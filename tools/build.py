"""Static page generator for the portfolio (optional — the output HTML is plain and hand-editable).
Edit PROJECTS / TOOLS / STAGES below, then run: python3 build.py
"""
import os
OUT = os.environ.get('OUT', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', ''))

OWNER = {
    'name': 'Zakharii Stroich', 'first': 'Zakharii', 'last': 'Stroich',
    'role': 'Character & Technical Artist', 'city': 'Lublin, PL',
    'email': 'stroichzahar161218@gmail.com',
    'socials': [('ArtStation', 'https://www.artstation.com/zakhariistroich'),
                ('Instagram', 'https://www.instagram.com/stroichz/'),
                ('LinkedIn', 'https://www.linkedin.com/in/zakharii-stroich-74822633a/')],
}

ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg>'
ARROW_UP = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 14V3m-4 4 4-4 4 4" stroke="currentColor" stroke-width="1.5"/></svg>'
ARROW_L = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M14 8H3m4-4L3 8l4 4" stroke="currentColor" stroke-width="1.5"/></svg>'
KNOB = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 5 2 10l5 5M13 5l5 5-5 5" stroke="currentColor" stroke-width="1.6"/></svg>'
IMG = 'assets/img/'

# ------------------------------------------------------------------ data
MAPS = [
    ('albedo', 'Albedo', 'Base colour, no lighting', 'sRGB · 4K'),
    ('normal', 'Normal', 'Baked from high-poly, OpenGL Y+', 'Linear · 4K'),
    ('roughness', 'Roughness', 'Micro-surface response', 'Linear · 4K'),
    ('metallic', 'Metallic', 'Conductor mask', 'Linear · 2K'),
    ('ao', 'Ambient Occlusion', 'Baked cavity + AO', 'Linear · 2K'),
]

PROJECTS = [
    {
        'slug': 'character', 'title': 'Cyber Samurai', 'cat': 'character', 'tag': 'Character',
        'sub': 'Real-time character · Cyberpunk challenge', 'year': '2025', 'engine': 'Marmoset Toolbag 4',
        'scope': 'Sculpt → Retopo → UV → Bake → Texture', 'role': 'Solo — character artist',
        'lead': 'A game-ready cyber-samurai bust built for a Cyberpunk 2077 fan challenge. Sculpted in ZBrush, retopologised and unwrapped in Blender, textured in Substance 3D Painter and presented in Marmoset Toolbag 4.',
        'cover': 'bust-beauty.webp', 'alt': 'bust-wire.webp', 'tris': '48,212 tris',
        'compare': ('bust-beauty.webp', 'bust-lowpoly.webp'), 'compare_labels': ('High · 18.4M', 'Low · 48.2K'),
        'modes': [('beauty', 'Beauty', 'bust-beauty.webp'), ('wire', 'Wireframe', 'bust-wire.webp'), ('topo', 'Topology', 'bust-topo.webp')],
        'metrics': [('Triangles', '48,212', 'LOD0', 62), ('Vertices', '26,904', '', 48), ('High-poly', '18.4M', 'polys', 100), ('Texture sets', '3', '× 4K', 75),
                    ('Texel density', '10.24', 'px/cm', 80), ('Bones', '112', '', 55), ('Materials', '3', '', 30), ('LODs', '4', '', 40)],
        'lods': [('LOD0', '48.2K', 100), ('LOD1', '24.1K', 50), ('LOD2', '11.0K', 23), ('LOD3', '4.8K', 10)],
        'uv': [('UDIM', '1001'), ('Islands', '64'), ('Packing', '78.4%'), ('Padding', '16 px'), ('Unwrap', 'RizomUV')],
        'pbr': True, 'sets': 'Head · Armour · Cloth (3 × 4K)',
        'process': ['Blockout and primary forms were sculpted in ZBrush with DynaMesh, then refined with ZRemesher guides and hand-sculpted hard-surface armour plates.',
                    'Retopology targeted deformation first: edge loops follow the orbicularis and jaw so facial blendshapes stay clean. UVs were cut along hidden seams and packed for consistent texel density.',
                    'Normals, AO, curvature and thickness were baked in Marmoset, then layered in Substance 3D Painter with smart masks for lacquer chipping and edge wear.'],
        'shots': [('bust-beauty.webp', 'Beauty render'), ('bust-topo.webp', 'Topology flow')],
    },
    {
        'slug': 'props', 'title': 'Hard Surface Props', 'cat': 'hard', 'tag': 'Hard surface',
        'sub': 'Shooter weapons & mechanical parts', 'year': '2024', 'engine': 'Unreal Engine 5',
        'scope': 'Modelling → UV → Bake → Texture', 'role': 'Prop artist',
        'lead': 'A set of weapons and mechanical parts for a shooter, built to tight budgets with weighted normals, clean bevels and a trim-friendly UV layout.',
        'cover': 'prop-beauty.webp', 'alt': 'prop-wire.webp', 'tris': '12,640 tris',
        'compare': ('prop-beauty.webp', 'prop-wire.webp'), 'compare_labels': ('Beauty', 'Wire'),
        'modes': [('beauty', 'Beauty', 'prop-beauty.webp'), ('wire', 'Wireframe', 'prop-wire.webp')],
        'metrics': [('Triangles', '12,640', 'LOD0', 40), ('Texture sets', '2', '× 2K', 50), ('Texel density', '20.48', 'px/cm', 90), ('LODs', '3', '', 30)],
        'lods': [('LOD0', '12.6K', 100), ('LOD1', '6.1K', 48), ('LOD2', '2.4K', 19)],
        'uv': [('UDIM', '1001–1002'), ('Islands', '41'), ('Packing', '81.2%'), ('Padding', '8 px'), ('Unwrap', 'RizomUV')],
        'pbr': True, 'sets': 'Body · Attachments (2 × 2K)',
        'process': ['High-poly built with support loops and booleans, low-poly with weighted normals to minimise bake artefacts.',
                    'Textures authored in Substance 3D Painter with anchor-point edge wear and imported to Unreal Engine 5 with packed ORM maps.'],
        'shots': [('prop-beauty.webp', 'In-engine render'), ('prop-wire.webp', 'Wireframe')],
    },
    {
        'slug': 'environment', 'title': 'Sci-Fi Outpost', 'cat': 'environment', 'tag': 'Environment',
        'sub': 'Modular UE5 scene · dynamic lighting', 'year': '2024', 'engine': 'Unreal Engine 5',
        'scope': 'Modular kit → Lighting → Optimisation', 'role': 'Environment artist',
        'lead': 'A modular sci-fi outpost assembled in Unreal Engine 5 with Lumen dynamic lighting, built from a reusable kit of 38 pieces.',
        'cover': 'env-beauty.webp', 'alt': 'env-wire.webp', 'tris': '1.2M tris',
        'compare': ('env-beauty.webp', 'env-wire.webp'), 'compare_labels': ('Lit', 'Wire'),
        'modes': [('beauty', 'Lit', 'env-beauty.webp'), ('wire', 'Wireframe', 'env-wire.webp')],
        'metrics': [('Scene tris', '1.2M', '', 80), ('Modular pieces', '38', '', 60), ('Lighting', 'Lumen', '', 70), ('Target', '60', 'fps', 100)],
        'lods': [], 'uv': None, 'pbr': False,
        'process': ['The kit was designed on a 50 cm grid so every wall, floor and trim snaps cleanly; shared trim sheets keep the material count low.',
                    'Lighting uses Lumen GI with a handful of hero lights; HLODs and Nanite on rock meshes keep the scene at 60 fps.'],
        'shots': [('env-beauty.webp', 'Lit scene'), ('env-wire.webp', 'Wireframe')],
    },
]

def mono(t, c, fs=13):
    return f'<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="{c}"/><text x="16" y="21" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="{fs}" fill="#0a0a0b">{t}</text></svg>'

TOOLS = [
    ('zbrush', 'ZBrush', 'High-poly sculpting', '<img src="assets/icons/icons8-zbrush-100.png" alt="" width="30" height="30" loading="lazy">', 5),
    ('blender', 'Blender', 'Retopo, UVs, look-dev', '<img src="assets/icons/icons8-blender-3d-48.png" alt="" width="30" height="30" loading="lazy">', 5),
    ('maya', 'Maya', 'Modelling & rigging prep', mono('M', '#37a5cc', 16), 4),
    ('substance', 'Substance 3D Painter', 'PBR texturing', '<img src="assets/icons/icons8-substance-painter-64.png" alt="" width="30" height="30" loading="lazy">', 5),
    ('marmoset', 'Marmoset Toolbag', 'Baking & presentation', mono('MT', '#ff6a2b', 12), 4),
    ('rizom', 'RizomUV', 'Unwrapping & packing', mono('R', '#3fc7b4', 16), 4),
    ('marvelous', 'Marvelous Designer', 'Cloth simulation', mono('MD', '#e9c46a', 12), 3),
    ('ue5', 'Unreal Engine 5', 'Real-time integration', '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#ededea"/><text x="16" y="21.5" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="15" fill="#0a0a0b">U</text></svg>', 4),
]
TOOL_NAMES = {t[0]: t[1] for t in TOOLS}

STAGES = [
    ('Concept', 'blender zbrush'), ('Sculpt', 'zbrush'), ('Retopo', 'blender maya'), ('UV', 'rizom maya'),
    ('Cloth', 'marvelous zbrush'), ('Bake & Texture', 'substance marmoset'), ('Engine', 'ue5 marmoset'),
]

# ------------------------------------------------------------------ partials
def head(title, desc, preload=None):
    pre = f'\n  <link rel="preload" as="image" href="{preload}" type="image/webp">' if preload else ''
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#0a0a0b">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="assets/img/bust-beauty.webp">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230a0a0b'/%3E%3Crect x='9' y='9' width='14' height='14' fill='%23d4ff3a' transform='rotate(45 16 16)'/%3E%3C/svg%3E">{pre}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
  <script>document.documentElement.classList.add('js')</script>
  <script type="importmap">{{"imports": {{"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js", "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}}}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="cursor is-hidden" aria-hidden="true"><div class="cursor__dot"></div><div class="cursor__ring"><span class="cursor__label"></span></div></div>
'''

def nav(home=True):
    p = '' if home else 'index.html'
    links = [('work', 'Work'), ('breakdown', 'Breakdown'), ('pipeline', 'Pipeline'), ('about', 'About'), ('contact', 'Contact')]
    li = ''.join(f'<a href="{p}#{i}"><span>0{n + 1}</span>{t}</a>' for n, (i, t) in enumerate(links))
    return f'''  <header class="nav">
    <div class="container nav__inner">
      <a class="logo" href="{p or '#'}top" aria-label="{OWNER['name']} — home"><span class="logo__mark">ZS/</span>{OWNER['name']}</a>
      <nav class="nav__links" id="nav-links" aria-label="Primary">{li}</nav>
      <div class="nav__right">
        <span class="status"><span class="status__dot"></span>Available for freelance</span>
        <button class="nav__toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span></button>
      </div>
    </div>
  </header>
'''

def footer():
    cdn = 'https://cdn.jsdelivr.net/npm/'
    mods = ['core/utils', 'modules/smooth-scroll', 'modules/reveal', 'modules/cursor', 'modules/magnetic', 'modules/compare', 'modules/segmented', 'modules/hero-stage', 'modules/ui', 'main']
    js = '\n'.join(f'  <script src="js/{m}.js" defer></script>' for m in mods)
    return f'''  <footer class="footer">
    <div class="container footer__inner">
      <span>© <span data-year>2026</span> {OWNER['name']}. All rights reserved.</span>
      <span class="mono">{OWNER['city']} · {OWNER['role']}</span>
      <a class="to-top" href="#top">Back to top {ARROW_UP}</a>
    </div>
  </footer>
  <!-- Optional enhancement libraries (site works without them) -->
  <script src="{cdn}gsap@3.12.5/dist/gsap.min.js" defer></script>
  <script src="{cdn}gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
  <script src="{cdn}lenis@1.1.13/dist/lenis.min.js" defer></script>
{js}
</body>
</html>
'''

def lines(*ls):
    return ''.join(f'<span class="split-line"><span>{l}</span></span>' for l in ls)

def section_head(idx, eyebrow, title_lines, right=''):
    return f'''<div class="section-head">
        <div><span class="eyebrow">{eyebrow}</span><h2 class="h2" data-split>{lines(*title_lines)}</h2></div>
        <div>{right or f'<span class="section-index">{idx}</span>'}</div>
      </div>'''

def corners():
    return ''.join(f'<span class="viewport__corner viewport__corner--{c}"></span>' for c in ('tl', 'tr', 'bl', 'br'))

def breakdown(p, uid):
    hi, lo = p['compare']; lh, ll = p['compare_labels']
    compare = f'''<div class="panel" data-reveal>
          <div class="panel__head"><h3 class="panel__title">High → Low comparison</h3><span class="mono muted">Drag or use ← →</span></div>
          <div class="viewport compare" data-compare data-labels="{lh}|{ll}" data-cursor="Drag">
            <img src="{IMG}{lo}" alt="{p['title']} — {ll}" loading="lazy" width="800" height="1000">
            <div class="viewport__layer compare__top"><img src="{IMG}{hi}" alt="{p['title']} — {lh}" loading="lazy" width="800" height="1000"></div>
            <input class="compare__range" type="range" min="0" max="100" value="50" aria-label="Comparison position: {lh} versus {ll}">
            <div class="compare__handle"><span class="compare__knob">{KNOB}</span></div>
            <div class="compare__labels"><span>{lh}</span><span>{ll}</span></div>
            {corners()}
          </div>
        </div>'''
    tabs = ''.join(f'<button role="tab" data-mode="{m}" aria-selected="{"true" if i == 0 else "false"}" aria-controls="view-{uid}">{label}</button>' for i, (m, label, _) in enumerate(p['modes']))
    layers = ''.join(f'<div class="viewport__layer{"" if i == 0 else " is-hidden"}" data-layer="{m}"><img src="{IMG}{img}" alt="{p["title"]} — {label}" loading="lazy" width="800" height="1000"></div>' for i, (m, label, img) in enumerate(p['modes']))
    modes = f'''<div class="panel" data-reveal>
          <div class="panel__head"><h3 class="panel__title">Shading</h3>
            <div class="segmented" role="tablist" aria-label="Shading mode" data-modes="#view-{uid}"><span class="segmented__pill" aria-hidden="true"></span>{tabs}</div>
          </div>
          <div class="viewport" id="view-{uid}" role="tabpanel" aria-live="polite">
            {layers}
            <div class="viewport__hud"><span data-mode-label>{p['modes'][0][1]}</span><span>{p['tris']}</span></div>
            {corners()}
          </div>
        </div>'''
    mets = ''.join(f'<div class="metric"><dt>{k}</dt><dd>{v}{f" <small>{s}</small>" if s else ""}</dd><div class="meter" aria-hidden="true"><span style="--v:{pct}%"></span></div></div>' for k, v, s, pct in p['metrics'])
    lods = ''
    if p['lods']:
        lods = '<div class="lods"><span class="lods__title">LOD chain</span>' + ''.join(f'<div class="lod"><span>{n}</span><div class="meter" aria-hidden="true"><span style="--v:{pct}%"></span></div><span>{c}</span></div>' for n, c, pct in p['lods']) + '</div>'
    metrics = f'''<div class="panel" data-reveal>
          <div class="panel__head"><h3 class="panel__title">Polycount & budgets</h3><span class="mono muted">Game-ready</span></div>
          <dl class="metrics">{mets}</dl>
          {lods}
        </div>'''
    rows = [f'<div class="bd-row">{compare}{modes}</div>']
    if p['uv']:
        legend = ''.join(f'<li><span>{k}</span><span>{v}</span></li>' for k, v in p['uv'])
        uv = f'''<div class="panel" data-reveal>
          <div class="panel__head"><h3 class="panel__title">UV layout</h3><span class="mono muted">0–1 space</span></div>
          <div class="panel__body uv">
            <div class="uv__map"><img src="{IMG}uv-layout.webp" alt="{p['title']} UV layout" loading="lazy" width="1024" height="1024"><span class="uv__axis uv__axis--u">U →</span><span class="uv__axis uv__axis--v">↑ V</span></div>
            <ul class="legend">{legend}</ul>
          </div>
        </div>'''
        rows.append(f'<div class="bd-row bd-row--5-7">{metrics}{uv}</div>')
    else:
        rows.append(f'<div class="bd-row bd-row--1">{metrics}</div>')
    if p['pbr']:
        imgs = ''.join(f'<img src="{IMG}pbr-{m}.webp" alt="{name} map" data-map-img="{m}" loading="lazy" width="768" height="768"' + ('' if i == 0 else ' class="is-hidden"') + '>' for i, (m, name, _, _) in enumerate(MAPS))
        btns = ''.join(f'<button class="pbr__tab" role="tab" data-map="{m}" data-badge="{name} · {fmt}" aria-selected="{"true" if i == 0 else "false"}" aria-controls="pbr-{uid}"><span class="pbr__thumb"><img src="{IMG}pbr-{m}.webp" alt="" loading="lazy" width="44" height="44"></span><span class="pbr__name">{name}<span class="pbr__desc">{d}</span></span><span class="pbr__fmt">{fmt}</span></button>' for i, (m, name, d, fmt) in enumerate(MAPS))
        pbr = f'''<div class="panel" data-reveal>
          <div class="panel__head"><h3 class="panel__title">PBR texture breakdown</h3><span class="mono muted">Metal / Rough</span></div>
          <div class="pbr" data-pbr>
            <figure class="pbr__preview" id="pbr-{uid}" role="tabpanel">{imgs}<span class="pbr__badge">{MAPS[0][1]} · {MAPS[0][3]}</span></figure>
            <div class="pbr__side">
              <div class="pbr__list" role="tablist" aria-label="Texture maps" aria-orientation="vertical">{btns}</div>
              <dl class="pbr__info"><div><dt>Workflow</dt><dd>Metal / Roughness</dd></div><div><dt>Texture sets</dt><dd>{p['sets']}</dd></div><div><dt>Authoring</dt><dd>Substance 3D Painter</dd></div></dl>
            </div>
          </div>
        </div>'''
        rows.append(f'<div class="bd-row bd-row--1">{pbr}</div>')
    return '<div class="bd">' + ''.join(rows) + '</div>'

def work_card(p):
    return f'''<article class="work-card" data-cat="{p['cat']}" data-reveal>
          <a class="work-card__link" href="{p['slug']}.html" data-cursor="View">
            <div class="work-card__media">
              <img src="{IMG}{p['cover']}" alt="{p['title']} — render" loading="lazy" width="800" height="1000">
              <img class="is-alt" src="{IMG}{p['alt']}" alt="" loading="lazy" width="800" height="1000">
              <span class="work-card__tag">{p['tag']}</span>
              <div class="work-card__hud"><span>{p['tris']}</span><span>{p['engine']}</span></div>
            </div>
            <div class="work-card__meta">
              <div><h3 class="work-card__title">{p['title']}</h3><p class="work-card__sub">{p['sub']}</p></div>
              <span class="work-card__arrow" aria-hidden="true">{ARROW}</span>
            </div>
          </a>
        </article>'''

# ------------------------------------------------------------------ pages
def index():
    hero_p = PROJECTS[0]
    tools = ''.join(f'''<div class="tool" data-tool="{i}" data-reveal>
          <span class="tool__icon">{ic}</span>
          <div><div class="tool__name">{n}</div><div class="tool__role">{r}</div></div>
          <div class="tool__level" role="img" aria-label="Proficiency {lv} of 5">{''.join(f'<i class="on"></i>' if k < lv else '<i></i>' for k in range(5))}</div>
        </div>''' for i, n, r, ic, lv in TOOLS)
    stages = ''.join(f'<button class="stage" data-stage-tools="{t}"><span class="stage__num">0{n + 1}</span><span class="stage__name">{s}</span><span class="stage__tools">{" · ".join(TOOL_NAMES[x] for x in t.split())}</span></button>' for n, (s, t) in enumerate(STAGES))
    marquee_words = ['Character art', 'Real-time', 'Topology', 'PBR texturing', 'Game-ready', 'Unreal Engine 5', 'Sculpting', 'Look-dev']
    mq = ''.join(f'<span class="marquee__item">{w}</span>' for w in marquee_words)
    socials = ''.join(f'<a class="chip" href="{u}" target="_blank" rel="noopener">{n} ↗</a>' for n, u in OWNER['socials'])
    body = f'''{nav(True)}
  <main id="main">
    <section class="hero" id="top" data-stage data-video="" data-model="" data-poster="{IMG}bust-beauty.webp" aria-label="Intro">
      <div class="hero__stage" aria-hidden="true">
        <div class="hero__bg"></div>
        <div class="hero__grid"></div>
        <div class="hero__subject"><img src="{IMG}bust-beauty.webp" alt="" width="800" height="1000" fetchpriority="high"></div>
        <div class="hero__scanline"></div>
      </div>
      <div class="container hero__content" data-split>
        <span class="eyebrow">{OWNER['role']} — {OWNER['city']}</span>
        <h1 class="display hero__title">{lines(OWNER['first'], '<span class="outline">' + OWNER['last'] + '</span>')}</h1>
        <p class="lead hero__lead" data-reveal>Game-ready characters with production topology, clean UVs and physically based materials — from first sculpt to Unreal Engine 5.</p>
        <div class="hero__ctas" data-reveal>
          <a class="btn btn--primary" href="#work" data-magnetic="0.25">View selected work <span class="btn__icon">{ARROW}</span></a>
          <a class="btn" href="#contact" data-magnetic="0.25">Start a project</a>
        </div>
      </div>
      <dl class="hero__hud">
        <div class="hud__cell"><dt>Asset</dt><dd>{hero_p['title']} · LOD0</dd></div>
        <div class="hud__cell"><dt>Triangles</dt><dd>48,212</dd></div>
        <div class="hud__cell"><dt>Viewport</dt><dd data-hud-xy>X 0.000  Y 0.000</dd></div>
        <div class="hud__cell"><dt>Scroll</dt><dd><a class="scroll-cue" href="#work"><span class="scroll-cue__bar"></span>Explore</a></dd></div>
      </dl>
    </section>

    <div class="marquee" aria-hidden="true"><div class="marquee__track">{mq}{mq}</div></div>

    <section class="section" id="work" tabindex="-1">
      <div class="container">
      {section_head('01', 'Selected work', ['Characters built', 'for real-time.'], '<div class="filters" data-filters="#work-grid" role="group" aria-label="Filter projects"><button class="chip" data-filter="all" aria-pressed="true">All</button><button class="chip" data-filter="character" aria-pressed="false">Character</button><button class="chip" data-filter="hard" aria-pressed="false">Hard surface</button><button class="chip" data-filter="environment" aria-pressed="false">Environment</button></div>')}
        <div class="work-grid" id="work-grid" data-reveal-group="0.1">
          {''.join(work_card(p) for p in PROJECTS)}
        </div>
      </div>
    </section>

    <section class="section" id="breakdown" tabindex="-1" style="background: var(--bg-2); border-block: 1px solid var(--line);">
      <div class="container">
      {section_head('02', 'Technical breakdown — ' + hero_p['title'], ['Under the', 'surface.'], f'<a class="btn" href="{hero_p["slug"]}.html">Full case study <span class="btn__icon">{ARROW}</span></a>')}
        {breakdown(hero_p, 'home')}
      </div>
    </section>

    <section class="section" id="pipeline" tabindex="-1">
      <div class="container">
      {section_head('03', 'Tech stack & pipeline', ['Sculpt to engine,', 'no shortcuts.'])}
        <div class="pipeline" aria-label="Production pipeline — hover a stage to highlight its tools">{stages}</div>
        <div class="tools" data-reveal-group="0.05">{tools}</div>
      </div>
    </section>

    <section class="section" id="about" tabindex="-1">
      <div class="container about">
        <figure class="about__media" data-reveal>
          <img src="{IMG}avatar.jpg" alt="Portrait of {OWNER['name']}" loading="lazy" width="764" height="1024" data-parallax="0.12">
          <figcaption class="mono">{OWNER['city']}</figcaption>
        </figure>
        <div class="about__body">
          <span class="eyebrow">04 — About</span>
          <h2 class="h2" data-split>{lines('Art direction', 'meets tech.')}</h2>
          <p class="lead" data-reveal>I'm {OWNER['first']}, a character and technical artist from {OWNER['city'].replace(', PL', ', Poland')}. I bridge the gap between sculpting and engine: assets that look like the concept and still respect the frame budget.</p>
          <p class="muted" data-reveal>My focus is anatomy, hard-surface armour and stylised realism — with deformation-ready topology, efficient UVs and materials that hold up under any lighting.</p>
          <div class="stats" data-reveal>
            <div class="stat"><div class="stat__num" data-count="5" data-suffix="+">5+</div><div class="stat__label">Years in 3D</div></div>
            <div class="stat"><div class="stat__num" data-count="50" data-suffix="+">50+</div><div class="stat__label">Models shipped</div></div>
            <div class="stat"><div class="stat__num" data-count="12">12</div><div class="stat__label">Game projects</div></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="contact" tabindex="-1" style="border-top: 1px solid var(--line);">
      <div class="container contact">
        <div>
          <span class="eyebrow">05 — Contact</span>
          <h2 class="display contact__title" data-split>{lines("Let's build", 'something <span class="accent">real.</span>')}</h2>
          <a class="contact__email" href="mailto:{OWNER['email']}" data-copy="{OWNER['email']}" data-cursor="Copy">{OWNER['email']} <span class="mono" data-copy-label>Click to copy</span></a>
          <div class="socials">{socials}</div>
        </div>
        <form class="form" data-mailto-form="{OWNER['email']}" data-reveal novalidate>
          <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required placeholder="Your name"></div>
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required placeholder="you@studio.com"></div>
          <div class="field"><label for="f-type">Project type</label><select id="f-type" name="type"><option>Character</option><option>Hard-surface props</option><option>Environment</option><option>Full-time role</option></select></div>
          <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="5" required placeholder="Scope, engine, timeline…"></textarea></div>
          <button class="btn btn--primary" type="submit" data-magnetic="0.2">Send message <span class="btn__icon">{ARROW}</span></button>
          <p class="form__note" aria-live="polite"></p>
        </form>
      </div>
    </section>
  </main>
'''
    return head(f"{OWNER['name']} — {OWNER['role']}", 'Portfolio of Zakharii Stroich: game-ready characters, topology, UVs and PBR texturing for real-time engines.', IMG + 'bust-beauty.webp') + body + footer()

def case(p, nxt):
    meta = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in [('Role', p['role']), ('Year', p['year']), ('Engine', p['engine']), ('Scope', p['scope'])])
    prose = ''.join(f'<p>{t}</p>' for t in p['process'])
    shots = ''.join(f'<figure class="shot" data-reveal><img src="{IMG}{img}" alt="{p["title"]} — {c}" loading="lazy" width="800" height="1000"><figcaption><span>{c}</span><span class="mono">{p["tris"]}</span></figcaption></figure>' for img, c in p['shots'])
    body = f'''{nav(False)}
  <main id="main">
    <section class="case-hero" id="top">
      <div class="container" data-split>
        <a class="back-link" href="index.html#work">{ARROW_L} All work</a>
        <div style="margin-top: var(--s-5);"><span class="eyebrow">{p['tag']} — {p['year']}</span></div>
        <h1 class="display case-hero__title">{lines(p['title'])}</h1>
        <p class="lead" data-reveal>{p['lead']}</p>
        <dl class="case-meta" data-reveal style="margin-top: var(--s-7);">{meta}</dl>
      </div>
    </section>
    <section class="section" style="padding-top: 0;">
      <div class="container">{breakdown(p, p['slug'])}</div>
    </section>
    <section class="section" style="padding-top: 0;">
      <div class="container">
        {section_head('', 'Process', ['How it was made.'])}
        <div class="prose" data-reveal>{prose}</div>
        <div class="shots" style="margin-top: var(--s-8);">{shots}</div>
        <a class="next-case" href="{nxt['slug']}.html" style="margin-top: var(--s-8);" data-cursor="Next">
          <div><span class="eyebrow">Next project</span><div class="next-case__title" style="margin-top: var(--s-3);">{nxt['title']}</div></div>
          <span class="work-card__arrow" aria-hidden="true">{ARROW}</span>
        </a>
      </div>
    </section>
  </main>
'''
    return head(f"{p['title']} — {OWNER['name']}", p['lead'][:155], IMG + p['cover']) + body + footer()

if __name__ == '__main__':
    with open(OUT + 'index.html', 'w') as f: f.write(index())
    for i, p in enumerate(PROJECTS):
        with open(OUT + p['slug'] + '.html', 'w') as f: f.write(case(p, PROJECTS[(i + 1) % len(PROJECTS)]))
    print('built')
