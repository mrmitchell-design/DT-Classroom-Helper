function TaskBuilder({ onSaved, onCancel }) {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("written");
  const [framework, setFramework] = useState("accessfm");
  const [instructions, setInstructions] = useState("");
  const [isPracticeBank, setIsPracticeBank] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!title.trim()) { setError("Give the task a title."); return; }
    if (taskType === "image" && !imageFile) { setError("Choose an image to upload for an image task."); return; }
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("taskType", taskType);
      formData.append("framework", framework);
      formData.append("instructions", instructions.trim());
      formData.append("isPracticeBank", isPracticeBank ? "true" : "false");
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/admin/tasks", { method: "POST", credentials: "same-origin", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Could not create task.");
      onSaved(body);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="qb-builder">
      <div className="qb-meta">
        <label>
          <span>Task title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Analyse this kettle" autoFocus />
        </label>
        <label>
          <span>Task type</span>
          <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
            <option value="written">Written task (a prompt to respond to)</option>
            <option value="image">Image task (upload a photo to analyse)</option>
          </select>
        </label>
        <label>
          <span>Framework</span>
          <select value={framework} onChange={(e) => setFramework(e.target.value)}>
            <option value="accessfm">ACCESSFM</option>
            <option value="scamper">SCAMPER</option>
          </select>
        </label>
        <label>
          <span>Instructions {taskType === "image" ? "(optional, shown alongside the photo)" : ""}</span>
          <textarea rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="What should students do?" />
        </label>
        {taskType === "image" && (
          <label>
            <span>Upload image</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} />
          </label>
        )}
        {imagePreview && <img src={imagePreview} alt="Preview" className="qb-image-preview" />}
        <label className="qb-checkbox-label">
          <input type="checkbox" checked={isPracticeBank} onChange={(e) => setIsPracticeBank(e.target.checked)} />
          <span>Practice bank — any student can do this any time (in addition to any class you assign it to)</span>
        </label>
      </div>

      {error && <p className="login-error">{error}</p>}
      <div className="qb-save-row">
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Create task"}</button>
        <button type="button" className="btn-text" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function TaskManagerPanel() {
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  function load() {
    setLoading(true);
    Promise.all([apiGet("/api/admin/tasks"), apiGet("/api/admin/task-assignments"), apiGet("/api/admin/classes")])
      .then(([t, a, c]) => { setTasks(t); setAssignments(a); setClassGroups(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleDelete(task) {
    if (!window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    try { await apiDelete(`/api/admin/tasks/${task.id}`); load(); } catch (e) { /* ignore */ }
  }

  async function handleAssign(taskId, payload) {
    await apiPost("/api/admin/task-assignments", { taskId, ...payload });
    load();
  }

  async function handleUnassign(assignmentId) {
    await apiDelete(`/api/admin/task-assignments/${assignmentId}`);
    load();
  }

  if (creating) {
    return (
      <div className="tab-content admin-content">
        <div className="panel-head"><div><h2>New task</h2></div></div>
        <TaskBuilder onSaved={() => { setCreating(false); load(); }} onCancel={() => setCreating(false)} />
      </div>
    );
  }

  return (
    <div className="tab-content admin-content">
      <div className="panel-head">
        <div>
          <h2>Tasks</h2>
          <p className="sub">Assign a specific written or image-analysis task to a class, or add it to the practice bank.</p>
        </div>
        <button className="btn-primary" onClick={() => setCreating(true)}><IconGlyph name="UserPlus" size={18} /> New task</button>
      </div>

      {loading && <p className="sub">Loading...</p>}
      {!loading && tasks.length === 0 && <p className="sub">No tasks yet.</p>}

      <div className="qb-set-list">
        {tasks.map((task) => {
          const taskAssignments = assignments.filter((a) => a.taskId === task.id);
          const isOpen = expandedId === task.id;
          return (
            <div className="qb-set-card" key={task.id}>
              <div className="qb-set-head" onClick={() => setExpandedId(isOpen ? null : task.id)}>
                <span className="qb-set-name">
                  <IconGlyph name={task.taskType === "image" ? "Palette" : "PenLine"} size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                  {task.title} {task.isPracticeBank && <span className="needs-marking-badge" style={{ background: "#EDF5EE", color: "#2A5B37" }}>practice bank</span>}
                </span>
                <span className="mono">{FRAMEWORKS[task.framework] ? FRAMEWORKS[task.framework].label : task.framework}</span>
                <IconGlyph name="ChevronDown" size={14} className={"chevron" + (isOpen ? " up" : "")} />
              </div>
              {isOpen && (
                <div className="qb-set-body">
                  {task.imageUrl && <img src={task.imageUrl} alt={task.title} className="qb-image-preview" />}
                  {task.instructions && <p className="sub">{task.instructions}</p>}
                  <div className="qb-set-actions">
                    <button type="button" className="btn-text" onClick={() => handleDelete(task)}><IconGlyph name="Trash2" size={14} /> Delete</button>
                  </div>
                  <span className="help-label">Assign to a class</span>
                  <AssignPanel
                    itemLabel="task"
                    existingAssignments={taskAssignments}
                    onAssign={(payload) => handleAssign(task.id, payload)}
                    onUnassign={handleUnassign}
                    classGroups={classGroups}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
