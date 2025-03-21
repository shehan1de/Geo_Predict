import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/main.css';

const EditUserPopup = ({ user, onClose, onUserUpdated }) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/users/user/${user.userId}`, { name, role });
      toast.success('User updated successfully!');
      onUserUpdated();
      onClose();
    } catch (err) {
      toast.error('Error updating user!');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Edit User</h4>

        <label>User ID:</label>
        <input type="text" className="form-control readonly-field" value={user.userId} readOnly />

        <label>Email:</label>
        <input type="email" className="form-control readonly-field" value={user.email} readOnly />

        <label>Name:</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Role:</label>
        <div className="dropdown-wrapper">
          <select className="form-control dropdown" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Client">Client</option>
          </select>
          <i className="bi bi-chevron-down dropdown-icon"></i>
        </div>

        <div className="modal-actions">
          <button className="btn-save" onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserPopup;
