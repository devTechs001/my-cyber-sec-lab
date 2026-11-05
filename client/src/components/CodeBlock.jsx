export default function CodeBlock({ title, lines }) {
  return (
    <div className="code-block">
      {title && <div className="code-title">{title}</div>}
      <pre>
        <code>
          {lines.map((l, i) => (
            <div key={i} className={l.startsWith("#") ? "code-comment" : "code-line"}>
              {l || " "}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
