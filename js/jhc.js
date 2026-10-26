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
        "telephone": "+57 311 5589185",
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
  /* SEO de categorias: titulo y descripcion para Google (invisible para el cliente) */
  var TERMS = {
    "anillos-en-oro": ["Anillos en Oro 18k con Esmeraldas Colombianas | JHC Bogotá", "Anillos en oro amarillo 18k con esmeraldas naturales colombianas, zircones y diamantes. Hechos a mano en Bogotá, con certificado. Envíos a toda Colombia."],
    "anillos-en-plata": ["Anillos en Plata 925 con Esmeralda Natural | JHC Bogotá", "Anillos en plata ley 925 con esmeraldas naturales colombianas y zircones. Diseños hechos a mano en Bogotá, con garantía de autenticidad. Envíos a toda Colombia."],
    "anillos-para-mujer": ["Anillos de Esmeralda para Mujer en Oro y Plata | JHC", "Anillos para mujer con esmeraldas naturales colombianas en oro 18k y plata 925: compromiso, aniversario y regalo. Hechos a mano en Bogotá. Envíos a toda Colombia."],
    "anillos-para-hombre": ["Anillos de Esmeralda para Hombre en Oro y Plata | JHC", "Anillos para hombre con esmeraldas naturales colombianas: sellos, iniciales y diseños en oro 18k y plata 925. Hechos a mano en Bogotá. Envíos a toda Colombia."],
    "anillos-de-esmeralda-colombiana": ["Anillos de Esmeralda Colombiana en Oro y Plata | JHC", "Todos nuestros anillos con esmeraldas naturales colombianas en oro 18k y plata 925: compromiso, mujer y hombre. Hechos a mano en Bogotá, con certificado y envíos a toda Colombia."],
    "zircones": ["Anillos con Zircones en Plata 925 y Oro | JHC Bogotá", "Anillos con zircones en plata 925 y oro 18k, ideales para quince años, regalos y aniversarios. Hechos a mano en Bogotá. Envíos a toda Colombia."],
    "dijes-en-oro": ["Dijes y Cruces en Oro 18k con Esmeraldas | JHC Bogotá", "Dijes y cruces en oro amarillo 18k con esmeraldas colombianas naturales. Hechos a mano en Bogotá, con certificado. Envíos a toda Colombia."],
    "dijes-en-plata": ["Dijes en Plata 925 con Esmeraldas y Zafiros | JHC Bogotá", "Dijes en plata ley 925 con esmeraldas naturales colombianas y otras piedras. Hechos a mano en Bogotá. Envíos a toda Colombia."],
    "grillz": ["Grillz en Oro y Plata con Esmeraldas y Diamantes | Bogotá", "Grillz a la medida en oro 18k y plata 925 con esmeraldas colombianas, diamantes y zafiros. Diseños únicos hechos a mano en Bogotá. Envíos a toda Colombia."],
    "esmeraldas": ["Joyas con Esmeraldas Colombianas Naturales | JHC Bogotá", "Joyas con esmeraldas colombianas naturales: anillos, dijes, cruces y brazaletes en oro 18k y plata 925. Hechas a mano en Bogotá, con certificado. Envíos a toda Colombia."],
    "coleccion-privee": ["Colección Privée: Joyería de Autor con Esmeraldas | JHC", "Diseños exclusivos de autor inspirados en Colombia, con esmeraldas naturales colombianas, fabricados a mano en Bogotá. Piezas únicas en oro 18k."],
    "sets": ["Sets de Joyas con Esmeraldas: Anillo, Dije y Aretes | JHC", "Sets de joyería con esmeraldas naturales colombianas: anillo, dije y aretes que combinan. Hechos a mano en Bogotá. Envíos a toda Colombia."],
    "brazaletes": ["Brazaletes en Oro 18k con Piedras Preciosas | JHC Bogotá", "Brazaletes en oro 18k con esmeraldas y ópalos, hechos a mano en Bogotá. Envíos a toda Colombia."]
  };
  function seoTerms() {
    var cls = document.body.className || "";
    var m = cls.match(/(?:^|\s)term-([a-z0-9-]+)/g);
    if (!m) return;
    for (var i = 0; i < m.length; i++) {
      var slug = m[i].trim().replace(/^term-/, "");
      var t = TERMS[slug];
      if (!t) continue;
      document.title = t[0];
      var metas = [["meta[name='description']", "content"], ["meta[property='og:title']", "content"], ["meta[property='og:description']", "content"], ["meta[name='twitter:title']", "content"], ["meta[name='twitter:description']", "content"]];
      for (var k = 0; k < metas.length; k++) {
        var sel = metas[k][0], isTitle = /title/.test(sel);
        var e = document.querySelector(sel);
        if (!e && sel === "meta[name='description']") { e = document.createElement("meta"); e.setAttribute("name", "description"); document.head.appendChild(e); }
        if (e) e.setAttribute("content", isTitle ? t[0] : t[1]);
      }
      return;
    }
  }
  /* SEO de productos: agrega la marca a los datos estructurados que ya genera WooCommerce */
  function productBrand() {
    if (!document.body.classList.contains("single-product")) return;
    var ss = document.querySelectorAll("script[type='application/ld+json']");
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i];
      if (s.getAttribute("data-jhc-b") || s.text.indexOf('"Product"') === -1) continue;
      try {
        var d = JSON.parse(s.text), ch = false;
        var arr = d["@graph"] || [d];
        for (var j = 0; j < arr.length; j++) {
          if (arr[j]["@type"] === "Product" && !arr[j].brand) { arr[j].brand = { "@type": "Brand", "name": "JHC Colombian Emeralds" }; ch = true; }
        }
        if (ch) { s.text = JSON.stringify(d); s.setAttribute("data-jhc-b", "1"); }
      } catch (e) {}
    }
  }
  function init() {
    seoTerms();
    productBrand();
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
