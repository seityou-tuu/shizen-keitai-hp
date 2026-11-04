import { getOfficialLineUrl } from "@/lib/contact";

export function LineConsultationLink({
  className = "line-consult-link",
}: {
  className?: string;
}) {
  const url = getOfficialLineUrl();
  if (!url) return null;
  return (
    <a
      className={className}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      公式LINEで相談する<span className="sr-only">（別タブで開きます）</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
