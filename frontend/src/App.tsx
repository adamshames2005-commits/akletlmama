import { useState } from "react";
import type { AuthUser } from "./features/auth/authApi";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminMealsPage from "./features/meals/pages/AdminMealsPage";
import HomePage from "./features/home/pages/HomePage";

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("akletlmama-user");
    return savedUser ? JSON.parse(savedUser) as AuthUser : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("akletlmama-token");
    localStorage.removeItem("akletlmama-user");
    setUser(null);
  };

  if (user?.role === "admin") {
    return (
      <AdminLayout onLogout={handleLogout}>
        <AdminMealsPage />
      </AdminLayout>
    );
  }

  return (
    <CustomerLayout onAuthenticated={setUser}>
      <HomePage />
    </CustomerLayout>
  );
}

export default App;