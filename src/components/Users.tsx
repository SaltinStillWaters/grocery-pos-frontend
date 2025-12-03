import { useState, useEffect } from "react";
import { API_URL, type Role, type User, useCurrentUser } from "../utils";
import axios from "axios";
import { RolesDisplay, RolesEdit } from "./sub-components/RolesDisplay";
import { EditableCell } from "./sub-components/EditableCell";

export default function Users() {
  const user = useCurrentUser();

  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const [changes, setChanges] = useState<Record<string, Partial<User>>>({});

  function handleChange(user_id: string, value: any, property: keyof User) {
    setChanges((prev) => {
      const userChanges = { ...prev[user_id], [property]: value };
      if (value === "" || value === null) delete userChanges[property];

      const newChanges = { ...prev, [user_id]: userChanges };
      if (Object.keys(userChanges).length === 0) delete newChanges[user_id];

      return newChanges;
    });
  }

  async function handleSave(changes: Record<string, Partial<User>>) {
    setLoading(true);
    const updates = Object.entries(changes).map(([_id, update]) => ({
      _id,
      update,
    }));

    try {
      const res = await axios.patch(
        `${API_URL}/users`,
        { updates },
        { withCredentials: true }
      );
      await fetchUsers();
      console.log({ res });
    } catch (err) {
      console.log({ err });
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    setChanges({});
    fetchUsers();
  }

  const [editingCell, setEditingCell] = useState<{
    userId: string;
    property: keyof User;
  } | null>(null);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <button
        onClick={() => handleSave(changes)}
        disabled={loading || !Object.keys(changes).length}
      >
        Save
      </button>
      <button
        onClick={handleCancel}
        disabled={loading || !Object.keys(changes).length}
      >
        Cancel
      </button>
      {users && users.length > 0 ? (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roles</th>
              <th>Active?</th>
              <th>New Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td
                  onClick={() =>
                    setEditingCell({ userId: u._id, property: "name" })
                  }
                >
                  <EditableCell
                    value={changes[u._id]?.["name"] ?? u.name}
                    editing={
                      editingCell?.userId === u._id &&
                      editingCell.property === "name"
                    }
                    onChange={(e) => handleChange(u._id, e, "name")}
                    onEnd={() => setEditingCell(null)}
                  />
                </td>
                <td>
                  {editingCell?.userId === u._id &&
                  editingCell.property === "roles" ? (
                    <RolesEdit
                      roles={changes[u._id]?.["roles"] ?? u.roles}
                      allRoles={["guest", "clerk", "owner", "unauthenticated"]}
                      onChange={(roles) => handleChange(u._id, roles, "roles")}
                      onBlur={() => setEditingCell(null)}
                    />
                  ) : (
                    <RolesDisplay
                      roles={changes[u._id]?.["roles"] ?? u.roles}
                      onClick={() =>
                        setEditingCell({ userId: u._id, property: "roles" })
                      }
                    />
                  )}
                </td>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={u.isActive}
                    onChange={(e) =>
                      handleChange(u._id, e.target.checked, "isActive")
                    }
                  />
                </td>
                <td
                  onClick={() =>
                    setEditingCell({ userId: u._id, property: "password" })
                  }
                >
                  <EditableCell
                    type="password"
                    value={changes[u._id]?.["password"] ?? ""}
                    editing={
                      editingCell?.userId === u._id &&
                      editingCell.property === "password"
                    }
                    onChange={(e) => handleChange(u._id, e, "password")}
                    onEnd={() => setEditingCell(null)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
