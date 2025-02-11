import React, { useState, useEffect } from "react";
import {
    List,
    ListItem,
    Avatar,
    Typography,
    TextField,
    IconButton,
    Box,
    Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import moment from "moment";

const AdminChat = () => {
    const [activeChats, setActiveChats] = useState([]); // List of active users
    const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
    const [messages, setMessages] = useState({}); // Messages per user
    const [messageInput, setMessageInput] = useState(""); // Input field for the message
    const [stompClient, setStompClient] = useState(null); // WebSocket client
    const [typingUsers, setTypingUsers] = useState({}); // Tracks users who are typing
    const [unreadUsers, setUnreadUsers] = useState({}); // Tracks users with unread messages
    const [seenNotification, setSeenNotification] = useState(null); // Tracks seen notifications
     const [lastSentMessage, setLastSentMessage] = useState(null); // Tracks the last sent message

    useEffect(() => {
        const socket = new SockJS("http://chat.localhost/ws");
        const client = new Client({
            webSocketFactory: () => socket,
        });

        client.onConnect = () => {
            console.log("Admin connected to WebSocket");
            setStompClient(client);

            // Subscribe to messages sent to Admin
            client.subscribe("/topic/admin/*", (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log("Message Received:", receivedMessage);
                const userId = receivedMessage.userId;

                setMessages((prev) => {
                    const userMessages = prev[userId] || [];
                    const isDuplicate = userMessages.some(
                        (msg) =>
                            msg.message === receivedMessage.message &&
                            msg.timestamp === receivedMessage.timestamp
                    );

                    if (isDuplicate) return prev;

                    return {
                        ...prev,
                        [userId]: [...userMessages, receivedMessage],
                    };
                });

                if (!activeChats.some((chat) => chat.id === userId)) {
                    setActiveChats((prevChats) => [
                        ...prevChats.filter((chat) => chat.id !== userId),
                        { id: userId, username: receivedMessage.sender },
                    ]);
                }
                if (!unreadUsers[userId]) {
                    setUnreadUsers((prev) => ({ ...prev, [userId]: true }));
                }
               // setUnreadUsers((prev) => ({ ...prev, [userId]: true }));
            });

            // Subscribe to typing notifications
            client.subscribe("/topic/admin/*/typing", (message) => {
                const typingInfo = JSON.parse(message.body);
                console.log("Typing Notification Received:", typingInfo);
                const userId = typingInfo.userId;

                setTypingUsers((prev) => ({
                    ...prev,
                    [userId]: true,
                }));

                setTimeout(() => {
                    setTypingUsers((prev) => ({
                        ...prev,
                        [userId]: false,
                    }));
                }, 3000);
            });

            // Subscribe to read notifications
            client.subscribe("/topic/admin/*/messageRead", (message) => {
                console.log("Read Notification Received:", message.body);
                const readNotification = JSON.parse(message.body);
                const userId = readNotification.userId;
                const readTimestamp = readNotification.timestamp;

                setMessages((prev) => ({
                    ...prev,
                    [userId]: prev[userId]?.map((msg) =>
                        msg.timestamp === readNotification.timestamp && msg.sender === "Admin"
                            ? { ...msg, read: true }
                            : msg
                    ),
                }));
                // setUnreadUsers((prev) => {
                //     const newUnreadUsers = { ...prev };
                //     delete newUnreadUsers[userId];
                //     return newUnreadUsers;
                // });

                 if (lastSentMessage && lastSentMessage.timestamp === readTimestamp) {
                setSeenNotification(
                    `seen`
                );
                 }
               // setSeenNotification(`seen your message sent at ${moment(readNotification.timestamp).format("HH:mm")}`);
                setSeenNotification(`seen`);

    });
        };

        client.activate();

        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, [activeChats,lastSentMessage]);

    const sendMessage = () => {
        if (!messageInput.trim() || !selectedUser || !stompClient || !stompClient.connected) {
            console.error("STOMP client is not connected or required parameters are missing");
            return;
        }

        const timestamp = new Date().toISOString();
        const newMessage = {
            sender: "Admin",
            userId: selectedUser.id,
            message: messageInput,
            type: "CHAT",
            timestamp,
        };

        stompClient.publish({
            destination: "/app/chat.adminToUser",
            body: JSON.stringify(newMessage),
        });

        setMessages((prev) => ({
            ...prev,
            [selectedUser.id]: [
                ...(prev[selectedUser.id] || []),
               // { ...newMessage, read: false },
                { sender: "Admin", message: messageInput, timestamp, read: false },

            ],
        }));

         setLastSentMessage(newMessage);
        setSeenNotification(null);
        setMessageInput("");
    };

    const handleTyping = () => {
        if (stompClient && selectedUser) {
            stompClient.publish({
                destination: "/app/chat.typing",
                body: JSON.stringify({ userId: selectedUser.id, sender: "Admin" }),
            });
        }
    };

    // Notify read status when opening a conversation
    useEffect(() => {
        if (selectedUser && messages[selectedUser.id]) {
            messages[selectedUser.id].forEach((msg) => {
                if (msg.sender !== "Admin" && !msg.read) {
                    stompClient.publish({
                        destination: "/app/chat.messageRead",
                        body: JSON.stringify({
                            sender: "Admin",
                            userId: selectedUser.id,
                            timestamp: msg.timestamp,
                        }),
                    });
                }
            });

            setUnreadUsers((prev) => {
                const newUnreadUsers = { ...prev };
                delete newUnreadUsers[selectedUser.id];
                return newUnreadUsers;
            });
        }
    }, [selectedUser, messages]);

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: "25%", borderRight: "1px solid #ccc", padding: 2 }}>
                <Typography variant="h6">Active Chats</Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <List>
                    {activeChats.map((user) => (
                        <ListItem
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            sx={{
                                bgcolor: selectedUser?.id === user.id ? "primary.light" : "transparent",
                                cursor: "pointer",
                                position: "relative",
                            }}
                        >
                            <Avatar sx={{ bgcolor: "secondary.main" }}>
                                {user.username.charAt(0)}
                            </Avatar>
                            <Box sx={{ marginLeft: 2 }}>
                                <Typography>{user.username}</Typography>
                                {typingUsers[user.id] && (
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{ fontStyle: "italic" }}
                                    >
                                        Typing...
                                    </Typography>
                                )}
                            </Box>
                            {unreadUsers[user.id] && (
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        bgcolor: "green",
                                        borderRadius: "50%",
                                        position: "absolute",
                                        top: "50%",
                                        right: 10,
                                        transform: "translateY(-50%)",
                                    }}
                                ></Box>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ flexGrow: 1, padding: 2 }}>
                {selectedUser ? (
                    <>
                        <Typography variant="h6">{selectedUser.username}</Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        <List sx={{ maxHeight: "70vh", overflowY: "auto" }}>
                            {(messages[selectedUser.id] || []).map((msg, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        flexDirection: msg.sender === "Admin" ? "row-reverse" : "row",
                                        alignItems: "center",
                                        gap: 1,
                                        marginBottom: 2,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: msg.sender === "Admin" ? "primary.main" : "grey.500",
                                        }}
                                    >
                                        {msg.sender.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box
                                        sx={{
                                            bgcolor: msg.sender === "Admin" ? "primary.main" : "grey.300",
                                            color: msg.sender === "Admin" ? "white" : "black",
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
                        </List>

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
                            <IconButton
                                color="primary"
                                onClick={sendMessage}
                                disabled={!messageInput.trim()}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h6" align="center">
                        Select a user to start a chat
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default AdminChat;
