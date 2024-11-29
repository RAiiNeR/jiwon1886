import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client';
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
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false); // 채팅창
    const startMsg = ('안녕하세요, 무엇을 도와드릴까요?');
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socket = new SockJS('http://192.168.0.90/back/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log('WebSocket connected');
            client.subscribe('/topic/messages', (msg) => {
                const newMessage = JSON.parse(msg.body) as ChatMessage;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }, () => {
            console.error("WebSocket connection error");
        });

        setStompClient(client);

        return () => {
            if (client) client.disconnect();
        };
    }, []);

    useEffect(() => {
        // 메시지가 업데이트될 때마다 스크롤을 최신 메시지로 이동
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (stompClient && message.trim()) {
            const chatMessage: ChatMessage = {
                id: username,
                value: message,
                state: 1,
            };

            // 서버에 메시지 전송 할 때 /app -> 
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
            setMessages((prevMessages) => [...prevMessages, chatMessage]);
            setMessage('');
        }
    };

    return (
        <div className="chat">
            {!isChatOpen && ( // 채팅창이 닫혀 있을 때
                <div className="chat-preview" onClick={() => setIsChatOpen(true)}>
                    <i className="fa-regular fa-comment-dots i-size"></i>
                </div>
            )}

            {isChatOpen && ( // 채팅창이 열려 있을 때
                <div className="chat-container">
                    <div className='chatRoom'>
                        <div className='chat-head'>CHATBOT</div>
                        <div className="chat-window" ref={chatWindowRef}>
                            <p className='start-msg'>{startMsg}</p>
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.id === username ? 'my-message' : 'other-message'}`}>
                                    <p style={{whiteSpace:'pre-wrap'}}>{msg.value.replace(/<br>/g,'\n')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="input-container">
                            <input type="text" value={message} onChange={(e) => {setMessage(e.target.value); setUsername(username === "Server" ? "Server" : "User")}}
                                placeholder="궁금하신 점이 있으신가요?" className="chat-input"/>
                            <button onClick={sendMessage} className="send-button">
                                <i className="fa-regular fa-paper-plane send-size"></i>
                            </button>
                        </div>
                    </div>
                    <div className='exit-box'>
                        <div onClick={() => setIsChatOpen(false)} className='chat-exit'>
                            <i className="fa-solid fa-xmark exit-size"></i>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat