import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../App';

export default function UserDashboard({ token }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const headers = { Authorization: `Bearer ${token}` };

  const loadStores = async () => {
    const res = await axios.get(`${API_BASE}/stores`, {
      headers,
      params: { search, sortBy, sortOrder }
    });
    setStores(res.data);
  };

  useEffect(() => {
    loadStores();
  }, [search, sortBy, sortOrder]);

  const handleRate = async (storeId, rating) => {
    try {
      await axios.post(`${API_BASE}/stores/${storeId}/rate`, { rating }, { headers });
      loadStores();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating.');
    }
  };

  return (
    <div className="card">
      <h2>Explore Stores</h2>
      <div className="flex" style={{ margin: '16px 0' }}>
        <input
          type="text"
          placeholder="Search by store name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', flex: 1 }}
        />
        <button 
          className="btn" 
          style={{ background: '#e2e8f0' }} 
          onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
        >
          Sort Order: {sortOrder}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Submit / Modify Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td><strong>{store.name}</strong></td>
              <td>{store.address}</td>
              <td>⭐ {store.overall_rating}</td>
              <td>{store.user_rating ? `⭐ ${store.user_rating}` : 'Not rated yet'}</td>
              <td>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleRate(store.id, val)}
                      className="btn"
                      style={{
                        padding: '4px 10px',
                        background: store.user_rating === val ? '#f59e0b' : '#e2e8f0',
                        color: store.user_rating === val ? '#fff' : '#000'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}