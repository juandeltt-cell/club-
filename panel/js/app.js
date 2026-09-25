/* ==========================================================================
   Mejores Amigos — Panel del restaurante (demo navegable)
   Vanilla JS sin dependencias. Todo el render sale de window.MA_DEMO,
   que tiene la misma forma que la futura API.
   ========================================================================== */
(() => {
  "use strict";

  const data = window.MA_DEMO;
  const state = {
    route: "inicio",
    listSegment: "all",
    homeSegment: "all",
    query: "",
    sent: new Set(),
    returned: new Set(),
    boosted: new Set(),
    openCustomer: null,
    pendingSend: null,
  };

  // ---------- Utilidades ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (name, cls = "") => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const nf = new Intl.NumberFormat("es-AR");
  const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const firstName = (name) => name.split(" ")[0];
  const byId = (id) => data.customers.find((c) => c.id === id);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const avatar = (c, cls = "") => `<span class="avatar ${cls}" data-tone="${c.tone}">${esc(initials(c.name))}</span>`;
  const segBadge = (seg) => `<span class="badge badge--${seg}">${esc(data.segmentLabels[seg])}</span>`;
  const stars = (n, total = data.venue.rewardGoal) =>
    `<span class="stars" aria-label="${n} de ${total} estrellitas">${Array.from({ length: total }, (_, i) => icon("star", i < n ? "" : "is-empty")).join("")}</span>`;
  const renderMessage = (tpl, name) =>
    esc(tpl).replace(/\{nombre\}/g, `<span class="msg-preview__var">${esc(name)}</span>`);

  function countUp(el, to, duration = 1100) {
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = nf.format(Math.round(to * ease(t)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  let toastTimer;
  function toast(text) {
    const t = $("#toast");
    $("span", t).textContent = text;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2600);
  }

  // ---------- Bindings simples ----------
  function bindText() {
    $$("[data-bind]").forEach((el) => {
      const val = el.dataset.bind.split(".").reduce((o, k) => (o ? o[k] : undefined), data);
      if (val !== undefined) el.textContent = val;
    });
  }

  // ---------- KPIs ----------
  function renderKpis() {
    $("#kpis").innerHTML = data.kpis.map((k) => `
      <div class="card stat ${k.highlight ? "stat--highlight" : ""}" data-kpi="${k.id}">
        <div class="stat__label"><span class="stat__icon">${icon(k.icon, "icon--sm")}</span>${esc(k.label)}</div>
        <div class="stat__value" data-count="${k.value}">0</div>
        <div class="stat__delta">${esc(k.delta)}</div>
      </div>`).join("");
    $$("#kpis [data-count]").forEach((el) => countUp(el, Number(el.dataset.count)));
  }

  // ---------- Segmentos ----------
  function segmentChips(container, active, onPick) {
    container.innerHTML = data.segments.map((s) => `
      <button class="chip ${s.id === active ? "is-active" : ""}" data-seg="${s.id}">
        ${s.id !== "all" ? `<span class="chip__dot" style="color:var(--seg-${s.id === "risk" ? "risk" : s.id === "new" ? "new" : s.id === "frequent" ? "frequent" : "occasional"})"></span>` : ""}
        ${esc(s.label)} <span class="chip__count">${nf.format(s.count)}</span>
      </button>`).join("");
    $$(".chip", container).forEach((b) => b.addEventListener("click", () => onPick(b.dataset.seg)));
  }

  function renderHomePeople() {
    const list = data.customers
      .filter((c) => state.homeSegment === "all" || c.segment === state.homeSegment)
      .slice(0, 5);
    $("#home-people").innerHTML = list.map((c) => `
      <div class="people-list__row" data-customer="${c.id}" style="cursor:pointer">
        ${avatar(c)}
        <div><div class="person__name">${esc(c.name)}</div><div class="person__meta">${c.visits} visitas · ${esc(c.last)}</div></div>
        ${state.returned.has(c.id) ? `<span class="badge badge--returned">${icon("check", "icon--sm")}Volvió</span>` : segBadge(c.segment)}
      </div>`).join("");
    $$("#home-people [data-customer]").forEach((r) => r.addEventListener("click", () => openCustomer(r.dataset.customer)));
    segmentChips($("#home-segments"), state.homeSegment, (seg) => { state.homeSegment = seg; renderHomePeople(); });
  }

  // ---------- Gráfico por día ----------
  function renderBars() {
    const max = Math.max(...data.weekdays.map((d) => Math.max(d.value, d.target || 0)));
    $("#weekday-bars").innerHTML = data.weekdays.map((d) => {
      const boosted = state.boosted.has(d.id);
      const v = boosted ? d.target : d.value;
      const cls = d.low ? (boosted ? "bars__bar--boosted" : "bars__bar--low") : "";
      return `
        <div class="bars__col" data-day="${d.id}">
          <div class="bars__bar ${cls}" style="--h:${Math.round((v / max) * 100)}%"><span class="bars__value">${v}</span></div>
          <span class="bars__label">${esc(d.label)}</span>
        </div>`;
    }).join("");
  }

  // ---------- Sugerencias ----------
  function suggestionCard(s) {
    const sent = state.sent.has(s.id);
    const countdown = s.countdown ? `
      <div class="countdown">
        ${s.countdown.map((id, i) => {
          const c = byId(id);
          const days = c.birthdayIn;
          return `<span class="countdown__item ${i === 0 ? "countdown__item--main" : ""}">${avatar(c)}<span><span class="countdown__name">${esc(firstName(c.name))}</span> · <span class="countdown__days">${days === 1 ? "mañana" : `en ${days} días`}</span></span></span>`;
        }).join("")}
      </div>` : "";
    return `
      <article class="suggestion ${s.featured ? "suggestion--featured" : ""} ${sent ? "is-sent" : ""}" data-suggestion="${s.id}">
        <div class="suggestion__top">
          <span class="ai-tag">${icon("sparkle")}Sugerencia del sistema de IA</span>
          ${sent ? `<span class="badge badge--auto">${icon("check", "icon--sm")}Enviado</span>` : ""}
        </div>
        <div class="suggestion__head">
          <div class="suggestion__icon suggestion__icon--${s.kind}">${icon(s.icon, "icon--lg")}</div>
          <div>
            <h3 class="suggestion__title">${esc(s.title)}</h3>
            <p class="suggestion__why">${esc(s.why)}</p>
          </div>
        </div>
        ${countdown}
        <div class="msg-preview">
          <div class="msg-preview__label"><span>Mensaje sugerido</span><span class="badge badge--auto">${icon("sparkle", "icon--sm")}Automático</span></div>
          ${renderMessage(s.message, s.previewFor)}
          <div class="msg-preview__foot">Se personaliza con el nombre de cada cliente</div>
        </div>
        <div class="suggestion__actions">
          <button class="btn btn--primary" data-approve="${s.id}" ${sent ? "disabled" : ""}>${sent ? `${icon("check", "icon--sm")}Enviado` : `${icon("send", "icon--sm")}${esc(s.cta)}`}</button>
          <button class="btn btn--ghost btn--sm" ${sent ? "disabled" : ""}>${icon("pencil", "icon--sm")}Editar mensaje</button>
          <span class="suggestion__audience">${icon("users", "icon--sm")} ${esc(s.audienceLabel)}</span>
        </div>
      </article>`;
  }

  function renderSuggestions() {
    $("#home-suggestions").innerHTML = data.suggestions.slice(0, 2).map(suggestionCard).join("");
    $("#all-suggestions").innerHTML = data.suggestions.map(suggestionCard).join("");
    $$("[data-approve]").forEach((b) => b.addEventListener("click", () => openSend(b.dataset.approve)));
    const pending = data.suggestions.filter((s) => !state.sent.has(s.id)).length;
    $("#nav-suggestions-count").textContent = pending;
    $("#nav-suggestions-count").style.display = pending ? "" : "none";
  }

  // ---------- Clientes ----------
  function renderCustomers() {
    segmentChips($("#list-segments"), state.listSegment, (seg) => { state.listSegment = seg; renderCustomers(); });
    const q = state.query.trim().toLowerCase();
    const rows = data.customers.filter((c) =>
      (state.listSegment === "all" || c.segment === state.listSegment) &&
      (!q || c.name.toLowerCase().includes(q) || c.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "") || "§")));
    $("#customers-body").innerHTML = rows.map((c) => `
      <tr data-customer="${c.id}" class="${state.openCustomer === c.id ? "is-selected" : ""}">
        <td><div class="person">${avatar(c)}<div><div class="person__name">${esc(c.name)}</div><div class="person__meta">${esc(c.phone)}</div></div></div></td>
        <td>${state.returned.has(c.id) ? `<span class="badge badge--returned">${icon("check", "icon--sm")}Volvió</span>` : segBadge(c.segment)}</td>
        <td class="hide-sm tabular">${c.visits}</td>
        <td>${stars(c.stars)}</td>
        <td class="hide-sm muted">${esc(c.last)}</td>
        <td class="hide-sm">${esc(c.birthday)}${c.birthdayIn ? ` <span class="subtle">· en ${c.birthdayIn} días</span>` : ""}</td>
      </tr>`).join("") || `<tr><td colspan="6" class="muted" style="padding:24px">No hay clientes que coincidan.</td></tr>`;
    $$("#customers-body [data-customer]").forEach((r) => r.addEventListener("click", () => openCustomer(r.dataset.customer)));
  }

  // ---------- Ficha de cliente ----------
  function openCustomer(id) {
    const c = byId(id);
    if (!c) return;
    state.openCustomer = id;
    const returned = state.returned.has(id);
    const history = [...(data.history[id] || [{ icon: "star", title: "Última visita", meta: c.last }])];
    if (state.sent.has("birthday") && data.suggestions[0].audience.includes(id)) {
      history.unshift({ icon: "cake", title: "Invitación de cumpleaños enviada", meta: "Automático · sugerida por el sistema de IA", tone: "accent" });
    }
    if (returned) history.unshift({ icon: "return", title: "Volvió · sumó 1 estrellita", meta: "Hoy, después de la invitación", tone: "success" });
    const visits = c.visits + (returned ? 1 : 0);
    const starsNow = c.stars + (returned ? 1 : 0);
    const goal = data.venue.rewardGoal;

    $("#drawer").innerHTML = `
      <div class="profile" style="position:relative">
        <button class="btn btn--quiet profile__close" data-close-drawer aria-label="Cerrar">${icon("x")}</button>
        <div class="profile__head">
          ${avatar(c, "avatar--lg")}
          <div>
            <h2 class="profile__name">${esc(c.name)}</h2>
            <div class="profile__phone">${esc(c.phone)} · En el club desde ${esc(c.since || "2025")}</div>
            <div class="profile__badges">${segBadge(c.segment)}${returned ? `<span class="badge badge--returned pop">${icon("check", "icon--sm")}Volvió</span>` : ""}</div>
          </div>
        </div>
        <div class="profile__facts">
          <div class="fact"><div class="fact__label">Visitas</div><div class="fact__value">${visits}</div></div>
          <div class="fact"><div class="fact__label">Estrellitas</div><div class="fact__value">${starsNow}/${goal}</div></div>
          <div class="fact ${c.birthdayIn ? "fact--birthday" : ""}"><div class="fact__label">Cumpleaños</div><div class="fact__value">${esc(c.birthday)}</div></div>
        </div>
        ${c.birthdayIn ? `<div class="countdown"><span class="countdown__item countdown__item--main">${icon("cake", "icon--sm")} Faltan <span class="countdown__days">${c.birthdayIn} días</span> para su cumpleaños</span></div>` : ""}
        <div>
          <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);font-weight:600;margin-bottom:8px"><span>Próximo premio: Postre de regalo</span><span class="subtle">Le faltan ${goal - starsNow}</span></div>
          <div class="progress"><div class="progress__fill" style="--p:${(starsNow / goal) * 100}%"></div></div>
        </div>
        <div>
          <h3 class="profile__section-title">Historia en Brasa</h3>
          <ol class="timeline">
            ${history.map((h, i) => `
              <li class="timeline__item ${i === 0 && returned ? "rise" : ""}">
                <span class="timeline__dot ${h.tone ? `timeline__dot--${h.tone}` : ""}">${icon(h.icon)}</span>
                <div><div class="timeline__title">${esc(h.title)}</div><div class="timeline__meta">${esc(h.meta)}</div></div>
              </li>`).join("")}
          </ol>
        </div>
      </div>`;
    $$("[data-close-drawer]").forEach((b) => b.addEventListener("click", closeCustomer));
    document.body.classList.add("is-drawer-open");
    renderCustomers();
  }
  function closeCustomer() {
    state.openCustomer = null;
    document.body.classList.remove("is-drawer-open");
    renderCustomers();
  }

  // ---------- Envío de una sugerencia ----------
  function openSend(id) {
    const s = data.suggestions.find((x) => x.id === id);
    if (!s || state.sent.has(id)) return;
    state.pendingSend = id;
    const people = s.audience.map(byId);
    const extra = parseInt(s.audienceLabel, 10) - people.length;
    $("#modal").innerHTML = `
      <div class="send">
        <span class="ai-tag">${icon("sparkle")}Sugerencia del sistema de IA</span>
        <h2 class="send__title" id="send-title">${esc(s.title)}</h2>
        <div class="msg-preview">
          <div class="msg-preview__label"><span>Así lo recibe ${esc(s.previewFor)}</span><span class="badge badge--auto">${icon("sparkle", "icon--sm")}Automático</span></div>
          ${renderMessage(s.message, s.previewFor)}
          <div class="msg-preview__foot">WhatsApp · ${icon("checks", "icon--sm")}</div>
        </div>
        <div>
          <div style="font-weight:600;margin-bottom:10px">Se envía a ${esc(s.audienceLabel)}</div>
          <div class="recipients">
            ${people.map((c) => `<span class="recipient" data-recipient="${c.id}">${avatar(c)}${esc(firstName(c.name))}<span class="recipient__check">${icon("check", "icon--sm")}</span></span>`).join("")}
            ${extra > 0 ? `<span class="recipient" data-recipient="extra">+${nf.format(extra)} más<span class="recipient__check">${icon("check", "icon--sm")}</span></span>` : ""}
          </div>
        </div>
        <div class="send__status" id="send-status"></div>
        <div class="send__foot">
          <button class="btn btn--ghost" data-cancel>Cancelar</button>
          <button class="btn btn--primary" data-confirm>${icon("send", "icon--sm")}Confirmar envío</button>
        </div>
      </div>`;
    $("[data-cancel]", $("#modal")).addEventListener("click", closeSend);
    $("[data-confirm]", $("#modal")).addEventListener("click", confirmSend);
    document.body.classList.add("is-modal-open");
  }
  function closeSend() {
    state.pendingSend = null;
    document.body.classList.remove("is-modal-open");
  }
  async function confirmSend() {
    const id = state.pendingSend;
    const s = data.suggestions.find((x) => x.id === id);
    if (!s) return;
    const btn = $("[data-confirm]", $("#modal"));
    btn.disabled = true;
    btn.innerHTML = `${icon("send", "icon--sm")}Enviando…`;
    for (const r of $$("[data-recipient]", $("#modal"))) {
      r.classList.add("is-sent");
      await wait(260);
    }
    $("#send-status").innerHTML = `${icon("checks")} Enviado automáticamente a ${esc(s.audienceLabel)}`;
    btn.classList.add("is-done");
    btn.innerHTML = `${icon("check", "icon--sm")}Listo`;
    state.sent.add(id);
    if (s.boostsWeekday) state.boosted.add(s.boostsWeekday);
    await wait(1100);
    closeSend();
    renderSuggestions();
    renderBars();
    toast(s.boostsWeekday ? "Doble estrellita activada los martes" : `Enviado a ${s.audienceLabel}`);
  }

  // ---------- Mensajes automáticos ----------
  function renderAutomations() {
    $("#automations").innerHTML = data.automations.map((a) => `
      <article class="automation ${a.on ? "is-on" : ""}" data-automation="${a.id}">
        <div class="automation__icon">${icon(a.icon, "icon--lg")}</div>
        <div class="automation__body">
          <div><h3 class="automation__title">${esc(a.title)}</h3><p class="automation__trigger">${esc(a.trigger)}</p></div>
          <div class="msg-preview">
            <div class="msg-preview__label"><span>Mensaje</span><span class="badge badge--auto">${icon("sparkle", "icon--sm")}Automático</span></div>
            ${renderMessage(a.message, "Juli")}
          </div>
          <div class="automation__stats"><span><strong>${a.sent}</strong> enviados este mes</span><span><strong>${esc(a.rate)}</strong></span></div>
        </div>
        <div>
          <label class="toggle"><input type="checkbox" ${a.on ? "checked" : ""} aria-label="Activar ${esc(a.title)}"><span class="toggle__track"></span><span class="toggle__thumb"></span></label>
          <div class="automation__state">${a.on ? "Activo" : "Pausado"}</div>
        </div>
      </article>`).join("");
    $$("#automations .toggle input").forEach((input) => input.addEventListener("change", (e) => {
      const card = e.target.closest("[data-automation]");
      setAutomation(card.dataset.automation, e.target.checked, true);
    }));
  }
  function setAutomation(id, on, notify = false) {
    const a = data.automations.find((x) => x.id === id);
    a.on = on;
    const card = $(`[data-automation="${id}"]`);
    card.classList.toggle("is-on", on);
    $("input", card).checked = on;
    $(".automation__state", card).textContent = on ? "Activo" : "Pausado";
    if (notify) toast(on ? `"${a.title}" activado` : `"${a.title}" en pausa`);
  }

  // ---------- Ruteo ----------
  function go(route) {
    if (!$(`[data-view="${route}"]`)) route = "inicio";
    state.route = route;
    $$(".view").forEach((v) => v.classList.toggle("is-active", v.dataset.view === route));
    $$(".nav__link").forEach((l) => l.classList.toggle("is-active", l.dataset.route === route));
    if (location.hash.slice(1) !== route) history.replaceState(null, "", `#${route}`);
    window.scrollTo({ top: 0 });
    if (route === "inicio") renderKpis();
  }

  // ---------- Inicio ----------
  function init() {
    bindText();
    renderSuggestions();
    renderHomePeople();
    renderBars();
    renderCustomers();
    renderAutomations();
    $("#search").addEventListener("input", (e) => {
      state.query = e.target.value;
      if (state.route !== "clientes") go("clientes");
      renderCustomers();
    });
    $("#modal-backdrop").addEventListener("click", (e) => { if (e.target.id === "modal-backdrop") closeSend(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSend(); closeCustomer(); } });
    window.addEventListener("hashchange", () => go(location.hash.slice(1)));

    const params = new URLSearchParams(location.search);
    if (params.get("demo") === "automations-off") data.automations.forEach((a) => setAutomation(a.id, false));
    go(location.hash.slice(1) || "inicio");
  }

  // ---------- API de demo (la usa el script de grabación del video) ----------
  window.MA = {
    go, openCustomer, closeCustomer, openSend, confirmSend, closeSend, setAutomation,
    markReturned(id) {
      state.returned.add(id);
      const k = data.kpis.find((x) => x.id === "recovered");
      k.value += 1;
      renderHomePeople();
      renderCustomers();
      if (state.openCustomer === id) openCustomer(id);
    },
    async cascadeAutomations(delay = 450) {
      for (const a of data.automations) { setAutomation(a.id, true); await wait(delay); }
    },
  };

  document.addEventListener("DOMContentLoaded", init);
})();
