import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProfileContainer = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const profilePicture = user.profilePicture;
  const profileImgUrl = profilePicture
    ? `/image/${user.profilePicture.split('/').pop()}`
    : '/image/defaultProfile.jpg';

  return (
    <Link to="/profileEdit" className="profile-container-link">
      <div
        className="profile-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={profileImgUrl} alt="Profile" className="profile-img" />
        {isHovered && (
          <div className="profile-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProfileContainer;
