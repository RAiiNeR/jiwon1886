// import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from 'react'
// import SockJS from 'sockjs-client';
import '../../css/chat.css';
import axios from 'axios';

interface ChatMessage {
  id: string; // 메세지 보내는 사람 ID
  value: string; // 메세지 내용
  state: number; // 메세지 구분(사용자, 서버)
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 체팅 메세지 리스트
  const [message, setMessage] = useState<string>(''); // 입력중인 메세지
  const [stompClient, setStompClient] = useState<any>(null);
  const [username, setUsername] = useState<string>('test'); // 사용자 이름
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false); // 채팅창(열림,닫힘)
  const startMsg = ('안녕하세요, 무엇을 도와드릴까요?');
  const chatWindowRef = useRef<HTMLDivElement>(null); // 채팅창 스크롤 제어 

  useEffect(() => {
    // 메시지가 업데이트될 때마다 스크롤을 최신 메시지로 이동
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const addChat = async (chat: string) => {
    const data = new FormData();
    data.append('chat', chat);
    const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/chat/${username}`, data);
    // console.log(response);
    const chatMessage: ChatMessage = {
      id: 'Admin', // 보낸 사람 ID
      value: response.data, // 메시지 내용
      state: 0, // 메시지 상태 (사용자가 보낸 메시지)
    };

    // 서버에 메시지 전송 
    // stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
    setMessages((prevMessages) => [...prevMessages, chatMessage]); // 메시지를 화면에 추가
  }

  // 메세지 전송 함수
  const sendMessage = () => {
    const chatMessage: ChatMessage = {
      id: username, // 보낸 사람 ID
      value: message, // 메시지 내용
      state: 1, // 메시지 상태 (사용자가 보낸 메시지)
    };
    setMessages((prevMessages) => [...prevMessages, chatMessage]); // 메시지를 화면에 추가
    setMessage(''); // 입력창 초기화

    addChat(message)
  };

  //엔터키 입력
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { // Enter 눌리면
      e.preventDefault(); // 기본 동작 방지
      sendMessage(); // 메세지 전송
    }
  };

  return (
    <div className="chat">
      {!isChatOpen && ( // 채팅창이 닫혀 있을 때
        <div className="chat-preview" onClick={() => setIsChatOpen(true)}>
          <i className="fa-solid fa-person-walking-luggage i-size"></i> {/* 채팅 열기 아이콘 */}
        </div>
      )}

      {isChatOpen && ( // 채팅창이 열려 있을 때
        <div className="chat-container">
          <div className='chatRoom'>
            <div className='chat-head'>CHATBOT</div>
            {/* 채팅 메시지 창 */}
            <div className="chat-window" ref={chatWindowRef}>
              <p className='start-msg'>{startMsg}</p> {/* 초기 메시지 */}
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.id === username ? 'my-message' : 'other-message'}`}>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.value.replace(/<br>/g, '\n')}</p> {/* 메시지 내용 */}
                </div>
              ))}
            </div>
            {/* 메시지 입력창 */}
            <div className="input-container">
              <input type="text" value={message} onChange={(e) => { setMessage(e.target.value); }}
                placeholder="궁금하신 점이 있으신가요?" className="chat-input" onKeyDown={handleKeyDown} />
              <button onClick={sendMessage} className="send-button"> {/* 엔터키 이벤트 처리 */}
                <i className="fa-regular fa-paper-plane send-size"></i>
              </button>
            </div>
          </div>
          {/* 채팅창 닫기 버튼 */}
          <div className='exit-box'>
            <div onClick={() => setIsChatOpen(false)} className='chat-exit'>
              <i className="fa-solid fa-xmark exit-size"></i> {/* 닫기 아이콘 */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat