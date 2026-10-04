import React from 'react';

export default function Navbar({ user, setShowPasswordModal, handleLogout }) {
  if (!user) return null;

  return (
    <nav className="navbar">
      <div>
        <strong>Store Ratings Portal</strong> | {user.name} ({user.role})
      </div>
      <div className="flex">
        <button 
          className="btn" 
          style={{ background: '#334155', color: '#fff' }} 
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </button>
        <button 
          className="btn btn-danger" 
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}