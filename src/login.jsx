function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setBusy(true);
    setError("");
    try {
      const user = await apiPost("/api/login", { username: username.trim(), password });
      onLogin(user);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="app-title login-title">DT Classroom <span>Helper</span></h1>
        <p className="app-sub" style={{ marginBottom: 24 }}>Sign in to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="login-error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={busy} style={{ justifyContent: "center", marginTop: 4 }}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="login-hint">Ask your teacher if you've forgotten your login.</p>
      </div>
    </div>
  );
}
