const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const AdminModel = mongoose.model('AdminModel')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')




router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, city, state, gender, sources } = req.body;

      

        const existingUser = await AdminModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Adjust the salt rounds as needed

        const newUser = new AdminModel({
            name,
            email,
            password: hashedPassword,
            phone,
            city,
            state,
            gender,
            sources,
            updatedAt: new Date()  // Add this line to set the initial updatedAt timestamp
        });

        const savedUser = await newUser.save();
        if (savedUser) {
            console.log("User saved");
            return res.status(201).json({ message: "User registration successful" });
        } else {
            console.log("Server error");
            return res.status(500).json({ message: "Server error" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});
// router.post('/signup', async (req, res) => {
//     try {
//         const { name, email, password, phone, city, state, gender, sources } = req.body;

//         if (!name || !email || !password || !phone || !city || !state) {
//             return res.status(400).json({ message: "One or more mandatory fields are empty" });
//         }

//         const existingUser = await AdminModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 12); // Adjust the salt rounds as needed

//         const newUser = new AdminModel({
//             name,
//             email,
//             password: hashedPassword,
//             phone,
//             city,
//             state,
//             gender,
//             sources,
//             updatedAt: new Date()  // Add this line to set the initial updatedAt timestamp
//         });

//         const savedUser = await newUser.save();
//         if (savedUser) {
//             console.log("User saved");
//             return res.status(201).json({ message: "User registration successful" });
//         } else {
//             console.log("Server error");
//             return res.status(500).json({ error: "Server error" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "An error occurred" });
//     }
// });








router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "One or more mandatory fields are empty" });
        }

        const user = await AdminModel.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "Login failed" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Incorrect password");
            return res.status(400).json({ message: "Login failed" });
        }

        console.log("Login Success");

        const jwtToken = jwt.sign({ _id: user._id }, JWT_SECRET);
        const userInfo = { email: user.email, name: user.name };

        return res.status(200).json({ result: { token: jwtToken, user: userInfo }, message: "Login Success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/all', async (req, res) => {
    try {
        const allAdmins = await AdminModel.find();
        console.log(allAdmins)
        res.status(200).json({ success: true, data: allAdmins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.get('/details/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId)

        // Assuming AdminModel has a method like findById to find a user by their ID
        const user = await AdminModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.delete('/delete/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
    
        const deletedAdmin = await AdminModel.findByIdAndDelete(userId);
        
        if (!deletedAdmin) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: deletedAdmin, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


router.put('/update/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, email, password, phone, city, state, gender, sources } = req.body;

        // Check if the provided user ID is valid
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // // Check for mandatory fields
        // if (!name || !email || !phone || !city || !state) {
        //     return res.status(400).json({ message: "One or more mandatory fields are empty" });
        // }

        // Find the user by ID
        const existingUser = await AdminModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        existingUser.name = name;
        existingUser.email = email;
        existingUser.phone = phone;
        existingUser.city = city;
        existingUser.state = state;
        existingUser.gender = gender;
        existingUser.sources = sources;

        // If a new password is provided, hash and update it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            existingUser.password = hashedPassword;
        }

        // Set the updatedAt field to the current date and time
        existingUser.updatedAt = new Date();

        // Save the updated user to the database
        const updatedUser = await existingUser.save();

        // Check if the user was successfully updated
        if (updatedUser) {
            console.log("User updated");
            return res.status(200).json({ message: "User updated successfully" });
        } else {
            console.log("Server error");
            return res.status(500).json({ error: "Server error" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});



module.exports = router;

