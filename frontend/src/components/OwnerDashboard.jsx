import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../App';

export default function OwnerDashboard({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/owner/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>No store profile assigned to this owner account.</p>;

  return (
    <div>
      <div className="card">
        <h2>{data.store.name}</h2>
        <p style={{ color: '#64748b' }}>{data.store.address}</p>
        <div style={{ marginTop: '16px' }}>
          <h3>Average Rating: ⭐ {data.averageRating}</h3>
        </div>
      </div>

      <div className="card">
        <h3>User Ratings & Feedback</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Customer Email</th>
              <th>Rating Given</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.ratedUsers.length === 0 ? (
              <tr><td colSpan="4">No ratings submitted yet.</td></tr>
            ) : (
              data.ratedUsers.map((u, i) => (
                <tr key={i}>
                  <td>{u.user_name}</td>
                  <td>{u.user_email}</td>
                  <td>⭐ {u.rating}</td>
                  <td>{new Date(u.updated_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}