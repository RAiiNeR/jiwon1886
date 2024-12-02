import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import './Chat.css';

interface ChatMessage {
    id: string;
    value: string;
    state: number;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>('');
    const [stompClient, setStompClient] = useState<any>(null);
    const [username, setUsername] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const chatWindowRef = useRef<HTMLDivElement>(null); // chat-window를 참조하기 위한 useRef 추가

    useEffect(() => {
        const socket = new SockJS('http://192.168.0.90/ictdemo1104/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            setIsConnected(true);
            client.subscribe('/topic/messages', (msg) => {
                const newMessage = JSON.parse(msg.body) as ChatMessage;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }, () => {
            console.error("WebSocket 접속에러");
            setIsConnected(false);
        });

        setStompClient(client);

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        // 메시지가 업데이트될 때마다 스크롤을 최신 메시지로 이동
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]); // messages 배열이 변경될 때마다 실행

    const handleLogin = () => {
        if (username.trim()) {
            setIsLoggedIn(true);
            const loginMessage: ChatMessage = {
                id: username,
                value: `${username}님이 입장했습니다.`,
                state: 0,
            };
            if (isConnected) {
                stompClient.send('/app/chat', {}, JSON.stringify(loginMessage));
            }
            axios.get<string[]>('http://192.168.0.90/ictdemo1104/api/chat/history')
            .then((response) => {
                setMessages(response.data.map((line) => {
                    const [id, ...valueParts] = line.split(': ');
                    return { id, value: valueParts.join(': '), state: 1 } as ChatMessage;
                }));
            });
        }
    };

    const sendMessage = () => {
        if (stompClient && isConnected && message.trim()) {
            const chatMessage: ChatMessage = {
                id: username,
                value: message,
                state: 1,
            };
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
            setMessage('');
        } else {
            console.warn("전송에러");
        }
    };

    return (
        <div>
            {!isLoggedIn ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div>
                    <div className="chat-window" ref={chatWindowRef}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message 
                                ${msg.id === username ? 'my-message' : 'other-message'}`}
                            >
                                <strong>{msg.id}:</strong> {msg.value}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter message"
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default Chat;