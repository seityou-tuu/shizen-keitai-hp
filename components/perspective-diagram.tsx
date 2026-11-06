/** Conceptual diagrams, not anatomical or outcome illustrations. Text carries the meaning. */
export function PerspectiveDiagram({ index }: { index: number }) {
  return (
    <svg className="perspective-diagram" viewBox="0 0 180 112" fill="none" aria-hidden="true" focusable="false">
      {index === 0 && <>
        <path d="M24 88c27-14 43-14 66 0s39 14 66 0" />
        <path d="M55 62V31a10 10 0 0 1 20 0v24m0-16a10 10 0 0 1 20 0v18m0-10a10 10 0 0 1 20 0v15m0-8a10 10 0 0 1 20 0v15" />
        <path d="M55 62 43 50a8 8 0 0 0-12 11l24 25" />
        <path className="diagram-accent" d="M81 75c11-5 24-5 35 0" />
      </>}
      {index === 1 && <>
        <circle cx="65" cy="56" r="32" /><circle className="diagram-accent" cx="114" cy="56" r="32" />
        <path d="M15 56h20m110 0h20M67 51l10 10 25-26" />
        <circle cx="65" cy="56" r="42" strokeDasharray="2 7" />
      </>}
      {index === 2 && <>
        <path d="M25 56c16 0 17-28 33-28s17 56 33 56 17-56 33-56 17 28 31 28" />
        <path className="diagram-accent" d="M25 74c16 0 17-28 33-28s17 56 33 56 17-56 33-56 17 28 31 28" />
        <path d="M90 10v8m0 87v5" />
      </>}
      {index === 3 && <>
        <path d="M49 38a45 45 0 0 1 79-11l8 13m-4 34a45 45 0 0 1-79 11l-8-13" />
        <path className="diagram-accent" d="m117 37 19 3 2-20M64 75l-19-3-2 20" />
        <path d="m73 56 12 12 25-26" />
        <circle cx="90" cy="56" r="22" strokeDasharray="2 6" />
      </>}
    </svg>
  );
}
