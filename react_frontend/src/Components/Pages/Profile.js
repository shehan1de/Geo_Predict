import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast, ToastContainer } from 'react-toastify';
import '../css/profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    userId: '',
    name: '',
    email: '',
    accountType: '',
    profilePicture: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/user/${userId}`);
        setUser({
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          accountType: response.data.accountType,
          profilePicture: response.data.profilePicture
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Error fetching user details');
      }
    };

    fetchUserDetails();
  }, [userId]);

  const profilePicture = user.profilePicture;
  const profileImgUrl = previewImage || (profilePicture
    ? `/image/${user.profilePicture.split('/').pop()}`
    : '/image/defaultProfile.jpg');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'currentPassword') {
      setShowCurrentPassword((prev) => !prev);
    } else if (field === 'newPassword') {
      setShowNewPassword((prev) => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append('name', user.name);
    
    if (user.currentPassword) formData.append('currentPassword', user.currentPassword);
    if (user.newPassword) formData.append('newPassword', user.newPassword);
    if (user.confirmPassword) formData.append('confirmPassword', user.confirmPassword);
    if (file) formData.append('image', file);
  
    try {
      const response = await axios.put(`/api/users/user/${userId}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      const updatedUser = response.data;
  
      if (updatedUser.profilePicture) {
        const profilePicturePath = `/image/${updatedUser.profilePicture.split('/').pop()}`;
        localStorage.setItem('userProfilePicture', profilePicturePath);
      }
  
      setUser({
        ...updatedUser,
        profilePicture: updatedUser.profilePicture,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
  
      setLoading(false);
      toast.success('Profile updated successfully!');

      setTimeout(() => {
        window.location.reload();
      }, 3000);
  
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error updating profile: ${errorMessage}`);
    }
  };

  return (
    <div className="main-content">
      <div className="pp-container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4>We need to update more information...</h4>
            <p className="text-muted">Update your details</p>
          </div>
          <div className="text-center">
            <div className="mt-2">
              <img src={profileImgUrl} alt="Profile" className="profile-img" />
              <label className="btn btn-sm btn-primary me-2 update">
                <PencilSquare /> Update
                <input type="file" hidden onChange={handleFileChange} />
              </label>
              <button className="btn btn-sm btn-danger" onClick={handleRemoveImage}>
                <Trash /> Remove
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">User ID</label>
            <input type="text" className="form-control readonly-input" value={userId} readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control readonly-input" value={user.email} readOnly />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Current Password</label>
            <div className="input-group">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className="form-control"
                name="currentPassword"
                value={user.currentPassword}
                onChange={handleChange}
              />
              <span className="input-group-text" onClick={() => togglePasswordVisibility('currentPassword')}>
                <i className={showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">New Password</label>
            <div className="input-group">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="form-control"
                name="newPassword"
                value={user.newPassword}
                onChange={handleChange}
              />
              <span className="input-group-text" onClick={() => togglePasswordVisibility('newPassword')}>
                <i className={showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
              </span>
            </div>
          </div>
          <div className="col-md-6 mb-3 position-relative">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
              />
              <span className="input-group-text" onClick={() => togglePasswordVisibility('confirmPassword')}>
                <i className={showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <button type="submit" className="btn login-btn submit-pro" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Update Profile'}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
