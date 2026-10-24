/* JHC Colombian Emeralds - scripts del sitio (solo front-end). */
(function () {
  /* Video de portada en categorías: slug de la categoría -> { src: URL del mp4, vertical: true si el video es vertical } */
  var VIDEOS = {
    "grillz": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/portada_flor_web.mp4" },
    "coleccion-privee": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/dije_heliconia_modelo.mp4", vertical: true }
  };
  function init() {
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
