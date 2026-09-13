import { useState, type ReactNode } from "react";
import { login, signUp, type AuthUser } from "../features/auth/authApi";
import { createOrder } from "../features/orders/orderApi";
import type { CustomerView, MenuFilter, OrderItem } from "../App";
import "./CustomerLayout.css";

type CustomerLayoutProps = Readonly<{
  children: (actions: { onRequireLogin: () => void }) => ReactNode;
  onAuthenticated?: (user: AuthUser) => void;
  menuFilter: MenuFilter;
  onMenuFilterChange: (filter: MenuFilter) => void;
  customerView: CustomerView;
  onCustomerViewChange: (view: CustomerView) => void;
  orderItems: OrderItem[];
  onRemoveFromCart: (id: string) => void;
  onOrderPlaced: () => void;
}>;

export default function CustomerLayout({
  children,
  onAuthenticated,
  menuFilter,
  onMenuFilterChange,
  customerView,
  onCustomerViewChange,
  orderItems,
  onRemoveFromCart,
  onOrderPlaced,
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
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthError("");
    setName("");
    setPhone("");
    setPassword("");
  };

  const requestLogin = () => {
    if (!user) openAuth("login");
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

  const cartTotal = orderItems.reduce((total, item) => total + item.price, 0);
  const handlePlaceOrder = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setCheckoutError("");
    setIsOrdering(true);
    try {
      await createOrder(orderItems, location, alternatePhone);
      onOrderPlaced();
      setIsCheckoutOpen(false);
      setIsOrderOpen(false);
      setLocation("");
      setAlternatePhone("");
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Could not place order");
    } finally {
      setIsOrdering(false);
    }
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
            <button className={customerView === "home" ? "active" : ""} type="button" onClick={() => onCustomerViewChange("home")}>
              🏠 <span>Home</span>
            </button>

            <button className={customerView === "menu" && menuFilter === "daily" ? "active" : ""} type="button" onClick={() => { onMenuFilterChange("daily"); onCustomerViewChange("menu"); }}>
              🍲 <span>Today's Menu</span>
            </button>

            <button className={customerView === "menu" && menuFilter === "all" ? "active" : ""} type="button" onClick={() => { onMenuFilterChange("all"); onCustomerViewChange("menu"); }}>
              🍴 <span>All Meals</span>
            </button>

            <button type="button">
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
            <button type="button" onClick={() => user ? setIsOrderOpen((isOpen) => !isOpen) : requestLogin()} aria-label={`Open cart, ${orderItems.length} items`}>
              🛒{orderItems.length > 0 && <span className="order-count">{orderItems.length}</span>}
            </button>
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
          {children({ onRequireLogin: requestLogin })}
        </main>

        {isOrderOpen && user && (
          <aside className="order-panel" aria-label="Your cart">
            <div className="order-panel-header">
              <h2>Your cart</h2>
              <button type="button" onClick={() => setIsOrderOpen(false)} aria-label="Close order">×</button>
            </div>
            {orderItems.length === 0 ? <p>Your cart is empty.</p> : orderItems.map((item) => (
              <div className="order-item" key={item.id}>
                <span>{item.meal.name} <small>{item.size}</small></span>
                <span><strong>${item.price}</strong><button type="button" onClick={() => onRemoveFromCart(item.id)} aria-label={`Remove ${item.meal.name}`}>Remove</button></span>
              </div>
            ))}
            {orderItems.length > 0 && <div className="cart-total"><strong>Total</strong><strong>${cartTotal.toFixed(2)}</strong></div>}
            {orderItems.length > 0 && <button className="auth-submit" type="button" onClick={() => setIsCheckoutOpen(true)}>Order now</button>}
          </aside>
        )}

        {isCheckoutOpen && user && (
          <div className="auth-backdrop">
            <section className="auth-modal" aria-label="Complete your order">
              <button className="auth-close" type="button" onClick={() => setIsCheckoutOpen(false)} aria-label="Close">×</button>
              <span className="auth-eyebrow">Checkout</span>
              <h2>Where should we deliver?</h2>
              <p>Ordering as {user.name}. Total: ${cartTotal.toFixed(2)}</p>
              <form onSubmit={handlePlaceOrder}>
                <label><span>Location</span><input value={location} onChange={(event) => setLocation(event.target.value)} required minLength={3} placeholder="Street, building, area" /></label>
                <label><span>Another phone number (optional)</span><input value={alternatePhone} onChange={(event) => setAlternatePhone(event.target.value)} inputMode="tel" placeholder={user.phone} /></label>
                {checkoutError && <p className="auth-error" role="alert">{checkoutError}</p>}
                <button className="auth-submit" type="submit" disabled={isOrdering}>{isOrdering ? "Placing order..." : `Place order · $${cartTotal.toFixed(2)}`}</button>
              </form>
            </section>
          </div>
        )}

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