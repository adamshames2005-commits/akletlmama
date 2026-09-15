import { useEffect, useState } from "react";
import type { AuthUser } from "./features/auth/authApi";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminMealsPage from "./features/meals/pages/AdminMealsPage";
import HomePage from "./features/home/pages/HomePage";
import type { Meal } from "./features/meals/types/meal.types";
import AdminUsersPage from "./features/admin/pages/AdminUsersPage";
import AdminOrdersPage from "./features/admin/pages/AdminOrdersPage";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";

export type MenuFilter = "daily" | "all";
export type CustomerView = "home" | "menu";
export type AdminView = "dashboard" | "meals" | "users" | "orders";

export type OrderItem = {
  id: string;
  meal: Meal;
  size: "individual" | "smallPot" | "largePot";
  price: number;
};

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("akletlmama-user");
    return savedUser ? JSON.parse(savedUser) as AuthUser : null;
  });
  const [menuFilter, setMenuFilter] = useState<MenuFilter>("daily");
  const [customerView, setCustomerView] = useState<CustomerView>("home");
  const [orderItems, setOrderItems] = useState<OrderItem[]>(() => {
    const savedUser = localStorage.getItem("akletlmama-user");
    const userId = savedUser ? (JSON.parse(savedUser) as AuthUser).id : "guest";
    const savedOrder = localStorage.getItem(`akletlmama-cart-${userId}`);
    return savedOrder ? JSON.parse(savedOrder) as OrderItem[] : [];
  });
  const [adminView, setAdminView] = useState<AdminView>("meals");

  useEffect(() => {
    const key = `akletlmama-cart-${user?.id ?? "guest"}`;
    const savedCart = localStorage.getItem(key);
    setOrderItems(savedCart ? JSON.parse(savedCart) as OrderItem[] : []);
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("akletlmama-token");
    localStorage.removeItem("akletlmama-user");
    setUser(null);
    setOrderItems([]);
  };

  const addToOrder = (item: Omit<OrderItem, "id">) => {
    setOrderItems((currentItems) => {
      const updatedItems = [...currentItems, { ...item, id: `${item.meal._id}-${item.size}-${Date.now()}` }];
      const userId = user?.id ?? "guest";
      localStorage.setItem(`akletlmama-cart-${userId}`, JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const removeFromCart = (id: string) => {
    setOrderItems((currentItems) => {
      const updatedItems = currentItems.filter((item) => item.id !== id);
      localStorage.setItem(`akletlmama-cart-${user?.id ?? "guest"}`, JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const clearCart = () => {
    setOrderItems([]);
    localStorage.removeItem(`akletlmama-cart-${user?.id ?? "guest"}`);
  };

  if (user?.role === "admin") {
    return (
      <AdminLayout onLogout={handleLogout} activeView={adminView} onViewChange={setAdminView}>
        {adminView === "dashboard" && <AdminDashboardPage />}
        {adminView === "meals" && <AdminMealsPage />}
        {adminView === "users" && <AdminUsersPage />}
        {adminView === "orders" && <AdminOrdersPage />}
      </AdminLayout>
    );
  }

  return (
    <CustomerLayout
      onAuthenticated={setUser}
      menuFilter={menuFilter}
      onMenuFilterChange={setMenuFilter}
      customerView={customerView}
      onCustomerViewChange={setCustomerView}
      orderItems={orderItems}
      onRemoveFromCart={removeFromCart}
      onOrderPlaced={clearCart}
    >
      {({ onRequireLogin }) => (
        <HomePage
          menuFilter={menuFilter}
          onMenuFilterChange={setMenuFilter}
          customerView={customerView}
          onCustomerViewChange={setCustomerView}
          isAuthenticated={Boolean(user)}
          onRequireLogin={onRequireLogin}
          onAddToOrder={addToOrder}
        />
      )}
    </CustomerLayout>
  );
}

export default App;