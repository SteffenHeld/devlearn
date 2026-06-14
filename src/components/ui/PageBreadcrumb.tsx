// Wiederverwendbare Breadcrumb-Navigation für alle DevLearn-Seiten.
//
// Verwendung:
//   <PageBreadcrumb items={[
//     { label: "Kurse", onClick: () => navigate("/kurse") },
//     { label: "Kurs",  onClick: () => navigate(`/kurse/${kursId}`) },
//     { label: lesson.title },   // letztes Item = aktuell, kein onClick
//   ]} />

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <nav className="dl-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i}>
            {isLast ? (
              <span className="dl-breadcrumb-current">{item.label}</span>
            ) : (
              <>
                <span role="button" onClick={item.onClick}>{item.label}</span>
                <span className="dl-breadcrumb-sep" aria-hidden="true"> / </span>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}
