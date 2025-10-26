import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, PieChart, Settings, LogOut } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="header-title">Expense Tracker</h1>
                    <div className="header-user">
                        <span className="user-name">{user?.username}</span>
                        <button onClick={handleLogout} className="btn-icon" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <nav className="app-nav">
                <Link
                    to="/"
                    className={`nav-item ${isActive('/') ? 'active' : ''}`}
                >
                    <Home size={20} />
                    <span>Expenses</span>
                </Link>
                <Link
                    to="/analytics"
                    className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}
                >
                    <PieChart size={20} />
                    <span>Analytics</span>
                </Link>
                <Link
                    to="/settings"
                    className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </nav>

            <main className="app-main">
                {children}
            </main>
        </div>
    );
};

export default Layout;
