const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err.message));
client.on('connect', () => console.log('Redis Connected'));

const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
  }
};

module.exports = { client, connectRedis };
