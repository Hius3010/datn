import mqtt from "mqtt";
// Thông tin kết nối đến Mosquitto broker
const brokerUrl = 'mqtt://localhost:1883'; // URL của broker (thay đổi nếu cần)
const username = 'haivl';
const password = 'haivl';

// Thông tin topic và message
const topic = 'test1';
const message = 'Hello MQTT';

// Khởi tạo và kết nối client
const client = mqtt.connect(brokerUrl, {
  username: username,
  password: password
});

client.on('connect', () => {
  console.log('Connected to broker');

  // Publish message đến topic
  setInterval(() => {
    client.publish(topic, message, (err) => {
        if (err) {
          console.error('Failed to publish message:', err);
        } else {
          console.log(`Message published to topic '${topic}': ${message}`);
        }
        // Đóng kết nối sau khi publish
        // client.end();
      });
  }, 100)
});

client.on('error', (err) => {
  console.error('Failed to connect to broker:', err);
});
