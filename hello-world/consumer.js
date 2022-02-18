require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});
const {
  APM_PORT = 5672,
  AMP_HOST = 'localhost',
  AMQP_QUEUE_NAME
} = process.env;
const amqp = require('amqplib');

async function consume() {
  try {
    const connection = await amqp.connect(`amqp://${AMP_HOST}:${APM_PORT}`);
    const channel = await connection.createChannel();

    channel
      .assertQueue(AMQP_QUEUE_NAME, {
        durable: false
      })
      .then((res) => {})
      .catch((error) => console.error(error));

    channel.consume(
      AMQP_QUEUE_NAME,
      (msg) => {
        console.log(
          `Message from ${AMQP_QUEUE_NAME} arrived: `,
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
