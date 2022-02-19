require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});
const {
  AMP_PROTOCOL,
  APM_PORT = 5672,
  AMP_HOST = 'localhost',
  AMP_PATH,
  AMP_QUEUE_NAME='test',
  AMP_USER,
  AMP_PASS,
} = process.env;
const amqp = require('amqplib');

const connectUrl = `${AMP_PROTOCOL}://${AMP_USER}:${AMP_PASS}@${AMP_HOST}/${AMP_PATH}`
console.log(connectUrl)

async function consume() {
  try {
    const connection = await amqp.connect( process.env.CLOUDAMQP_URL);
    const channel = await connection.createChannel();

    channel
      .assertQueue(AMP_QUEUE_NAME, {
        durable: false
      })
      .then((res) => {})
      .catch((error) => console.error(error));

    channel.consume(
      AMP_QUEUE_NAME,
      (msg) => {
        console.log(
          `Message from ${AMP_QUEUE_NAME} arrived: `,
          JSON.parse(msg.content.toString())
        );
      },
      { noAck: true }
    );
  } catch (error) {
    console.error(error);
  }
}

consume();
