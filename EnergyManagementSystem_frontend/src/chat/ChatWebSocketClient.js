import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class ChatWebSocketClient {
    constructor() {
        this.client = null;
    }

    connect(onMessageReceived, onConnectedCallback) {
        if (this.client) {
            this.client.deactivate();
        }

        this.client = new Client({
            brokerURL: "ws://chat.localhost/ws",
            webSocketFactory: () => new SockJS("http://chat.localhost/ws"),
            onConnect: () => {
                console.log("Connected to WebSocket for chat");
                this.client.subscribe("/topic/public", (message) => {
                    console.log("Received chat message:", message.body);
                    onMessageReceived(JSON.parse(message.body));
                });
                if (onConnectedCallback) onConnectedCallback();
            },
            onStompError: (frame) => {
                console.error("Broker reported error: ", frame.headers["message"]);
                console.error("Additional details: ", frame.body);
            },
        });

        this.client.activate();
    }

    sendMessage(destination, message) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(message),
            });
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

export default new ChatWebSocketClient();
