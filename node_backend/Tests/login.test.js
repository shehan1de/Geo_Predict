// const request = require('supertest');
// const app = require('../server');
// const User = require('../Model/User');
// const mongoose = require('mongoose');




// describe(authController)


// const request = require('supertest');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const app = require('../server');  // Import the app
// const User = require('../Model/User');  // Import the User model

// // Setup before running tests
// beforeAll(async () => {
//     await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
// });

// // Clean up after tests
// afterAll(async () => {
//     await mongoose.connection.close();
// });

// describe('POST /api/auth/login', () => {
//     it('should login a user with correct credentials', async () => {
//         // User data provided in your example
//         const userData = {
//             name: 'shehan de silva',
//             email: 'linukaofficial4@gmail.com',
//             password: 'shehan123ewer', // Plain text password for login attempt
//             role: 'Admin',
//             profilePicture: 'images/defaultProfile.jpg',
//             userId: 21,
//         };

//         // Create user using hashed password
//         const hashedPassword = '$2b$10$u9/pbFrG6H8hqot4Bz1CPe3iNwnjCXD23W7KonbT.KZfkCK0ZK6Ji'; // Hashed password from your example
//         const user = new User({
//             ...userData,
//             password: hashedPassword,
//         });

//         await user.save();  // Save the user in the database

//         // Now, attempt to login with the provided email and plain text password
//         const response = await request(app)
//             .post('/api/auth/login')
//             .send({ email: userData.email, password: userData.password })
//             .expect(200);  // Expect success status

//         // Check if the response contains a token
//         expect(response.body).toHaveProperty('token');
//     });

//     it('should fail with incorrect credentials', async () => {
//         const response = await request(app)
//             .post('/api/auth/login')
//             .send({ email: 'linukaofficial4@gmail.com', password: 'wrongpassword' })
//             .expect(400);  // Expect failure status

//         expect(response.body.message).toBe('Invalid credentials');
//     });
// });


    // it("should login a user with correct credentials", async () => {
    //     const response = await request(app)
    //         .post("/api/auth/login")
    //         .send({
    //             email: "testuser@example.com",
    //             password: "testpassword",
    //         });

    //     expect(response.status).toBe(200); // Should return 200 for successful login
    //     expect(response.body).toHaveProperty("token"); // Response should have a token
    //     expect(response.body).toHaveProperty("userId");
    //     expect(response.body.userId).toBe(user.userId); // Check if the correct userId is returned
    // });

    // it("should return 400 for invalid email", async () => {
    //     const response = await request(app)
    //         .post("/api/auth/login")
    //         .send({
    //             email: "invaliduser@example.com", // Non-existing email
    //             password: "testpassword",
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toHaveProperty("message", "Invalid credentials");
    // });

    // it("should return 400 for incorrect password", async () => {
    //     const response = await request(app)
    //         .post("/api/auth/login")
    //         .send({
    //             email: "testuser@example.com",
    //             password: "wrongpassword", // Incorrect password
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toHaveProperty("message", "Invalid credentials");
    // });

    // it("should return 400 for missing email", async () => {
    //     const response = await request(app)
    //         .post("/api/auth/login")
    //         .send({
    //             password: "testpassword", // Missing email
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toHaveProperty("message", "Invalid email");
    // });

    // it("should return 400 for missing password", async () => {
    //     const response = await request(app)
    //         .post("/api/auth/login")
    //         .send({
    //             email: "testuser@example.com", // Missing password
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toHaveProperty("message", "Password is required");
    // });
//});