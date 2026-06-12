const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-db';

mongoose.connect(MONGO_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin01', salt);

    // Update or insert admin@gmail.com
    const result = await db.collection('users').updateOne(
      { email: 'admin@gmail.com' },
      { 
        $set: { 
          username: 'admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date()
        } 
      },
      { upsert: true }
    );
    
    console.log('Admin account (admin@gmail.com / Admin01) successfully reset or created!');
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
});
