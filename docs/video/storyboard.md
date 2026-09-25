# Mejores Amigos — Storyboard del reel

**Base:** guion v5 (`docs/video/guion.md`) · **1080×1920** · 30 fps · **1.650 cuadros = 55 s**
**Música:** beat sintetizado a **120 BPM → 1 pulso = 15 cuadros**. Todos los cortes caen en múltiplos de 15.
**Zona segura:** el texto crítico va entre y≈240 y y≈1680 (el 75 % central). Arriba y abajo lo tapa la interfaz de Instagram y TikTok.

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| `cream` | `#FDF9F2` (muestreado del logo) | Fondo principal (60 %) |
| `ink` | `#02312A` (muestreado del logo) | Texto, fondos oscuros de contraste (30 %) |
| `mint` | `#05AB87` (muestreado del logo) | **Color protagonista: un solo elemento por cuadro** (10 %) |
| `mintSoft` / `inkSoft` / `line` | derivados de los anteriores | Superficies, bordes, textos secundarios |
| `star` | `#F5B83D` | Solo las estrellitas: es el objeto de juego del producto |

- **Tipografía:** *Bricolage Grotesque* 800 para los titulares (redonda y con carácter, conversa con el wordmark), con interletrado −0,03em e interlineado 1,0. *Inter* 500/600 para los textos de interfaz y los subtítulos.
- **Tamaños:** titulares de 110–150 px; frases de beneficio de 84–96 px; subtítulos de 44 px.
- **Fondo de cada escena, de abajo hacia arriba (las 5 capas del skill):** malla de degradé suave crema/menta en movimiento lento → assets (teléfono, panel) → gráficos y tipografía → *grade* de color cálido → grano + viñeta.
- **Motivo de marca:** la **sonrisa con los dos puntitos** del logo, redibujada en SVG. Cumple tres funciones: transición entre bloques (se dibuja o barre la pantalla), marcador de los pasos y "respiración" del logo al final.
- **Íconos:** todos dibujados en SVG con los colores de la marca (estrellita, torta, QR, lamparita de la sugerencia de IA, check). **Nada de emoji**, porque se renderizan con colores de sistema que rompen la paleta.
- **Movimiento:** entradas con `spring` que animan opacidad, desplazamiento y escala a la vez, siempre escalonadas cada 3–6 cuadros. Salidas más rápidas que las entradas (~8–10 cuadros). Nada lineal. Todo lo que queda quieto más de 2 s "respira" con un vaivén sutil.
- **Logos:** los PNG de Mejores Amigos tienen fondo crema sólido, así que **solo se apoyan sobre el fondo `cream`**. El de Luz Sur se usa en su versión sin fondo, sobre `cream`, oscureciendo "LUZ" a `ink` con un filtro (el original es blanco).

---

## Escena 1 · Gancho — cuadros 0–120 (0:00–0:04)
**Fondo:** crema, con la malla menta muy tenue.

| Cuadros | Qué pasa | Movimiento | Sonido |
|---|---|---|---|
| 0–10 | **"Hay un cliente que vino"** entra palabra por palabra | Cada palabra sube 60 px desde abajo, escala 0,9→1 y aparece; separación de 3 cuadros | Golpe de bombo en el cuadro 0 |
| 15 | **"12 veces a tu restaurante"**: el "12" es **menta** y enorme (220 px) | El número *cae* desde arriba con un spring con rebote y lo sigue un contador rápido 0→12 | *Tick* mientras cuenta |
| 30 | **"este año."** | Entrada escalonada igual que la primera línea | Golpe |
| 30–60 | **Pausa.** Las tres líneas quedan quietas, solo respiran | — | — |
| 60 | **Corte seco a fondo `ink`.** **"¿Sabés quién es?"** en crema, 150 px | Las palabras caen escalonadas; "quién es" lleva una píldora menta que se abre detrás, 5 cuadros después | Golpe grave en el corte |
| 90–120 | Un **"?"** gigante gira 180° y se **deforma en la sonrisa** del logo, que barre hacia abajo y funciona como transición | Interpolación de la forma + escala | *Whoosh* que arranca 3 cuadros antes |

## Escena 2 · Qué es Mejores Amigos — 330 cuadros: 120–450 (0:04–0:15)
Es la escena que **explica el producto**. Tres momentos, todos sobre fondo crema.

**2a · La respuesta — 120–195**
| Cuadros | Qué pasa | Movimiento |
|---|---|---|
| 120–140 | La sonrisa se asienta en la parte alta; **caen los dos puntitos** | Los puntitos entran con un spring rebotón, separados por 4 cuadros |
| 135–165 | El **logo principal** de Mejores Amigos se revela *a través de la sonrisa*, con una máscara que se abre de izquierda a derecha | Máscara + escala 0,94→1 + desplazamiento en y |
| 165–195 | **"Con Mejores Amigos, sí."** en `ink`, 96 px, con "sí" en menta | Palabras escalonadas; el "sí" entra último, con rebote | 

**2b · La definición — 195–285**
| Cuadros | Qué pasa | Movimiento |
|---|---|---|
| 195–205 | El logo se achica y sube a la parte alta del cuadro (queda como firma de la escena); la frase anterior sale hacia arriba | Salida rápida (8 cuadros) |
| 205–240 | **"Un nuevo sistema de fidelización de clientes para restaurantes."** en `ink`, 110 px, en 4 líneas. **"fidelización de clientes"** va en menta con un subrayado que se dibuja | Línea por línea, con 5 cuadros de desfase; el subrayado 5 cuadros después de la última |
| 240–285 | **Pausa.** Es la frase más importante del video y se tiene que poder leer entera | Solo respiración |

**2c · Qué hace, en cuatro líneas — 285–450**
La definición sube y se achica (80 px). Debajo, cuatro filas de "cómo funciona en simple", cada una con un **ícono SVG dentro de un círculo** a la izquierda y el texto a la derecha (56 px, `ink`):

| Cuadros | Fila | Ícono |
|---|---|---|
| 300 | **Tus clientes suman estrellitas en cada visita.** | Estrellita amarilla que gira al entrar |
| 325 | **Las canjean por premios que vos elegís.** | Regalo (caja con moño) cuya tapa salta |
| 350 | **Vos sabés quién es cada uno.** | Silueta de persona con una tarjetita de ficha |
| 375 | **Un sistema de IA te sugiere qué enviarles, y los mensajes salen solos por WhatsApp.** — **la línea clave**: es la única en menta, con un brillo suave, y entra con más fuerza (escala 0,85→1 con rebote) | Destello de IA (estrella de 4 puntas) del que salen tres burbujas en abanico |
| 400–435 | Pausa con las cuatro filas visibles; solo la cuarta respira | Respiración |
| 435–450 | Salida: todo barre hacia la izquierda y entra el teléfono de la escena 3 | *Whoosh* |

Cada fila entra desde la izquierda (−80 px) con aparición y escala 0,95→1; el ícono pega un *pop* 4 cuadros después que su texto. Sonido: un *pop* por fila, en el beat, y un *shimmer* en la cuarta.

## Escena 3 · Cómo funciona — 450–870 (0:15–0:29)
**Elemento fijo:** un **teléfono** (marco SVG propio con notch, 620 px de ancho) al centro. Arriba, un **número de paso gigante** (`01`, `02`, `03`) en menta con una etiqueta en `ink`. Entre paso y paso el teléfono gira ±6° y se acerca o aleja (parallax), y el número cambia con un *flip* vertical.

**PASO 01 · Escanea el QR — 450–570**
| Cuadros | Qué pasa |
|---|---|
| 450–465 | Entra "01 Escanea el QR" |
| 460–510 | Delante del teléfono, un **exhibidor de mesa de Brasa** (acrílico con el QR). El **QR se arma módulo por módulo** en diagonal, con 3 cuadros de desfase por onda |
| 510–530 | **Línea de escaneo** menta que baja por el QR, con un destello blanco al final |
| 530–570 | El exhibidor sale y en el teléfono se abre la **página de Brasa**: logo, "Sumá estrellitas en cada visita" y 3 filas de premios que entran escalonadas (⭐5 Postre · ⭐10 Plato principal · ⭐15 Cena para dos) con el botón "Sumar mis estrellitas" |
Sonido: *whoosh* de entrada, *blip* del escaneo, *pop* suave por cada fila.

**PASO 02 · Suma estrellitas por WhatsApp — 570–720**
| Cuadros | Qué pasa |
|---|---|
| 570–585 | Flip a "02". Un dedo (círculo de toque) presiona el botón → el teléfono pasa a una **interfaz de chat** (encabezado "Brasa", avatar, fondo de chat) |
| 590–620 | El mensaje del cliente ya escrito sale: burbuja a la derecha y **doble tilde** que se pone menta |
| 620–635 | Indicador de "escribiendo…" (tres puntos que laten) |
| 635–660 | Llega la **burbuja de Brasa**: "¡Sumaste tu 3.ª estrellita, Juli! ★★★ Te faltan 2 para tu postre de regalo", con una etiqueta chica **"automático"** (con el destello de IA) que aparece 5 cuadros después: nadie del restaurante la escribió |
| 660–690 | Las **tres estrellitas saltan desde la burbuja** en arco hacia afuera del teléfono y se acomodan en una fila grande al costado |
| 690–720 | Pausa con respiración y salida |
Sonido: *ding* en el mensaje entrante, *pop* agudo por estrellita (escala ascendente).

**PASO 03 · Sigue su tarjeta y canjea — 720–870**
| Cuadros | Qué pasa |
|---|---|
| 720–735 | Flip a "03". El teléfono muestra la **tarjeta personal**: "Hola, Juli", cinco lugares de estrellita (3 llenos) y una barra "Te faltan 2" |
| 750 / 765 | Se llenan la **4.ª y la 5.ª estrellita**, cada una con escala 0→1,3→1 y un anillo que se expande |
| 770–800 | **Lluvia de estrellitas**: unas 30 partículas SVG salen del centro con gravedad y rotación |
| 790–840 | La tarjeta se da vuelta en 3D y aparece el **cupón "Postre de regalo"** con ícono de torta en SVG y código `482 913` |
| 840–870 | Pausa y salida: el teléfono cae y sale de cuadro, más rápido que su entrada |
Sonido: dos *pops*, un *shimmer* en la lluvia de estrellitas y un *whoosh* al darse vuelta la tarjeta.

## Escena 4 · ¿Y vos qué ganás? — 870–1470 (0:29–0:49)

**Título — 870–930:** fondo `ink`. **"¿Y vos qué ganás?"** en crema, 140 px, con "vos" en menta. Entra en dos golpes de beat y sale barriendo hacia arriba.

**Plantilla de cada beneficio (120 cuadros; el 2 dura 180):**
- Arriba (y≈300): **número** grande en contorno menta (`1`–`4`) y la **frase del beneficio** en `ink`, 88 px, máximo dos líneas.
- Centro/abajo: una **"ventana" del panel real** (tarjeta con esquinas redondeadas y sombra, 960 px de ancho) mostrando el **video o captura del panel HTML** con un *push-in* (zoom lento hacia la zona clave) y un **resaltado** (anillo menta que se dibuja alrededor del elemento importante).
- Entrada: la frase escalonada; la ventana sube 80 px con un spring y aparece. Salida: 8 cuadros.

| # | Cuadros | Frase | Qué se ve del panel |
|---|---|---|---|
| **1** | 930–1050 | **Sabés quién es cada cliente** | Lista de clientes con scroll real → se iluminan en secuencia los chips **Nuevos 63 · Frecuentes 148 · En riesgo 37** → clic en *Juli* → su ficha: 12 visitas, cumple 14/3, último premio |
| **2** | 1050–1230 *(6 s: el beneficio central)* | **Mensajes automáticos, en el momento justo** + subtítulo *"Un sistema de IA te sugiere qué enviar. Vos aprobás y sale solo."* | **1050–1100:** tarjeta **"Sugerencia del sistema de IA"**: *"4 clientes cumplen años esta semana. Enviarles un saludo con postre de regalo."*, con vista previa del mensaje y el botón **Aprobar y enviar** (anillo menta dibujándose alrededor) → hover y clic. **1100–1150:** el mensaje se **reparte solo**: cuatro líneas curvas salen del botón hacia cuatro avatares (Juli, Martín, Caro, Lucas) que reciben un check, escalonados cada 5 cuadros; contador *"Enviado automáticamente a 4 clientes"*. **1150–1185:** un teléfono chico entra desde abajo con la burbuja *"¡Feliz cumple, Juli! Esta semana el postre va por nuestra cuenta."* y la etiqueta "automático". **1185–1230:** pantalla **Mensajes automáticos** del panel: cuatro interruptores se encienden en cascada (*Bienvenida · Saludo de cumpleaños · Aviso de premio disponible · "Te extrañamos"*) y encima entra **"Vos decidís qué se envía. El sistema lo hace solo."** |
| **3** | 1230–1350 | **Vuelve más seguido** | La ficha de Juli suma una visita y aparece la etiqueta **"Volvió ✓"**. Superpuesto, un **contador grande** en `ink`: *Clientes recuperados* **+23**, contando |
| **4** | 1350–1470 | **Llenás los días flojos** | Gráfico de visitas por día con el martes como la barra más baja. Aparece la sugerencia del sistema de IA *"Doble estrellita los martes"* → toque en **Activar** (la promo se avisa sola por WhatsApp) → **la barra del martes crece** con un spring hasta emparejar a las demás |

Sonido: golpe en cada número, *ticks* en los contadores, un *ding* en la burbuja y un *riser* suave hacia el cierre.

## Escena 5 · Cierre — 1470–1650 (0:49–0:55)
| Cuadros | Qué pasa |
|---|---|
| 1470–1500 | La sonrisa barre la pantalla (transición) y deja fondo crema. El **logo principal** de Mejores Amigos, grande (900 px), escala 0,9→1 con la máscara |
| 1500–1530 | **"Convertí a tus clientes en mejores amigos."** 92 px, en `ink`, con "mejores amigos" en menta y un leve brillo (el único elemento destacado del cuadro) |
| 1530–1560 | Una línea de tres palabras que entran en golpes, separadas por puntos: **Sin apps · Sin tarjetas · Solo WhatsApp** |
| 1560–1590 | **Botón "Pedí tu demo →"**: una píldora `ink` con texto crema, entra con un spring y la flecha late suave |
| 1590–1650 | Abajo, discreto: *un producto de* + **logo de Luz Sur** (240 px de ancho). **Pausa final** de 2 s con respiración de la sonrisa (ideal para el loop del reel) |
Sonido: golpe grave en el logo, *pops* en las tres palabras y un acorde de cierre que se apaga.

---

## Cómo se construye cada pieza
| Pieza | Técnica |
|---|---|
| Teléfono, página de Brasa, chat, tarjeta, cupón | Componentes React/SVG dentro de Remotion, animados por cuadro |
| QR | Matriz SVG generada por código (patrón fijo determinístico), revelada por diagonal |
| Panel del restaurante | **Página HTML/CSS real** (`panel/`), con los datos de ejemplo de Brasa. **Chromium headless** la graba navegándola (scroll, hover, clic) y genera clips de video para cada beneficio → `<OffthreadVideo>` en el reel |
| Estrellitas, lluvia, íconos, sonrisa | SVG + física simple por cuadro (determinística) |
| Música y efectos | Script de Node que sintetiza WAV de 16 bits: bombo, whoosh, pop, tick, ding, shimmer, acorde, y un beat de 46 s a 120 BPM |

## Loop de verificación (según el skill)
Render → extraer con ffmpeg los cuadros clave (**15, 75, 100, 180, 260, 390, 420, 510, 650, 785, 900, 990, 1080, 1130, 1210, 1290, 1410, 1520, 1620**) → mirar cada uno buscando texto fuera de la zona segura, contraste, más de un elemento menta destacado por cuadro, elementos visibles antes de su entrada y orden de capas → corregir → re-render → re-inspección → checklist final de `design-rules.md`.
