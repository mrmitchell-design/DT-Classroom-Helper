/* ------------------------------------------------------------------ */
/* ICONS \u2014 served from local /icons/*.svg (no external CDN needed)    */
/* ------------------------------------------------------------------ */

const ICON_KEBAB = {
  Printer: "printer", Download: "download", RotateCcw: "rotate-ccw", Check: "check", X: "x",
  ChevronRight: "chevron-right", Wrench: "wrench", Volume2: "volume-2", Lightbulb: "lightbulb",
  ChevronDown: "chevron-down", PenLine: "pen-line", Search: "search", Palette: "palette",
  Coins: "coins", Users: "users", Leaf: "leaf", Ruler: "ruler", ShieldCheck: "shield-check",
  Settings: "settings", Layers: "layers", Repeat: "repeat", GitMerge: "git-merge",
  RefreshCw: "refresh-cw", SlidersHorizontal: "sliders-horizontal", Recycle: "recycle",
  Eraser: "eraser", ArrowLeftRight: "arrow-left-right", UserPlus: "user-plus", Key: "key",
  Trash2: "trash-2", FileDown: "file-down", UsersRound: "users-round",
  ClipboardList: "clipboard-list", LogOut: "log-out", Shield: "shield", GraduationCap: "graduation-cap",
};
const ICON_SVG_CACHE = {};

function useIconSvg(name) {
  const [svg, setSvg] = useState(ICON_SVG_CACHE[name] || null);
  useEffect(() => {
    if (!name) return;
    if (ICON_SVG_CACHE[name]) { setSvg(ICON_SVG_CACHE[name]); return; }
    const file = ICON_KEBAB[name] || name;
    fetch("/icons/" + file + ".svg")
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error("icon-fetch-failed"))))
      .then((text) => { ICON_SVG_CACHE[name] = text; setSvg(text); })
      .catch(() => {});
  }, [name]);
  return svg;
}

function IconGlyph({ name, size = 16, className = "", style = {} }) {
  const svg = useIconSvg(name);
  return (
    <span
      className={"icon-glyph " + className}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: svg || "" }}
    />
  );
}
