import axios from "axios"
import type { AuthUser } from "./types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
export const API_URL = 'http://localhost:3000'

export async function getUser(
    navigate: (path: string) => void,
    isLoginPage: boolean = false
): Promise<AuthUser | undefined> {
    try {
        const res = await axios.get(
            `${API_URL}/users/profile`,
            { withCredentials: true }
        );

        if (isLoginPage)
            navigate('/dashboard');

        return res.data.data;
    } catch (err) {
        if (!isLoginPage)
            navigate('/login');
    }
}

export function useCurrentUser(isLoginPage: boolean = false) {
    const navigate = useNavigate();
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        (async () => {
            const u = await getUser(navigate, isLoginPage);
            setUser(u ?? null);
        })();
    }, [navigate]);

    return user;
}