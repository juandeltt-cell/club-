/* ==========================================================================
   Datos de ejemplo del panel (restaurante ficticio "Brasa Restó").
   Este objeto tiene la misma forma que devolverá la API real, así que
   reemplazarlo por un fetch() no requiere tocar el render.
   ========================================================================== */

window.MA_DEMO = {
  today: "Lunes 9 de marzo",

  venue: { name: "Brasa Restó", initial: "B", plan: "Plan Estándar", rewardGoal: 5 },

  user: { name: "Mariano", initials: "MA" },

  kpis: [
    { id: "active", label: "Clientes activos", value: 412, delta: "+38 este mes", icon: "users" },
    { id: "visits", label: "Visitas este mes", value: 1286, delta: "+12% vs. febrero", icon: "calendar" },
    { id: "rewards", label: "Premios canjeados", value: 94, delta: "+21 este mes", icon: "gift" },
    { id: "recovered", label: "Clientes recuperados", value: 23, delta: "Volvieron tras un mensaje", icon: "heart", highlight: true },
  ],

  segments: [
    { id: "all", label: "Todos", count: 412 },
    { id: "new", label: "Nuevos", count: 63 },
    { id: "frequent", label: "Frecuentes", count: 148 },
    { id: "occasional", label: "Ocasionales", count: 164 },
    { id: "risk", label: "En riesgo", count: 37 },
  ],

  segmentLabels: { new: "Nuevo", frequent: "Frecuente", occasional: "Ocasional", risk: "En riesgo" },

  // tone: color del avatar (0–4). stars: estrellitas actuales sobre venue.rewardGoal.
  customers: [
    { id: "juli", name: "Juli Fernández", phone: "+54 9 11 •••• ••27", segment: "frequent", visits: 12, stars: 2, last: "Hace 4 días", birthday: "14/3", birthdayIn: 5, tone: 0, since: "Noviembre 2025" },
    { id: "martin", name: "Martín Suárez", phone: "+54 9 11 •••• ••81", segment: "frequent", visits: 9, stars: 4, last: "Hace 6 días", birthday: "11/3", birthdayIn: 2, tone: 2 },
    { id: "caro", name: "Caro Benítez", phone: "+54 9 223 ••• ••05", segment: "frequent", visits: 7, stars: 2, last: "Hace 2 días", birthday: "13/3", birthdayIn: 4, tone: 3 },
    { id: "lucas", name: "Lucas Ferreyra", phone: "+54 9 11 •••• ••64", segment: "occasional", visits: 4, stars: 4, last: "Hace 12 días", birthday: "15/3", birthdayIn: 6, tone: 1 },
    { id: "nico", name: "Nicolás Paz", phone: "+54 9 11 •••• ••19", segment: "frequent", visits: 15, stars: 0, last: "Ayer", birthday: "2/8", tone: 4 },
    { id: "valen", name: "Valentina Ríos", phone: "+54 9 11 •••• ••33", segment: "new", visits: 1, stars: 1, last: "Ayer", birthday: "21/6", tone: 3 },
    { id: "tomas", name: "Tomás Aguirre", phone: "+54 9 11 •••• ••58", segment: "risk", visits: 8, stars: 3, last: "Hace 26 días", birthday: "4/11", tone: 1 },
    { id: "mora", name: "Mora Castillo", phone: "+54 9 223 ••• ••72", segment: "frequent", visits: 10, stars: 0, last: "Hace 3 días", birthday: "30/9", tone: 0 },
    { id: "agus", name: "Agustina Molina", phone: "+54 9 11 •••• ••40", segment: "risk", visits: 6, stars: 1, last: "Hace 31 días", birthday: "17/1", tone: 2 },
    { id: "cami", name: "Camila Ortiz", phone: "+54 9 11 •••• ••96", segment: "new", visits: 2, stars: 2, last: "Hace 5 días", birthday: "8/5", tone: 4 },
    { id: "santi", name: "Santiago Rojas", phone: "+54 9 11 •••• ••11", segment: "frequent", visits: 11, stars: 1, last: "Hace 8 días", birthday: "25/12", tone: 1 },
    { id: "fede", name: "Federico Luna", phone: "+54 9 223 ••• ••29", segment: "risk", visits: 5, stars: 3, last: "Hace 24 días", birthday: "12/7", tone: 3 },
    { id: "ramiro", name: "Ramiro Díaz", phone: "+54 9 11 •••• ••87", segment: "frequent", visits: 13, stars: 3, last: "Hace 7 días", birthday: "19/4", tone: 0 },
    { id: "joaco", name: "Joaquín Vera", phone: "+54 9 11 •••• ••45", segment: "occasional", visits: 3, stars: 3, last: "Hace 15 días", birthday: "3/10", tone: 2 },
    { id: "lu", name: "Lucía Herrera", phone: "+54 9 11 •••• ••02", segment: "risk", visits: 7, stars: 2, last: "Hace 29 días", birthday: "9/9", tone: 4 },
    { id: "pau", name: "Paula Giménez", phone: "+54 9 11 •••• ••76", segment: "new", visits: 1, stars: 1, last: "Hoy", birthday: "27/2", tone: 1 },
    { id: "emi", name: "Emilia Sosa", phone: "+54 9 223 ••• ••14", segment: "new", visits: 2, stars: 2, last: "Hace 9 días", birthday: "6/6", tone: 3 },
    { id: "bruno", name: "Bruno Medina", phone: "+54 9 11 •••• ••53", segment: "occasional", visits: 2, stars: 2, last: "Hace 40 días", birthday: "15/8", tone: 0 },
  ],

  // Historial de la ficha (solo se completa para los clientes de la demo).
  history: {
    juli: [
      { icon: "star", title: "Visita · sumó 1 estrellita", meta: "Hace 4 días" },
      { icon: "gift", title: "Canjeó: Postre de regalo", meta: "Hace 4 días", tone: "accent" },
      { icon: "star", title: "Visita · sumó 1 estrellita", meta: "Hace 11 días" },
      { icon: "message", title: "Aviso de premio disponible", meta: "Automático · hace 11 días", tone: "accent" },
      { icon: "star", title: "Visita · sumó 1 estrellita", meta: "Hace 17 días" },
      { icon: "user", title: "Se sumó al club", meta: "Noviembre 2025" },
    ],
  },

  // Visitas promedio por día de la semana (último mes).
  weekdays: [
    { id: "lun", label: "Lun", value: 142 },
    { id: "mar", label: "Mar", value: 86, low: true, target: 150 },
    { id: "mie", label: "Mié", value: 158 },
    { id: "jue", label: "Jue", value: 176 },
    { id: "vie", label: "Vie", value: 248 },
    { id: "sab", label: "Sáb", value: 291 },
    { id: "dom", label: "Dom", value: 185 },
  ],

  // Sugerencias generadas por el sistema de IA a partir de las métricas agregadas.
  suggestions: [
    {
      id: "birthday",
      kind: "birthday",
      icon: "cake",
      featured: true,
      title: "Faltan 5 días para que Juli cumpla años",
      why: "Esta semana también cumplen Martín, Caro y Lucas. Invitarlos unos días antes les da tiempo a organizarse y reservar.",
      countdown: ["juli", "martin", "caro", "lucas"],
      message: "¡Hola, {nombre}! Se viene tu cumple y en Brasa Restó queremos festejarlo con vos: el postre va por nuestra cuenta. ¿Te reservamos mesa?",
      previewFor: "Juli",
      audience: ["juli", "martin", "caro", "lucas"],
      audienceLabel: "4 clientes",
      cta: "Aprobar y enviar a los 4",
    },
    {
      id: "risk",
      kind: "risk",
      icon: "clock",
      title: "37 clientes frecuentes no vienen hace más de 3 semanas",
      why: "Venían al menos dos veces por mes. Una invitación con un beneficio concreto es la mejor forma de traerlos de vuelta.",
      message: "¡Hola, {nombre}! Hace un tiempo que no te vemos por Brasa Restó y te extrañamos. Este jueves tenés 2×1 en postres. ¿Te guardamos una mesa?",
      previewFor: "Tomás",
      audience: ["tomas", "agus", "fede", "lu"],
      audienceLabel: "37 clientes en riesgo",
      cta: "Aprobar y enviar",
    },
    {
      id: "tuesday",
      kind: "slow",
      icon: "trend",
      title: "Los martes tenés la mitad de visitas que el resto de la semana",
      why: "Una promo fija para ese día, avisada a tus frecuentes, ayuda a mover el día más flojo sin descontar los demás.",
      message: "¡Novedad en Brasa Restó! Desde esta semana, los martes sumás doble estrellita. ¿Nos vemos el martes, {nombre}?",
      previewFor: "Nicolás",
      audience: ["nico", "mora", "ramiro", "santi"],
      audienceLabel: "148 clientes frecuentes",
      cta: "Activar doble estrellita",
      boostsWeekday: "mar",
    },
    {
      id: "reward",
      kind: "reward",
      icon: "star",
      title: "12 clientes están a 1 estrellita de su premio",
      why: "Recordarles que les falta poco es el empujón más simple para que vuelvan esta semana.",
      message: "¡{nombre}, te falta 1 sola estrellita para tu postre de regalo! Te esperamos en Brasa Restó.",
      previewFor: "Martín",
      audience: ["martin", "lucas", "joaco"],
      audienceLabel: "12 clientes",
      cta: "Aprobar y enviar",
    },
  ],

  // Mensajes automáticos: el dueño decide cuáles están activos y el sistema los envía solo.
  automations: [
    {
      id: "welcome", icon: "user", on: true,
      title: "Bienvenida",
      trigger: "Cuando alguien se suma al club por primera vez.",
      message: "¡Hola, {nombre}! Ya sos parte del club de Brasa Restó. Sumaste tu primera estrellita: con 5 tenés un postre de regalo.",
      sent: 63, rate: "98% leídos",
    },
    {
      id: "birthday", icon: "cake", on: true,
      title: "Invitación de cumpleaños",
      trigger: "5 días antes del cumpleaños, con una invitación y un regalo.",
      message: "¡Hola, {nombre}! Se viene tu cumple y en Brasa Restó queremos festejarlo con vos: el postre va por nuestra cuenta. ¿Te reservamos mesa?",
      sent: 18, rate: "11 vinieron",
    },
    {
      id: "reward", icon: "gift", on: true,
      title: "Aviso de premio disponible",
      trigger: "Cuando un cliente junta las estrellitas de un premio.",
      message: "¡{nombre}, ya tenés tu postre de regalo! Mostrá esta tarjeta en tu próxima visita.",
      sent: 41, rate: "32 canjeados",
    },
    {
      id: "missyou", icon: "heart", on: true,
      title: "Te extrañamos",
      trigger: "Cuando un cliente frecuente no viene hace 21 días.",
      message: "¡Hola, {nombre}! Hace un tiempo que no te vemos por Brasa Restó. Te dejamos una estrellita extra para tu próxima visita.",
      sent: 29, rate: "23 volvieron",
    },
  ],
};
