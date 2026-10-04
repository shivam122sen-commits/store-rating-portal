import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import Navbar from './components/Navbar';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Check API connection on mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        console.log('Checking API connection at:', API_BASE);
        const response = await axios.get(API_BASE.replace('/api', '/api/health'));
        console.log('API Status:', response.data);
        setApiStatus('connected');
      } catch (error) {
        console.error('API Connection Error:', error);
        setApiStatus('disconnected');
      }
    };
    checkAPI();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.response?.data?.error || 'Login failed. Please check if backend is running.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await axios.post(`${API_BASE}/auth/signup`, { name, email, password, address });
      alert('Signup successful! Please log in.');
      setIsLoginView(true);
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg(err.response?.data?.error || 'Signup failed.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/auth/update-password`, 
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password updated successfully!');
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      alert(err.response?.data?.error || 'Password update failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  // Show API status if disconnected
  if (apiStatus === 'checking') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Connecting to server...</h3>
          <p style={{ color: '#64748b', marginTop: '10px' }}>Please wait</p>
        </div>
      </div>
    );
  }

  if (apiStatus === 'disconnected') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h3 style={{ color: '#ef4444' }}>⚠️ Cannot Connect to Server</h3>
          <p style={{ marginTop: '15px', color: '#64748b' }}>
            Unable to connect to the backend API at:<br/>
            <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
              {API_BASE}
            </code>
          </p>
          <p style={{ marginTop: '15px', color: '#64748b' }}>
            Please make sure the backend server is running on port 5001.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '20px' }}
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ width: '400px' }}>
          <h2>{isLoginView ? 'Login to Store Ratings' : 'Register Normal User'}</h2>
          {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
          <form onSubmit={isLoginView ? handleLogin : handleSignup} style={{ marginTop: '15px' }}>
            {!isLoginView && (
              <>
                <div className="form-group">
                  <label>Full Name (3-60 characters)</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    minLength="3"
                    maxLength="60"
                    placeholder="e.g., John Doe"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Address (5-400 characters)</label>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    rows="3"
                    minLength="5"
                    maxLength="400"
                    placeholder="e.g., 123 Main St, New York, NY 10001"
                    required 
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your.email@example.com"
                required 
              />
            </div>
            <div className="form-group">
              <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                minLength="8"
                maxLength="16"
                placeholder="e.g., MyPass@123"
                required 
              />
              <small style={{ color: '#64748b', fontSize: '12px' }}>
                Must include: 1 uppercase letter and 1 special character (!@#$%^&*...)
              </small>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} type="submit">
              {isLoginView ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <button 
            style={{ background: 'transparent', border: 'none', color: '#2563eb', marginTop: '14px', width: '100%' }}
            onClick={() => { setIsLoginView(!isLoginView); setErrorMsg(''); }}
          >
            {isLoginView ? "Don't have an account? Sign up" : 'Already registered? Log in'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar 
        user={user} 
        setShowPasswordModal={setShowPasswordModal} 
        handleLogout={handleLogout} 
      />

      <div className="container">
        {user.role === 'System Administrator' && <AdminDashboard token={token} />}
        {user.role === 'Normal User' && <UserDashboard token={token} />}
        {user.role === 'Store Owner' && <OwnerDashboard token={token} />}
      </div>

      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '380px' }}>
            <h3>Update Password</h3>
            <form onSubmit={handlePasswordUpdate} style={{ marginTop: '15px' }}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="flex" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}