function App() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = logged out

  useEffect(() => {
    apiGet("/api/me").then(setUser).catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    try { await apiPost("/api/logout", {}); } catch (e) { /* ignore */ }
    setUser(null);
  }

  if (user === undefined) {
    return <div className="loading-screen">Loading DT Classroom Helper&hellip;</div>;
  }
  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }
  if (user.role === "admin") {
    return <AdminConsole user={user} onLogout={handleLogout} />;
  }
  return <StudentApp user={user} onLogout={handleLogout} />;
}

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
