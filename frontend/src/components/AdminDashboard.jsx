import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../App';

export default function AdminDashboard({ token }) {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSortCol, setUserSortCol] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState('ASC');

  const headers = { Authorization: `Bearer ${token}` };

  const loadStats = async () => {
    const res = await axios.get(`${API_BASE}/admin/dashboard-stats`, { headers });
    setStats(res.data);
  };

  const loadUsers = async () => {
    const res = await axios.get(`${API_BASE}/admin/users`, {
      headers,
      params: { search: userSearch, role: userRoleFilter, sortBy: userSortCol, sortOrder: userSortOrder }
    });
    setUsers(res.data);
  };

  const loadStores = async () => {
    const res = await axios.get(`${API_BASE}/admin/stores`, { headers });
    setStores(res.data);
  };

  useEffect(() => {
    loadStats();
    loadStores();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [userSearch, userRoleFilter, userSortCol, userSortOrder]);

  const toggleSort = (col) => {
    if (userSortCol === col) {
      setUserSortOrder(userSortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setUserSortCol(col);
      setUserSortOrder('ASC');
    }
  };

  return (
    <div>
      <div className="grid-stats">
        <div className="stat-box">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-box">
          <h3>{stats.totalStores}</h3>
          <p>Total Stores</p>
        </div>
        <div className="stat-box">
          <h3>{stats.totalRatings}</h3>
          <p>Submitted Ratings</p>
        </div>
      </div>

      <div className="card">
        <h3>User Management</h3>
        <div className="flex" style={{ margin: '14px 0' }}>
          <input 
            type="text" 
            placeholder="Search Name, Email, Address..." 
            value={userSearch} 
            onChange={(e) => setUserSearch(e.target.value)} 
            style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', width: '250px' }}
          />
          <select 
            value={userRoleFilter} 
            onChange={(e) => setUserRoleFilter(e.target.value)}
            style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          >
            <option value="">All Roles</option>
            <option value="System Administrator">Admin</option>
            <option value="Normal User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name {userSortCol === 'name' ? (userSortOrder === 'ASC' ? '▲' : '▼') : ''}</th>
              <th onClick={() => toggleSort('email')}>Email {userSortCol === 'email' ? (userSortOrder === 'ASC' ? '▲' : '▼') : ''}</th>
              <th onClick={() => toggleSort('address')}>Address {userSortCol === 'address' ? (userSortOrder === 'ASC' ? '▲' : '▼') : ''}</th>
              <th onClick={() => toggleSort('role')}>Role {userSortCol === 'role' ? (userSortOrder === 'ASC' ? '▲' : '▼') : ''}</th>
              <th>Store Rating (If Owner)</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
                <td>{u.role === 'Store Owner' ? (u.store_rating || 'No ratings') : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Registered Stores</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>⭐ {s.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}