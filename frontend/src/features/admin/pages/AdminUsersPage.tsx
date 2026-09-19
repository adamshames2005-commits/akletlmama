import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUser, type AdminUser } from "../../auth/api/userApi";
import "./AdminUsersPage.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { getUsers().then(setUsers).catch((reason: Error) => setError(reason.message)); }, []);
  const edit = async (user: AdminUser) => {
    const name = window.prompt("User name", user.name);
    if (!name || name === user.name) return;
    const updated = await updateUser(user.id, { name });
    setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
  };
  const remove = async (user: AdminUser) => {
    if (!window.confirm(`Delete ${user.name}'s account?`)) return;
    await deleteUser(user.id);
    setUsers((current) => current.filter((item) => item.id !== user.id));
  };
  return <section className="admin-page"><div className="admin-content"><div className="page-header"><h1>Users</h1><p>Manage customer accounts and contact details.</p></div><div className="admin-card"><p className="admin-feedback">{error}</p><table className="admin-data-table"><thead><tr><th>Name</th><th>Phone</th><th>Role</th><th>Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.phone}</td><td>{user.role}</td><td><button className="btn btn-edit" onClick={() => void edit(user)}>Edit</button><button className="btn btn-delete" onClick={() => void remove(user)}>Delete</button></td></tr>)}</tbody></table></div></div></section>;
}
