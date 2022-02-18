const amqp = require('amqplib/callback_api');

const QUEUE_NAME = 'test';

console.log(`Hello From Producer/Sender 😏`);

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) {
    throw err;
  }

  connection.createChannel((err, channel) => {
    channel.assertQueue(QUEUE_NAME, {
      durable: false
    });

    const message = 'Hello Riko ;)';
    const res = channel.sendToQueue(QUEUE_NAME, Buffer.from(message, 'utf-8'));
    console.log(`Message "${message} sent to queue "${QUEUE_NAME}"`);
  });
});
