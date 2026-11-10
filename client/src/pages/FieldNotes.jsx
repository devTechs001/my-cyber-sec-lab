import { useMemo, useRef, useState } from "react";
import SectionHeading from "../components/SectionHeading.jsx";

const STORAGE_KEY = "cyber-ec-lab-field-notes-v1";
const kinds = ["Finding", "Lesson", "Practical"];
const emptyForm = () => ({
  type: "Finding", title: "", date: new Date().toISOString().slice(0, 10),
  target: "", severity: "Informational", tags: "", summary: "", steps: "", evidence: "", remediation: "",
});

function readNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((n) => n && n.id && n.title) : [];
  } catch { return []; }
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function FieldNotes() {
  const [notes, setNotes] = useState(readNotes);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const importRef = useRef(null);

  const saveNotes = (next) => {
    setNotes(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setMessage("Saved in this browser.");
    } catch {
      setMessage("Could not save locally. Export a backup or check browser storage settings.");
    }
  };

  const visible = useMemo(() => notes
    .filter((n) => filter === "All" || n.type === filter)
    .filter((n) => `${n.title} ${n.target} ${n.tags?.join(" ")} ${n.summary} ${n.steps} ${n.evidence} ${n.remediation}`.toLowerCase().includes(query.toLowerCase().trim()))
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.updatedAt - a.updatedAt), [notes, filter, query]);

  const change = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const record = {
      ...form,
      id: editing || makeId(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      updatedAt: Date.now(),
    };
    const next = editing ? notes.map((n) => n.id === editing ? record : n) : [record, ...notes];
    saveNotes(next);
    setForm(emptyForm());
    setEditing(null);
  };

  const edit = (note) => {
    setEditing(note.id);
    setForm({ ...emptyForm(), ...note, tags: (note.tags || []).join(", ") });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (id) => {
    if (!window.confirm("Delete this note? This cannot be undone unless you have an export.")) return;
    saveNotes(notes.filter((n) => n.id !== id));
    if (editing === id) { setEditing(null); setForm(emptyForm()); }
  };

  const exportNotes = () => {
    const blob = new Blob([JSON.stringify({ format: "cyber-ec-lab-field-notes", version: 1, exportedAt: new Date().toISOString(), notes }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `cyber-ec-lab-notes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click(); URL.revokeObjectURL(url);
    setMessage("Backup exported.");
  };

  const importNotes = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = Array.isArray(parsed) ? parsed : parsed.notes;
      if (!Array.isArray(imported) || imported.some((n) => !n || typeof n.title !== "string" || !kinds.includes(n.type))) {
        throw new Error("That file does not look like a Field Notes export.");
      }
      const existing = new Map(notes.map((n) => [n.id, n]));
      imported.forEach((n) => {
        const id = n.id || makeId();
        existing.set(id, { ...n, id });
      });
      saveNotes([...existing.values()]);
      setMessage(`Imported ${imported.length} note(s). Matching IDs were updated.`);
    } catch (error) {
      setMessage(error.message || "Could not read that backup file.");
    }
  };

  return (
    <section className="section field-notes-page">
      <SectionHeading eyebrow="Personal workspace · stored locally" title="Field Notes" subtitle="Build your own learning log as you progress: record lab findings, lessons learned, and practical procedures. Notes stay in this browser unless you export them." />

      <div className="notes-privacy"><strong>Keep it safe:</strong> do not save passwords, API keys, personal data, private client evidence, or unredacted sensitive targets here. Browser storage is not encrypted or synced; export regular backups and keep them in a secure location.</div>

      <div className="notes-toolbar">
        <div className="notes-count"><strong>{notes.length}</strong> saved {notes.length === 1 ? "entry" : "entries"}{message && <span role="status"> · {message}</span>}</div>
        <div className="notes-actions">
          <button className="btn btn-ghost" type="button" onClick={exportNotes}>Export backup</button>
          <button className="btn btn-ghost" type="button" onClick={() => importRef.current?.click()}>Import backup</button>
          <input ref={importRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={importNotes} />
        </div>
      </div>

      <form className="panel note-form" onSubmit={submit}>
        <h3>{editing ? "Edit entry" : "Add a finding, lesson, or practical"}</h3>
        <div className="notes-form-grid">
          <label>Entry type<select value={form.type} onChange={(e) => change("type", e.target.value)}>{kinds.map((k) => <option key={k}>{k}</option>)}</select></label>
          <label>Title *<input required maxLength={120} value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="e.g. Missing authorization check on lab profile endpoint" /></label>
          <label>Date<input type="date" value={form.date} onChange={(e) => change("date", e.target.value)} /></label>
          <label>Target / lab (use a safe alias)<input maxLength={120} value={form.target} onChange={(e) => change("target", e.target.value)} placeholder="e.g. Juice Shop local · 127.0.0.1:3000" /></label>
          {form.type === "Finding" && <label>Severity<select value={form.severity} onChange={(e) => change("severity", e.target.value)}>{["Informational", "Low", "Medium", "High", "Critical"].map((v) => <option key={v}>{v}</option>)}</select></label>}
          <label>Tags (comma-separated)<input value={form.tags} onChange={(e) => change("tags", e.target.value)} placeholder="web, access-control, lab-02" /></label>
          <label className="notes-wide">Summary / what I learned<textarea required rows="3" value={form.summary} onChange={(e) => change("summary", e.target.value)} placeholder="What did you observe? Why does it matter? Keep evidence sanitized." /></label>
          <label className="notes-wide">Steps to reproduce / practical procedure<textarea rows="4" value={form.steps} onChange={(e) => change("steps", e.target.value)} placeholder="1. Confirm scope and authorization\n2. Set up the local lab\n3. Run the minimal check and record the result" /></label>
          <label className="notes-wide">Evidence / result<textarea rows="3" value={form.evidence} onChange={(e) => change("evidence", e.target.value)} placeholder="Redacted output, expected vs actual result, screenshot filename, or link to a safe local artifact." /></label>
          <label className="notes-wide">Remediation / next step<textarea rows="3" value={form.remediation} onChange={(e) => change("remediation", e.target.value)} placeholder="How would you fix it? What will you test or learn next?" /></label>
        </div>
        <div className="notes-form-actions"><button className="btn btn-primary" type="submit">{editing ? "Save changes" : "Save entry"}</button>{editing && <button className="btn btn-ghost" type="button" onClick={() => { setEditing(null); setForm(emptyForm()); }}>Cancel edit</button>}</div>
      </form>

      <div className="notes-list-head">
        <h3>Your notebook</h3>
        <div className="notes-filters">
          <input aria-label="Search notes" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your notes…" />
          <select aria-label="Filter note type" value={filter} onChange={(e) => setFilter(e.target.value)}>{["All", ...kinds].map((k) => <option key={k}>{k}</option>)}</select>
        </div>
      </div>
      {visible.length === 0 ? <div className="panel notes-empty"><h3>{notes.length ? "No matching entries" : "Your notebook starts here"}</h3><p>{notes.length ? "Try another search or filter." : "Add a finding, lesson, or practical above. Your entries will remain available in this browser."}</p></div> : (
        <div className="notes-grid">{visible.map((n) => (
          <article className="card note-card" key={n.id}>
            <div className="note-card-top"><span className={`badge ${n.type === "Finding" ? "badge-amber" : n.type === "Practical" ? "badge-cyan" : "badge-green"}`}>{n.type}</span><time>{n.date}</time></div>
            <h3>{n.title}</h3>
            {(n.target || n.severity) && <p className="note-meta">{n.target && <span>{n.target}</span>}{n.type === "Finding" && <span className="badge">{n.severity}</span>}</p>}
            <p className="note-summary">{n.summary}</p>
            {n.steps && <details className="note-detail"><summary>Procedure / steps</summary><p>{n.steps}</p></details>}
            {n.evidence && <details className="note-detail"><summary>Evidence / result</summary><p>{n.evidence}</p></details>}
            {n.remediation && <details className="note-detail"><summary>Remediation / next step</summary><p>{n.remediation}</p></details>}
            {!!n.tags?.length && <div className="note-tags">{n.tags.map((tag) => <span className="badge" key={tag}>{tag}</span>)}</div>}
            <div className="note-actions"><button className="link-btn" onClick={() => edit(n)}>Edit</button><button className="link-btn note-delete" onClick={() => remove(n.id)}>Delete</button></div>
          </article>
        ))}</div>
      )}
    </section>
  );
}
