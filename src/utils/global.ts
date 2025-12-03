import axios from "axios"
import type { User } from "./types";
export const API_URL = 'http://localhost:3000'

export async function getUser(
    navigate: (path: string) => void,
    isLoginPage: boolean = false
): Promise<User | undefined> {
    try {
        const res = await axios.get(
            `${API_URL}/users/profile`,
            { withCredentials: true }
        );
        console.log('AUTHENTICATED', res.data.data);

        if (isLoginPage) {
            navigate('/dashboard');
        }

        return res.data.data;
    } catch (err) {
        console.log('NOT AUTHENTICATED', {err});

        if (!isLoginPage) {
            navigate('/login');
        }   
    }
}