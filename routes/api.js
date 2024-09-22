const express = require('express');
const router = express.Router();
const { auth, db } = require('../firebaseConfig');

// Alumni Registration (using Firebase Auth and Firestore)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Create user with email and password using Firebase Admin SDK
        const userRecord = await auth.createUser({
            email: email,
            password: password,
        });

        // Save additional user information in Firestore
        await db.collection('alumni').doc(userRecord.uid).set({
            name: name,
            email: email,
            createdAt: new Date()
        });

        res.status(200).send('User registered successfully');
    } catch (error) {
        console.error('Error registering:', error.message);
        res.status(500).send('Registration failed');
    }
});

// Donation handling
router.post('/donate', async (req, res) => {
    const { name, amount } = req.body;

    try {
        // Save donation details to Firestore
        await db.collection('donations').add({
            name: name,
            amount: amount,
            donatedAt: new Date()
        });

        res.status(200).send('Donation successful');
    } catch (error) {
        console.error('Error donating:', error.message);
        res.status(500).send('Donation failed');
    }
});

module.exports = router;
