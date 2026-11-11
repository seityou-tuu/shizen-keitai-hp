import Link from "next/link";
import { informationLinks } from "@/lib/site-information";
export function InformationLinks({ label = "運営情報・各種方針" }: { label?: string }) {
  return (
    <nav className="information-links" aria-label={label}>
      {informationLinks.map((link) => (
        <Link href={link.href} key={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
