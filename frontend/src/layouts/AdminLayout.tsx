import "./AdminLayout.css";

type AdminLayoutProps = {
  children: React.ReactNode;
  onLogout?: () => void;
};

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <div>
          <div className="admin-brand">
            <span className="brand-icon">🌱</span>
            <h2>AkletLmama</h2>
            <p>Good Food, Brighter Days</p>
          </div>

          <nav className="admin-nav">
            <button>⌂ <span>Dashboard</span></button>

            <button className="active">
              🍴 <span>Meals</span>
            </button>

            <button>▣ <span>Daily Menu</span></button>
            <button>🛒 <span>Orders</span></button>
            <button>♙ <span>Subscriptions</span></button>
          </nav>
        </div>

        <div className="sidebar-footer">
          🌿
          <span>Homemade<br />with love</span>
        </div>
      </aside>

      <div className="admin-right">

        <header className="admin-topbar">
          <div className="topbar-actions">
            <button className="icon-button">🔔</button>

            <button className="admin-avatar" type="button" onClick={onLogout} title="Log out">
              MJ
            </button>

            <span>Admin</span>
          </div>
        </header>

        <main className="admin-main">
          {children}
        </main>

      </div>

    </div>
  );
}