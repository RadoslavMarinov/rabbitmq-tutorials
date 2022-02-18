require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});
const {
  APM_PORT = 5672,
  AMP_HOST = 'localhost',
  AMQP_QUEUE_NAME
} = process.env;

const amqp = require('amqplib');

console.log(`Hello From Producer/Sender 😏`);

producer();

async function producer() {
  try {
    const connection = await amqp.connect(`amqp://${AMP_HOST}:${APM_PORT}`);
    const channel = await connection.createChannel();

    channel
      .assertQueue(AMQP_QUEUE_NAME, {
        durable: false
      })
      .then((res) => {
        console.log(`QUEUE "${AMQP_QUEUE_NAME}" is fine :)`, res);
      })
      .catch((e) => {
        console.error(`QUEUE Error: `, e);
      });

    setInterval(() => {
      const message = { name: 'Riko', age: Math.ceil(Math.random() * 30) };
      const res = channel.sendToQueue(
        AMQP_QUEUE_NAME,
        Buffer.from(JSON.stringify(message), 'utf-8')
      );
      console.log(`Message "${message} sent to queue "${AMQP_QUEUE_NAME}"`);
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}
