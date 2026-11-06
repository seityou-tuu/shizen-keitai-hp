import { getOfficialLineUrl } from "@/lib/contact";
import type { MouseEventHandler } from "react";

export function LineConsultationLink({
  className = "line-consult-link",
  label = "LINEで受講相談",
  onClick,
}: {
  className?: string;
  label?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const url = getOfficialLineUrl();
  if (!url) return null;
  return (
    <a
      className={className}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {label}<span className="sr-only">（別タブで開きます）</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
