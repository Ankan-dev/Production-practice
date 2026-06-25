import { FormEvent, useEffect, useState } from "react";
import { api } from "./api";
import type { User } from "./types";

const USER_KEY = "auth_practice_user";

function App() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.me()
      .then(({ user: sessionUser }) => {
        setUser(sessionUser);
        localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      })
      .catch(() => {
        localStorage.removeItem(USER_KEY);
        setUser(null);
      });
  }, []);

  const saveSession = (nextUser: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Clear local state even if the request fails.
    }

    localStorage.removeItem(USER_KEY);
    setUser(null);
    setMessage("");
  };

  const handleAuthSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response =
        mode === "register"
          ? await api.register(authForm)
          : await api.login({ email: authForm.email, password: authForm.password });

      saveSession(response.user);
      setAuthForm({ name: "", email: "", password: "" });
      setMessage(mode === "login" ? "Logged in successfully" : "Account created successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="page">
        <section className="card auth-card">
          <h1>Auth Practice</h1>
          <p>Small MERN + TypeScript app for register, login, logout, and session deployment practice.</p>

          <div className="tabs">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="stack">
            {mode === "register" && (
              <input
                placeholder="Name"
                value={authForm.name}
                onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          {message && <p className="message error">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card app-card">
        <header className="header">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p>You are signed in as {user.email}</p>
          </div>
          <button className="secondary" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="profile-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> Authenticated</p>
        </div>

        {message && <p className="message success">{message}</p>}
      </section>
    </main>
  );
}

export default App;
