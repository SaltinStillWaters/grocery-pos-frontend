import { useCurrentUser } from "../utils";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const user = useCurrentUser();
    const navigate = useNavigate();

    const buttons = [
        { label: 'Users', path: '/users' },
        { label: 'Inventory', path: '/inventory' },
        { label: 'Restock', path: '/restocks' },
        { label: 'Adjust', path: '/adjustments' },
        { label: 'Cashier', path: '/sell' },
    ];

    if (!user)
        return <p>Loading dashboard...</p>;
    
    return (
    <>
    <h1>
        Welcome, {user?.username}!
    </h1>
    {
        buttons.map(({label, path}) => (
            <button 
                key={path}
                onClick={() => navigate(path)}
            >
                {label}
            </button>
        ))    
    }    
    </>
    )
}

