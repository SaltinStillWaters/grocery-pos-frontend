import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, type AuthUser, type User, getUser } from "../utils";
import axios from "axios";

export default function Users() {
    const navigate = useNavigate();
    const [user, setUser] = useState<(AuthUser | undefined) | null>(null);

    useEffect(() => {
        (async() => {
            setUser(await getUser(navigate));
        })();
    }, [navigate]);

    const [users, setUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState<boolean | null>(true);

    async function getUsers() {
        try {
            const res = await axios.get(`${API_URL}/users`, { withCredentials: true });
            console.log('USERS', res.data.data);
            setUsers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
            setUsers(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => await getUsers())();
    }, []);

    return (
    <div className="container mt-4">
        <h2>Users</h2>

        {loading ? (
        <p>Loading users...</p>
        ) : users && users.length > 0 ? (
        <table className="table table-striped table-bordered">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Roles</th>
                <th>Active?</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.roles.join(", ")}</td>
                <td>{user.isActive ? "Yes" : "No"}</td>
                </tr>
            ))}
            </tbody>
        </table>
        ) : (
        <p>No users found.</p>
        )}
    </div>
    );

};