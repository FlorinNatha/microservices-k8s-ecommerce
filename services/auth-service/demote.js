const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth').then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('users').updateMany(
    { email: 'User01@example.com' }, // or we can update all except a specific real admin
    { $set: { role: 'user' } }
  );
  // Actually let's just demote EVERYONE to 'user' so they can see the button disappear, then if they want an admin they can register one via mongo manually later or I can provide a script.
  const resultAll = await db.collection('users').updateMany(
    {}, 
    { $set: { role: 'user' } }
  );
  console.log('Demoted all users to user role:', resultAll.modifiedCount);
  process.exit(0);
});
