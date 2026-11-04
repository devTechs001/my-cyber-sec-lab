export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}
