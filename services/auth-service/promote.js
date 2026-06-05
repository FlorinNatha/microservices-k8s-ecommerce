const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth').then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('users').updateOne(
    { email: 'test@example.com' },
    { $set: { role: 'admin' } }
  );
  console.log('Update result:', result);
  process.exit(0);
});
