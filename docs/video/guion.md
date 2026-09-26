# Mejores Amigos — Guion del reel (v17)

**Formato:** vertical 1080×1920 · 30 fps · **~66 s**
**Control de legibilidad:** `node scripts/check-legibility.mjs out/mejores-amigos-reel.mp4` (Tesseract).

| Pantalla | Qué se ve |
|---|---|
| ¿Tenés un comercio gastronómico? | comandas de restaurante flotando en profundidad |
| Un cliente vino 12 veces este año. | "veces este año." debajo del 12; 12 comandas "VISITA n · JULI" van cayendo por toda la pantalla |
| ¿Sabés quién es? | anillos, persona borrosa en el círculo iluminado, signos de pregunta, rayos detrás |
| Con Mejores Amigos, sí. → definición | subida de la canción |
| El cliente escanea el QR en la mesa. | la señora escaneando + estrellita 3D |
| En cada visita, suma estrellitas. | estrellita 3D + tarjeta de 5 |
| Desbloquea premios. | el celular que da vuelta la tarjeta: ¡Primer premio! |
| ¿Y tu comercio qué gana? | |
| Conocés a tus clientes. | Nuevos 63 · Frecuentes 148 · En riesgo 37, en columna, con sonido |
| Perfil del cliente | Pedro escaneado: Viene 1 vez por semana · Cumple el 7 de enero · Frecuente |
| Llená los días más flojos. | + "El sistema detecta tu día más flojo y te propone una promo." |
| Sugerencia del sistema de IA | captura del panel; la cámara se acerca y viaja entre los focos: foco en "Los martes vienen la mitad de clientes…", foco en el mensaje, toque en el botón → "Promo automática activada · Martes de doble estrellita" |
| Los martes +55% de visitas. | barras 3D |
| La IA te sugiere el mensaje para cada cliente. | |
| Sugerencias de hoy | las sugerencias caen una tras otra, desordenadas, hasta llenar la pantalla; la última es "Juli cumple en 5 días", cae al centro, se ilumina y la cámara entra |
| (mensaje) → Enviado → Le llega por WhatsApp. | celular 20:41 con notificación |
| Tus clientes vuelven. | |
| + frecuencia. + clientes. + ventas. | cada "+" gira y entra, la palabra se revela y se subraya |
| Cierre | logo, contacto, cinta horizontal SIN APPS ✦ SIN TARJETAS ✦ SOLO WHATSAPP |

### Cambios v17
- Sin vibración ni saltos: el grano de película ahora es fijo (al cambiar cuadro a cuadro, el compresor de video repartía mal la calidad y el texto fino temblaba y la cinta final se trababa) y la exportación final usa una compresión más fina.
- Pantallas más cortas: "Conocés a tus clientes" (−1 s), perfil de Pedro (−2 s, sin "Pide café con leche"), "Llená los días más flojos" (−1,5 s).

---

## Versiones anteriores
### v12

**Formato:** vertical 1080×1920 · 30 fps · **~83 s** (v11: 71,5 s · v10: 64 s · v9: 69,5 s · v8: 68,5 s · v7: 76 s · v6: 82 s)
**Música:** `cancion.mp3` (~134 BPM), recortada: arranca en 4,68 s (3 compases antes de la subida) y termina con un fundido de 2 s a los 69,4 s. No hay cortes en el medio de la canción.

| Canción | Tiempo en el reel | Uso |
|---|---|---|
| Intro tranquila | 0 – 7,2 s | Gancho |
| **Subida** | **7,2 s** | "Con Mejores Amigos, sí." + logo |
| Sección A | 7,2 – 46,8 s | Qué es + los 3 pasos del cliente + "¿Y tu comercio qué gana?" |
| Corte (sin bajo) | 46,8 – 54,4 s | Beneficio 2: se lee el mensaje de cumpleaños con calma |
| Vuelta de la energía | 54,4 s | El mensaje se envía solo |
| Sección B | 54,4 – 76 s | Beneficios 3 y 4, remate y cierre |

**Ejemplo (ficticio):** restaurante **Brasa Restó** · clientes **Juli** y **Martín** · el premio se descubre al desbloquearlo.
**Estilo:** íconos 3D (Microsoft Fluent Emoji, MIT) que flotan con sombra, grilla "bento" de beneficios, tipografía de peso variable, contador tipo cuentakilómetros, teléfono inclinado en 3D, cinta de texto en movimiento, kinetic type con máscaras, personajes ilustrados (Open Peeps), pantallas reales del panel con **foco** (se oscurece el resto y se enmarca el dato, sin trazos a mano), transiciones de marca, motion blur en los títulos, movimiento orgánico con ruido (@remotion/noise).

---

## Cambios v12 (aplicando latent-spaces/brag)
- **Gancho nuevo (0–3 s):** solo la pregunta "¿Tenés un comercio gastronómico?" sobre fondo oscuro de marca, con un plato y una campana plateada en 3D real (three.js) bajo un foco de luz: la campana se levanta, sale vapor y aparece la estrellita dorada del sistema. Después siguen "12 veces" y "¿Sabés quién es?". La canción arranca desde el principio (la subida cae en el logo, a los 10 s).
- **Regla de lectura de brag** (~0,3 s por palabra desde que la frase termina de entrar): más tiempo en la definición, la línea de IA, el premio, las placas de beneficio y el mensaje de cumpleaños.
- **Efectos de sonido reales** de Kenney (CC0, incluidos en brag), mezclados suaves bajo la música: tarjetas, clicks, campanas, golpes suaves, fichas para las estrellitas.
- **Reacción a la música:** los graves de la canción avivan el haz de luz del gancho, las auroras de las placas y los fondos (nunca el texto).
- **Entregables extra:** `texto-para-publicar.txt` (copy para Instagram) y una portada (`portada.jpg`) con el cuadro más fuerte para elegir como cover.

## Cambios v11
- **Más tiempo de lectura:** la sugerencia de los martes (foco en el título y después en el mensaje, 4,6 s), "Los martes, cada visita suma 2 estrellitas" con el gráfico (3,7 s), y la placa "Los clientes vuelven más seguido" con su frase (4,5 s).
- **El "12"** sin resplandor (se notaba el recuadro de cada cifra).
- **La cinta del cierre** corre pareja, sin saltos al reiniciar.
- **Nuevo (recetas de HyperFrames):**
  - *El mensaje le llega a Juli*: después de "Enviado", aparece su celular bloqueado y cae una notificación de vidrio ("liquid glass") de Brasa Restó.
  - *Dolly zoom* en "¿Sabés quién es?": los anillos del fondo se abren hacia cámara mientras el círculo de la clienta queda quieto (efecto "vértigo").
  - *Fondos aurora* en las placas de beneficio: manchas de color de marca que derivan lento.
- **Archivo limpio de metadatos**: sin marcas de herramientas ni de IA (C2PA/IPTC) en el MP4.

## Cambios v10
- **Sin vibración:** los resortes de entrada ahora quedan exactamente quietos al asentarse (antes oscilaban décimas de píxel y el texto "temblaba"), y no hay acercamientos lentos sobre texto.
- **Sin números 3D:** ni en el "12" ni en los 01/02/03 ni en las placas.
- **Movimiento de cámara entre escenas** (recetas de HyperFrames, Apache 2.0): la escena nueva entra empujando o desde cerca de cámara con desenfoque de lente, la anterior retrocede por debajo; del paso 03 la cámara se "zambulle" en el celular. Las tarjetas llegan desde el fondo del espacio y se asientan planas.
- **Placas de beneficio con la frase grande** y el ejemplo en otra pantalla:
  1. Conocé a tus clientes. — Sabé quién viene. Sabé quién vuelve.
  2. Llená los días flojos. — El sistema detecta tu día más flojo y te propone una promo.
  3. Mensajes automáticos, en el momento justo. — El sistema de IA te sugiere qué enviar.
  4. Los clientes vuelven más seguido. — Vos decidís. El sistema te sugiere propuestas de mensajes, y vos autorizás el envío.
- Botón del mensaje de cumpleaños: "Aprobar y enviar mensaje" → "✓ Enviado". Sin "¡Enviado solo!".
- Canción desde un compás más tarde: gancho de 5,4 s.

## Cambios v9
- Gancho: las 12 estrellitas van **debajo** de "a tu restaurante este año." El "12" tiene volumen (tipografía extruida).
- "Con [Mejores Amigos], sí.": el logo queda **centrado en la pantalla**.
- Paso 01: sin chat. Después del escaneo aparece una **estrellita 3D real** (three.js) con "+1 estrellita".
- Paso 03: el teléfono tiene canto (espesor) y ya no vibra; se corrigió el "03" que quedaba encima de la transición.
- "¿Y tu comercio qué gana?" dura más (4,9 s).
- **Nuevo orden de beneficios:** 1 Conocé a tus clientes · 2 Llená los días flojos · 3 Mensajes automáticos · 4 Los clientes vuelven más seguido.
- Días flojos: más tiempo de lectura (foco en el título y en el mensaje), y un **gráfico de barras 3D** propio donde crece el martes (+55%).
- Mensajes automáticos: sin "Vos aprobás…" ni la pantalla de envío; el botón pasa a "Enviado a los 4" y aparece "¡Enviado solo!".
- Vuelven más seguido: "Vos decidís. El sistema te sugiere propuestas de mensajes, y vos autorizás el envío."
- Cierre sin los íconos alrededor del logo. Íconos más chicos y con borde blanco tipo sticker. Luces cálidas tipo película en la subida y el cierre.

## 1 · Gancho (0 – 7,2 s)
- **"Hay un cliente que vino / 12 veces / a tu restaurante / este año."** Debajo del 12 se suman 12 estrellitas, una por visita.
- **"¿Sabés quién es?"** Personaje detrás de un vidrio esmerilado; signos de pregunta flotando.

## 2 · Qué es (7,2 – 16,2 s)
1. En la subida: **"Con [logo Mejores Amigos], sí."** → **"Un nuevo sistema de fidelización de clientes para restaurantes."**
2. **"Un sistema de IA te sugiere qué enviarles… y los mensajes salen solos por WhatsApp."** Las burbujas ("¡Feliz cumple!", "Tu premio te espera", "¡Te extrañamos!") quedan en pantalla hasta el corte.

## 3 · El cliente
- **01 · El cliente escanea el QR en la mesa.** Ilustración de la mesa → directo al WhatsApp (sin formulario): **"¡Bienvenida a Mejores Amigos, Juli! Sumaste tu 1.ª estrellita. Con 5, desbloqueás tu primer premio."**
- **02 · En cada visita, suma una estrellita.** Tres visitas con estrellitas 3D que vuelan a la tarjeta (sin el "¿Cuántas estrellitas tengo?").
- **03 · Junta 5 y desbloquea su premio.** "¡Premio desbloqueado!" → la tarjeta se da vuelta: **"¡Primer premio! Con tu próximo plato, el postre va sin cargo."**

## 4 · ¿Y tu comercio qué gana? — 4 beneficios
Primero una grilla con los 4 beneficios y su ícono 3D. Después, cada uno con **su pantalla de título** ("Beneficio n/4").

| # | Título | Bajada | Ejemplo |
|---|---|---|---|
| 1 | **Conocé a tus clientes.** | Sabé quién viene. Sabé quién vuelve. | Solo el título (sin el panel). |
| 2 | **Mensajes automáticos, en el momento justo.** | Más interacción con tus clientes, sin trabajo extra. | Solo el mensaje: *"¡Hola, Juli! Se viene tu cumple… **si venís con 4 amigos, tu plato va por nuestra cuenta.** ¿Te reservamos mesa?"* → "Aprobar y enviar" → "¡Enviado solo!" |
| 3 | **Los clientes vuelven más seguido.** | Recuperá a los que dejaron de venir. | "Vos decidís qué se envía. El sistema lo hace solo." Mensaje a Martín: *"…**el café corre por nuestra cuenta.**"* → "Enviado automáticamente" (sin la escena de Martín volviendo). |
| 4 | **Llená los días flojos.** | Promos automáticas para tu día más tranquilo. | Sugerencia del martes → **"Los martes, cada visita suma 2 estrellitas"** → la barra del martes crece. |

## 5 · Cierre
- Remate: **"Más frecuencia. Más clientes. Más ventas."**
- Logo · **"Convertí a tus clientes en mejores amigos."** · **"Lo instalamos en tu restó →"** · WhatsApp 2254447706 · @luz.sur.arg · "un producto de Luz Sur"
- Cinta en movimiento: "SIN APPS ✦ SIN TARJETAS ✦ SOLO WHATSAPP" sobre los amigos festejando.
