# Grafissto Studio — Sitio Web Oficial

> **Creamos Mundos Digitales** — Webs · Apps · Cómics · Identidad Visual

Sitio web editorial premium para Grafissto Studio, construido con tecnologías 100% cliente (sin build tools) para GitHub Pages.

---

## 🛠️ Stack Técnico

| Capa | Tecnología |
|---|---|
| Animaciones | **GSAP 3.12** + ScrollTrigger + TextPlugin |
| WebGL Hero | **Three.js r134** — partículas ink + viñetas 3D |
| Smooth Scroll | **Lenis 1.0** |
| Tipografía | **Bebas Neue** (display) + **Space Grotesk** (body) |
| Estructura | HTML semántico puro, sin frameworks |
| Estilos | CSS custom properties, sin frameworks |

---

## 📁 Estructura de Archivos

```
grafissto-studio/
├── index.html                  ← Página principal
├── alberto-varela.html         ← Perfil del fundador (CV)
├── assets/
│   ├── css/
│   │   ├── main.css            ← Sistema de diseño global
│   │   └── founder.css         ← Estilos de la página del fundador
│   ├── js/
│   │   ├── main.js             ← Loader, Lenis, GSAP, cursor, nav, form
│   │   ├── hero.js             ← Three.js WebGL scene del hero
│   │   ├── panels.js           ← Scroll horizontal tipo cómic
│   │   └── founder.js          ← Animaciones de la página del fundador
│   ├── img/
│   │   ├── comics/             ← Imágenes de los cómics
│   │   ├── founder/            ← Fotos de Alberto Varela
│   │   ├── portfolio/          ← Imágenes de proyectos digitales
│   │   └── favicon.svg
│   └── docs/
│       └── alberto-varela-cv.pdf  ← CV descargable (agregar manualmente)
└── README.md
```

---

## 🚀 Deploy en GitHub Pages

### Opción A: GitHub Pages desde rama `main`

1. Renombra el repositorio en GitHub a `grafissto-studio`
2. Ve a **Settings → Pages**
3. Source: `Deploy from a branch` → Branch: `main` → Folder: `/` (root) o `/grafissto-studio`
4. Guarda. GitHub Pages publicará en `https://betouxdesigner.github.io/grafissto-studio/`

### Opción B: Dominio personalizado `grafissto.studio`

1. Sigue los pasos de la Opción A
2. En **Settings → Pages → Custom domain**, escribe `grafissto.studio`
3. En tu proveedor de DNS, agrega:
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   betouxdesigner.github.io
   ```
4. Espera propagación DNS (puede tardar hasta 24h)
5. Activa **Enforce HTTPS** en GitHub Pages

---

## ✅ Checklist antes de publicar

- [ ] Agregar `assets/docs/alberto-varela-cv.pdf` (diseñar e incluir)
- [ ] Actualizar links de Behance y LinkedIn en `index.html` y `alberto-varela.html`
- [ ] Configurar Formspree (formulario de contacto) en `https://formspree.io` — reemplazar ID en `index.html`
- [ ] Probar en Chrome, Firefox y Safari
- [ ] Verificar responsive en mobile (375px) y tablet (768px)
- [ ] Agregar Google Analytics si se desea

---

## 📝 Notas de Desarrollo

- El formulario de contacto usa [Formspree](https://formspree.io) — gratis para hasta 50 envíos/mes
- El canvas Three.js usa `alpha: true` para fondo transparente, el CSS maneja el color de fondo
- Lenis smooth scroll se sincroniza con GSAP ScrollTrigger vía `lenis.on('scroll', ScrollTrigger.update)`
- El cursor personalizado se oculta automáticamente en dispositivos touch

---

## 📧 Contacto

**Grafissto Studio** — grafissto@gmail.com  
**GitHub**: [BetoUXDesigner](https://github.com/BetoUXDesigner)
