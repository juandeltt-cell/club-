# Sistema de fidelización para restaurantes — Arquitectura de producto y técnica

**Luz Sur · documento de decisión · septiembre 2026**
Nombre provisorio del producto: **Club** (dominio de ejemplo: `sumapuntos.ar`).

---

## 0. Antes de empezar: problemas serios detectados en las premisas

Me pediste que señale cualquier problema serio antes de seguir. Encontré cinco. Ninguno invalida las decisiones tomadas, pero todos cambian cómo se implementan.

### 0.1 "25 sitios de Hostinger" no equivale a "25 restaurantes"
El sistema es **multi-tenant**: todos los restaurantes viven en **una sola aplicación y una sola base de datos**. Ocupan 1 o 2 "sitios" del plan, no uno por restaurante. Dar de alta el restaurante n.º 40 no consume ningún sitio más. La capacidad real no la limita la cantidad de sitios: la limitan CPU, RAM y procesos del plan, y a esta escala sobran.

### 0.2 No pondría este sistema en el mismo plan Premium que los sitios de otros clientes
En el hosting compartido de Hostinger, **todos los sitios de un mismo plan corren bajo el mismo usuario de Linux**. Si un plugin vulnerable de un WordPress de otro cliente (u otro sitio de los 10 que ya tenés) queda comprometido, el atacante puede leer los archivos del resto de los sitios. Eso incluye el `.env` con las credenciales de la base que guarda los teléfonos de los clientes de todos los restaurantes y los tokens de WhatsApp.
**Recomendación:** un plan de Hostinger **separado y dedicado** al producto: Business o Cloud Startup, que además trae backups diarios. Es el mismo proveedor, el mismo hPanel y la misma forma de trabajar, sin sumar ningún proveedor nuevo. El costo se traslada a la suscripción (me dijiste que el presupuesto no es la restricción).

### 0.3 Hosting compartido: sin Node.js, sin procesos persistentes y sin SSL wildcard
- Node.js no está disponible en los planes compartidos Premium, solo en Business/Cloud o VPS. → El stack natural en el plan es **PHP + MySQL**, que es casi seguro lo mismo que usa el panel de Barbados (`/panel` dentro del mismo dominio en Hostinger). No pude acceder a esa carpeta ni al sitio desde este entorno: **confirmámelo** cuando puedas.
- El certificado **SSL wildcard** (`*.sumapuntos.ar`) solo existe en VPS. → La decisión 2 ya admitía "subdominio **o path**": **en el MVP recomiendo path** (`sumapuntos.ar/mordisco`). Detalle en §1.4.
- No hay workers ni colas persistentes. → Todo lo asincrónico (envíos de WhatsApp, jobs de baja, cumpleaños) corre con **cron cada minuto + tabla "outbox"** en MySQL. Es perfectamente suficiente para este volumen.

### 0.4 Meta cambia la tarifa de WhatsApp el 1/10/2026 (en 6 días)
Desde el 1 de octubre de 2026, Meta cobra también los **mensajes de servicio** (las respuestas dentro de la ventana de 24 hs) y las plantillas utility enviadas dentro de la ventana. Cada número de negocio tiene **1.000 mensajes de servicio gratis por mes**; del 1.001 en adelante se cobra la tarifa utility del país. Esto cambia los costos y pesa mucho en la decisión de número propio o compartido (§3).

### 0.5 Dos detalles de las decisiones 3a y 3b que conviene corregir
- **3a, "identificarse con su número de WhatsApp" en un formulario:** si el cliente *tipea* su número en la landing, cualquiera puede anotar el número de otra persona, sumarle puntos o hacer que le lleguen mensajes que nunca pidió. Eso rompe el consentimiento y pone en riesgo la calidad de la cuenta en Meta. **Propuesta:** que el cliente se identifique **mandando él un WhatsApp** desde la landing (botón `wa.me` con un código precargado). WhatsApp ya verifica que el número es suyo, el mensaje abre la ventana de 24 hs y el consentimiento queda probado. La decisión 3a se mantiene; solo cambia el *cómo*. Detalle en §3.4.
- **3b, token de ejemplo `x7f2a9`:** 6 caracteres hexadecimales dan unos 16 millones de combinaciones, que se recorren en horas. El token tiene que tener **≥ 16 caracteres base62**. Detalle en §2.

---

## 1. Arquitectura técnica: tres alternativas

### 1.1 Componentes comunes a las tres

| Pieza | Qué hace |
|---|---|
| **Landing pública** (`sumapuntos.ar/{slug}`) | Muestra la marca del restaurante, los premios y un botón "Sumar puntos por WhatsApp". Al pie, el párrafo de T&C. |
| **Tarjeta personal** (`sumapuntos.ar/t/{token}`) | Progreso, historial y cuánto falta para el próximo premio. Botón "Canjear". |
| **Panel** (`panel.luz-sur.com`) | Login por persona, rol y restaurante. Pantalla de "modo mostrador" para el personal. Superadmin de Luz Sur. |
| **Webhook de WhatsApp** | Recibe los mensajes entrantes (visitas, BAJA, TARJETA, CANJE) y los estados de entrega. |
| **Outbox + scheduler** | Cola de mensajes salientes y jobs programados (campañas, ciclo de vida de la baja, borrado). |
| **Capa de IA** | Llamada bajo demanda a la API de Claude con métricas agregadas (§5). |
| **Backups offsite** | Dump cifrado nocturno fuera del hosting. |

### 1.2 Las alternativas

#### Alternativa A: PHP (Laravel) + MySQL en un plan Hostinger dedicado ✅ recomendada
- **Datos:** MySQL del propio plan.
- **Backend:** Laravel. Trae migraciones, autenticación, *global scopes* para el multi-tenant, scheduler y colas con driver de base de datos. Claude Code lo maneja muy bien y en Hostinger se instala con Composer por SSH.
- **Landing y tarjeta:** HTML renderizado en el servidor (Blade), sin framework JS, con menos de 100 KB por página. El color y el logo del tenant se inyectan como variables CSS.
- **Panel:** Blade + htmx/Alpine (sin build de Node), instalable como PWA en la tablet o el celular del local.
- **Asincronía:** el cron de hPanel corre `schedule:run` cada minuto, y ese comando procesa la cola con `queue:work --stop-when-empty`.
- **WhatsApp:** Cloud API directa por HTTP (§3).
- **IA:** llamada HTTP a la API de Anthropic desde un job semanal.
- **Costo fijo:** el plan dedicado (del orden de US$5–15/mes según plan y promoción) más el storage de backups offsite (centavos a esta escala).
- **Mantenimiento:** bajo. Hostinger se ocupa del sistema operativo, PHP, MySQL y SSL, y vos mantenés solo la aplicación.
- **Velocidad al MVP:** la más alta, porque es el mismo terreno que Barbados.
- **Techo:** alcanza cómodamente para decenas de restaurantes. El tráfico real (cientos de visitas por día por local en pleno enero) es mínimo para un servidor. El techo aparece si se necesita tiempo real (websockets) o procesos largos.

#### Alternativa B: VPS propio (Hostinger KVM o Hetzner) con Node/TypeScript + PostgreSQL + Caddy
- **Datos:** PostgreSQL instalado en el VPS.
- **Backend:** Node (Hono/Fastify) o Next.js, más un worker real con cola sobre Postgres (pg-boss), sin Redis.
- **Landing:** SSR o Next.js.
- **Infraestructura:** Caddy da SSL wildcard automático por challenge DNS, así que los subdominios por restaurante funcionan desde el día 1. Opcionalmente, Coolify para desplegar "estilo PaaS".
- **Costo fijo:** US$7–20/mes.
- **Mantenimiento:** **alto para una sola persona part-time.** Sos el sysadmin: parches de seguridad, firewall, monitoreo, backups de Postgres, disco lleno, reinicios. Un problema de servidor en pleno enero lo resolvés vos.
- **Velocidad al MVP:** media. La aplicación se escribe igual de rápido, pero la infraestructura suma de una a dos semanas y riesgo operativo.
- **Cuándo tiene sentido:** más de unos 40 restaurantes, necesidad de tiempo real, o una integración con sistemas de punto de venta (POS) que requiera procesos persistentes.

#### Alternativa C: Serverless de bajo costo con Cloudflare Workers + D1 (SQLite) + Cron Triggers
- **Datos:** D1.
- **Backend:** Workers (TypeScript).
- **Landing:** Workers en el edge, rapidísima en cualquier conexión, con wildcard y dominios propios nativos y gratis.
- **Costo fijo:** entre US$0 y 5/mes.
- **Mantenimiento:** bajo en infraestructura, porque no hay servidor que cuidar.
- **Problema:** es **exactamente el tipo de dependencia que descartaste con Supabase**. Los datos quedan en un formato y una API propietarios (D1), con límites propios y un modelo de programación distinto (sin PHP, sin MySQL). Migrar después cuesta.
- **Velocidad al MVP:** media-alta si ya sabés TypeScript, y media si no.

#### Comparación

| Criterio | A · Laravel + MySQL en Hostinger | B · VPS propio | C · Cloudflare |
|---|---|---|---|
| Costo fijo/mes | Bajo (plan dedicado) | Bajo-medio | Casi cero |
| Dependencia externa nueva | Ninguna (mismo proveedor) | Ninguna, pero sos el operador | **Alta** (plataforma propietaria) |
| Mantenimiento part-time | **Bajo** | Alto | Bajo |
| Tiempo al MVP | **El más corto** | +1–2 semanas | Similar o mayor |
| Subdominios por restaurante | Solo vía Cloudflare DNS (§1.4) | Nativo | Nativo |
| Procesos en tiempo real | No | Sí | Limitado |
| Salida futura | Mover a un VPS sin cambiar código | — | Reescritura parcial |

**Recomendación: A.** Es el camino con menos riesgo operativo para una persona sola, reutiliza lo que ya funciona en Barbados y no agrega proveedores. Como es Laravel + MySQL estándar, **migrar a B es solo mudar la aplicación** (copiar el código y hacer un dump de la base) si algún día hace falta. Disparadores concretos de esa migración: más de 40 restaurantes activos, el cron de un minuto se queda corto, o se integra un POS.

### 1.3 Template único parametrizado por tenant: cómo se renderiza

| Opción | Cómo funciona | Veredicto |
|---|---|---|
| **Render en el servidor por request** | La aplicación lee el `slug` o el subdominio, busca el tenant (con caché) y renderiza el template Blade con su configuración. | ✅ **Recomendada.** Dar de alta un restaurante es cargar un registro. Los cambios se ven al instante. La tarjeta es dinámica de todas formas. |
| Sitios estáticos generados por build | Un build genera el HTML de cada tenant y hay que redeployar para cada cambio. | ❌ Contradice "dar de alta es cargar datos": cada cambio de texto o premio exige un build y un deploy. |
| Estático + JS que consulta una API | La página es HTML fijo y un script trae la configuración. | ❌ Más lenta con mala señal (dos idas y vueltas) y peor en conectividad variable. |

Caché: la configuración del tenant va a caché de archivos, invalidada al guardar desde el panel. La landing se puede servir con `Cache-Control: public, max-age=300`. La tarjeta **nunca** se cachea (`private, no-store`).

### 1.4 Dominios y ruteo en Hostinger
- **Producto (público):** `sumapuntos.ar/{slug}` y `sumapuntos.ar/t/{token}`. Es un sitio del plan con un solo certificado SSL gratuito y cero configuración de DNS por alta.
- **Panel:** `panel.luz-sur.com` → **el mismo código**, con dos "superficies" según el dominio. En Hostinger se resuelve con un symlink del `public_html` del segundo sitio a la carpeta `public` de la aplicación, o con un doble deploy del mismo repo. Ventaja de seguridad: las cookies de sesión del panel nunca viajan al dominio público.
- **Subdominios (`mordisco.sumapuntos.ar`), para v2 si el cliente los valora:** se pone el DNS del dominio en Cloudflare (plan gratuito, sin datos ahí, solo DNS/proxy). Su certificado universal cubre `*.sumapuntos.ar`, y una regla de reescritura manda `mordisco.sumapuntos.ar/*` a `sumapuntos.ar/mordisco/*`. No se mueve nada de la aplicación.
- **¿Alcanza el hosting actual?** Técnicamente sí. Por seguridad, conviene el **plan dedicado** (§0.2).

---

## 2. Seguridad del token de la tarjeta personal

### 2.1 Generación
- 16 caracteres base62 generados con un CSPRNG (`random_bytes` → base62), lo que da **unos 95 bits de entropía**. Ejemplo: `sumapuntos.ar/t/k3Q9vXa27LmPz8Rw`. No se puede adivinar ni enumerar: ni con millones de intentos por segundo se acierta uno en la vida útil del universo.
- **No se deriva de nada** (ni del teléfono, ni del ID, ni de la fecha), porque un token derivado es predecible.
- **Se guarda solo el hash** (`SHA-256(token)`) en `card_tokens.token_hash`. El token en claro existe únicamente en el mensaje de WhatsApp. Si se filtra la base, los links no sirven.
- **Un token por cliente y por restaurante.** La misma persona en dos restaurantes tiene dos tarjetas sin relación entre sí, que es lo que pide §6.c.

### 2.2 Anti-enumeración y fugas
- Rate limit por IP en `/t/*`: más de 20 tokens inválidos en 10 minutos bloquea esa IP por una hora.
- Respuesta idéntica para un token inexistente y uno revocado: siempre 404, sin pistas.
- `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex`, `Cache-Control: private, no-store`, sin scripts de terceros (analytics, píxeles) en la tarjeta para que el token no salga en ningún referer.
- **Datos mínimos en la tarjeta:** nombre de pila y teléfono enmascarado (`+54 9 223 ••• ••42`). Si alguien reenvía el link, lo que queda expuesto es poco.

### 2.3 Si el cliente pierde el link
El cliente escribe **"TARJETA"** al WhatsApp del restaurante. El webhook identifica el número (verificado por WhatsApp), **rota el token**: genera uno nuevo y revoca el anterior. Después responde con el link nuevo. Es un mensaje de servicio dentro de la ventana que abrió el propio cliente, así que entra en los 1.000 gratis. La rotación además sirve de "cerrar sesión": si el link se filtró, pedir uno nuevo invalida el viejo. La landing tiene también un botón "Recuperar mi tarjeta" que abre `wa.me` con "TARJETA" ya escrito.

### 2.4 Verificación adicional para canjes, sin contraseña
El principio es que **el cliente nunca se autocanjea: todo canje necesita dos partes**, el cliente y el personal del local.

| Nivel | Cuándo | Flujo |
|---|---|---|
| **Normal** | Premio con costo menor al umbral configurado por el restaurante | El cliente toca "Canjear" en la tarjeta y aparece un código de 6 dígitos válido por 10 minutos. El personal lo ingresa (o escanea el QR) en el modo mostrador y confirma. Tener el link alcanza, porque además la persona está físicamente en el local. |
| **Alto valor** | `rewards.high_value = true` o costo ≥ umbral | El cliente escribe **"CANJE"** al WhatsApp y recibe el código **por WhatsApp**. Eso prueba que tiene el teléfono, no solo el link. Como la ventana la abrió él, es un mensaje de servicio y no hace falta una plantilla de autenticación paga. |

Siempre: los códigos son de un solo uso y se guardan hasheados. Cada canje queda en `redemptions` y en `audit_log` con el usuario del personal que lo confirmó, y se descuenta en el ledger dentro de la misma transacción.

---

## 3. WhatsApp: build vs. buy, número propio vs. compartido y costos

### 3.1 Tarifas de referencia para Argentina (USD por mensaje entregado, tarifa base de Meta)

| Categoría | Tarifa | Uso en el producto |
|---|---|---|
| Marketing | **≈ 0,0618** | Campañas, cumpleaños, reactivación, "volvió la temporada" |
| Utility | ≈ 0,012 | Avisos transaccionales fuera de la ventana |
| Authentication | ≈ 0,022 | No hace falta (se usa el flujo iniciado por el cliente) |
| Servicio (dentro de la ventana de 24 hs) | **Gratis hasta 1.000/mes por número**; después, la tarifa utility | Confirmación de puntos, link de tarjeta, consentimiento, BAJA, TARJETA, CANJE |

Meta ya no cobra por "conversación": cobra **por mensaje**. Son tarifas indicativas que conviene verificar en el WhatsApp Manager al dar de alta cada cuenta. Los intermediarios (BSP) suman su margen encima.

### 3.2 Costo típico de un restaurante en enero
Supuestos: 1.500 visitas/mes, 600 clientes nuevos y 2 campañas a 1.200 personas.
- Mensajes entrantes: gratis.
- Unos 2.100 mensajes de servicio salientes (confirmaciones, más un mensaje combinado de bienvenida, consentimiento y link para cada cliente nuevo). Los primeros 1.000 son gratis y los 1.100 restantes cuestan unos US$13.
- 2.400 mensajes de marketing: **unos US$148.**

**Conclusión:** el costo real está en **el marketing, no en la operación diaria.** El producto tiene que mostrar el **costo estimado antes de mandar cada campaña**, segmentar para no mandar a todos, y cobrarse con créditos de campañas o un tope por plan.

### 3.3 Número propio o compartido (me lo dejaste a mí)

| | Número compartido del producto | **Número propio por restaurante** ✅ |
|---|---|---|
| Qué ve el cliente final | La marca del producto: se percibe un tercero, en contra de la decisión 2 | **El nombre del restaurante** |
| Los 1.000 mensajes de servicio gratis | Se reparten entre todos los restaurantes | **1.000 por restaurante** |
| Riesgo de calidad o bloqueo en Meta | Un restaurante que spamea hace caer a todos | Aislado por restaurante |
| "Los datos son del restaurante" (§6.c) | Mezcla conversaciones de varios negocios | La cuenta de WhatsApp Business (WABA) está en el **portfolio de Meta del restaurante** |
| Baja de un restaurante | Hay que desenredar | El restaurante se queda con su número. Se desconecta el token y listo |
| Fricción de alta | Nula | Media: número dedicado y verificación en Meta (§3.5) |

**Recomendación: número propio por restaurante, con la WABA dentro del Business portfolio del restaurante y Luz Sur como socio con acceso técnico.** Encaja con cada una de las decisiones: marca propia, datos propios, baja limpia y costos que se pagan con la tarjeta del restaurante en Meta, sin que Luz Sur financie mensajes.

### 3.4 Flujo de identificación y suma de puntos, iniciado por el cliente

```
QR del local → landing sumapuntos.ar/mordisco
  → botón "Sumar mis puntos" → wa.me/549XXXX?text=MORDISCO+V-8K2P
  → el cliente envía el mensaje (si no hay señal, WhatsApp lo guarda y lo manda después)
  → webhook: número verificado por WhatsApp + código de visita
      ├─ cliente nuevo: crea customer, registra consent_event y responde con UN solo mensaje:
      │    "¡Sumaste tu 1.ª visita en Mordisco! Tu tarjeta: <link>.
      │     <texto de consentimiento vigente>. Para darte de baja escribí BAJA."
      └─ cliente existente: suma en el ledger y responde "Llevás 5/8. Te faltan 3 para <premio>. <link>"
```

Ventajas: el número está verificado sin pagar OTP, la ventana la abre el cliente (mensaje de servicio), el consentimiento queda asociado a un mensaje real (`wa_message_id` como evidencia) y **el texto de consentimiento no necesita aprobación de Meta**, porque dentro de la ventana se puede mandar texto libre. Así ese texto se edita desde el panel (§6).

**Cómo se prueba que la visita fue real** (el código `V-8K2P`), de mayor a menor preferencia:
1. **QR dinámico en el modo mostrador:** el personal toca "Nueva visita" (y opcionalmente carga el monto). La pantalla muestra un QR con un código de un solo uso válido por 4 horas. Se mide contra la hora en que el cliente *envió* el mensaje, no la de llegada, para tolerar la falta de señal.
2. **Talonario de códigos impresos** de un solo uso, generados por lote y asignados a un empleado. Funciona **sin internet en el local** (paradores, balnearios): el cliente lo escanea cuando tenga señal.
3. **Carga manual** por número de teléfono desde el panel, como respaldo. En ese caso el primer mensaje al cliente es una plantilla utility y se aplica el mismo texto de consentimiento con opción de BAJA.

El QR fijo en la mesa sirve solo para **conocer el programa o recuperar la tarjeta**, nunca para sumar puntos. Si no, sumar sería gratis y repetible.

### 3.5 Hacerlo nosotros o pagar un intermediario

| Opción | Costo | Qué aporta | Veredicto |
|---|---|---|---|
| **Cloud API directa de Meta** | Sin margen ni cuota: solo la tarifa de Meta | REST + webhooks. Es simple: enviar plantillas, recibir mensajes y estados | ✅ **Recomendada.** Lo que "resolvió" Wave IA es el inbox, el CRM y el bot conversacional, y **nada de eso lo necesitamos**: el restaurante sigue chateando desde su app de WhatsApp Business |
| Twilio | Tarifa de Meta + margen por mensaje (entrante y saliente) | SDK y consola | ❌ Suma costo por mensaje y un proveedor en el medio sin resolver nada difícil |
| 360dialog / YCloud y otros BSP | Cuota mensual por número o margen | **Alta embebida (Embedded Signup) con coexistencia** ya lista | ⚠️ Solo como atajo si un restaurante exige usar el número que ya tiene antes de que Luz Sur sea Tech Provider (ver abajo) |

**Coexistencia** permite conectar a la API el **mismo número** que el restaurante ya usa en la app WhatsApp Business: sigue chateando desde la app y el sistema manda por API. Es la experiencia ideal, pero se habilita mediante *Embedded Signup*, y para eso Luz Sur tiene que registrarse como **Tech Provider** de Meta (gratis, con verificación de negocio y revisión de la app, de semanas) — **no es algo que un negocio pueda activar por su cuenta sin un partner certificado**. Incluso una vez habilitada, tiene una condición operativa propia **de este modo, que el MVP con número dedicado no tiene**: **si nadie abre la app de WhatsApp Business en ese celular durante 7 días seguidos, la conexión con la API se corta** y hay que volver a vincularla. En un restaurante donde la app la usan a diario para pedidos y reservas no es un problema; si el número solo se usa esporádicamente, sí puede serlo. Es un argumento más a favor de arrancar con número dedicado en el MVP (§3.7): no depende de que nadie abra nada.

- **MVP:** número nuevo dedicado por restaurante (una línea prepaga barata), con la WABA creada en el portfolio del restaurante. Alta manual: el restaurante agrega a Luz Sur como socio y se genera un token de *system user*. Así, cero proveedores.
- **v2:** Luz Sur registrada como Tech Provider. Alta embebida en 5 minutos desde el panel y coexistencia con el número de siempre.

### 3.6 Límites operativos de Meta que afectan al producto
- **Límite de mensajes iniciados por el negocio:** un portfolio *no verificado* solo puede escribir a unos **250 destinatarios únicos cada 24 hs**. Una campaña a 1.200 personas tarda 5 días, y el aviso de baja a 2.000 clientes, 8 días (entra en los 30, pero justo). → La **verificación del negocio del restaurante en Meta** va en el checklist de alta, y el outbox reparte los envíos respetando el límite.
- **Plantillas:** todo lo que se manda fuera de la ventana necesita una plantilla aprobada. Al dar de alta un restaurante, el sistema **crea por API las plantillas estándar** (aviso de baja, reactivación, cumpleaños, confirmación manual) en su WABA.
- **Opt-out desde la interfaz de WhatsApp:** el usuario puede frenar el marketing desde la propia app. El webhook y los errores de envío correspondientes se tratan igual que un BAJA de marketing.
- **Arrancar ya** con la verificación de negocio de Luz Sur en Meta. Sin eso no hay onboarding ágil para la temporada.

### 3.7 El alta en la práctica: qué pide Meta, cuánto tarda, y si hace falta ir con el celular del restaurante

**No hace falta ir al local con su celular.** El único momento en que se necesita el teléfono es para recibir **un código por SMS o llamada de 6 dígitos**, una sola vez. Se puede hacer 100% remoto: por videollamada o llamada normal, el dueño te lee el código que le llega, y listo. Tampoco hace falta que instale nada ni que abra la app de WhatsApp Business en ese número — de hecho, en el MVP **no debe tenerlo asociado a esa app** (ver más abajo).

**Paso a paso (MVP, sin coexistencia):**

1. **Conseguir un número nuevo dedicado.** Una línea prepaga barata que nunca haya tenido WhatsApp personal ni WhatsApp Business App instalada (si la tuvo, hay que darla de baja de esa app primero). Puede comprarla el restaurante o vos y facturársela — es indistinto, pero conviene que la línea quede a nombre del restaurante para que sea inequívocamente su activo.
2. **El restaurante crea (o ya tiene) su Meta Business Portfolio** — la cuenta empresarial de Meta, no una cuenta personal de Facebook. Si no la tiene, se crea en 5 minutos con el mail del restaurante.
3. **El restaurante te agrega a vos (Luz Sur) como socio/administrador** de ese portfolio, con permisos sobre WhatsApp. Esto se hace con tu ID de negocio de Meta, sin que compartan contraseñas ni vos necesites loguearte como ellos.
4. **Se crea la WABA (WhatsApp Business Account)** dentro de ese portfolio y se registra el número nuevo. Acá llega el SMS/llamada con el código — es el único paso que depende del dueño en tiempo real, y dura minutos.
5. **Se genera un token de acceso de sistema** (*system user token*) de larga duración, para que el panel mande mensajes por API sin que nadie tenga que volver a loguearse. Este token se guarda cifrado en `tenants.wa_token_enc`.
6. **Se cargan las plantillas** (aviso de baja, cumpleaños, reactivación) por API — quedan pendientes de aprobación de Meta, normalmente en minutos a pocas horas.
7. **Se inicia la verificación de negocio** (nombre legal, CUIT, dirección — documentos con menos de un año), en paralelo, porque no bloquea empezar a mandar mensajes, pero **sí define el techo de destinatarios por día** (250/24 hs sin verificar, se eleva con volumen y buena reputación una vez verificado). Puede tardar de horas a **1–2 semanas** según la carga de Meta; en casos raros más. Por eso conviene iniciarla el mismo día del alta, no cuando ya se necesita mandar una campaña grande.

**Tiempo real de tu parte:** el alta técnica (pasos 1 a 6) es de **20 a 40 minutos** en una sola llamada con el dueño. Lo que puede demorar días o semanas es la verificación de negocio (paso 7), que corre en paralelo y no frena el uso normal del sistema (sumar puntos, canjear, avisos chicos) — solo limita cuántas campañas grandes se pueden mandar por día mientras tanto.

**Importante — esto NO significa que el restaurante tenga que atender dos WhatsApp.** El número del club no tiene ninguna app ni pantalla que alguien deba mirar: vive enteramente en el servidor, hablando por API directo contra Meta. El chip se usa una única vez, en el paso 4, para recibir el código — después se puede guardar sin necesidad de estar en un teléfono encendido ni de que nadie lo revise (conviene mantenerlo con algo de saldo por si alguna vez hay que re-verificar, nada más). El único WhatsApp que el personal mira es el de siempre, sin cambios. Su interacción diaria con el programa de fidelización es el **panel/modo mostrador** (§3.4, §7), no un WhatsApp.

**v2, con Luz Sur como Tech Provider:** el flujo de arriba se reemplaza por *Embedded Signup* — una pantalla dentro de tu propio panel donde el dueño hace login con su cuenta de Meta y en 5 minutos queda todo conectado, incluida la opción de **coexistencia** (usar el número que ya tiene en su app). Para ofrecer esto, Luz Sur tiene que pasar su propia revisión de app ante Meta una vez (semanas), así que conviene arrancarla en paralelo al desarrollo del MVP, no después.

---

## 4. Modelo de datos multi-tenant

### 4.1 Estrategia
**Una base, un esquema y `tenant_id` en cada tabla** (base compartida), con:
- un *global scope* de Laravel que agrega `WHERE tenant_id = ?` a toda consulta de los modelos del tenant (imposible de olvidar);
- índices compuestos que empiezan siempre por `tenant_id`;
- tests automáticos que verifican que un usuario del restaurante A nunca ve datos de B.

Alternativas descartadas: **una base por tenant** (en hosting compartido, crear bases es manual desde hPanel, más migraciones ×N y más backups ×N) y **un esquema por tenant** (MySQL no distingue esquema de base, así que es el mismo problema). La base compartida escala a cientos de restaurantes sin reescribir nada, y el borrado por tenant (§6) es un `DELETE ... WHERE tenant_id = ?` en orden.

### 4.2 Tablas principales

```sql
tenants            id, slug UNIQUE, name, status ENUM('onboarding','active','closing','closed','purged'),
                   branding JSON (logo, color, textos), timezone, settings JSON,
                   season_calendar JSON,                     -- p. ej. temporada alta dic–mar
                   wa_waba_id, wa_phone_number_id, wa_token_enc, wa_verified BOOL,
                   contract_signed_at, proposal_version, notice_days DEFAULT 30,
                   closing_reason ENUM('client_request','business_closed','owner_change','non_payment'),
                   closing_notice_at, closing_effective_at, closed_at, purge_after, purged_at

users              id, email, password_hash, name, is_luzsur_admin BOOL, status
tenant_memberships user_id, tenant_id, role ENUM('owner','manager','staff'), valid_until NULL, pin_hash NULL

customers          id, tenant_id, phone_e164, first_name, birthday NULL, status ENUM('active','opted_out','anonymized'),
                   first_seen_at, last_visit_at, visits_count, points_balance,   -- caché del ledger
                   local_or_tourist ENUM('unknown','local','tourist'),
                   UNIQUE(tenant_id, phone_e164)
card_tokens        id, tenant_id, customer_id, token_hash UNIQUE, created_at, revoked_at, last_used_at

loyalty_rules      id, tenant_id, version, type ENUM('stamps','per_amount'), params JSON,
                   points_expiry_policy JSON,  -- 'never' | 'end_of_next_season' | 'n_days'
                   valid_from, valid_to          -- versionadas: nunca se editan, se cierran y se crea otra
rewards            id, tenant_id, name, cost_points, high_value BOOL, active, sort
visit_codes        id, tenant_id, code_hash, kind ENUM('dynamic','printed'), batch_id, created_by,
                   amount_cents NULL, expires_at, used_at, used_by_customer_id
visits             id, tenant_id, customer_id, visit_code_id NULL, amount_cents NULL,
                   channel ENUM('qr','printed','manual','offline_sync'), staff_user_id, sent_at, created_at,
                   idempotency_key UNIQUE
points_ledger      id, tenant_id, customer_id, delta INT, balance_after INT,
                   type ENUM('earn','redeem','adjust','expire','program_closed','opt_out'),
                   ref_type, ref_id, rule_version, actor_user_id NULL, reason, created_at   -- SOLO INSERT
rewards_redemptions id, tenant_id, customer_id, reward_id, points, code_hash, channel ENUM('card','whatsapp'),
                   status ENUM('pending','confirmed','expired','cancelled'), confirmed_by, created_at

segments           id, tenant_id NULL (NULL = predefinido global), name, criteria JSON   -- filtros, no materializados
campaigns          id, tenant_id, kind ENUM('manual','birthday','reactivation','season_open','closure_notice','closure_reminder'),
                   is_system BOOL, segment_id, template_name, scheduled_at, status, est_cost_usd, created_by
outbound_messages  id, tenant_id, customer_id, campaign_id NULL, category ENUM('service','utility','marketing'),
                   template_name NULL, body_rendered, status ENUM('queued','sent','delivered','read','failed','suppressed'),
                   wa_message_id, attempts, next_attempt_at, error_code, cost_est_usd, created_at
webhook_events     id, tenant_id, wa_message_id UNIQUE, payload JSON, processed_at   -- idempotencia; retención 90 días

legal_documents    id, tenant_id NULL, kind ENUM('consent_msg','tyc_short','tyc_full','points_definition',
                   'closure_notice_msg','closure_reminder_msg','optout_confirm_msg'),
                   version, body_md, variables JSON, published_at, published_by
consent_events     id, tenant_id, customer_id, kind ENUM('granted','opted_out','regranted'),
                   legal_document_id, channel, evidence_wa_message_id, created_at          -- SOLO INSERT
audit_log          id, tenant_id NULL, actor_user_id, action, entity, entity_id, before JSON, after JSON, ip, created_at
tenant_archives    id, tenant_id, file_path, sha256, encrypted_with, created_at, destroy_after, destroyed_at
```

### 4.3 Decisiones de diseño clave
- **El ledger es la verdad.** El saldo es la suma de `points_ledger`. `customers.points_balance` es un caché que se actualiza **en la misma transacción** que inserta el movimiento, con un control nocturno que recalcula y alerta si difieren. Ningún saldo se "edita": todo ajuste es un movimiento con autor y motivo.
- **Reglas versionadas.** Si el restaurante cambia "8 visitas = postre" por "10 visitas = postre", los puntos ya ganados quedan con su `rule_version`. Como los puntos son discrecionales (§6.a), el cambio es válido, pero queda trazado.
- **Segmentación sin analítica pesada.** Los segmentos son filtros SQL sobre `customers` y `visits`: nuevos, frecuentes (≥3 visitas en 30 días), en riesgo (sin visita hace más de N días *dentro de la temporada*), perdidos, cumpleaños este mes, turistas de la temporada pasada y locales. Con índices en `(tenant_id, last_visit_at)` responden en milisegundos con decenas de miles de clientes.
- **Idempotencia en todo lo que entra de afuera:** webhooks (`wa_message_id UNIQUE`), sincronización offline (`idempotency_key`) y códigos de visita (de un solo uso).
- **Supresión centralizada:** el outbox chequea `customers.status` y el estado del tenant **en el momento del envío**, no al encolar. Si alguien escribió BAJA hace un minuto, ese mensaje no sale.

---

## 5. IA de sugerencias para el dueño

### 5.1 Qué es realizable y con qué

| Nivel | Qué hace | Cómo | Esfuerzo |
|---|---|---|---|
| **1 · Resumen semanal inteligente** ✅ v2 temprano | Cada lunes el dueño recibe por WhatsApp y en el panel: qué pasó, qué conviene hacer y **un borrador de campaña listo para aprobar con un toque** | SQL arma un JSON de ~2 KB con métricas **agregadas** (visitas contra la semana anterior y **contra la misma semana de la temporada pasada**, nuevos, en riesgo, tasa de canje, premio más pedido, día y hora pico). Una llamada a Claude (un modelo chico tipo Haiku alcanza) con instrucciones fijas → 3 sugerencias concretas + texto de campaña + segmento sugerido | Bajo: 1 job, 1 prompt y 1 pantalla. Costo del orden de centavos por restaurante por mes |
| **2 · Alertas por reglas + redacción por IA** | "12 clientes que venían todos los fines de semana de enero no volvieron en febrero", "Arranca la temporada en 3 semanas: 340 clientes del verano pasado" | Las **reglas** son SQL determinístico; el LLM solo **redacta y prioriza**. Así no hay alucinaciones sobre los números | Bajo-medio |
| **3 · Pesado (no recomendado todavía)** | Propensión de abandono por cliente, pronósticos, clima y eventos, ticket promedio por plato | Requiere integración con el POS, histórico de varias temporadas y un pipeline de analítica | Alto; recién cuando haya 2+ temporadas de datos |
| Chat "preguntale a tus datos" | El dueño pregunta en lenguaje natural | LLM con **herramientas predefinidas limitadas al tenant** (nunca SQL libre, para no filtrar datos entre restaurantes) | v3 |

### 5.2 La versión más simple que igual se siente inteligente
Lo que hace que se sienta inteligente no es el modelo: es que la sugerencia sea **específica** (números y nombres de segmento reales), **comparada con la temporada anterior** (lo que el dueño no puede calcular a mano) y **accionable con un toque** (el borrador de campaña con costo estimado ya armado). Eso es el Nivel 1 más un par de reglas del Nivel 2.

**Privacidad:** al LLM se mandan **solo agregados**. Nunca teléfonos ni nombres de clientes.

### 5.3 Por qué el costo de IA no depende de cuánto "use" el restaurante
Esto está resuelto por diseño, no por confianza en que el restaurante se porte bien:

- **En el MVP y v2 no hay ninguna caja de texto libre para el dueño.** El único uso de IA es el **Nivel 1**: un job semanal que **dispara el sistema, no el restaurante**. Una vez por semana, un tamaño de prompt fijo (los ~2 KB de métricas agregadas de §5.1) y una respuesta con **`max_tokens` fijado por código** (no lo decide el modelo ni el usuario). El restaurante no puede hacer que este proceso corra más seguido ni que devuelva una respuesta más larga, porque no tiene ningún control sobre él.
- **Costo por restaurante, siempre acotado:** 1 llamada/semana × (~3.000–5.000 tokens de entrada + ≤800 de salida, con un modelo económico tipo Haiku) ≈ **centavos de dólar por mes**, sin importar cuántas visitas o campañas tenga ese restaurante — el volumen de negocio no infla el prompt, porque lo que se manda es un resumen agregado de tamaño constante, no el historial completo de cada cliente.
- **Se loguea el consumo real por tenant** (`ai_usage_log`: tokens de entrada/salida, costo estimado, fecha) para detectar cualquier desvío y para poder mostrar, si hace falta, "cuánto cuesta la IA de este restaurante" — pero en la práctica es una cifra tan chica que no vale la pena facturarla aparte; ya está contemplada en los US$0,20–0,50/mes de §9.1.
- **Si en v3 se agrega el chat "preguntale a tus datos" (interactivo, con preguntas libres del dueño), ahí sí hay que ponerle un techo explícito desde el primer día**, porque ahí el volumen de uso ya no lo controla el código sino la curiosidad del dueño: una cuota incluida en el plan (por ejemplo, 30 preguntas por mes), un `max_tokens` corto por respuesta, un modelo económico, y bloqueo o aviso al superar la cuota — nunca una llamada a la API sin límite superior definido de antemano. Es la única pieza de IA del roadmap que necesita este control; el resto (Niveles 1 y 2) ya nace acotado por ser un job batch, no una conversación.

---

## 6. Marco legal y contractual: implementación técnica

Cada punto se toma como especificación funcional.

### 6.a Definición de los puntos
- **Dónde vive:** `legal_documents(kind='points_definition')`, versionado. Se muestra en la landing, en la tarjeta (junto al saldo: "Tus puntos son un beneficio del local, sin valor en dinero") y en los T&C completos.
- **Consecuencias en el modelo:**
  - No hay moneda, tipo de cambio ni "valor contable" en ninguna tabla. `points_ledger.delta` es un entero sin unidad monetaria.
  - No existe ningún flujo de "liquidación", "transferencia" ni "conversión" de puntos. El único destino de un saldo es `redeem`, `expire` o `program_closed`.
  - "Sujeto a modificación": las reglas versionadas (§4.3) y los ajustes manuales (`type='adjust'`, con autor y motivo en `audit_log`) lo implementan.

### 6.b Baja de un restaurante: máquina de estados y campaña automática

```
active ──(Luz Sur registra la baja: motivo + fecha)──▶ closing
   │  closing_notice_at = hoy; closing_effective_at = hoy + tenants.notice_days (30)
   │  · sumar puntos SIGUE habilitado (decisión configurable; por defecto sí)
   │  · CANJEAR sigue habilitado hasta closing_effective_at
   │  · banner en la landing y la tarjeta: "El programa termina el DD/MM. Canjeá antes de esa fecha."
   ▼
closing ──(closing_effective_at)──▶ closed
   │  · por cada cliente con saldo > 0: movimiento type='program_closed', delta = −saldo
   │  · landing: "Programa finalizado" (sin formulario); tarjetas: solo ese mensaje
   │  · panel: solo lectura; se desactiva el webhook del tenant; se revoca el token de WhatsApp
   │  · se genera el archivo del tenant (6.c) y se ejecuta el borrado en vivo
   ▼
closed ──(closed_at + 90 días)──▶ purged
      · se destruye el archivo cifrado; tenants queda con datos mínimos del contrato (sin datos personales)
```

**Jobs (scheduler diario, 10:00 hora argentina):**
- `lifecycle:closing-notices`: para cada tenant en `closing` que no tenga la campaña `closure_notice`, **la crea y la encola en el outbox** para todos los clientes `active`, con la plantilla aprobada `closure_notice` y las variables `{restaurante}`, `{fecha_cierre}` y `{link_tarjeta}` (se rota un token por cliente). El outbox respeta el límite de 250/día si el portfolio no está verificado.
- `lifecycle:closing-reminders`: recordatorios en **T−7** y **T−1**, solo a clientes con saldo suficiente para algún premio (menos costo y más útil).
- `lifecycle:close`: al cumplirse `closing_effective_at` ejecuta la transición a `closed` **en una transacción** y deja el registro en `audit_log`.
- `lifecycle:purge`: al cumplirse `purge_after` ejecuta la destrucción (6.c).
- **Salvaguardas:** la transición a `closing` pide doble confirmación en el superadmin (escribir el slug). Hasta `closing_effective_at` se puede **revertir** (el restaurante se arrepiente), lo que cancela las campañas pendientes. El panel muestra una cuenta regresiva.
- **Disparadores de 6.e:** `closing_reason` admite `business_closed` y `owner_change`. Registrar un cambio de dueño dispara **exactamente el mismo flujo**; no hay caminos alternativos en el código.

### 6.c Datos personales, consentimiento, BAJA y borrado
**Pertenencia de los datos**
- `tenant_id` en cada registro, y ninguna tabla que vincule clientes entre tenants. La misma persona en dos restaurantes son dos filas sin relación, con tokens distintos. **No existe ninguna consulta ni pantalla que cruce clientes entre tenants.** Hay tests que lo verifican.
- Mientras el servicio está activo, el dueño puede **exportar su base a CSV** desde el panel (queda en `audit_log`).

**Consentimiento en el primer WhatsApp**
- El texto vive en `legal_documents(kind='consent_msg')`, con un texto global de Luz Sur y un override opcional por tenant, versionado y con variables `{restaurante}`.
- Se envía **dentro del primer mensaje de respuesta** (§3.4) y se registra `consent_events(kind='granted', legal_document_id=<versión vigente>, evidence_wa_message_id=<mensaje entrante del cliente>)`.
- Si se cambia el texto, el panel publica una **nueva versión** y la vieja queda intacta. Cada cliente queda asociado a la versión que efectivamente recibió.

**BAJA**
- El webhook normaliza el mensaje (minúsculas, sin tildes ni signos) y reconoce `baja`, `dar de baja`, `stop` y `no quiero mas mensajes`. También procesa el opt-out de marketing hecho desde la interfaz de WhatsApp.
- Efecto inmediato:
  1. `consent_events(kind='opted_out')`;
  2. movimiento `type='opt_out'` que deja el saldo en 0;
  3. borrado del perfil: se eliminan nombre, cumpleaños y tokens; `phone_e164` se reemplaza por un **hash con sal** (sirve como lista de supresión y evita que el sistema lo vuelva a contactar) y `status='anonymized'`;
  4. se cancela todo lo pendiente en el outbox;
  5. una respuesta de confirmación, con el texto de `legal_documents(kind='optout_confirm_msg')`.
- Si la persona vuelve a escanear y escribe por su cuenta, es un nuevo alta explícita (`regranted`) con consentimiento nuevo.

**Borrado tras la baja del restaurante** (implementa "backup de 90 días, luego destrucción")
1. **Al pasar a `closed`:** se genera un **archivo cifrado solo con los datos de ese tenant** (export JSON/SQL de sus filas), cifrado con una clave pública de Luz Sur (age/GPG; la clave privada no vive en el servidor). Se guarda offsite y se registra en `tenant_archives` con `destroy_after = closed_at + 90 días`.
2. **Acto seguido:** se hace un `DELETE` de todas las filas del tenant en las tablas de clientes, visitas, ledger, tokens, mensajes, webhooks y consentimientos, en orden de claves foráneas y por lotes. `tenants` queda solo con datos del contrato y métricas agregadas sin datos personales, para la historia comercial de Luz Sur.
3. **Backups generales:** su retención se fija en **≤ 30 días rotativos**, así que a los 30 días del cierre ningún backup general contiene esos datos. El único lugar donde persisten hasta el día 90 es el archivo del paso 1.
4. **Día 90:** `lifecycle:purge` borra el archivo offsite, verifica que ya no existe, marca `destroyed_at` y `tenants.status='purged'`, y deja el registro en `audit_log`.

### 6.d T&C mínimos, editables sin tocar código
- `legal_documents` con `kind` en `tyc_short` (el párrafo del pie), `tyc_full` (el detalle en `sumapuntos.ar/{slug}/terminos`), `points_definition` y `consent_msg`.
- **Editor en el superadmin** (Markdown con vista previa) → "Publicar" crea la versión n+1. Hay un texto global de Luz Sur y un override opcional por restaurante. Variables disponibles: `{restaurante}`, `{direccion}`, `{whatsapp}`, `{fecha_cierre}`.
- El pie de la landing y de la tarjeta renderiza siempre la última versión publicada de `tyc_short` con el link a `tyc_full`. **No hay textos legales en el código**: los seeds iniciales cargan la versión 1 redactada en el tono de las propuestas de Luz Sur.
- Solo Luz Sur puede editar los textos legales. El dueño edita la marca, los premios y las reglas.

### 6.e Cláusulas del contrato Luz Sur–restaurante reflejadas en el sistema
| Cláusula | Implementación |
|---|---|
| 30 días de aviso | `tenants.notice_days` (default 30), usado por `closing_effective_at` |
| Cierre o cambio de dueño disparan la baja | `closing_reason` = `business_closed` / `owner_change` → mismo flujo 6.b |
| Datos del restaurante mientras el servicio esté activo | Export CSV en el panel mientras el estado sea `active` o `closing`; borrado en `closed` (6.c) |
| Responsabilidad limitada y resolución en 48 hs hábiles | **Monitoreo externo gratuito** (chequeo de salud cada 5 minutos a `/health`, que valida la base, el cron que corrió en los últimos 3 minutos y la antigüedad del outbox) con alerta al WhatsApp o mail de Luz Sur. Una tabla `incidents` (apertura, resolución, restaurantes afectados) documenta el cumplimiento del plazo |
| Referencia a la versión de propuesta firmada | `tenants.proposal_version`, `contract_signed_at` |

---

## 7. Riesgos de la costa atlántica y cómo mitigarlos en el diseño

| Riesgo | Mitigación en el producto |
|---|---|
| **Estacionalidad fuerte** (el 70–80 % del movimiento entre diciembre y marzo) | · **Los puntos no pueden vencer antes de la próxima temporada**: el turista vuelve el verano siguiente. Política por defecto: `end_of_next_season`.<br>· Las métricas se comparan **contra la misma semana de la temporada anterior**, no contra la semana pasada (en marzo, todo "cae").<br>· Campaña automática **"Volvió la temporada"** a los clientes del verano anterior 1–2 semanas antes de la apertura: es la campaña de mayor retorno del año.<br>· Segmento **local o turista** (inferido: visitas fuera de temporada = local) para un programa de invierno con los residentes.<br>· Comercial: cuota anual prorrateada o "modo invierno" más barato, para evitar bajas en abril. |
| **Rotación de personal** que opera el panel | · **Cada persona tiene su usuario** (sin contraseñas compartidas), con `valid_until` que **vence solo** al final de la temporada.<br>· **Modo mostrador**: la tablet del local queda logueada y cada empleado usa un PIN de 4 dígitos. Una pantalla con dos botones grandes: "Nueva visita" y "Canjear". Cero capacitación.<br>· El rol `staff` solo suma y confirma canjes; no exporta, no ve teléfonos completos ni manda campañas.<br>· `audit_log` por empleado, y los talonarios impresos asignados a un empleado permiten detectar abusos.<br>· Video de 60 segundos y alta de empleado por link de invitación enviado por WhatsApp. |
| **Conectividad variable** (paradores, horas pico, datos móviles saturados) | · **El cliente suma por WhatsApp**: si no hay señal, el mensaje queda en cola en su teléfono y se envía solo. El código se valida contra la hora de *envío*.<br>· **Talonarios impresos**: el local suma sin internet.<br>· Panel como **PWA con cola offline** (IndexedDB + `idempotency_key`): las visitas manuales se sincronizan al volver la señal, sin duplicados.<br>· Landing y tarjeta livianas (SSR, menos de 100 KB, sin JS pesado). |
| **Dependencia de Meta** (calidad del número, bloqueos) | Número por restaurante (el riesgo queda aislado), marketing segmentado con tope de frecuencia (máximo 1 mensaje de marketing por cliente por semana), BAJA inmediata. La **tarjeta web funciona aunque WhatsApp falle**. |
| **Una sola persona operando** | Todo en código y documentado en el repo (un CLAUDE.md con runbooks: alta, baja, restaurar backup, rotar token de Meta). Backups offsite **con prueba de restauración mensual**, monitoreo externo y alertas. |
| **Pico de enero** | La carga es trivial (unas visitas por minuto por local). Aun así: caché de la configuración del tenant, índices y cola con límite de ritmo por número. |

---

## 8. Fases de desarrollo

Hoy es 25/09/2026. Con una persona part-time y Claude Code, **un MVP de 8–10 semanas llega a un piloto con 1–2 restaurantes antes de la temporada** (mediados de diciembre). Es ajustado. **La verificación de negocio en Meta, de Luz Sur y del primer restaurante, conviene arrancarla esta semana**, porque puede tardar.

### MVP: indispensable para la primera venta
**Plataforma**
- Plan Hostinger dedicado, Laravel + MySQL, deploy por git/SSH, backups nocturnos cifrados offsite con retención de 30 días y monitoreo externo.
- Alta de restaurante desde el superadmin: marca, premios y regla **tipo sellos** ("cada visita suma 1; 8 = premio"), la mecánica que todos entienden.

**Cliente final**
- Landing por path con los T&C del pie desde `legal_documents`.
- Identificación y suma **por WhatsApp iniciado por el cliente**, con consentimiento en el primer mensaje.
- Tarjeta por token (≥ 95 bits, guardado con hash), con los comandos **TARJETA** (reenvío con rotación) y **BAJA** (completo, §6.c).

**Local**
- Modo mostrador con visita por QR dinámico + carga manual. Talonarios impresos (se generan en PDF).
- Canje con código de dos partes y umbral de alto valor por WhatsApp.
- Panel del dueño: clientes (teléfono enmascarado para el personal), visitas, KPIs básicos y export CSV.

**WhatsApp**
- Cloud API directa, WABA en el portfolio del restaurante, creación automática de plantillas y outbox con límite de ritmo.

**Legal (innegociable)**
- `legal_documents` versionado + editor, `consent_events`, BAJA, **máquina de estados de baja completa** (aviso, recordatorios, cierre, archivo cifrado, purga a los 90 días), `audit_log`.

**Campañas**
- **Una campaña manual a un segmento predefinido** con costo estimado previo. Reutiliza el mismo outbox que el aviso de baja, y es lo que vende.

### v2: primera temporada con clientes reales (enero–abril 2027)
- Automatizaciones: cumpleaños, reactivación dentro de la temporada y **"Volvió la temporada"**.
- **Resumen semanal con IA** (Nivel 1) + alertas por reglas (Nivel 2).
- Segmentos editables y regla por monto (`per_amount`).
- Vencimiento de puntos por temporada.
- PWA offline del mostrador con PIN por empleado y usuarios con vencimiento.
- Luz Sur como **Tech Provider**: alta embebida + **coexistencia** con el número de siempre del restaurante.
- Varias sucursales por restaurante.
- Subdominios vía Cloudflare DNS si hay demanda.

### v3: cuando haya escala y 2+ temporadas de datos
- Chat "preguntale a tus datos" con herramientas limitadas al tenant.
- Pedido de reseñas de Google después de la visita.
- Referidos ("traé un amigo").
- Dominios propios del restaurante.
- Integración con POS (disparador para migrar a VPS, alternativa B).
- Facturación automática de la suscripción y los créditos de campaña.
- Wallet (Google/Apple) solo como canal *opcional* adicional.

---

## 9. Precio, formato comercial y unit economics

*Añadido en una segunda pasada, a pedido explícito. Las cifras de costo real de infraestructura y de mensajería son datos duros; las de tiempo de soporte y de desarrollo son estimaciones con una tarifa/hora que se puede ajustar — el método importa más que el número exacto.*
Referencia de tipo de cambio usada: dólar oficial ≈ **ARS 1.500/USD** (25/09/2026). Actualizar antes de fijar precios en pesos.

### 9.1 Costo real para Luz Sur, no lo que "parece caro"

**Fijos, compartidos entre todos los restaurantes (no crecen por cliente nuevo):**

| Ítem | Costo |
|---|---|
| Plan Hostinger dedicado (§0.2) | ≈ US$10–15/mes |
| Backup cifrado offsite (decenas de GB) | < US$1/mes |
| Dominio del producto | ≈ US$1,5/mes prorrateado |
| Monitoreo externo | US$0 (nivel gratuito alcanza a este volumen) |
| **Total fijo** | **≈ US$15/mes**, repartido entre todos los tenants activos |

**Variables, por restaurante:**

| Ítem | Costo | Nota |
|---|---|---|
| Resumen semanal con IA (§5) | ≈ US$0,20–0,50/mes | Un modelo chico con un prompt corto; irrelevante en el costo total |
| WhatsApp (mensajes) | **US$0 para Luz Sur** | Decisión clave de §3.3: la WABA vive en el portfolio de Meta *del restaurante*, así que Meta le cobra a él directamente con su propia tarjeta. Luz Sur no paga un solo mensaje ni asume el riesgo de una campaña cara |
| **Soporte y operación** (el costo real) | ≈ **US$15–25/mes en temporada alta**, casi US$0 en temporada baja | Alta (3–5 hs una vez: branding, verificación de WhatsApp, talonarios, capacitación) + acompañamiento mensual (media hora a una hora: dudas, ajustes de premios, alguna campaña armada a pedido). Calculado a ≈ US$15–25/hora, una tarifa de referencia para trabajo freelance calificado en Argentina — ajustable |

**Conclusión que cambia cómo pensar el precio:** la infraestructura y la IA son casi gratis a esta escala, y el mensaje de WhatsApp no lo pagás vos. **El costo real es tu tiempo de onboarding y soporte**, no el servidor. El precio tiene que cubrir *eso*, no "el hosting".

### 9.2 Costo de desarrollo (inversión única, no mensual)
MVP de 8–10 semanas part-time (≈120–200 horas totales) a una tarifa de construcción de producto (más alta que la de soporte porque es un activo, no una tarea repetida), digamos US$25–35/hora → **inversión total ≈ US$3.000–7.000**. Es un costo de una sola vez que se recupera con la base de clientes de las primeras temporadas, no algo que haya que cobrarle a cada restaurante por separado.

### 9.3 Qué cobran los competidores, como referencia de mercado
- **Kivly** (fidelización con tarjeta digital, ecosistema Shopify): arranca en **US$29/mes**.
- **Lealtix** (México, CRM + fidelización más completo): **$1.500–3.500+ MXN/mes ≈ US$75–175/mes**.
- **Software de gestión para restaurantes** en general (reservas, ERP): planes básicos desde **€29–50/mes**, los completos **€100–150+/mes**.

Tu producto es más angosto que Lealtix o Wave IA (no es un CRM ni un bot conversacional completo: es fidelización + WhatsApp + IA liviana), pero resuelve algo puntual muy bien y sin fricción de instalar nada. Eso lo ubica **por debajo de un CRM completo y por encima de un simple sello de cartulina digitalizado**.

### 9.4 Formato comercial: por qué suscripción y no otra cosa

| Formato | Por qué sí o por qué no |
|---|---|
| **Suscripción mensual** ✅ | Ingreso predecible, es el estándar que cualquier dueño de restaurante ya entiende (lo mismo que paga por el sistema de reservas o el POS), y alinea el cobro con el soporte continuo que en realidad estás dando |
| Pago único / licencia | ❌ No cubre el soporte, los cambios de temporada ni el mantenimiento de un desarrollador part-time. Sin ingreso recurrente, cada restaurante nuevo es una carga fija sin financiamiento |
| Comisión por punto canjeado | ❌ Genera fricción rara ("me cobrás por usar mi propio programa"), es difícil de explicar y de facturar, y castiga al restaurante que más éxito tiene con el programa |
| Freemium | ❌ A esta escala, un plan gratis igual genera soporte y no genera caja. Puede tener sentido como *gancho para el primer piloto*, no como modelo general |

**Recomendación: suscripción mensual por restaurante, con precio de referencia en USD (por la inflación argentina) y cobro en ARS al tipo de cambio del mes.** Es lo que ya hacen Kivly y Lealtix, y es lo que cualquier PyME de la costa ya paga por otras herramientas.

### 9.5 Estructura de precios propuesta

**Fee de alta (una vez por restaurante): US$100 (≈ ARS 150.000).**
Cubre el trabajo real de onboarding: ayuda con la verificación del negocio en Meta, carga de marca y premios, generación de los talonarios impresos y la capacitación del personal. Sirve además como filtro: un restaurante que no lo paga no está realmente comprometido con arrancar la temporada.
→ Para los primeros 2–3 restaurantes piloto (Barbados y algún otro conocido), **bonificalo o reducilo a cambio de testimonio y caso de éxito documentado** — es marketing, no pérdida.

**Planes mensuales, por volumen de clientes activos** (el volumen es lo que más correlaciona con el valor que reciben y con cuánto soporte te demandan):

| Plan | Clientes activos | Precio de referencia | En ARS (≈1.500) |
|---|---|---|---|
| **Base** | hasta 300 | US$29/mes | ≈ $43.500 |
| **Estándar** (el esperable para la mayoría en temporada) | 300–1.500 | US$49/mes | ≈ $73.500 |
| **Pro** | +1.500 o varias sucursales, soporte prioritario | US$79/mes | ≈ $118.500 |

El plan se recalcula automáticamente según `customers.status='active'` contado por tenant; si un restaurante cruza el umbral dos meses seguidos, el sistema lo sugiere en el panel (no lo sube solo).

**Modo invierno (crítico dado el riesgo de estacionalidad de §7):** en vez de perder al cliente entre abril y noviembre, ofrecer una **pausa a mitad de precio** (o directamente sin cargo si el contrato es anual) que mantiene los datos, el número de WhatsApp y la landing activos pero sin campañas. Reactivar en diciembre no vuelve a cobrar el fee de alta. Esto es lo que más protege el negocio de Luz Sur frente al problema #1 detectado en §7: es mucho más barato retener a mitad de precio que volver a vender el fee de alta cada temporada.

**Descuento por pago de temporada completa:** 6 meses (diciembre–mayo) por adelantado con **15–20 % de descuento**. Mejora el flujo de caja de Luz Sur y baja la fricción de cobro mensual repetido con una sola persona operando.

### 9.6 Unit economics (plan Estándar, temporada alta, por restaurante)

| | Monto |
|---|---|
| Ingreso mensual | US$49 |
| Costo real (soporte + infra prorrateada + IA) | ≈ US$20 |
| **Margen bruto** | **≈ US$29/mes (≈59 %)** |
| Margen en temporada baja (modo invierno, a mitad de precio) | Similar o mejor en términos relativos: el ingreso baja a la mitad pero el soporte casi desaparece |

**Recuperar la inversión del MVP** (≈US$3.000–7.000, §9.2): con 15 restaurantes activos en plan Estándar durante una temporada de 6 meses, el margen acumulado es de ≈US$2.600. Es decir, **la primera temporada no termina de pagar el desarrollo si el punto de partida son ~15 clientes**; con 25–30 restaurantes (alcanzable en la segunda temporada si el piloto funciona) se cubre en un semestre. No es un problema: es el ritmo normal de un producto que arranca — lo importante es que **cada restaurante, desde el primer mes, deja margen positivo** y no subsidia al siguiente.

### 9.7 Qué vender aparte (no meter en el plan base)
- Diseño de material impreso extra (cartelería de mesa, stickers) más allá del talonario estándar: cargo único chico.
- Alta de una sucursal adicional del mismo restaurante: fracción del plan, no el plan completo de nuevo (comparten marca y reglas, no comparten local).
- Coexistencia con el número de WhatsApp que el restaurante ya usa (v2, §3.5): valor agregado real, puede justificar el salto del plan Base al Estándar por sí solo.

---

## Resumen de recomendaciones

| Tema | Recomendación |
|---|---|
| Infraestructura | **Laravel + MySQL en un plan Hostinger dedicado** (no el Premium compartido con otros clientes). Migración a VPS solo si se superan unos 40 restaurantes o se integra un POS. |
| Template multi-tenant | Render en el servidor por request, con **path** en el MVP y subdominios vía Cloudflare DNS en v2. |
| Token | 16 caracteres base62 (~95 bits), guardado con hash, rotación en cada reenvío, canje siempre entre dos partes y alto valor confirmado por WhatsApp. |
| WhatsApp | **Cloud API directa**, **número propio por restaurante** con la WABA en su portfolio, identificación **iniciada por el cliente**. Sin intermediario, salvo atajo puntual para coexistencia. |
| Datos | Base compartida con `tenant_id` + global scope, ledger solo de inserción, reglas versionadas y segmentos como filtros. |
| IA | Resumen semanal: métricas agregadas por SQL → LLM → sugerencias + borrador de campaña aprobable con un toque. |
| Legal | Todo como datos versionados (`legal_documents`, `consent_events`) y una máquina de estados de baja con jobs; ningún texto legal en el código. |
| Precio | Suscripción mensual por nivel de clientes activos (US$29/49/79), fee de alta único (~US$100), y modo invierno a mitad de precio para no perder al cliente en la temporada baja. |

## Fuentes (§9, precios)
- [Kivly — Fidelización | Shopify App Store](https://apps.shopify.com/kivly-fidelizacion)
- [Lealtix — Suite de Inteligencia y Administración](https://github.com/syborx-git/lealtix-main/issues/138)
- [Cotización del dólar oficial, 25/09/2026 — qpasó](https://qpaso.ar/finanzas/dolar/2026/septiembre)

## Fuentes
- [Pricing on the WhatsApp Business Platform | Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)
- [Upcoming pricing updates for service and utility messages | Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
- [Argentina WhatsApp API Pricing 2026 — Ominiflow](https://ominiflow.com/whatsapp-api-pricing/argentina)
- [WhatsApp API Pricing 2026: Meta Rates by Country — Whautomate](https://whautomate.com/whatsapp-business-api-pricing)
- [Service Message Charging Starts October 1, 2026 — 360dialog](https://360dialog.com/blog/whatsapp-service-message-charging-october-2026/)
- [WhatsApp API Pricing Update: Effective October 1, 2026 — YCloud](https://www.ycloud.com/blog/whatsapp-api-message-pricing-update-effective-october-1-2026)
- [Node.js hosting options at Hostinger](https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/)
- [Are Wildcard or Multi-Domain SSL Certificates Supported at Hostinger?](https://www.hostinger.com/support/1583432-are-wildcard-or-multi-domain-ssl-certificates-supported-at-hostinger/)
- [How to set up a cron job at Hostinger](https://www.hostinger.com/support/1583465-how-to-set-up-a-cron-job-at-hostinger/)
