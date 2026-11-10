export function ServidorVisual() {
  return <>
    <svg className="servidor-art" viewBox="0 0 600 300" fill="none" aria-hidden="true">
      <defs><linearGradient id="servidor-light" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d4edff"/><stop offset="1" stopColor="#5a9df5"/></linearGradient></defs>
      <g stroke="url(#servidor-light)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M181 129 300 68l119 61H181ZM192 139h216M183 220h234M172 228h256"/>
        <path d="M208 139v78m46-78v78m46-78v78m46-78v78m46-78v78" opacity=".72"/>
        <path d="M200 150h16m30 0h16m30 0h16m30 0h16m30 0h16M200 207h16m30 0h16m30 0h16m30 0h16m30 0h16" opacity=".7"/>
        <circle cx="421" cy="184" r="26" fill="#090a0e"/><path d="m440 203 18 18" strokeWidth="3"/>
      </g>
      <g fill="#d6ecff"><circle cx="300" cy="100" r="3"/><circle cx="172" cy="228" r="2.5"/><circle cx="428" cy="228" r="2.5"/></g>
      <g className="servidor-lines" stroke="#83b9fa" strokeWidth=".8"><path d="M64 248h472M96 258h408M130 268h340"/></g>
    </svg>
    <span className="work-visual-name servidor-name">ServidorBR</span>
  </>;
}
