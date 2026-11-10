export function FrameBridgeVisual() {
  return <>
    <svg className="framebridge-art" viewBox="0 0 600 300" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs><linearGradient id="bridge-light" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#4d93f6"/><stop offset=".5" stopColor="#e4f6ff"/><stop offset="1" stopColor="#6bbdff"/></linearGradient></defs>
      <g className="bridge-grid" stroke="#8abaff" strokeWidth=".7"><path d="M0 243H600M0 265H600M0 285H600"/><path d="M65 240 0 300M140 240 100 300M215 240 200 300M300 240v60M385 240l15 60M460 240l40 60M535 240l65 60"/></g>
      <g stroke="url(#bridge-light)" strokeWidth="1.5"><path d="M42 211h516M42 221h516"/><path d="M154 212V68h20v144M426 212V68h20v144"/><path d="M145 68h38M417 68h38"/><path d="M46 155C95 155 122 120 164 82c64 116 208 116 272 0 42 38 69 73 118 73"/><path d="M164 82C228 198 372 198 436 82" opacity=".38"/><path d="M77 155v56M108 145v66M136 123v88M195 126v85M226 151v60M258 165v46M290 172v39M322 170v41M354 161v50M386 144v67M466 123v88M494 145v66M525 155v56" opacity=".58"/></g>
      <path className="bridge-signal" d="M42 216h516" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 90"/>
      <g fill="#e2f4ff"><circle cx="42" cy="216" r="4"/><circle cx="558" cy="216" r="4"/><circle cx="164" cy="68" r="3"/><circle cx="436" cy="68" r="3"/></g>
    </svg>
    <span className="work-visual-name framebridge-name">FrameBridge</span>
  </>;
}
