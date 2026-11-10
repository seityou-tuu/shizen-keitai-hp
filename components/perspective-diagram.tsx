/** Conceptual diagrams, not anatomical or outcome illustrations. Text carries the meaning. */
export function PerspectiveDiagram({ index }: { index: number }) {
  return (
    <svg className="essential-illustration" viewBox="0 0 180 112" fill="none" aria-hidden="true" focusable="false">
      {index === 0 && <>
        <path d="M24 88c27-14 43-14 66 0s39 14 66 0" />
        <path d="M55 62V31a10 10 0 0 1 20 0v24m0-16a10 10 0 0 1 20 0v18m0-10a10 10 0 0 1 20 0v15m0-8a10 10 0 0 1 20 0v15" />
        <path d="M55 62 43 50a8 8 0 0 0-12 11l24 25" />
        <path className="diagram-accent" d="M81 75c11-5 24-5 35 0" />
      </>}
      {index === 1 && <>
        <circle cx="53" cy="22" r="9"/><path d="M40 91V53q0-19 14-19t14 19v38M41 50 25 68m42-17 14 12M49 91v12m11-12v12"/>
        <circle cx="124" cy="22" r="9"/><path d="M110 91V53q0-19 14-19t14 19v38M111 50 94 64m43-13 17 6M120 91v12m11-12v12"/>
        <path className="diagram-accent" d="M82 23h12M84 84h13"/>
      </>}
      {index === 2 && <>
        <path d="M67 20q-26 15-26 47v24m72-71q26 15 26 47v24M90 18v73M80 35q-14-8-25 5m25 10q-16-8-27 5m27 10q-16-8-27 5m47-35q14-8 25 5m-25 10q16-8 27 5m-27 10q16-8 27 5"/>
        <path className="diagram-accent" d="M12 96q16-12 32 0t32 0M105 103q16-10 32 0t32 0"/>
      </>}
      {index === 3 && <>
        <circle cx="90" cy="20" r="12"/><circle cx="48" cy="87" r="12"/><circle cx="132" cy="87" r="12"/>
        <path d="M70 22q-33 7-31 47m20 28q31 17 60 0m22-28q2-35-31-47"/>
        <path className="diagram-accent" d="m33 58 6 11 9-8m60 33 11 3-2 11m3-76-10-10 13-3M76 56h28m-24 8h20"/>
      </>}
    </svg>
  );
}
