import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../App';
import { 
    Calendar, 
    Upload, 
    CheckCircle2, 
    AlertTriangle,
    ChevronRight,
    ArrowLeft,
    PlayCircle,
    Download,
    MessageSquare
} from 'lucide-react';

const PayrollProcess = () => {
    const [step, setStep] = useState(1);
    const [month, setMonth] = useState(4);
    const [year, setYear] = useState(2026);
    const [employees, setEmployees] = useState([]);
    const [processedResults, setProcessedResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await api.get('/api/employees');
            setEmployees(res.data);
        };
        fetchEmployees();
    }, [token]);

    const handleProcess = async () => {
        setLoading(true);
        try {
            // Mock attendance data for all employees
            const attendanceData = employees.map(emp => ({
                employeeId: emp.employeeId,
                presentDays: 24,
                absentDays: 2,
                leaveDays: 0
            }));

            const res = await api.post('/api/payroll/process', {
                month,
                year,
                attendanceData
            });
            
            setProcessedResults(res.data.results);
            setStep(3);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppNotify = async (payrollId, employeeName) => {
        try {
            await api.post('/api/payroll/whatsapp-notify', { payrollId });
            alert(`WhatsApp notification sent to ${employeeName}`);
        } catch (err) {
            alert('Failed to send WhatsApp message');
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Stepper */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '1rem' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', 
                            backgroundColor: step >= i ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '600', fontSize: '0.9rem',
                            color: step >= i ? 'white' : 'var(--text-muted)',
                            border: step === i ? '2px solid rgba(99, 102, 241, 0.5)' : 'none'
                        }}>
                            {step > i ? <CheckCircle2 size={18} /> : i}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: step >= i ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {i === 1 ? 'Month' : i === 2 ? 'Upload' : 'Calculate'}
                        </span>
                        {i < 3 && <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--glass-border)' }}></div>}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div className="card animate-fade-in">
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Calendar size={24} color="var(--primary)" /> Select Payroll Period
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Month</label>
                            <select 
                                className="glass" 
                                style={{ width: '100%', padding: '0.75rem', color: 'white' }}
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                            >
                                <option value={4}>April 2026</option>
                                <option value={5}>May 2026</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Year</label>
                            <select className="glass" style={{ width: '100%', padding: '0.75rem', color: 'white' }}>
                                <option>2026</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={() => setStep(2)}>
                            Next Step <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="card animate-fade-in">
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Upload size={24} color="var(--primary)" /> Attendance & Variable Pay
                    </h2>
                    <div style={{ 
                        border: '2px dashed var(--glass-border)', 
                        borderRadius: '16px', 
                        padding: '3rem', 
                        textAlign: 'center',
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        marginBottom: '2rem'
                    }}>
                        <Upload size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Drop attendance CSV here</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Or click to browse from your computer</p>
                        <div style={{ color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer' }}>Download CSV Template</div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-ghost" onClick={() => setStep(1)}>
                            <ArrowLeft size={18} /> Back
                        </button>
                        <button className="btn btn-primary" onClick={handleProcess}>
                            Run Calculations <PlayCircle size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>Calculation Preview</h2>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-ghost" onClick={() => setStep(2)}>Recalculate</button>
                            <button className="btn btn-primary" style={{ backgroundColor: 'var(--secondary)' }}>
                                <CheckCircle2 size={18} /> Approve & Finalize
                            </button>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '1rem' }}>Employee</th>
                                    <th style={{ padding: '1rem' }}>Earned Gross</th>
                                    <th style={{ padding: '1rem' }}>PF (Employee)</th>
                                    <th style={{ padding: '1rem' }}>ESI</th>
                                    <th style={{ padding: '1rem' }}>PT</th>
                                    <th style={{ padding: '1rem' }}>Net Salary</th>
                                    <th style={{ padding: '1rem' }}>Notifications</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedResults.map((res, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
                                        <td style={{ padding: '1rem' }}>{res.employeeId}</td>
                                        <td style={{ padding: '1rem' }}>₹{res.earnedGross.toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>₹{res.deductions.pf.toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>₹{res.deductions.esi.toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>₹{res.deductions.pt.toLocaleString()}</td>
                                        <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--secondary)' }}>₹{(res.netSalary || 0).toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button 
                                                className="btn btn-ghost" 
                                                onClick={() => handleWhatsAppNotify(res.id, res.employeeId)}
                                                style={{ padding: '0.5rem', color: '#25D366' }}
                                                title="Send to WhatsApp"
                                            >
                                                <MessageSquare size={18} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>Ready</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayrollProcess;
