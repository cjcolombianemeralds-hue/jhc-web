# jhc-web

CSS y JS del sitio **jhccolombianemeralds.com** (WordPress + Divi + WooCommerce). Repositorio del agente web (Jorge).

## Estructura

- `css/jhc.css`: todos los estilos personalizados del sitio.
- `js/jhc.js`: scripts del sitio (video de portada en categorías).

## Cómo se carga en el sitio

Un fragmento pegado una sola vez en Divi → Opciones del tema → Integración → "Añadir código al <head>" carga estos archivos desde jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cjcolombianemeralds-hue/jhc-web@main/css/jhc.css">
<script defer src="https://cdn.jsdelivr.net/gh/cjcolombianemeralds-hue/jhc-web@main/js/jhc.js"></script>
```

## Reglas de seguridad (repo público)

Este repositorio es **público**: todo lo que se suba lo puede leer cualquiera (igual que el CSS/JS del sitio en el navegador).

**NUNCA subir aquí:** contraseñas, claves API, tokens, datos de clientes, precios mayoristas, contabilidad, códigos de descuento, ni credenciales del hosting. Eso va en el repo privado `jhc-colombian-emeralds`.

- Solo se publican estilos y scripts del front-end.
- La rama `main` está protegida: sin force-push y sin borrado.
- La cuenta de GitHub debe tener verificación en dos pasos (2FA) activa.
- No se incluyen scripts de terceros ni se cargan recursos de dominios desconocidos.
- Cambios al JS: revisar siempre que no envíe datos a servidores externos.
