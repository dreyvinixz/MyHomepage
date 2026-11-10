type ProjectArtProps = { kind: 'data' | 'frame' | 'public' };

export function ProjectArt({ kind }: ProjectArtProps) {
  if (kind === 'data') return <svg className="project-svg" viewBox="0 0 500 260" fill="none" aria-hidden="true">
    <defs><linearGradient id="data-glow" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#c5e4ff"/><stop offset="1" stopColor="#65a9ff" stopOpacity=".35"/></linearGradient></defs>
    <g stroke="url(#data-glow)" strokeWidth="1.25"><path d="M87 82 151 49l65 33v94l-65 34-64-34z"/><path d="m87 82 64 34 65-34M151 116v94"/><path d="m151 49 65 33-65 34-64-34z" opacity=".4"/><path d="M258 78h110M258 104h145M258 130h90M258 156h128M258 182h104" opacity=".55"/><path d="M226 129h22"/><circle cx="250" cy="129" r="3" fill="#d5edff"/></g><g fill="#d6edff"><circle cx="151" cy="49" r="3"/><circle cx="87" cy="82" r="3"/><circle cx="216" cy="82" r="3"/><circle cx="151" cy="210" r="3"/></g>
    <g fill="#a8ccf9" fontSize="9" fontFamily="monospace" letterSpacing="2"><text x="258" y="67">DATA / INGEST</text><text x="258" y="204">STRUCTURE → INSIGHT</text></g>
  </svg>;
  if (kind === 'frame') return <svg className="project-svg" viewBox="0 0 500 260" fill="none" aria-hidden="true">
    <g stroke="#b5d8ff" strokeWidth="1.2"><rect x="95" y="54" width="180" height="126" rx="5" opacity=".38"/><rect x="135" y="75" width="180" height="126" rx="5" opacity=".62"/><rect x="175" y="96" width="180" height="126" rx="5"/><path d="M286 63h93m-12-8 12 8-12 8M118 207h-38m12-8-12 8 12 8"/><path d="m208 176 29-31 27 16 45-41" stroke="#d7efff" strokeWidth="2"/><circle cx="309" cy="120" r="3" fill="#d7efff"/></g><g fill="#a8ccf9" fontSize="9" fontFamily="monospace" letterSpacing="2"><text x="294" y="51">FRAME / 03</text><text x="94" y="230">UPSCALE → GENERATE</text></g>
  </svg>;
  return <svg className="project-svg" viewBox="0 0 500 260" fill="none" aria-hidden="true">
    <g stroke="#b5d8ff" strokeWidth="1.2"><rect x="100" y="43" width="300" height="180" rx="7"/><path d="M100 73h300M132 43v180M154 98h109M154 119h75M154 154h109M154 175h89" opacity=".65"/><circle cx="116" cy="58" r="2" fill="#c5e7ff"/><path d="M300 117c7-18 22-23 30-30l10 7 15-2 6 15-5 12 4 13-12 6-6 18-12 9-9-17-12-4-4-14-12-5z" fill="#6ba9fa" fillOpacity=".18"/><path d="M286 187h82" opacity=".5"/></g><g fill="#a8ccf9" fontSize="9" fontFamily="monospace" letterSpacing="2"><text x="154" y="208">PUBLIC / DATA</text><text x="289" y="180">BRAZIL</text></g>
  </svg>;
}
