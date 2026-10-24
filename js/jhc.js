/* JHC Colombian Emeralds - scripts del sitio (solo front-end). */
(function () {
  /* Video de portada en categorías: slug de la categoría -> URL del video (mp4) */
  var VIDEOS = {
    "grillz": "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/portada_flor_web.mp4"
  };
  function init() {
    var main = document.getElementById("main-content");
    if (!main) return;
    for (var slug in VIDEOS) {
      if (document.body.classList.contains("term-" + slug) && !document.querySelector(".jhc-cat-video")) {
        var box = document.createElement("div");
        box.className = "jhc-cat-video";
        var v = document.createElement("video");
        v.src = VIDEOS[slug];
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
