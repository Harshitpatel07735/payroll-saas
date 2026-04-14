import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../App';
import { 
    Plus, 
    Search, 
    MoreVertical, 
    UserPlus,
    Filter,
    Download
} from 'lucide-react';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { token } = useAuth();
    
    const [newEmployee, setNewEmployee] = useState({
        employeeId: '',
        name: '',
        email: '',
        department: '',
        designation: '',
        salaryStructure: {
            basic: 0,
            hra: 0,
            da: 0,
            conveyance: 0,
            otherAllowances: 0
        }
    });

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/api/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [token]);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/employees', newEmployee);
            setShowModal(false);
            fetchEmployees();
            setNewEmployee({
                employeeId: '', name: '', email: '', department: '', designation: '',
                salaryStructure: { basic: 0, hra: 0, da: 0, conveyance: 0, otherAllowances: 0 }
            });
        } catch (err) {
            alert('Error adding employee: ' + err.response?.data?.message || err.message);
        }
    };

    const handleExport = async () => {
        try {
            const res = await api.get('/api/employees/export', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'employees.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('Export failed', err);
        }
    };

    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Add Employee Modal - Moved outside wrapper to break free from sidebar transforms */}
            {showModal && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card glass-effect" style={{ 
                        width: '95%',
                        maxWidth: '650px',
                        padding: '1.25rem',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 0 100px rgba(0,0,0,0.8)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <h3 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '1.4rem' }}>New Employee Profile</h3>
                        <form onSubmit={handleAddEmployee}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.8rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block', color: 'rgba(255,255,255,0.9)' }}>Emp ID</label>
                                    <input type="text" className="glass" placeholder="ID" style={{ padding: '0.5rem', fontSize: '0.9rem', color: 'white', caretColor: 'white' }} value={newEmployee.employeeId} onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block', color: 'rgba(255,255,255,0.9)' }}>Full Name</label>
                                    <input type="text" className="glass" placeholder="Name" style={{ padding: '0.5rem', fontSize: '0.9rem', color: 'white', caretColor: 'white' }} value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block', color: 'rgba(255,255,255,0.9)' }}>Email</label>
                                    <input type="email" className="glass" placeholder="Email" style={{ padding: '0.5rem', fontSize: '0.9rem', color: 'white', caretColor: 'white' }} value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} required />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block', color: 'rgba(255,255,255,0.9)' }}>Department</label>
                                    <input type="text" className="glass" placeholder="Dept" style={{ padding: '0.5rem', fontSize: '0.9rem', color: 'white', caretColor: 'white' }} value={newEmployee.department} onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block', color: 'rgba(255,255,255,0.9)' }}>Designation</label>
                                    <input type="text" className="glass" placeholder="Role" style={{ padding: '0.5rem', fontSize: '0.9rem', color: 'white', caretColor: 'white' }} value={newEmployee.designation} onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})} required />
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>Basic (₹)</label>
                                        <input type="number" className="glass" style={{ padding: '0.4rem', color: 'white', caretColor: 'white' }} value={newEmployee.salaryStructure.basic} onChange={(e) => setNewEmployee({...newEmployee, salaryStructure: {...newEmployee.salaryStructure, basic: parseFloat(e.target.value)}})} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>HRA (₹)</label>
                                        <input type="number" className="glass" style={{ padding: '0.4rem', color: 'white', caretColor: 'white' }} value={newEmployee.salaryStructure.hra} onChange={(e) => setNewEmployee({...newEmployee, salaryStructure: {...newEmployee.salaryStructure, hra: parseFloat(e.target.value)}})} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>DA (₹)</label>
                                        <input type="number" className="glass" style={{ padding: '0.4rem', color: 'white', caretColor: 'white' }} value={newEmployee.salaryStructure.da} onChange={(e) => setNewEmployee({...newEmployee, salaryStructure: {...newEmployee.salaryStructure, da: parseFloat(e.target.value)}})} required />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 2rem' }}>Save Employee</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Employee Directory</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your workforce and salary structures.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-ghost" onClick={handleExport} style={{ border: '1px solid var(--glass-border)' }}>
                        <Download size={18} /> Export
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <UserPlus size={18} /> Add Employee
                    </button>
                </div>
            </div>


            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            className="glass"
                            placeholder="Search by name, ID or department..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'white' }}
                        />
                    </div>
                    <button className="btn btn-ghost" style={{ border: '1px solid var(--glass-border)', padding: '0.6rem 1rem' }}>
                        <Filter size={18} />
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>Employee ID</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Name</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Department</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Designation</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Basic Salary</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>Loading workforce...</td></tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>No employees found.</td></tr>
                            ) : filteredEmployees.map((emp) => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{emp.employeeId}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>{emp.name}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>{emp.department}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>{emp.designation}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>₹{emp?.salaryStructure?.basic?.toLocaleString() || '0'}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ padding: '0.25rem 0.6rem', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', fontSize: '0.75rem' }}>
                                            Active
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <button className="btn btn-ghost" style={{ padding: '0.5rem' }}><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
    );
};

export default Employees;
