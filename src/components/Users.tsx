import { useState, useEffect } from "react";
import { API_URL, type Role, type User, useChangeTracker, useCurrentUser } from "../utils";
import axios from "axios";
import { RolesDisplay, RolesEdit } from "./sub-components/RolesDisplay";
import { EditableCell } from "./sub-components/EditableCell";
import Header from "./Header";

export default function Users() {
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

  const { changes, setChanges, handleChange } = useChangeTracker<User>();
  const [errors, setErrors] = useState<Record<string, Partial<User>>>({});

  async function handleSave(e: React.FormEvent, changes: Record<string, Partial<User>>) {
    e.preventDefault();
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
      setChanges({});
      console.log({ res });
    } catch (err: any) {
      console.log({ err });
      err.response.data.message
        .map(({msg, _id, property}: any) => {
          setErrors(prev => ({
              ...prev, 
              [_id]: {
                ...(prev[_id] || {}),
                [property]: msg
              }
          }));
        });
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setChanges({});
    setErrors({});
    await fetchUsers();
  }

  const [editingCell, setEditingCell] = useState<{
    userId: string;
    property: keyof User;
  } | null>(null);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mt-5">
      <Header />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Users</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary px-4"
            onClick={(e) => handleSave(e, changes)}
            disabled={loading || !Object.keys(changes).length}
          >
            Save
          </button>
          <button
            className="btn btn-outline-secondary px-4"
            onClick={(e) => handleCancel(e)}
            disabled={loading || !Object.keys(changes).length}
          >
            Cancel
          </button>
        </div>
      </div>

      {users && users.length > 0 ? (
        <div className="table-responsive shadow-sm rounded overflow-hidden">
          <table
            className="table table-hover mb-0"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Roles</th>
                <th>Active?</th>
                <th>New Password</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const userChanges = changes[u._id] || {};
                return (
                  <tr key={u._id} className="align-middle">
                    <td
                      onClick={() =>
                        setEditingCell({ userId: u._id, property: "name" })
                      }
                    >
                      <EditableCell<User, "name">
                        value={userChanges.name ?? u.name}
                        isEditing={
                          editingCell?.userId === u._id &&
                          editingCell.property === "name"
                        }
                        onChange={(e) => handleChange(u._id, u, {'name': e})}
                        onEnd={() => setEditingCell(null)}
                        error={errors[u._id]?.["name"]}
                      />
                    </td>

                    <td>
                      {editingCell?.userId === u._id &&
                      editingCell.property === "roles" ? (
                        <RolesEdit
                          roles={userChanges.roles ?? u.roles}
                          allRoles={[
                            "guest",
                            "clerk",
                            "owner",
                            "unauthenticated",
                          ]}
                          onChange={(e) =>
                            handleChange(u._id, u, {"roles": e as Role[]})
                          }
                          onBlur={() => setEditingCell(null)}
                        />
                      ) : (
                        <RolesDisplay
                          roles={userChanges.roles ?? u.roles}
                          onClick={() =>
                            setEditingCell({ userId: u._id, property: "roles" })
                          }
                        />
                      )}
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={userChanges.isActive ?? u.isActive}
                        onChange={(e) =>
                          handleChange(u._id, u, {'isActive': e.target.checked})
                        }
                        className="form-check-input"
                      />
                    </td>

                    <td
                      onClick={() =>
                        setEditingCell({ userId: u._id, property: "password" })
                      }
                    >
                      <EditableCell<User, "password">
                        type="password"
                        value={userChanges.password ?? ""}
                        isEditing={
                          editingCell?.userId === u._id &&
                          editingCell.property === "password"
                        }
                        onChange={(e) => handleChange(u._id, u, {'password': e})}
                        onEnd={() => setEditingCell(null)}
                        error={errors[u._id]?.["password"]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted mt-3">No users found.</p>
      )}
    </div>
  );
}
