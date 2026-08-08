function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
  }

  function toggle() {
    setOpen((o) => !o);
    reset();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Fill in all three fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }
    setBusy(true);
    try {
      await apiPost("/api/change-password", { currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="change-password-wrap">
      <button type="button" className="btn-text" onClick={toggle}>
        <IconGlyph name="Key" size={15} /> Change password
      </button>
      {open && (
        <div className="change-password-panel no-print">
          {success ? (
            <p className="change-password-success">Password updated ✓</p>
          ) : (
            <form onSubmit={handleSubmit} className="change-password-form">
              <label>
                <span>Current password</span>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoFocus />
              </label>
              <label>
                <span>New password</span>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </label>
              <label>
                <span>Confirm new password</span>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </label>
              {error && <p className="login-error">{error}</p>}
              <div className="change-password-actions">
                <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Update password"}</button>
                <button className="btn-text" type="button" onClick={toggle}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
