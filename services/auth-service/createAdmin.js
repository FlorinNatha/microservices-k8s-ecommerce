const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-db';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPass123!';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

mongoose.connect(MONGO_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Update or insert admin
    const result = await db.collection('users').updateOne(
      { email: ADMIN_EMAIL },
      { 
        $set: { 
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date()
        } 
      },
      { upsert: true }
    );
    
    console.log(`Admin account (${ADMIN_EMAIL}) successfully created or updated!`);
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
});
