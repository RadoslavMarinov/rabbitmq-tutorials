require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});

const {
  AMP_PROTOCOL,
  AMP_PATH,
  APM_PORT = 5672,
  AMP_HOST = 'localhost',
  AMP_QUEUE_NAME='test',
  AMP_USER,
  AMP_PASS,
} = process.env;

const amqp = require('amqplib');
const connectUrl = `${AMP_PROTOCOL}://${AMP_USER}:${AMP_PASS}@${AMP_HOST}/${AMP_PATH}`
console.log(connectUrl)
console.log(`Hello From Producer/Sender 😏`);

producer();

async function producer() {
  try {
    const connection = await amqp.connect(process.env.CLOUDAMQP_URL);
    const channel = await connection.createChannel();

    channel
      .assertQueue(AMP_QUEUE_NAME, {
        durable: false
      })
      .then((res) => {
        console.log(`QUEUE "${AMP_QUEUE_NAME}" is fine :)`, res);
      })
      .catch((e) => {
        console.error(`QUEUE Error: `, e);
      });

    setInterval(() => {
      const message = { name: 'Riko', age: Math.ceil(Math.random() * 30) };
      const res = channel.sendToQueue(
        AMP_QUEUE_NAME,
        Buffer.from(JSON.stringify(message), 'utf-8')
      );
      console.log(`Message "${message} sent to queue "${AMP_QUEUE_NAME}"`);
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}
