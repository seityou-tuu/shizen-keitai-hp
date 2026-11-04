import Link from "next/link";
import { informationLinks } from "@/lib/site-information";
export function InformationLinks() {
  return (
    <nav className="information-links" aria-label="運営情報・各種方針">
      {informationLinks.map((link) => (
        <Link href={link.href} key={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
