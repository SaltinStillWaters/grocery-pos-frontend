import { useState, useEffect } from "react";
import { API_URL, type Role, type User, useCurrentUser } from "../utils";
import axios from "axios";
import { RolesDisplay, RolesEdit } from "./RolesDisplay";

export default function Users() {
  const user = useCurrentUser();

  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUsers() {
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

    fetchUsers();
  }, []);

  const [changes, setChanges] = useState<Record<string, Partial<User>>>({});

  function handleChange(
    user_id: string, value: any, property: "name" | "roles" | "isActive" | "password"
    ) {
      setChanges((prev) => {
        const userChanges = { ...prev[user_id], [property]: value };

        if (value === '' || value === null) {
            delete userChanges[property];
        }

        const newChanges = { ...prev, [user_id]: userChanges };
        if (Object.keys(userChanges).length === 0) {
            delete newChanges[user_id];
        }

        return newChanges;
    });
    
    console.log({
        ...changes,
        [user_id]: {
            ...changes[user_id],
            [property]: value
        }
    });
  }

  const [editingCell, setEditingCell] = useState<{ userId: string; property: keyof User } | null>(null);


  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mt-4">
      <h2>Users</h2>

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
                <td onClick={() => setEditingCell({ userId: u._id, property: 'name' })}>
                    {
                        editingCell?.userId === u._id && editingCell.property === 'name' ?
                        (
                            <input
                                type="text"
                                defaultValue={changes[u._id]?.['name'] ?? u.name}
                                autoFocus
                                onBlur={() => setEditingCell(null)}
                                onChange={e => handleChange(u._id, e.target.value, 'name')}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        setEditingCell(null);
                                    }
                                }}
                            />
                        ) :
                        ( changes[u._id]?.['name'] ?? u.name )
                    }
                </td>
                <td>
                    {
                        editingCell?.userId === u._id && editingCell.property === 'roles' ?
                        (
                            <RolesEdit
                            roles={changes[u._id]?.['roles'] ?? u.roles}
                            allRoles={['guest', 'clerk', 'owner', 'unauthenticated']}
                            onChange={roles => handleChange(u._id, roles, "roles")}
                            onBlur={() => setEditingCell(null)}
                            />
                        ) :
                        (
                            <RolesDisplay
                                roles={changes[u._id]?.['roles'] ?? u.roles}
                                onClick={() => setEditingCell({ userId: u._id, property: 'roles'})}
                            />
                        )
                    }
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
                <td onClick={() => setEditingCell({ userId: u._id, property: 'password' })}>
                    {
                        editingCell?.userId === u._id && editingCell.property === 'password' ?
                        (
                            <input
                                type="password"
                                defaultValue={changes[u._id]?.['password'] ?? ''}
                                autoFocus
                                onBlur={() => setEditingCell(null)}
                                onChange={e => handleChange(u._id, e.target.value, 'password')}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        setEditingCell(null);
                                    }
                                }}
                            />
                        ) :
                        ( changes[u._id]?.['password'] ? '****' : '-' )
                    }
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
