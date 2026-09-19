import { useEffect, useState } from "react";
import { getMonthlyTotals, getOrders, type AdminOrder, type MonthlyTotal } from "../../orders/api/orderApi";
import "./AdminOrdersPage.css";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totals, setTotals] = useState<MonthlyTotal[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([getOrders(), getMonthlyTotals()]).then(([loadedOrders, loadedTotals]) => { setOrders(loadedOrders); setTotals(loadedTotals); }).catch((reason: Error) => setError(reason.message)); }, []);
  return <section className="admin-page"><div className="admin-content"><div className="page-header"><h1>Orders</h1><p>Track orders and monthly revenue.</p></div><div className="admin-card monthly-summary"><h2>Monthly totals</h2>{totals.map((item) => <div className="monthly-row" key={item._id}><strong>{item._id}</strong><span>{item.count} orders</span><b>${item.total.toFixed(2)}</b></div>)}</div><div className="admin-card"><p className="admin-feedback">{error}</p><table className="admin-data-table"><thead><tr><th>Customer</th><th>Phone</th><th>Location</th><th>Total</th><th>Date</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td>{order.customerName}</td><td>{order.customerPhone}</td><td>{order.deliveryLocation}</td><td>${order.total.toFixed(2)}</td><td>{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></div></section>;
}
