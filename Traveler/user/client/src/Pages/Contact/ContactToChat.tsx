// 2025.02.14. 19:05 생성자: 이학수
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { appear_animate, handleScroll, updateHalfHeight } from '../../Comm/CommomFunc';
import axios from 'axios';
import '../../css/contactToChat.css'

interface ChatLogs {
    logfile: string;
    cdate: string;
    type: number;
}

interface Chating {
    date: string;
    chats: Array<{ isUser: boolean; name: string; content: string; }>;
}

const ContactToChat: React.FC = () => {
    const [userName, setUserName] = useState('test');
    const [chats, setChats] = useState<ChatLogs[]>([]);
    const [chatBots, setChatBots] = useState<ChatLogs[]>([]);
    const [chatings, setChatings] = useState<Chating[]>([]);
    const [isLoading, setIsLoading] = useState(0);
    const [isListVisiable, setIsListVisiable] = useState(true);
    const [isBot, setIsBot] = useState(false)
    const [chat, setChat] = useState('');
    const [isConnect, setIsConnect] = useState(true);

    const dateObj = (dateString: string = '') => {
        if (dateString === '') return new Date()
        return new Date(dateString)
    }

    const getFileList = async () => {
        const result = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/chat/${userName}`);
        const chats = await result.data.filter((item: ChatLogs) => item.type === 0);
        const chatBots = await result.data.filter((item: ChatLogs) => item.type === 1);
        const sortedChats = await chats.sort((a: ChatLogs, b: ChatLogs) => a.cdate.localeCompare(b.cdate))
        setChats(sortedChats);
        const sortedChatBots = await chatBots.sort((a: ChatLogs, b: ChatLogs) => a.cdate.localeCompare(b.cdate))
        setChatBots(sortedChatBots);
        if (isBot) {
            fetchLogContent(sortedChatBots);
        } else {
            fetchLogContent(sortedChats);
        }
    }

    useEffect(() => {
        getFileList();
        changeActive(isBot ? 2 : 1);
    }, []);

    useEffect(() => {
        const ws = new WebSocket(`${process.env.REACT_APP_BACK_END_URL}/ws/folder-watch`);

        ws.onmessage = (event) => {
            getFileList();
            changeActive(isBot ? 2 : 1);
        };

        ws.onopen = () => {
            setIsConnect(true);
            // console.log("WebSocket 연결됨");
        };

        ws.onclose = () => {
            setIsConnect(false);
            // console.log("WebSocket 연결 종료됨");
        };

        return () => ws.close();
    }, [isBot]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {

        appear_animate();

        handleScroll();

        updateHalfHeight();
        window.addEventListener('resize', updateHalfHeight);
        return () => {
            window.removeEventListener('resize', updateHalfHeight);
        };
    }, []);

    const handleSubmit = () => {
        const addChat = async (chat: string) => {
            const data = new FormData();
            data.append('chat', chat);
            data.append('isBot', `${isBot}`)
            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/chat/${userName}`, data);
        }
        addChat(chat)
        setChat('');
    }

    const handleKeyEnter = (e: React.KeyboardEvent) => {
        if (e.key.toLowerCase() === 'enter' && chat) {
            handleSubmit();
        }
    }

    useEffect(() => {
        setIsLoading(0);
        if (chatings.length > 0) chatScrollToBottom();
    }, [chatings])

    useEffect(() => {
        if (isLoading === 0) {
            if (chatings.length > 0) chatScrollToBottom();
        }
    }, [isLoading])

    const fetchLogContent = async (chatList: ChatLogs[]) => {
        setIsLoading(1);
        const data = await Promise.all(
            chatList.map(async (chatData) => {
                try {
                    const response = await axios(`${process.env.REACT_APP_FILES_URL}/logs/${chatData.logfile}`);
                    const text = response.data;

                    const chats: any[] = [];
                    for (const line of text.split('\n')) {
                        const [name, type, content] = line.split('||');
                        const isUser = type === 'user';
                        chats.push({ isUser, name, content });
                    }

                    return { date: chatData.cdate, chats };
                } catch (error) {
                    return { date: chatData.cdate, chats: [] };
                }
            })
        );
        setChatings(data);
    }

    const chatScrollToBottom = () => {
        if (chatings.length > 0) {
            const isNotInToday = dateObj(chatings[chatings.length - 1].date).toLocaleDateString() !== dateObj().toLocaleDateString()
            const id = `chat${isBot ? 'Bot' : ''}${chatings.length - (isNotInToday ? 0 : 1)}`;
            // console.log(1, id, chatings.length, chatings, isNotInToday);
            isBot ? handleChatScroll("123", id, false) : handleChatScroll("456", id, false)
        }
        changeActive(isBot ? 2 : 1);
    }

    const handleChatScroll = (id: string, eid: string, animate: boolean = true) => {
        // console.log(id, eid)
        setTimeout(() => {
            const scrollelement = document.getElementById(id);
            const element = document.getElementById(eid);
            if (element && scrollelement) {
                // console.log(element.offsetParent, element.parentElement?.style.display, element.offsetTop - 53)
                scrollelement.scrollTo(animate ? {
                    top: element.offsetTop - 53, // 요소의 상단 위치
                    behavior: 'smooth'      // 부드럽게 스크롤
                } : { top: scrollelement.scrollHeight, });
            }
        }, 10)
    }

    const changeActive = (e: number) => {
        setTimeout(() => {
            document.getElementById('v-tab1')?.classList.remove('active');
            document.getElementById('v-tab2')?.classList.remove('active');

            document.getElementById(`v-tab${e}`)?.classList.add('active');
        }, 100)
    }

    const drawChatUI = () => {
        const isNotToday = (date: string) => { return dateObj(date).toLocaleDateString() !== dateObj().toLocaleDateString() };

        const isNotInToday = (chat : any) => {
            return dateObj(chat[chat.length - 1]?.cdate).toLocaleDateString() !== dateObj().toLocaleDateString()
        }

        return (
            <div key={isLoading} className="row mb-5">

                <div className='col-md-3 border p-0' style={{ height: '500px', display: isListVisiable ? 'block' : 'none' }}>
                    <div className="nav-link-wrap py-3 d-flex justify-content-center border-bottom">
                        <div className="nav nav-pills nav-fill" id="v-pills-tab">
                            <div className='col-md-4'>
                                <button className="nav-link" id="v-tab1"
                                    onClick={_ => { setIsBot(false); fetchLogContent(chats); changeActive(1) }}
                                >
                                    1:1
                                </button>
                            </div>
                            <div className='col-md-8'>
                                <button className="nav-link" id="v-tab2"
                                    onClick={_ => { setIsBot(true); fetchLogContent(chatBots); changeActive(2) }}
                                >
                                    챗봇
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-12 p-0' style={{ height: '417px', overflowY: 'auto', display: isListVisiable ? 'block' : 'none' }}>
                        <button className='border-bottom d-flex align-items-center justify-content-center btn btn-light rounded-0 w-100'
                            style={{ height: '80px', color: '#bbb' }}
                            onClick={_ => { handleChatScroll((isBot ? '123' : '456'), `chat${isBot ? 'Bot' : ''}${(isBot ? chatBots : chats).length - (isNotInToday(isBot ? chatBots : chats) ? 0 : 1)}`) }}>
                            <span className='h6 m-0 text-dark'>{dateObj().toLocaleDateString()} 문의</span>
                        </button>
                        {
                            (isBot ? [...chatBots] : [...chats]).reverse().map((chat, idx) => {
                                if (!isNotToday(chat.cdate)) return <></>
                                return (
                                    <button key={idx}
                                        className='border-bottom d-flex align-items-center justify-content-center btn btn-light rounded-0 w-100'
                                        style={{ height: '80px', color: '#bbb' }}
                                        onClick={_ => { handleChatScroll(isBot ? '123' : '456', `chat${isBot ? 'Bot' : ''}${(isBot ? chatBots : chats).length - (1 + idx + (isNotInToday(isBot ? chatBots : chats) ? 0 : 1))}`) }}
                                    >
                                        <span className='h6 m-0 text-dark'>문의 내역: {dateObj(chat.cdate).toLocaleDateString()}</span>
                                    </button>)
                            })
                        }
                    </div>
                </div>
                <div key={isLoading} className={`${isListVisiable ? 'col-md-9' : 'col-md-12'} border pt-3 bg-opacity-10`}
                    style={{
                        background: `${isBot ?
                            'linear-gradient(160deg,rgba(0, 201, 252, 0.69) 20%, rgb(255, 255, 255)) ' :
                            'linear-gradient(160deg,rgba(0, 165, 0, 0.45) 50%, rgba(251, 255, 0, 0.45))'}`,
                        height: '500px'
                    }}>
                    {
                        isListVisiable ? (
                            <i className='h5 icon-arrow-left' style={{ zIndex: 10 }} onClick={_ => setIsListVisiable(false)} />
                        ) : (
                            <i className='h5 icon-arrow-right' style={{ zIndex: 10 }} onClick={_ => setIsListVisiable(true)} />
                        )
                    }
                    <div
                        id={isBot ? '123' : '456'}
                        // ref={isBot ? chatBotContainerRef : chatContainerRef}
                        style={{
                            height: '400px',
                            overflowY: 'auto',
                            padding: '10px',
                            scrollbarWidth: "none"
                        }}>
                        {
                            !isLoading && isConnect ? <>
                                {
                                    chatings.length > 0 && chatings.map((chating, idx) => (
                                        <div key={'chat' + idx} className='mb-3' id={`chat${isBot ? 'Bot' : ''}${idx}`}>
                                            <div className='text-center mb-3'>
                                                <span className='bg-light p-2 rounded'>{dateObj(chating.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className='mb-3'>
                                                {
                                                    chating.chats.length > 0 && chating.chats.map((chat, idx) => (
                                                        <div key={idx} className={`${chat.isUser ? 'text-end' : 'text-start'} mx-4 mb-2`}>
                                                            <p className='mb-1'>{chat.name}</p>
                                                            <span className='bg-light p-2 rounded d-inline-block'
                                                                style={{
                                                                    maxWidth: '50%',
                                                                    boxShadow: '3px 3px 3px 1px rgba(0, 0, 0, 0.5)'
                                                                }}>
                                                                {chat.content}
                                                            </span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            {isNotToday(chating.date) && <hr className='my-5' />}
                                        </div>))
                                }
                                {
                                    (isNotInToday(isBot ? chatBots : chats) || (isBot ? chatBots : chats).length === 0) && <>
                                        <div className='text-center mb-3' id={`chat${isBot ? 'Bot' : ''}${chatings.length}`}>
                                            <span className='bg-light p-2 rounded'>{dateObj().toLocaleDateString()}</span>
                                        </div>
                                        <div className='mb-3'>
                                            <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
                                                <h2 className='text-light bg-secondary p-2'
                                                    style={{ borderRadius: '1rem' }}>
                                                    금일 문의 내역이 없습니다.
                                                </h2>
                                            </div>
                                        </div>
                                    </>
                                }
                            </> : <>
                                <div className='text-center mb-3'>
                                    <span className='bg-light p-2 rounded'>{dateObj().toLocaleDateString()}</span>
                                </div>
                                <div className='mb-3'>
                                    <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
                                        <h2 className='text-light bg-secondary p-2'
                                            style={{ borderRadius: '1rem' }}>
                                            데이터 로딩 중
                                        </h2>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <div style={{
                        height: '50px',
                        display: 'flex'
                    }}>
                        <input type="text"
                            className='bg-light rounded-top rounded-bottom form-control me-3'
                            placeholder='문의 내역을 입력해주세요'
                            value={chat}
                            onChange={e => setChat(e.target.value)}
                            onKeyDown={e => handleKeyEnter(e)} />
                        <button type='button'
                            className='btn btn-success rounded-top rounded-bottom'
                            onClick={handleSubmit}>
                            전송
                        </button>
                    </div>
                </div>
            </div >)
    }

    return (
        <div>
            <div className="hero-wrap js-halfheight contact-title" style={{ backgroundImage: "url('./images/contactTitle.jpg')",backgroundSize:"40%",backgroundPositionY:"47%",position:"relative",zIndex:"1" }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax='{"properties": {"translateY": "70%"}}'>
                            <p className="breadcrumbs" data-scrollax='{"properties": {"translateY": "30%", "opacity": 1.6}}'>
                                <span className="mr-2"><Link to="/traveler/home">Home</Link></span> <span>Contact</span>
                            </p>
                            <h1 className="mb-3 bread" data-scrollax='{"properties": {"translateY": "30%", "opacity": 1.6}}'>문의 하기</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section contact-section ftco-degree-bg">
                <div className="container">
                    <div className="mb-4">
                        <h3>문의하기</h3>
                    </div>
                    <div className="col-md-12 nav-link-wrap mb-4">
                        <div className="nav ftco-animate nav-pills nav-fill" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <button className="nav-link active" id="v-pills-whatwedo-tab"
                                data-bs-toggle="pill" data-bs-target="#v-pills-whatwedo" role="tab"
                                aria-controls="v-pills-whatwedo" aria-selected="true"
                                onClick={_ => { fetchLogContent(chats); chatScrollToBottom(); setIsBot(false); }}
                            >
                                문의 내역
                            </button>

                            <button className="nav-link" id="v-pills-goal-tab"
                                data-bs-toggle="pill" data-bs-target="#v-pills-goal" role="tab"
                                ria-controls="v-pills-goal" aria-selected="false">
                                연락처 정보
                            </button>
                        </div>
                    </div>
                    <div className="tab-content ftco-animate" id="v-pills-tabContent">
                        <div className="tab-pane show active" id="v-pills-whatwedo" role="tabpanel" aria-labelledby="v-pills-whatwedo-tab">
                            {
                                drawChatUI()
                            }
                        </div>

                        <div className="tab-pane" id="v-pills-goal" role="tabpanel" aria-labelledby="v-pills-goal-tab">
                            <div className="row d-flex contact-info mb-4">
                                <div className="col-md-12 mb-4">
                                    <h2 className="h4">연락처 정보</h2>
                                </div>
                                <div className="w-100"></div>
                                <div className="col-md-3">
                                    <p><span>주소:</span> 서울 서초구 서초대로77길 41 4층</p>
                                </div>
                                <div className="col-md-3">
                                    <p><span>전화번호:</span> <Link to="tel://1234567920">+ 1235 2355 98</Link></p>
                                </div>
                                <div className="col-md-3">
                                    <p><span>이메일:</span> <Link to="mailto:info@yoursite.com">info@yoursite.com</Link></p>
                                </div>
                                <div className="col-md-3">
                                    <p><span>Website</span> <Link to="#">yoursite.com</Link></p>
                                </div>
                            </div>

                            {/* 회사 오시는 길 추가 */}
                            <div className='row'>
                                <div className='col-md-6'>
                                    {/* Google Maps 삽입 */}
                                    <div className="map-responsive">
                                        <iframe
                                            title="회사 오시는 길"
                                            width="100%"
                                            height="300"
                                            src="https://www.google.com/maps/embed/v1/place?q=서울+서초구+서초대로77길+41&key=api...key"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h3 className="h5 mb-3">회사 오시는 길</h3>
                                    <p>서울 서초구 서초대로77길 41 4층에 위치해 있습니다.</p>
                                    <p>🚇 지하철: 2호선 강남역 5번 출구 도보 10분</p>
                                    <p>🚗 주차: 건물 내 유료 주차 가능</p>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>
            </section >
        </div >
    );
};

export default ContactToChat;
