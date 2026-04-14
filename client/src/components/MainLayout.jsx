import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { 
    LayoutDashboard, 
    Users, 
    ReceiptText, 
    Settings, 
    LogOut, 
    Bell,
    UserCircle,
    Shield
} from 'lucide-react';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { id: 'employees', label: 'Employees', icon: <Users size={20} />, path: '/employees' },
        { id: 'payroll', label: 'Payroll', icon: <ReceiptText size={20} />, path: '/payroll' },
        { id: 'compliance', label: 'Compliance', icon: <Shield size={20} />, path: '/compliance' },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-darker)' }}>
            {/* Sidebar */}
            <aside className="glass" style={{ 
                width: '280px', 
                margin: '1rem', 
                marginRight: '0', 
                display: 'flex', 
                flexDirection: 'column',
                border: '1px solid var(--glass-border)'
            }}>
                <div style={{ padding: '2rem 1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: '700' }}>ANTIGRAVITY</h2>
                </div>

                <nav style={{ flex: 1, padding: '0 0.75rem' }}>
                    {navItems.map((item) => (
                        <Link 
                            key={item.id}
                            to={item.path}
                            className={`btn ${location.pathname === item.path ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ 
                                width: '100%', 
                                justifyContent: 'flex-start', 
                                marginBottom: '0.5rem',
                                paddingLeft: '1rem'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button 
                        onClick={logout} 
                        className="btn btn-ghost" 
                        style={{ width: '100%', justifyContent: 'flex-start', color: '#fca5a5' }}
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <header style={{ 
                    height: '80px', 
                    padding: '0 2rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>{user?.company?.name}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location: {user?.company?.state}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '10px' }}>
                            <Bell size={20} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user?.name}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</p>
                            </div>
                            <UserCircle size={32} color="var(--primary)" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
