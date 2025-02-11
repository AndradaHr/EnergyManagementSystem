// ChatRoom Component (User Perspective)
import React, { useState, useEffect } from "react";
import {
    List,
    ListItem,
    Avatar,
    Typography,
    TextField,
    IconButton,
    Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import moment from "moment";

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [user, setUser] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [seenNotification, setSeenNotification] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://user.localhost/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                connectToChat(response.data);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };

        fetchUserData();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
                setSubscribed(false);
            }
        };
    }, [stompClient]);

    const connectToChat = (userData) => {
        if (subscribed) return;

        const socket = new SockJS("http://chat.localhost/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            console.log("User connected to WebSocket");
            setStompClient(client);

            client.subscribe(`/topic/user/${userData.id}/messages`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        ...receivedMessage,
                        timestamp: receivedMessage.timestamp || new Date().toISOString(),
                        read: false,
                    },
                ]);
            });

            client.subscribe(`/topic/user/${userData.id}/typing`, (message) => {
                const typingInfo = JSON.parse(message.body);
                console.log("Typing notification received from Admin:", typingInfo.sender);
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            });

            client.subscribe(`/topic/user/${userData.id}/messageRead`, (message) => {
                const readNotification = JSON.parse(message.body);
                console.log("Read Notification Received:", readNotification);

                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.timestamp === readNotification.timestamp &&
                        msg.sender === "Admin"
                            ? { ...msg, read: true }
                            : msg
                    )
                );
                //setSeenNotification(`Admin has seen your message sent at ${moment(readNotification.timestamp).format("HH:mm")}`);
                setSeenNotification(`seen`);

            });

            client.publish({
                destination: "/app/chat.addUser",
                body: JSON.stringify({
                    sender: userData.username,
                    userId: userData.id,
                    type: "JOIN",
                }),
            });

            setSubscribed(true);
        };

        client.onStompError = (error) => {
            console.error("STOMP error:", error);
        };

        client.activate();
    };

    const sendMessage = () => {
        if (!messageInput.trim() || !user || !stompClient) return;

        const timestamp = new Date().toISOString();
        stompClient.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify({
                sender: user.username,
                userId: user.id,
                message: messageInput,
                type: "CHAT",
                timestamp,
            }),
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender: user.username,
                userId: user.id,
                message: messageInput,
                type: "CHAT",
                timestamp,
                read: false,
            },
        ]);

        setSeenNotification(null);
        setMessageInput("");
    };

    const handleTyping = () => {
        if (stompClient && user) {
            stompClient.publish({
                destination: "/app/chat.typing",
                body: JSON.stringify({ userId: user.id, sender: user.username }),
            });
        }
    };

    useEffect(() => {
        if (user && messages.length > 0) {
            messages.forEach((msg) => {
                if (msg.sender !== user.username && !msg.read) {
                    stompClient.publish({
                        destination: "/app/chat.messageRead",
                        body: JSON.stringify({
                            sender: user.username,
                            userId: user.id,
                            timestamp: msg.timestamp,
                        }),
                    });
                }
            });
        }
    }, [user, messages, stompClient]);

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "auto",
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "background.paper",
            }}
        >
            <List sx={{ maxHeight: 400, overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <ListItem
                        key={`${msg.sender}-${msg.timestamp}-${index}`}
                        sx={{
                            display: "flex",
                            flexDirection: msg.sender === user?.username ? "row-reverse" : "row",
                            alignItems: "center",
                            gap: 1,
                            marginBottom: 2,
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: msg.sender === user?.username ? "primary.main" : "grey.500",
                            }}
                        >
                            {msg.sender.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box
                            sx={{
                                bgcolor: msg.sender === user?.username ? "primary.main" : "grey.300",
                                color: msg.sender === user?.username ? "white" : "black",
                                padding: 1,
                                borderRadius: 2,
                                maxWidth: "75%",
                            }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                {moment(msg.timestamp).format("HH:mm")}
                            </Typography>
                            <Typography variant="body1">{msg.message}</Typography>
                            {msg.sender === "Admin" && msg.read && (
                                <Typography
                                    variant="caption"
                                    color="success.main"
                                    sx={{ fontStyle: "italic" }}
                                >
                                    Seen
                                </Typography>
                            )}
                        </Box>
                    </ListItem>
                ))}
                {isTyping && (
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        align="left"
                        sx={{ marginLeft: 2, fontStyle: "italic" }}
                    >
                        Admin is typing...
                    </Typography>
                )}
                {seenNotification && (
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        align="right"
                        sx={{ marginTop: 2, fontStyle: "italic" }}
                    >
                        {seenNotification}
                    </Typography>
                )}
            </List>

            <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Type a message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleTyping}
                />
                <IconButton color="primary" onClick={sendMessage} disabled={!messageInput.trim()}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatRoom;
