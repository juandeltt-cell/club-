# Panel del restaurante — Mejores Amigos

Maqueta **navegable y reutilizable** del panel del dueño. Es HTML, CSS y JS sin dependencias ni build: se abre con cualquier servidor estático y está pensada para portarse a Blade (Laravel) en el MVP (ver `docs/arquitectura-fidelizacion.md`).

```bash
cd panel && python3 -m http.server 8765
# abrir http://127.0.0.1:8765/  (desde file:// el navegador bloquea las fuentes)
```

## Estructura
| Archivo | Qué contiene |
|---|---|
| `css/tokens.css` | **Sistema de diseño**: colores de marca (muestreados de los logos), tipografía, escala de espaciado, radios, sombras, easings. Todo lo demás consume estas variables. |
| `css/components.css` | Componentes independientes (`.btn`, `.chip`, `.badge`, `.card`, `.stat`, `.table`, `.toggle`, `.suggestion`, `.countdown`, `.msg-preview`, `.recipients`, `.bars`, `.drawer`, `.modal`, `.timeline`, `.toast`). Cada uno se porta a un partial de Blade. |
| `css/panel.css` | Layout del panel (barra lateral, barra superior, grillas, vistas) y responsive. |
| `js/demo-data.js` | Datos de ejemplo del restaurante ficticio **Brasa**. Tienen la misma forma que va a devolver la API real: reemplazarlos por un `fetch()` no cambia el render. |
| `js/app.js` | Render, ruteo por hash, ficha de cliente, flujo "Aprobar y enviar", interruptores de mensajes automáticos. Expone `window.MA` para automatizar la grabación del video. |
| `assets/` | Tipografías self-hosted (Bricolage Grotesque e Inter, licencia OFL) e ícono de marca. |

## Pantallas
- **Inicio** (`#inicio`): KPIs, sugerencias de la semana del sistema de IA, segmentos, clientes recientes y visitas por día.
- **Clientes** (`#clientes`): lista filtrable por segmento y búsqueda, con ficha lateral (visitas, estrellitas, cuenta regresiva de cumpleaños e historia).
- **Sugerencias** (`#sugerencias`): cada sugerencia explica **por qué**, muestra el **mensaje sugerido** personalizado y se aprueba con un toque (modal de confirmación → envío automático a cada destinatario).
- **Mensajes automáticos** (`#automaticos`): bienvenida, invitación de cumpleaños, aviso de premio y "te extrañamos", con interruptor, vista previa y métricas.

## Sistema de diseño, en corto
- **Colores:** crema `#FDF9F2` (fondo) · verde `#02312A` (texto y superficies oscuras) · menta `#05AB87` (acción principal y estado "automático"). Amarillo `#F5B83D` solo para las estrellitas. Cada segmento tiene su color (nuevo, frecuente, ocasional, en riesgo).
- **Tipografía:** Bricolage Grotesque para títulos y números (interletrado −0,025em), Inter para la interfaz.
- **Íconos:** sprite SVG propio en `index.html` (trazo 1,8, heredan `currentColor`). Sin emoji.
- **Movimiento:** `--ease-out` en entradas y transiciones cortas; respeta `prefers-reduced-motion`.

## Parámetros de demo
- `?demo=automations-off`: arranca con los mensajes automáticos apagados (para animarlos encendiéndose en el video).
- `window.MA.go(ruta)`, `MA.openCustomer(id)`, `MA.openSend(idSugerencia)`, `MA.confirmSend()`, `MA.markReturned(id)`, `MA.cascadeAutomations(ms)`.
