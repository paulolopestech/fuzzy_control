import 'dotenv/config'
import { WebSocketServer } from "./websocket.server";
import { MqttClient } from "./mqtt.client";

const PORT = 3001;
const webSocketServer = new WebSocketServer(PORT);

const brokerUrl = `mqtt://${process.env.MQTT_BROKER_URL}`;
const mqttClient = new MqttClient(brokerUrl, webSocketServer);
// mqttClient.subscribeToTopic(`Resfriador/Temperatura`);
