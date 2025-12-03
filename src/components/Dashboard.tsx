import { useEffect, useState } from "react";
import { getUser } from "../utils";
import { useNavigate } from "react-router-dom";
import type { User } from "../utils";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<(User | undefined) | null>(null);

    useEffect(() => {
        (async() => {
            setUser(await getUser(navigate));
        })();
    }, [navigate]);

    if (!user) return <h1>Loading...</h1>;

    return <h1>Hello, {user.username}</h1>;
}

