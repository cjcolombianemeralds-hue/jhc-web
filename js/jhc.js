/* JHC Colombian Emeralds - scripts del sitio (solo front-end). */
(function () {
  /* Video de portada en categorías: slug de la categoría -> { src: URL del mp4, vertical: true si el video es vertical } */
  var VIDEOS = {
    "grillz": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/portada_flor_web.mp4" },
    "coleccion-privee": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/dije_heliconia_modelo.mp4", vertical: true },
    "dijes": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/dije_cruz_giro_loop.mp4", vertical: true },
    "dijes-en-oro": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/dije_cruz_giro_loop.mp4", vertical: true },
    "dijes-en-plata": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/dije_cruz_giro_loop.mp4", vertical: true },
    "anillos": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/anillo_esmeralda_giro_loop.mp4", vertical: true },
    "anillos-en-oro": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/anillo_esmeralda_giro_loop.mp4", vertical: true },
    "anillos-en-plata": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/anillo_esmeralda_giro_loop.mp4", vertical: true }
  };

  /* Colección Privée: separa el título en nombre + descripción (estilo catálogo de lujo) */
  function splitTitles() {
    if (!document.body.classList.contains("term-coleccion-privee")) return;
    var els = document.querySelectorAll(".woocommerce-loop-product__title");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.getAttribute("data-jhc")) continue;
      var t = el.textContent.trim();
      var m = t.match(/^(.+?)\s+(con|en)\s+(.+)$/i);
      if (!m) continue;
      el.setAttribute("data-jhc", "1");
      el.textContent = "";
      var n = document.createElement("span"); n.className = "jhc-pname"; n.textContent = m[1];
      var s = document.createElement("span"); s.className = "jhc-psub"; s.textContent = m[2] + " " + m[3];
      el.appendChild(n); el.appendChild(s);
    }
  }
  function init() {
    splitTitles();
    var main = document.getElementById("main-content");
    if (!main) return;
    for (var slug in VIDEOS) {
      if (document.body.classList.contains("term-" + slug) && !document.querySelector(".jhc-cat-video")) {
        var cfg = VIDEOS[slug];
        var box = document.createElement("div");
        box.className = "jhc-cat-video" + (cfg.vertical ? " jhc-cat-video--vertical" : "");
        var v = document.createElement("video");
        v.src = cfg.src;
        v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
        v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
        v.preload = "auto";
        box.appendChild(v);
        main.insertBefore(box, main.firstChild);
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
        break;
      }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
