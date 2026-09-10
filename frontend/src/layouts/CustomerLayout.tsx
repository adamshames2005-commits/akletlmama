import type { ReactNode } from "react";
import "./CustomerLayout.css";

type CustomerLayoutProps = {
  children: ReactNode;
};

export default function CustomerLayout({
  children,
}: CustomerLayoutProps) {
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

            <div className="customer-avatar">
              MJ
            </div>
          </div>

        </header>

        <main className="customer-main">
          {children}
        </main>

      </div>

    </div>
  );
}