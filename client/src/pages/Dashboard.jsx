import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../App';
import { 
    Users, 
    CreditCard, 
    Calendar, 
    AlertCircle,
    TrendingUp,
    FileCheck
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const Dashboard = () => {
    const { token } = useAuth();
    const [statsData, setStatsData] = useState({
        totalEmployees: 0,
        monthlyPayroll: 0,
        pendingFilings: 0,
        avgSalary: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/payroll/stats');
                setStatsData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, [token]);

    const data = [
        { name: 'Jan', amount: 450000 },
        { name: 'Feb', amount: 480000 },
        { name: 'Mar', amount: 460000 },
        { name: 'Apr', amount: 520000 },
    ];

    const stats = [
        { label: 'Total Employees', value: statsData?.totalEmployees || 0, icon: <Users color="#6366f1" />, trend: '+2 this month' },
        { label: 'Payroll Monthly', value: `₹${(statsData?.monthlyPayroll || 0).toLocaleString()}`, icon: <CreditCard color="#10b981" />, trend: '+4.5%' },
        { label: 'Pending Filings', value: statsData?.pendingFilings || 0, icon: <AlertCircle color="#f59e0b" />, trend: 'Due in 5 days' },
        { label: 'Avg Salary', value: `₹${(statsData?.avgSalary || 0).toLocaleString()}`, icon: <TrendingUp color="#c084fc" />, trend: 'Stable' },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Welcome back, Admin</h1>
                <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your payroll today.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ 
                            padding: '1rem', 
                            borderRadius: '16px', 
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.5rem', margin: '0.1rem 0' }}>{stat.value}</h3>
                            <p style={{ fontSize: '0.75rem', color: stat.trend.includes('-') ? 'var(--danger)' : 'var(--secondary)' }}>{stat.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Payroll Expenditure Trend</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `₹${v/1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#818cf8' }}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Compliance Calendar</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                        {
                            title: 'PF Return Filing', date: 'May 05', status: 'Upcoming', color: 'var(--primary)' 
                        },
                        { title: 'ESI Payment', date: 'May 21', status: 'Important', color: 'var(--accent)' },
                        { title: 'Prof. Tax Deposit', date: 'Jun 10', status: 'Pending', color: 'var(--danger)' },
                        { title: 'Payroll Processing', date: 'Apr 28', status: 'In Progress', color: 'var(--secondary)' },
                    ].map((event, i) => (
                        <div key={i} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            padding: '0.75rem', 
                            borderRadius: '12px', 
                            background: 'rgba(255,255,255,0.02)', 
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }} 
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        >
                                <div style={{ width: '4px', height: '40px', borderRadius: '4px', backgroundColor: event.color }}></div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{event.title}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due: {event.date}</p>
                                </div>
                                <div style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: event.color }}>
                                    {event.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
