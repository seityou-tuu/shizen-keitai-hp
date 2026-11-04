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
export function PhotoPlaceholder({
  label,
  caption,
}: {
  label: string;
  caption: string;
}) {
  return (
    <div
      className="photo-placeholder"
      role="img"
      aria-label={`${caption}。実際の写真は準備中です。`}
    >
      <div className="placeholder-art" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <span className="placeholder-label">{label}</span>
      <p>{caption}</p>
      <small>実際の写真を掲載予定</small>
    </div>
  );
}
export function ArrowLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <a href={href} className={`arrow-link ${light ? "on-dark" : ""}`}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
