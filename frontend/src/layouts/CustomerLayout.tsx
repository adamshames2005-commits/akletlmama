import { useState, type ReactNode } from "react";
import { login, signUp, type AuthUser } from "../features/auth/authApi";
import "./CustomerLayout.css";

type CustomerLayoutProps = Readonly<{
  children: ReactNode;
  onAuthenticated?: (user: AuthUser) => void;
}>;

export default function CustomerLayout({
  children,
  onAuthenticated,
}: CustomerLayoutProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("akletlmama-user");
    return savedUser ? JSON.parse(savedUser) as AuthUser : null;
  });
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthError("");
    setName("");
    setPhone("");
    setPassword("");
  };

  const handleAuth = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setAuthError("");
    if (!/^\+?\d{8,15}$/.test(phone.replace(/[\s()-]/g, ""))) {
      setAuthError("Enter a valid phone number with 8 to 15 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = authMode === "signup"
        ? await signUp(name, phone, password)
        : await login(phone, password);
      localStorage.setItem("akletlmama-token", result.token);
      localStorage.setItem("akletlmama-user", JSON.stringify(result.user));
      setUser(result.user);
      onAuthenticated?.(result.user);
      setAuthMode(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("akletlmama-token");
    localStorage.removeItem("akletlmama-user");
    setUser(null);
  };

  let authSubmitLabel = "Log in";
  if (isSubmitting) authSubmitLabel = "Please wait...";
  else if (authMode === "signup") authSubmitLabel = "Create account";

  return (
    <div className="customer-layout">

      <aside className="customer-sidebar">

        <div>
          <div className="customer-brand">
            <span>🌱</span>

            <div>
              <h2>AkletLmama</h2>
              <p>Good Food, Brighter Days</p>
            </div>
          </div>

          <nav className="customer-side-nav">
            <button className="active">
              🏠 <span>Home</span>
            </button>

            <button>
              🍲 <span>Today's Menu</span>
            </button>

            <button>
              🍴 <span>All Meals</span>
            </button>

            <button>
              📅 <span>Subscription</span>
            </button>
          </nav>
        </div>

        <div className="customer-sidebar-footer">
          <span>🌿</span>
          <p>
            Homemade
            <br />
            with love
          </p>
        </div>

      </aside>

      <div className="customer-right">

        <header className="customer-topbar">

          <div className="customer-topbar-message">
            What are we eating today?
          </div>

          <div className="customer-topbar-actions">
            <button>🛒</button>
            {user ? (
              <button className="customer-avatar" type="button" onClick={logout} title="Log out">
                {user.name.slice(0, 2).toUpperCase()}
              </button>
            ) : (
              <div className="customer-auth-actions">
                <button type="button" onClick={() => openAuth("login")}>Log in</button>
                <button className="customer-signup-button" type="button" onClick={() => openAuth("signup")}>Sign up</button>
              </div>
            )}
          </div>

        </header>

        <main className="customer-main">
          {children}
        </main>

        {authMode && (
          <div className="auth-backdrop">
            <section className="auth-modal" aria-label={authMode === "signup" ? "Create account" : "Log in"}>
              <button className="auth-close" type="button" onClick={() => setAuthMode(null)} aria-label="Close">×</button>
              <span className="auth-eyebrow">AkletLmama</span>
              <h2>{authMode === "signup" ? "Create your account" : "Welcome back"}</h2>
              <p>{authMode === "signup" ? "Save your details for easy homemade meals." : "Log in to continue your order."}</p>
              <form onSubmit={handleAuth}>
                {authMode === "signup" && (
                  <label>
                    <span>Name</span>
                    <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" />
                  </label>
                )}
                <label>
                  <span>Phone number</span>
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} required inputMode="tel" placeholder="+961 70 000 000" autoComplete="tel" />
                </label>
                <label>
                  <span>Password</span>
                  <input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} type="password" autoComplete={authMode === "signup" ? "new-password" : "current-password"} />
                </label>
                {authError && <p className="auth-error" role="alert">{authError}</p>}
                <button className="auth-submit" type="submit" disabled={isSubmitting}>
                  {authSubmitLabel}
                </button>
              </form>
              <button className="auth-switch" type="button" onClick={() => openAuth(authMode === "signup" ? "login" : "signup")}>
                {authMode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
              </button>
            </section>
          </div>
        )}

      </div>

    </div>
  );
}