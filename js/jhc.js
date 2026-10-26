/* JHC Colombian Emeralds - scripts del sitio (solo front-end). */
(function () {
  /* Video de portada en categorías: slug de la categoría -> { src: URL del mp4, vertical: true si el video es vertical } */
  var VIDEOS = {
    "grillz": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/portada_flor_web.mp4" },
    "coleccion-privee": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/dije_heliconia_modelo.mp4", vertical: true },
    "dijes": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/cruz_suave.mp4", vertical: true },
    "dijes-en-oro": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/cruz_suave.mp4", vertical: true },
    "dijes-en-plata": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/cruz_suave.mp4", vertical: true },
    "anillos": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/anillo_suave.mp4", vertical: true },
    "anillos-en-oro": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/anillo_suave.mp4", vertical: true },
    "anillos-en-plata": { src: "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/anillo_suave.mp4", vertical: true }
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

  /* SEO: titulo principal (H1) en la portada, textos alt en fotos y datos de empresa para Google */
  function seoFixes() {
    var main = document.getElementById("main-content");
    var isHome = location.pathname === "/" || location.pathname === "";
    if (isHome && main && !document.querySelector("h1")) {
      var h = document.createElement("h1");
      h.textContent = "Joyería fina con esmeraldas colombianas en Bogotá | JHC Colombian Emeralds";
      h.style.cssText = "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
      main.insertBefore(h, main.firstChild);
    }
    var t = document.querySelector("h1.product_title") || (document.body.classList.contains("single-product") ? document.querySelector("h1, .et_pb_title_container h1, .product_title") : null);
    var title = t ? t.textContent.trim() : "";
    var imgs = document.images;
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if ((im.getAttribute("alt") || "").trim()) continue;
      var src = im.currentSrc || im.src || "";
      if (/JHC_COLOMBIAN_EMERALDS/i.test(src)) im.alt = "JHC Colombian Emeralds - logo";
      else if (/xcvsv/i.test(src)) im.alt = "Medios de pago seguros";
      else if (title && im.closest(".woocommerce-product-gallery, [class*='wcgs']")) {
        var key = src.split("/").pop().replace(/-\d+x\d+(?=\.)/, "");
        var order = window.__jhcImgs = window.__jhcImgs || [];
        var n = order.indexOf(key);
        if (n < 0) { order.push(key); n = order.length - 1; }
        im.alt = title + (n > 0 ? " - foto " + (n + 1) : "");
      }
    }
    if (isHome && !document.getElementById("jhc-ld")) {
      var ld = {
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        "name": "JHC Colombian Emeralds",
        "url": "https://www.jhccolombianemeralds.com/",
        "logo": "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/jhc-icono-sitio-512.png",
        "image": "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/jhc-colombian-emeralds-og.jpg",
        "description": "Joyería fina en oro y plata con esmeraldas colombianas, hecha a mano en Bogotá. Piezas personalizadas y venta al por mayor de monturas.",
        "telephone": "+57 318 528 7947",
        "address": { "@type": "PostalAddress", "streetAddress": "Carrera 90a #8a-85 Torre 7", "addressLocality": "Bogotá", "addressCountry": "CO" },
        "areaServed": "CO"
      };
      var sc = document.createElement("script");
      sc.type = "application/ld+json"; sc.id = "jhc-ld"; sc.text = JSON.stringify(ld);
      document.head.appendChild(sc);
    }
  }
  function init() {
    splitTitles();
    seoFixes();
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
  window.addEventListener("load", seoFixes);
})();
