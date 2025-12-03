import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils";

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);

    const navigate = useNavigate();
    
    async function handleLogin() {
        try {
            const res = await axios.post(
                `http://localhost:3000/auth/login`, 
                { username, password },
                { withCredentials: true }
            );

            console.log({res});
            navigate('/dashboard')
        } catch (err: any) {
            if (err.response) {
                console.log(err.response.data.message);
            } else {
                console.error("Network error", err);
            }
        }
    }

    useEffect(() => {
        (async() => {
            await getUser(navigate, true);
        })();
    }, [navigate]);

    return (
    <>
        <input
            type='text'
            placeholder='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            type={show ? 'text' : 'password'}
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <input
            type='checkbox'
            onChange={() => setShow(!show)}
        />
        <button onClick={handleLogin}>
            Login
        </button>
    </>
    )
}