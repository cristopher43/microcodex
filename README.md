# MicroDex - Sistema Red

Juego web mobile-first para fotografiar micros y construir una colección personal. Las capturas y los logros se guardan en el navegador mediante localStorage; no se necesita backend, cuenta, API key ni servicio de pago. El mapa usa teselas de OpenStreetMap y muestra su atribución.

## Iconos y efectos visuales

La interfaz usa iconos SVG de Lucide React. Las fichas de colección y el botón de captura incorporan efectos de brillo y destellos adaptados de React Bits; sus créditos y términos están en `THIRD_PARTY_NOTICES.md`.

## Requisitos

- Node.js 20.19+ o 22.12+.
- npm.
- Un navegador moderno.

## Instalar y ejecutar

Desde la carpeta MicroDex:

    npm install
    npm run dev

Para abrir la app desde otro dispositivo conectado a la misma red Wi-Fi, deja el servidor visible en la red:

    npm run dev -- --host 0.0.0.0

En Windows, ejecuta ipconfig y busca la dirección IPv4 del adaptador Wi-Fi. En el teléfono, abre http://DIRECCION-IP:5173, por ejemplo http://192.168.1.25:5173. Si Windows pregunta, permite el acceso del servidor en redes privadas.

### Geolocalización en el teléfono

Los navegadores permiten geolocalización únicamente en un contexto seguro: HTTPS o localhost. La dirección LAN http://192.168... sirve para probar la cámara y el resto de la app, pero puede impedir que el navegador entregue coordenadas.

Para probar la ubicación sin publicar la app de forma permanente, puedes abrir una segunda terminal e iniciar un Quick Tunnel temporal de Cloudflare:

    cloudflared tunnel --url http://localhost:5173

Abre en el teléfono la URL HTTPS trycloudflare.com que muestre la terminal y acepta el permiso de ubicación. Es un enlace público temporal: quien lo tenga puede abrir la app mientras el túnel siga activo. Detén el proceso al terminar. Cloudflare documenta Quick Tunnels gratuitos que no requieren cuenta ni dominio.

También puedes desplegar la app en Netlify o Vercel; ambos ofrecen HTTPS en sus opciones gratuitas actuales. Revisa sus límites y condiciones antes de publicar.

## Compilar y publicar

Genera la versión lista para producción:

    npm run build

Vite deja el sitio estático en dist/.

### Netlify

1. Ejecuta npm run build.
2. Abre Netlify Drop o crea un sitio en Netlify.
3. Sube la carpeta dist como despliegue manual.

Para despliegues conectados a Git, usa npm run build como comando y dist como carpeta publicada.

### Vercel

1. Importa el repositorio en Vercel, o instala y ejecuta la CLI desde la raíz del proyecto:

    npm install --global vercel
    vercel

2. Usa npm run build y dist como salida si la plataforma no los detecta automáticamente.

## Privacidad y almacenamiento

- Las fotos se comprimen en el dispositivo antes de guardarse.
- Las capturas, ubicaciones, recorridos y logros quedan en localStorage del navegador.
- El respaldo JSON permite exportar o restaurar esos datos en el mismo u otro dispositivo.
- Si borras los datos del navegador, también puedes perder las capturas; guarda respaldos periódicamente.
- El mapa descarga teselas desde OpenStreetMap cuando se visualiza.

## Catálogo

Para agregar una micro, edita únicamente src/data/buses.js. Mantén los tipos y zonas permitidos, asigna un id único y deja ficha: {} para completar datos técnicos más adelante.

## Mejoras gratuitas posibles

- Retos diarios guardados en el mismo dispositivo.
- Favoritos y filtros por recorrido.
- Insignias por ciudades o regiones visitadas.
- Exportar una lámina de colección como imagen.

