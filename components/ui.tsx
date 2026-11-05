import type { ReactNode } from "react";
export function SectionHeading({
  number,
  english,
  children,
  light = false,
}: {
  number: string;
  english: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      <p className="eyebrow">
        <span>{number}</span> {english}
      </p>
      <h2>{children}</h2>
    </div>
  );
}
