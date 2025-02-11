// ChatWebSocketClient.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketClient {
    constructor() {
        this.client = null;
    }

    connect(userId, onMessageReceived) {
        if (this.client) {
            this.client.deactivate();
        }

        this.client = new Client({
            brokerURL: "ws://monitoring.localhost/ws",
            webSocketFactory: () => new SockJS("http://monitoring.localhost/ws"),
            onConnect: () => {
                console.log("Connected to WebSocket with userId:", userId);
                this.client.subscribe(`/topic/notifications/${userId}`, (message) => {
                    console.log("Received message:", message.body);
                    onMessageReceived(JSON.parse(message.body));
                });
            },
            onStompError: (frame) => {
                console.error("Broker reported error: ", frame.headers["message"]);
                console.error("Additional details: ", frame.body);
            },
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

export default new WebSocketClient();
