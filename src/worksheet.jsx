function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("load-failed"));
    document.body.appendChild(s);
  });
}

function WorksheetTab({ simpleMode, currentUser }) {
  const [fwKey, setFwKey] = useState("accessfm");
  const [mode, setMode] = useState("create");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [answers, setAnswers] = useState({});
  const [helpOpen, setHelpOpen] = useState({});
  const [exportState, setExportState] = useState({ pdf: "idle", word: "idle" });
  const [currentId, setCurrentId] = useState(null);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [savedList, setSavedList] = useState([]);
  const [savedListOpen, setSavedListOpen] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [availableTasks, setAvailableTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const textareaRefs = useRef({});
  const fw = FRAMEWORKS[fwKey];

  useEffect(() => {
    apiGet("/api/tasks/available").then(setAvailableTasks).catch(() => {});
  }, []);

  function refreshSavedList() {
    apiGet("/api/submissions").then(setSavedList).catch(() => {});
  }
  useEffect(() => { refreshSavedList(); }, []);

  function setAnswer(id, val) {
    setAnswers((a) => ({ ...a, [id]: val }));
    setSaveState("idle");
  }

  function insertText(id, text) {
    setAnswers((a) => {
      const existing = a[id] || "";
      const next = existing.trim() ? existing.replace(/\s+$/, "") + " " + text : text;
      return { ...a, [id]: next };
    });
    setSaveState("idle");
    const ta = textareaRefs.current[id];
    if (ta) { ta.focus(); setTimeout(() => { try { ta.selectionStart = ta.selectionEnd = ta.value.length; } catch (e) {} }, 0); }
  }

  function toggleHelp(id) { setHelpOpen((h) => ({ ...h, [id]: !h[id] })); }

  function startFresh(newFwKey, newMode) {
    setFwKey(newFwKey);
    setMode(newMode);
    setProductName("");
    setBrand("");
    setAnswers({});
    setCurrentId(null);
    setCurrentFeedback("");
    setActiveTask(null);
    setSaveState("idle");
  }

  function handleNewWorksheet() {
    const hasContent = productName.trim() || Object.values(answers).some((a) => a && a.trim());
    const hasUnsavedChanges = hasContent && saveState !== "saved";
    if (hasUnsavedChanges && !window.confirm("Start a new blank worksheet? Any unsaved changes to this one will be lost. (Already-saved worksheets are safe in \"My saved work\".)")) {
      return;
    }
    startFresh(fwKey, mode);
  }

  async function startTask(taskSummary) {
    try {
      const full = await apiGet(`/api/tasks/${taskSummary.id}`);
      setFwKey(full.framework);
      setMode(full.taskType === "image" ? "analyze" : "create");
      setProductName(full.title);
      setBrand("");
      setAnswers({});
      setCurrentId(null);
      setCurrentFeedback("");
      setSaveState("idle");
      setActiveTask(full);
    } catch (e) { /* ignore */ }
  }

  async function openSaved(item) {
    try {
      const full = await apiGet(`/api/submissions/${item.id}`);
      setFwKey(full.framework);
      setMode(full.toolMode);
      setProductName(full.productName || "");
      setBrand(full.brand || "");
      setAnswers(full.answers || {});
      setCurrentId(full.id);
      setCurrentFeedback(full.feedback || "");
      setActiveTask(null);
      setSaveState("idle");
      setSavedListOpen(false);
    } catch (e) { /* ignore */ }
  }

  async function deleteSaved(item, ev) {
    ev.stopPropagation();
    if (!window.confirm(`Delete "${item.productName || "Untitled"}"? This can't be undone.`)) return;
    try {
      await apiDelete(`/api/submissions/${item.id}`);
      if (currentId === item.id) { setCurrentId(null); }
      refreshSavedList();
    } catch (e) { /* ignore */ }
  }

  async function handleSave(asNew) {
    setSaveState("saving");
    try {
      if (currentId && !asNew) {
        await apiPut(`/api/submissions/${currentId}`, { productName, brand, answers });
      } else {
        const created = await apiPost("/api/submissions", { toolMode: mode, framework: fwKey, productName, brand, answers, taskId: activeTask ? activeTask.id : null });
        setCurrentId(created.id);
      }
      setSaveState("saved");
      refreshSavedList();
    } catch (e) {
      setSaveState("error");
    }
  }

  const heading = mode === "analyze" ? `${fw.label} Product Analysis` : `${fw.label} Design Worksheet`;
  const filenameBase = `${(productName || "worksheet").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${fwKey}-${mode}`;

  function getItemText(item) {
    const q = simpleMode ? item.simple : (mode === "analyze" ? item.analyzePrompt : item.prompt);
    const a = answers[item.id] || "(no answer yet)";
    return { q, a };
  }

  async function handleExportPDF() {
    setExportState((s) => ({ ...s, pdf: "busy" }));
    try {
      if (!window.jspdf) {
        await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const marginX = 50;
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const maxWidth = pageW - marginX * 2;
      let y = 56;

      doc.setFont("helvetica", "bold"); doc.setFontSize(19); doc.setTextColor(22, 50, 79);
      doc.text(heading, marginX, y); y += 26;

      doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(90, 100, 110);
      doc.text(`Name: ${currentUser.displayName}`, marginX, y); y += 15;
      doc.text(`Product: ${productName || "\u2014"}`, marginX, y); y += 15;
      if (mode === "analyze") { doc.text(`Made by: ${brand || "\u2014"}`, marginX, y); y += 15; }
      y += 8;
      doc.setDrawColor(216, 211, 196);
      doc.line(marginX, y, pageW - marginX, y);
      y += 22;

      fw.items.forEach((item) => {
        const { q, a } = getItemText(item);
        const qLines = doc.splitTextToSize(q, maxWidth);
        const aLines = doc.splitTextToSize(a, maxWidth);
        const blockHeight = 20 + qLines.length * 13 + 6 + aLines.length * 14 + 16;
        if (y + blockHeight > pageH - 48) { doc.addPage(); y = 56; }

        doc.setFont("helvetica", "bold"); doc.setFontSize(12.5); doc.setTextColor(22, 50, 79);
        doc.text(`${item.letter} \u2014 ${item.word}`, marginX, y); y += 17;

        doc.setFont("helvetica", "italic"); doc.setFontSize(10); doc.setTextColor(90, 100, 110);
        doc.text(qLines, marginX, y); y += qLines.length * 13 + 6;

        doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(30, 34, 38);
        doc.text(aLines, marginX, y); y += aLines.length * 14 + 20;
      });

      doc.save(`${filenameBase}.pdf`);
      setExportState((s) => ({ ...s, pdf: "idle" }));
    } catch (e) {
      setExportState((s) => ({ ...s, pdf: "error" }));
    }
  }

  function handleExportWord() {
    setExportState((s) => ({ ...s, word: "busy" }));
    try {
      let body = `<h1 style="font-family:Calibri,Arial,sans-serif;color:#16324F;font-size:22pt;margin-bottom:4pt;">${heading}</h1>`;
      body += `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#444;">Name: ${currentUser.displayName}</p>`;
      body += mode === "analyze"
        ? `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#444;">Product analysed: ${productName || "\u2014"}<br/>Made by: ${brand || "\u2014"}</p>`
        : `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#444;">Product: ${productName || "\u2014"}</p>`;
      body += `<hr style="border:none;border-top:1px solid #D8D3C4;margin:14pt 0;"/>`;

      fw.items.forEach((item) => {
        const { q, a } = getItemText(item);
        body += `<h3 style="font-family:Calibri,Arial,sans-serif;color:${fw.tint};font-size:13pt;margin-bottom:2pt;">${item.letter} \u2014 ${item.word}</h3>`;
        body += `<p style="font-family:Calibri,Arial,sans-serif;font-size:10pt;color:#666;font-style:italic;margin:0 0 4pt 0;">${q}</p>`;
        body += `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#222;margin:0 0 12pt 0;">${(a || "").replace(/\n/g, "<br/>")}</p>`;
      });

      const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset="utf-8"><title>${heading}</title></head><body>${body}</body></html>`;

      const blob = new Blob(["\ufeff", html], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${filenameBase}.doc`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      setExportState((s) => ({ ...s, word: "idle" }));
    } catch (e) {
      setExportState((s) => ({ ...s, word: "error" }));
    }
  }

  return (
    <div className="tab-panel">
      <div className="panel-head no-print">
        <div>
          <h2>Worksheet</h2>
          <p className="sub">
            {mode === "analyze" ? <>Use {fw.label} to analyse an existing product.</> : <>Apply {fw.label} to your own product idea.</>}{" "}
            Tap <IconGlyph name="Lightbulb" size={12} style={{ verticalAlign: "-1px" }} /> for words or starter ideas.
          </p>
        </div>
        <FrameworkToggle value={fwKey} onChange={(k) => startFresh(k, mode)} />
      </div>

      <div className="mode-toggle no-print" role="tablist" aria-label="Design or analyse">
        <button role="tab" aria-selected={mode === "create"} className={"mode-toggle-btn" + (mode === "create" ? " active" : "")} onClick={() => startFresh(fwKey, "create")}>
          <IconGlyph name="PenLine" size={15} /> Design my own idea
        </button>
        <button role="tab" aria-selected={mode === "analyze"} className={"mode-toggle-btn" + (mode === "analyze" ? " active" : "")} onClick={() => startFresh(fwKey, "analyze")}>
          <IconGlyph name="Search" size={15} /> Analyse an existing product
        </button>
        <button type="button" className="mode-toggle-btn saved-toggle" onClick={() => setSavedListOpen((o) => !o)}>
          <IconGlyph name="ClipboardList" size={15} /> My saved work ({savedList.length})
        </button>
        <button type="button" className="mode-toggle-btn" onClick={handleNewWorksheet}>
          <IconGlyph name="PenLine" size={15} /> New worksheet
        </button>
      </div>

      {availableTasks.length > 0 && !activeTask && (
        <div className="task-picker no-print">
          <span className="quiz-history-label">Assigned &amp; practice tasks from your teacher</span>
          <div className="task-picker-list">
            {availableTasks.map((t) => (
              <button type="button" key={t.id} className="task-picker-card" onClick={() => startTask(t)}>
                {t.imageUrl && <img src={t.imageUrl} alt={t.title} className="task-picker-thumb" />}
                <span className="task-picker-info">
                  <span className="task-picker-title">
                    {t.title} {t.isPracticeBank && <span className="needs-marking-badge" style={{ background: "#EDF5EE", color: "#2A5B37" }}>practice</span>}
                  </span>
                  {t.dueAt && <span className="mono">Due {t.dueAt}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTask && (
        <div className="task-active-banner no-print">
          <div className="task-active-head">
            <span className="worksheet-feedback-label">Task: {activeTask.title}</span>
            <button type="button" className="btn-text" onClick={() => setActiveTask(null)}>Clear task</button>
          </div>
          {activeTask.imageUrl && <img src={activeTask.imageUrl} alt={activeTask.title} className="task-active-image" />}
          {activeTask.instructions && <p>{activeTask.instructions}</p>}
        </div>
      )}

      <p className="worksheet-editing-status sub no-print">
        {currentId
          ? <>Editing a saved worksheet{productName ? <> — <strong>{productName}</strong></> : null}. Changes save to this same one unless you use "New worksheet" or "Save as new copy".</>
          : <>Starting a new, unsaved worksheet{productName ? <> — <strong>{productName}</strong></> : null}.</>}
      </p>

      {savedListOpen && (
        <div className="saved-panel no-print">
          {savedList.length === 0 && <p className="sub">Nothing saved yet — fill in a worksheet below and hit Save.</p>}
          {savedList.map((item) => (
            <div className="saved-row" key={item.id} onClick={() => openSaved(item)}>
              <span className="saved-row-fw" style={{ color: FRAMEWORKS[item.framework].tint }}>{FRAMEWORKS[item.framework].label}</span>
              <span className="saved-row-name">{item.productName || "Untitled"}{item.feedback && <IconGlyph name="Lightbulb" size={13} style={{ color: "#8A6A1E", marginLeft: 6, verticalAlign: "-2px" }} />}</span>
              <span className="saved-row-mode">{item.toolMode === "analyze" ? "Analysis" : "Design"}</span>
              <span className="saved-row-date mono">{formatDate(item.updatedAt)}</span>
              <button type="button" className="saved-row-delete" onClick={(e) => deleteSaved(item, e)} aria-label="Delete"><IconGlyph name="Trash2" size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {currentFeedback && (
        <div className="worksheet-feedback-callout no-print">
          <IconGlyph name="Lightbulb" size={16} style={{ color: "#8A6A1E" }} />
          <div>
            <span className="worksheet-feedback-label">Feedback from your teacher</span>
            <p>{currentFeedback}</p>
          </div>
        </div>
      )}

      <div className="worksheet-sheet">
        <div className="worksheet-meta">
          <label>
            <span>{mode === "analyze" ? "Product you're analysing" : "Product / project"}</span>
            <input value={productName} onChange={(e) => { setProductName(e.target.value); setSaveState("idle"); }} placeholder={mode === "analyze" ? "e.g. Dyson Airwrap" : "e.g. Reusable coffee cup"} />
          </label>
          {mode === "analyze" && (
            <label>
              <span>Made by (optional)</span>
              <input value={brand} onChange={(e) => { setBrand(e.target.value); setSaveState("idle"); }} placeholder="e.g. Dyson" />
            </label>
          )}
          <span className="worksheet-fw-label" style={{ color: fw.tint }}>{fw.label}</span>
        </div>

        <div className="worksheet-items">
          {fw.items.map((item) => {
            const promptText = simpleMode ? item.simple : (mode === "analyze" ? item.analyzePrompt : item.prompt);
            const starters = mode === "analyze" ? item.analyzeStarters : item.starters;
            const isHelpOpen = !!helpOpen[item.id];
            return (
              <div className="worksheet-item" key={item.id}>
                <LetterBadge letter={item.letter} tint={fw.tint} size={36} />
                <div className="worksheet-item-body">
                  <span className="worksheet-item-title">
                    <IconGlyph name={item.icon} size={15} className="worksheet-item-icon" style={{ color: fw.tint }} />
                    {item.word}
                  </span>
                  <span className="worksheet-item-prompt-row">
                    <span className="worksheet-item-prompt">{promptText}</span>
                    <span className="worksheet-item-controls no-print">
                      <SpeakBtn text={promptText} label={`Read question for ${item.word}`} />
                      <button type="button" className={"help-toggle" + (isHelpOpen ? " active" : "")} onClick={() => toggleHelp(item.id)}>
                        <IconGlyph name="Lightbulb" size={14} /> Help <IconGlyph name="ChevronDown" size={13} className={"chevron" + (isHelpOpen ? " up" : "")} />
                      </button>
                    </span>
                  </span>

                  {isHelpOpen && (
                    <div className="help-panel no-print">
                      <div className="help-block">
                        <span className="help-label">Useful words — tap to add one</span>
                        <div className="chip-row">
                          {item.wordbank.map((w) => (<button key={w} type="button" className="chip chip-word" onClick={() => insertText(item.id, w)}>{w}</button>))}
                        </div>
                      </div>
                      <div className="help-block">
                        <span className="help-label">Stuck? Try a sentence starter</span>
                        <div className="chip-row">
                          {starters.map((s) => (<button key={s} type="button" className="chip chip-starter" onClick={() => insertText(item.id, s)}>{s}</button>))}
                        </div>
                      </div>
                    </div>
                  )}

                  <textarea
                    ref={(el) => { textareaRefs.current[item.id] = el; }}
                    rows={3}
                    value={answers[item.id] || ""}
                    onChange={(e) => setAnswer(item.id, e.target.value)}
                    placeholder="Type your answer here..."
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="worksheet-actions no-print">
        <button className="btn-primary" onClick={() => handleSave(false)} disabled={saveState === "saving"}>
          <IconGlyph name="Download" size={18} /> {saveState === "saving" ? "Saving..." : currentId ? "Save changes" : "Save my work"}
        </button>
        {currentId && (
          <button className="btn-secondary" onClick={() => handleSave(true)} disabled={saveState === "saving"}>Save as new copy</button>
        )}
        <span className="save-status mono">
          {saveState === "saved" && "Saved \u2713"}
          {saveState === "error" && "Couldn't save \u2014 check your connection"}
        </span>
      </div>

      <div className="worksheet-actions no-print" style={{ paddingTop: 0 }}>
        <button className="btn-secondary" onClick={handleExportPDF} disabled={exportState.pdf === "busy"}>
          <IconGlyph name="FileDown" size={16} /> {exportState.pdf === "busy" ? "Preparing PDF..." : "Export as PDF"}
        </button>
        <button className="btn-secondary" onClick={handleExportWord} disabled={exportState.word === "busy"}>
          <IconGlyph name="FileDown" size={16} /> {exportState.word === "busy" ? "Preparing..." : "Export as Word (.doc)"}
        </button>
        <button className="btn-text" onClick={() => window.print()}><IconGlyph name="Printer" size={15} /> Print instead</button>
      </div>
      {exportState.pdf === "error" && <p className="export-error no-print">Couldn't generate the PDF (needs an internet connection to load once). Try "Print instead".</p>}
      {exportState.word === "error" && <p className="export-error no-print">Something went wrong creating the Word file. Try again, or use "Print instead".</p>}
    </div>
  );
}
