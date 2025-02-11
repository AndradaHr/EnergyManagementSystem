// Notifications.js
import React, { useEffect, useState } from "react";
import WebSocketClient from "./WebSocketClient";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const Notifications = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("http://user.localhost/auth/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserId(response.data.id);
            } catch (error) {
                console.error("Eroare la obținerea userId-ului:", error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            WebSocketClient.connect(userId, (message) => {
                toast.info(message.alertMessage || message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
        }
        return () => {
            WebSocketClient.disconnect();
        };
    }, [userId]);

    return (
        <div>
            <ToastContainer />
        </div>
    );
};

export default Notifications;
