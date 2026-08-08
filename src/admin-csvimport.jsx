function CsvImportPanel({ onImported, onBanner }) {
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result || ""));
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!csvText.trim()) {
      setError("Paste CSV text or choose a file first.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await apiPost("/api/admin/users/import-csv", { csv: csvText });
      setResult(res);
      if (res.createdCount > 0) {
        onImported();
        onBanner({ text: `Imported ${res.createdCount} student${res.createdCount === 1 ? "" : "s"}${res.failedCount > 0 ? `, ${res.failedCount} row${res.failedCount === 1 ? "" : "s"} failed \u2014 see details below` : ""}.` });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="csv-import-panel no-print">
      <p className="sub">
        CSV needs a header row with at least <code>username</code> and <code>displayName</code> columns
        (<code>yearGroup</code>, <code>classGroup</code> and <code>password</code> are optional \u2014 leave password
        blank per row to auto-generate one).{" "}
        <a href="/api/admin/users/import-template.csv" className="csv-template-link">Download a template</a>
      </p>
      <div className="csv-import-controls">
        <input type="file" accept=".csv,text/csv" onChange={handleFile} />
        {fileName && <span className="mono">{fileName}</span>}
      </div>
      <textarea
        rows={4}
        value={csvText}
        onChange={(e) => { setCsvText(e.target.value); setResult(null); }}
        placeholder="Or paste CSV text directly here..."
      />
      {error && <p className="login-error">{error}</p>}
      <button type="button" className="btn-primary" onClick={handleImport} disabled={busy}>
        {busy ? "Importing..." : "Import students"}
      </button>

      {result && (
        <div className="csv-import-result">
          <p className="sub"><strong>{result.createdCount}</strong> created, <strong>{result.failedCount}</strong> failed.</p>
          {result.created.length > 0 && (
            <div className="csv-import-created">
              {result.created.map((c) => (
                <div key={c.username} className="mono">{c.username}: {c.temporaryPassword}</div>
              ))}
            </div>
          )}
          {result.failed.length > 0 && (
            <div className="csv-import-failed">
              {result.failed.map((f) => (
                <div key={f.row} className="mono">Row {f.row} ({f.username || "?"}): {f.error}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
