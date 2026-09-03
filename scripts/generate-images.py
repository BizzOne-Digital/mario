from pathlib import Path

root = Path(__file__).resolve().parents[1] / "public" / "images"
root.mkdir(parents=True, exist_ok=True)


def svg(name: str, title: str, body: str, w: int = 1200, h: int = 800) -> None:
    content = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{title}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#071A2B"/>
      <stop offset="55%" stop-color="#0D2A40"/>
      <stop offset="100%" stop-color="#101820"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#CDEFF5" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#7FD7EA" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#F4FAFC" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7FD7EA" stop-opacity="0"/>
      <stop offset="50%" stop-color="#CDEFF5" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#7FD7EA" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#sky)"/>
  <circle cx="980" cy="120" r="90" fill="#7FD7EA" opacity="0.12"/>
  <rect x="0" y="120" width="{w}" height="8" fill="url(#ray)" opacity="0.5"/>
  {body}
  <text x="48" y="{h - 40}" fill="#7E8B94" font-family="Georgia, serif" font-size="22">{title}</text>
</svg>
"""
    (root / name).write_text(content, encoding="utf-8")
    print("wrote", name)


svg(
    "hero-residential.svg",
    "Residential glass craftsmanship",
    """
  <g opacity="0.95">
    <rect x="120" y="160" width="420" height="480" rx="18" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.45" stroke-width="2"/>
    <path d="M140 200 L500 180" stroke="#CDEFF5" stroke-opacity="0.55" stroke-width="2"/>
    <path d="M150 420 L510 390" stroke="#7FD7EA" stroke-opacity="0.25" stroke-width="18"/>
  </g>
  <rect x="620" y="220" width="460" height="360" rx="16" fill="#101820" stroke="#7E8B94" stroke-opacity="0.5"/>
  <rect x="660" y="260" width="180" height="220" rx="8" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.4"/>
  <rect x="870" y="260" width="180" height="220" rx="8" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.35"/>
  <rect x="660" y="510" width="390" height="40" rx="6" fill="#071A2B"/>
  <path d="M700 300 L820 280 L820 450 L700 470 Z" fill="#CDEFF5" opacity="0.18"/>
""",
)

svg(
    "hero-commercial.svg",
    "Commercial storefront glass",
    """
  <rect x="140" y="180" width="920" height="460" rx="12" fill="#101820" stroke="#7E8B94" stroke-opacity="0.4"/>
  <rect x="180" y="220" width="240" height="320" rx="6" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="460" y="220" width="240" height="320" rx="6" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.45"/>
  <rect x="740" y="220" width="280" height="320" rx="6" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.4"/>
  <rect x="180" y="560" width="840" height="40" fill="#071A2B"/>
  <circle cx="700" cy="400" r="18" fill="#E4A85D" opacity="0.7"/>
""",
)

svg(
    "shower-frameless.svg",
    "Frameless shower enclosure",
    """
  <rect x="280" y="140" width="640" height="520" rx="8" fill="#101820" stroke="#7E8B94"/>
  <path d="M320 180 H880 V600 H320 Z" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.55"/>
  <line x1="600" y1="180" x2="600" y2="600" stroke="#CDEFF5" stroke-opacity="0.35" stroke-width="2"/>
  <circle cx="620" cy="380" r="10" fill="#7E8B94"/>
  <rect x="300" y="620" width="600" height="30" rx="4" fill="#071A2B"/>
""",
)

svg(
    "shower-sliding.svg",
    "Sliding shower door",
    """
  <rect x="240" y="160" width="720" height="500" rx="10" fill="#101820"/>
  <rect x="280" y="200" width="300" height="400" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="620" y="200" width="300" height="400" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.45"/>
  <rect x="280" y="190" width="640" height="14" rx="4" fill="#7E8B94"/>
  <circle cx="560" cy="400" r="12" fill="#E4A85D" opacity="0.8"/>
  <circle cx="640" cy="400" r="12" fill="#E4A85D" opacity="0.8"/>
""",
)

svg(
    "tub-enclosure.svg",
    "Custom tub enclosure",
    """
  <ellipse cx="600" cy="560" rx="340" ry="80" fill="#0D2A40"/>
  <rect x="300" y="220" width="600" height="340" rx="12" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="300" y="200" width="600" height="20" fill="#7E8B94"/>
  <path d="M320 280 H880" stroke="#CDEFF5" stroke-opacity="0.3"/>
  <rect x="280" y="540" width="640" height="50" rx="20" fill="#101820" stroke="#7E8B94"/>
""",
)

svg(
    "hardware.svg",
    "Shower hardware detail",
    """
  <rect x="200" y="160" width="800" height="500" rx="16" fill="#101820"/>
  <rect x="260" y="220" width="280" height="380" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.4"/>
  <rect x="620" y="260" width="40" height="300" rx="8" fill="#7E8B94"/>
  <circle cx="640" cy="300" r="28" fill="#CDEFF5" opacity="0.8"/>
  <circle cx="640" cy="520" r="28" fill="#CDEFF5" opacity="0.8"/>
  <rect x="700" y="340" width="200" height="24" rx="12" fill="#E4A85D" opacity="0.85"/>
""",
)

svg(
    "window-replace.svg",
    "Window glass replacement",
    """
  <rect x="260" y="140" width="680" height="520" rx="8" fill="#101820" stroke="#7E8B94"/>
  <rect x="300" y="180" width="280" height="200" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="620" y="180" width="280" height="200" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="300" y="420" width="280" height="200" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.45"/>
  <rect x="620" y="420" width="280" height="200" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.45"/>
  <line x1="580" y1="180" x2="580" y2="620" stroke="#7E8B94" stroke-width="10"/>
  <line x1="300" y1="400" x2="900" y2="400" stroke="#7E8B94" stroke-width="10"/>
""",
)

svg(
    "vinyl-window.svg",
    "Vinyl window system",
    """
  <rect x="220" y="150" width="760" height="520" rx="14" fill="#F4FAFC" opacity="0.08"/>
  <rect x="280" y="190" width="640" height="440" rx="10" fill="#101820" stroke="#7FD7EA" stroke-opacity="0.4"/>
  <rect x="320" y="230" width="560" height="360" fill="url(#glass)"/>
  <rect x="300" y="210" width="600" height="24" fill="#CDEFF5" opacity="0.35"/>
  <rect x="300" y="590" width="600" height="24" fill="#CDEFF5" opacity="0.35"/>
""",
)

svg(
    "patio-door.svg",
    "Glass patio doors",
    """
  <rect x="180" y="120" width="840" height="580" rx="12" fill="#0D2A40"/>
  <rect x="220" y="160" width="360" height="500" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="620" y="160" width="360" height="500" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.45"/>
  <circle cx="560" cy="420" r="14" fill="#E4A85D"/>
  <circle cx="640" cy="420" r="14" fill="#E4A85D"/>
""",
)

svg(
    "mirror.svg",
    "Custom mirror glass",
    """
  <rect x="320" y="120" width="560" height="560" rx="20" fill="#101820" stroke="#7E8B94"/>
  <rect x="360" y="160" width="480" height="480" rx="8" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.5"/>
  <path d="M400 220 L760 200" stroke="#F4FAFC" stroke-opacity="0.45" stroke-width="3"/>
  <circle cx="600" cy="400" r="60" fill="#7FD7EA" opacity="0.08"/>
""",
)

svg(
    "storefront.svg",
    "Storefront glass doors",
    """
  <rect x="100" y="160" width="1000" height="500" fill="#101820"/>
  <rect x="140" y="200" width="280" height="380" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="460" y="200" width="280" height="380" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.45"/>
  <rect x="780" y="200" width="280" height="380" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.4"/>
  <rect x="100" y="160" width="1000" height="40" fill="#071A2B"/>
""",
)

svg(
    "measure.svg",
    "Precision measurement",
    """
  <rect x="200" y="200" width="800" height="420" rx="16" fill="#101820" stroke="#7E8B94"/>
  <line x1="240" y1="240" x2="240" y2="580" stroke="#7FD7EA" stroke-width="2" stroke-dasharray="8 6"/>
  <line x1="240" y1="580" x2="940" y2="580" stroke="#7FD7EA" stroke-width="2" stroke-dasharray="8 6"/>
  <rect x="320" y="260" width="520" height="260" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.4"/>
  <circle cx="860" cy="300" r="40" fill="#E4A85D" opacity="0.7"/>
  <path d="M840 300 H880 M860 280 V320" stroke="#071A2B" stroke-width="4"/>
""",
)

svg(
    "install.svg",
    "Professional glass installation",
    """
  <rect x="160" y="180" width="880" height="460" rx="18" fill="#0D2A40"/>
  <rect x="240" y="240" width="360" height="320" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <path d="M680 280 L900 260 L920 540 L700 560 Z" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.45"/>
  <rect x="200" y="560" width="800" height="40" fill="#071A2B"/>
""",
)

svg(
    "residential-install.svg",
    "Residential installation",
    """
  <path d="M200 420 L600 160 L1000 420 V680 H200 Z" fill="#101820" stroke="#7E8B94"/>
  <rect x="420" y="360" width="360" height="320" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="280" y="440" width="100" height="140" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.4"/>
  <rect x="820" y="440" width="100" height="140" fill="url(#glass)" stroke="#CDEFF5" stroke-opacity="0.4"/>
""",
)

svg(
    "commercial-install.svg",
    "Commercial installation",
    """
  <rect x="180" y="140" width="840" height="540" fill="#101820"/>
  <rect x="220" y="180" width="200" height="420" fill="url(#glass)"/>
  <rect x="460" y="180" width="200" height="420" fill="url(#glass)"/>
  <rect x="700" y="180" width="280" height="420" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.5"/>
  <rect x="180" y="140" width="840" height="30" fill="#7E8B94" opacity="0.5"/>
""",
)

for name, title, extra in [
    (
        "process-contact.svg",
        "Contact Express Glass",
        '<circle cx="600" cy="380" r="120" fill="url(#glass)" stroke="#7FD7EA"/><path d="M560 360 H640 M600 340 V420" stroke="#CDEFF5" stroke-width="8" stroke-linecap="round"/>',
    ),
    (
        "process-estimate.svg",
        "Free estimate",
        '<rect x="380" y="240" width="440" height="320" rx="16" fill="#101820" stroke="#7FD7EA"/>',
    ),
    (
        "process-measure.svg",
        "Measure and design",
        '<rect x="300" y="220" width="600" height="380" fill="url(#glass)" stroke="#7FD7EA"/><line x1="320" y1="240" x2="320" y2="580" stroke="#CDEFF5" stroke-dasharray="6 4"/>',
    ),
    (
        "process-select.svg",
        "Product selection",
        '<rect x="280" y="240" width="200" height="300" fill="url(#glass)"/><rect x="500" y="240" width="200" height="300" fill="url(#glass)"/><rect x="720" y="240" width="200" height="300" fill="url(#glass)" stroke="#E4A85D"/>',
    ),
    (
        "process-install.svg",
        "Installation or repair",
        '<rect x="340" y="200" width="520" height="420" fill="url(#glass)" stroke="#7FD7EA"/><path d="M380 280 L820 250" stroke="#CDEFF5" stroke-width="3"/>',
    ),
    (
        "process-review.svg",
        "Final review",
        '<circle cx="600" cy="380" r="140" fill="#101820" stroke="#7FD7EA" stroke-width="4"/><path d="M540 380 L580 420 L680 320" fill="none" stroke="#E4A85D" stroke-width="10" stroke-linecap="round"/>',
    ),
]:
    svg(name, title, extra)

svg(
    "before-shower.svg",
    "Before shower refresh",
    """
  <rect x="280" y="160" width="640" height="500" fill="#101820" opacity="0.9"/>
  <rect x="320" y="200" width="560" height="420" fill="#7E8B94" opacity="0.25" stroke="#7E8B94"/>
""",
)

svg(
    "after-shower.svg",
    "After shower refresh",
    """
  <rect x="280" y="160" width="640" height="500" fill="#101820"/>
  <rect x="320" y="200" width="560" height="420" fill="url(#glass)" stroke="#7FD7EA" stroke-opacity="0.6"/>
""",
)

svg(
    "before-after-shower.svg",
    "Before and after shower",
    """
  <rect x="120" y="180" width="460" height="440" fill="#101820"/>
  <rect x="160" y="220" width="380" height="360" fill="#7E8B94" opacity="0.2"/>
  <rect x="620" y="180" width="460" height="440" fill="#101820"/>
  <rect x="660" y="220" width="380" height="360" fill="url(#glass)" stroke="#7FD7EA"/>
""",
)

print("done", len(list(root.glob("*.svg"))))
