import { Link } from "react-router-dom";

interface DevLearnLogoProps {
  /** Wenn true, wird das Logo als klickbarer Link zur Startseite gerendert */
  linkTo?: string;
  /** Zusätzliche CSS-Klasse */
  className?: string;
}

/**
 * DevLearnLogo
 * Rendert "Dev<span>Learn</span>" — optional als Link.
 *
 * Verwendung:
 *   <DevLearnLogo />                    — nur Text
 *   <DevLearnLogo linkTo="/" />         — als Link zur Startseite
 *   <DevLearnLogo linkTo="/dashboard" /> — als Link zum Dashboard
 */
export default function DevLearnLogo({ linkTo, className }: DevLearnLogoProps) {
  const content = (
    <>Dev<span>Learn</span></>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={`dl-logo ${className ?? ""}`.trim()}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`dl-logo ${className ?? ""}`.trim()}>
      {content}
    </div>
  );
}