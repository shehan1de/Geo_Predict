import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import '../css/main.css';
import EditUserPopup from './EditUserPopup';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.userId.toString().includes(query)
    );
    setFilteredUsers(filtered);
  };



const handleDelete = async (userId) => {
  toast.warn(
    <div>
      <p>Are you sure you want to delete this user?</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button
          className="btn btn-danger"
          onClick={async () => {
            try {
              await axios.delete(`/api/users/user/${userId}`);
              toast.success('User deleted successfully!');
              setUsers(users.filter((user) => user.userId !== userId));
              setFilteredUsers(filteredUsers.filter((user) => user.userId !== userId));
            } catch (err) {
              toast.error('Error deleting user!');
            }
            toast.dismiss(); // Close the toast after clicking
          }}
        >
          Yes, Delete
        </button>
        <button className="btn btn-secondary" onClick={() => toast.dismiss()}>
          Cancel
        </button>
      </div>
    </div>,
    { autoClose: false, closeOnClick: false }
  );
};



  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  const handleUserUpdated = async () => {
    try {
      const response = await axios.get('/api/users/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError('Error fetching updated users');
    }
  };

  return (
    <div className="container mt-4">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Name, Email, or UserID"
        value={searchQuery}
        onChange={handleSearch}
      />

      <button
        onClick={() => (window.location.href = '/addUsers')}
        className="btn-add-user mb-3"
      >
        <i className="bi bi-plus-circle"></i> Add User
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Profile</th>
              <th>UserID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const profileImgUrl = user.profilePicture
                  ? `/image/${user.profilePicture.split('/').pop()}`
                  : '/image/defaultProfile.jpg';

                return (
                  <tr key={user.userId}>
                    <td>
                      <img src={profileImgUrl} alt="Profile" className="profile-img" />
                    </td>
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role !== "Client" ? (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="btn-edit me-2"
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button onClick={() => handleDelete(user.userId)} className="btn-delete">
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-muted">Restricted</span>
                      )}

                      <div className="user-meta">
                        <small>Added: {formatDateTime(user.createdAt)}</small>
                        {user.updatedAt && (
                          <>
                            <br />
                            <small>Last Updated: {formatDateTime(user.updatedAt)}</small>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditUserPopup 
          user={selectedUser} 
          onClose={handleClosePopup} 
          onUserUpdated={handleUserUpdated} 
        />
      )}
    </div>
  );
};

export default ViewUsers;
