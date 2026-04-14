import React, { useState } from 'react';
import { Building, Shield, Bell, CreditCard, Save, Lock, Mail, CreditCard as BillingIcon } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('company');

    const menuItems = [
        { id: 'company', icon: <Building size={18} />, label: 'Company Profile' },
        { id: 'security', icon: <Shield size={18} />, label: 'Security & Auth' },
        { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
        { id: 'billing', icon: <CreditCard size={18} />, label: 'Billing & Plans' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'company':
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Building size={24} color="var(--primary)" /> Company Profile
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Company Name</label>
                                <input className="glass" style={{ width: '100%', padding: '0.75rem', color: 'white' }} defaultValue="Apex Manufacturing Solutions" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered State</label>
                                <input className="glass" style={{ width: '100%', padding: '0.75rem', color: 'white' }} defaultValue="Gujarat" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>PF Registration No.</label>
                                <input className="glass" style={{ width: '100%', padding: '0.75rem', color: 'white' }} defaultValue="GJ/AHM/1234567" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ESI Registration No.</label>
                                <input className="glass" style={{ width: '100%', padding: '0.75rem', color: 'white' }} defaultValue="31000123450011001" />
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Shield size={24} color="var(--primary)" /> Security & Password
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Current Password</label>
                                <input type="password" className="glass" style={{ width: '100%', padding: '0.75rem', color: 'white' }} placeholder="••••••••" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>New Password</label>
                                <input type="password" className="glass" style={{ width: '100%', padding: '0.75rem', color: 'white' }} placeholder="Min. 8 characters" />
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>Two-Factor Authentication</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure your account with 2FA</p>
                                    </div>
                                    <div style={{ width: '40px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                                        <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Bell size={24} color="var(--primary)" /> Notification Preferences
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { title: 'Payroll Reminders', desc: 'When monthly payroll generation is due.' },
                                { title: 'Compliance Alerts', desc: 'Alerts for PF/ESI deposit deadlines.' },
                                { title: 'Employee Onboarding', desc: 'When new employees join the platform.' }
                            ].map((n, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                    <div>
                                        <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>{n.title}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.desc}</p>
                                    </div>
                                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'billing':
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <BillingIcon size={24} color="var(--primary)" /> Subscription & Billing
                        </h2>
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', tracking: '0.1em', opacity: 0.6 }}>Current Plan</span>
                                    <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Business Pro</h3>
                                </div>
                                <span style={{ padding: '0.4rem 0.8rem', background: 'var(--primary)', borderRadius: '20px', fontSize: '0.75rem' }}>Active</span>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Up to 250 Employees • Full Compliance Package</p>
                        </div>
                        <button className="btn btn-ghost" style={{ border: '1px solid var(--glass-border)', width: '100%' }}>View Payment History</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--primary)', borderRadius: '12px', display: 'flex' }}>
                    <SettingsIcon color="white" size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Platform Settings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your workspace, security, and billing preferences.</p>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveTab(item.id)}
                            className={`btn ${activeTab === item.id ? 'btn-primary' : 'btn-ghost'}`} 
                            style={{ 
                                justifyContent: 'flex-start', 
                                padding: '1.25rem',
                                transition: 'all 0.2s ease',
                                transform: activeTab === item.id ? 'translateX(5px)' : 'none'
                            }}
                        >
                            {item.icon} <span style={{ marginLeft: '10px' }}>{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="card glass-effect" style={{ padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
                    {renderContent()}
                    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={() => alert('Settings updated successfully!')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }}>
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
