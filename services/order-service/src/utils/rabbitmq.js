const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();
    console.log('RabbitMQ Connected');
    
    // Assert queues to ensure they exist
    await channel.assertQueue('ORDER_CREATED');
    await channel.assertQueue('PAYMENT_SUCCESS');
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error.message);
  }
};

const publishEvent = async (queue, data) => {
  if (!channel) await connectRabbitMQ();
  if (channel) {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    console.log(`[x] Event published to ${queue}`);
  }
};

const consumeEvent = async (queue, callback) => {
  if (!channel) await connectRabbitMQ();
  if (channel) {
    channel.consume(queue, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log(`[x] Event received from ${queue}`);
        await callback(data);
        channel.ack(msg);
      }
    });
  }
};

module.exports = { connectRabbitMQ, publishEvent, consumeEvent };
