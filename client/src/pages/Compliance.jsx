import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../App';
import { Shield, Download, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Compliance = () => {
    const [month, setMonth] = useState('April');
    const [year, setYear] = useState('2024');
    const { token } = useAuth();

    const handleDownloadECR = async () => {
        try {
            const res = await api.get(`/api/compliance/pf-ecr?month=${month}&year=${year}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `PF_ECR_${month}_${year}.txt`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('Error generating ECR: ' + err.message);
        }
    };

    const statutoryItems = [
        { 
            title: 'EPF ECR Generation', 
            desc: 'Generate Electronic Challan-cum-Return for Provident Fund.',
            icon: <FileText color="#6366f1" />,
            deadline: '15th of next month',
            status: 'Ready'
        },
        { 
            title: 'ESI Monthly Return', 
            desc: 'Prepare the monthly contribution file for State Insurance.',
            icon: <Shield color="#10b981" />,
            deadline: '15th of next month',
            status: 'Pending'
        },
        { 
            title: 'TDS (Form 24Q)', 
            desc: 'Quarterly return for tax deducted at source from salary.',
            icon: <CheckCircle color="#c084fc" />,
            deadline: 'Quarterly',
            status: 'Inactive'
        }
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Compliance Vault</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Generate Govt-compliant files for statutory filings.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
                    <select className="glass" value={month} onChange={(e) => setMonth(e.target.value)} style={{ border: 'none', padding: '0.5rem' }}>
                        {['January', 'February', 'March', 'April', 'May', 'June'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select className="glass" value={year} onChange={(e) => setYear(e.target.value)} style={{ border: 'none', padding: '0.5rem' }}>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card glass-effect" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Clock color="#f59e0b" size={20} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Upcoming Deadline</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem' }}>PF ECR Filing</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Due in 5 Days (15th April)</p>
                </div>
                <div className="card glass-effect" style={{ borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <CheckCircle color="#10b981" size={20} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Last Month</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem' }}>All Filed</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>March filings completed successfully.</p>
                </div>
                <div className="card glass-effect" style={{ borderLeft: '4px solid #ef4444' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <AlertTriangle color="#ef4444" size={20} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Action Required</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem' }}>KYC Pending</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>2 Employees missing UAN/AADHAAR.</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {statutoryItems.map((item, i) => (
                    <div key={i} className="card glass-effect" style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '1.5rem 2rem',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deadline</p>
                                <p style={{ fontSize: '0.9rem' }}>{item.deadline}</p>
                            </div>
                            <button 
                                className="btn btn-primary" 
                                onClick={item.title.includes('PF') ? handleDownloadECR : () => {}}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: item.status === 'Inactive' ? 0.5 : 1 }}
                                disabled={item.status === 'Inactive'}
                            >
                                <Download size={18} /> Download File
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Compliance;
