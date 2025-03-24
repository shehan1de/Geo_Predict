import React, { useEffect, useState } from "react";

const ProfileContainer = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem("profilePicture");
    const storedUserName = localStorage.getItem("userName");

    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    } else {
      setProfilePicture("http://localhost:5001/image/defaultProfile.jpg");
    }

    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []); // Run once on component mount

  return (
    <div className="profile-container">
      <div className="card shadow-lg p-4">
        <h3 className="text-center">User Profile</h3>

        <div className="text-center">
         
          <img
            src={profilePicture}
            alt="Profile"
            className="img-fluid rounded-circle"
            style={{ width: "150px", height: "150px" }}
          />
        </div>

        <h4 className="text-center mt-3">{userName || "No Name Available"}</h4>
      </div>
    </div>
  );
};

export default ProfileContainer;
