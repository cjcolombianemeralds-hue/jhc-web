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

  /* Rendimiento: cambia los videos pesados del sitio por versiones comprimidas (y el del pie de pagina se carga solo al llegar abajo) */
  var UP = "https://www.jhccolombianemeralds.com/wp-content/uploads/2026/10/";
  var HEAVY = [
    { match: "Pm9t2fxZvO.mp4", to: UP + "portada_inicio_optimizada.mp4", lazy: false },
    { match: "vecteezy_elegant-ring-diamond-gemstone", to: UP + "pie_pagina_anillo_optimizado.mp4", lazy: true }
  ];
  function swapHeavyVideos() {
    var vids = document.querySelectorAll("video");
    for (var i = 0; i < vids.length; i++) {
      (function (v) {
        if (v.getAttribute("data-jhc-v")) return;
        var s = v.querySelector("source");
        var cur = (s && (s.getAttribute("src") || s.src)) || v.getAttribute("src") || v.src || "";
        for (var k = 0; k < HEAVY.length; k++) {
          if (cur.indexOf(HEAVY[k].match) === -1) continue;
          var cfg = HEAVY[k];
          v.setAttribute("data-jhc-v", "1");
          var apply = function () {
            var ss = v.querySelectorAll("source");
            for (var j = 0; j < ss.length; j++) ss[j].parentNode.removeChild(ss[j]);
            v.src = cfg.to; v.load();
            var p = v.play(); if (p && p.catch) p.catch(function () {});
          };
          if (cfg.lazy && "IntersectionObserver" in window) {
            var ss0 = v.querySelectorAll("source");
            for (var j0 = 0; j0 < ss0.length; j0++) ss0[j0].parentNode.removeChild(ss0[j0]);
            v.removeAttribute("src"); v.preload = "none"; v.load();
            var io = new IntersectionObserver(function (es) {
              if (es[0].isIntersecting) { io.disconnect(); apply(); }
            }, { rootMargin: "400px" });
            io.observe(v);
          } else apply();
          break;
        }
      })(vids[i]);
    }
  }
  /* Portada: banda "Anillos de esmeralda colombiana" debajo del video de entrada */
  function emeraldRingsBand() {
    if (!(location.pathname === "/" || location.pathname === "") || document.querySelector(".jhc-esm")) return;
    var hero = document.querySelector("#main-content .et_pb_section_video") || document.querySelector("#main-content .et_pb_section");
    if (!hero || !hero.parentNode) return;
    var B = "https://www.jhccolombianemeralds.com/";
    var IMG = B + "wp-content/uploads/2026/10/";
    function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
    function link(href, cls, txt) { var a = el("a", cls, txt); a.href = href; return a; }
    var s = el("section", "jhc-esm");
    var inner = el("div", "jhc-esm__in");
    var tx = el("div", "jhc-esm__tx");
    tx.appendChild(el("p", "jhc-esm__eyebrow", "Colección de anillos"));
    tx.appendChild(el("h2", "jhc-esm__h", "Anillos de esmeralda colombiana"));
    tx.appendChild(el("p", "jhc-esm__p", "Esmeraldas naturales seleccionadas una a una y engastadas a mano en oro 18k y plata 925. Hechas en Bogotá, con certificado y envíos a toda Colombia."));
    var row = el("div", "jhc-esm__chips");
    [["Oro", "anillos/anillos-en-oro/"], ["Plata", "anillos/anillos-en-plata/"], ["Mujer", "anillos/anillos-para-mujer/"], ["Hombre", "anillos/anillos-para-hombre/"]].forEach(function (c) { row.appendChild(link(B + c[1], "jhc-esm__chip", c[0])); });
    tx.appendChild(row);
    tx.appendChild(link(B + "anillos/anillos-de-esmeralda-colombiana/", "jhc-esm__cta", "Ver todos los anillos"));
    var fig = el("div", "jhc-esm__fig");
    var im = document.createElement("img");
    im.src = IMG + "IMG_3601-480x643.png";
    im.srcset = IMG + "IMG_3601-480x643.png 480w, " + IMG + "IMG_3601-765x1024.png 765w";
    im.sizes = "(max-width: 980px) 70vw, 380px";
    im.alt = "Anillo Orchidée con esmeraldas naturales colombianas en oro 18k, puesto en la mano";
    im.loading = "lazy"; im.decoding = "async";
    fig.appendChild(im);
    inner.appendChild(tx); inner.appendChild(fig); s.appendChild(inner);
    hero.parentNode.insertBefore(s, hero.nextSibling);
  }
  function init() {
    emeraldRingsBand();
    splitTitles();
    seoFixes();
    swapHeavyVideos();
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
