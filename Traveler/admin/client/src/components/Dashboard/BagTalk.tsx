import axios from "axios";
import React, { useEffect, useState } from "react";

const BagTalk: React.FC<{ data: any, isBot: boolean, setIsBot: (e: boolean) => void }> = (props) => {
  const Avatar = [
    require("../../assets/images/xs/avatar1.jpg"),
    require("../../assets/images/xs/avatar2.jpg"),
    require("../../assets/images/xs/avatar3.jpg"),
    require("../../assets/images/xs/avatar4.jpg"),
    require("../../assets/images/xs/avatar5.jpg"),
    require("../../assets/images/xs/avatar6.jpg"),
    require("../../assets/images/xs/avatar7.jpg"),
    require("../../assets/images/xs/avatar8.jpg"),
    require("../../assets/images/xs/avatar9.jpg"),
    require("../../assets/images/xs/avatar10.jpg")
  ]
  const { data, isBot, setIsBot } = props;
  const [chatData, setChatData] = useState([...data]);
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [txtMessage, setTxtMessage] = useState("");

  // console.log(1, chatData);

  useEffect(() => {
    setTimeout(() => {
      const chatHistory = document.getElementById("chatHistory")
      if (chatHistory) {
        chatHistory.scrollTo({
          top: chatHistory.scrollHeight + 100,
          // behavior: 'smooth'
        });
      }
    }, 10);
  }, []);

  const handleSubmit = (username: string) => {
    const addChat = async (chat: string) => {
      const data = new FormData();
      data.append('chat', chat);
      data.append('isBot', `${isBot}`)
      await axios.post(`${process.env.REACT_APP_BACK_END_URL}/chat/${username}`, data);
    }
    addChat(txtMessage)
    setTxtMessage('');
  }

  const handleKeyEnter = (e: React.KeyboardEvent, username: string) => {
    if (e.key.toLowerCase() === 'enter' && txtMessage) {
      handleSubmit(username);
    }
  }

  const onChangeMessageText = (e: any) => { setTxtMessage(e) }

  function onClickToggle(e: any) {
    e.preventDefault();
    var ele = document.getElementById("chatMenuList");
    if (ele) {
      if (ele.classList.contains("open")) {
        ele.classList.remove("open");
      } else {
        ele.classList.add("open");
      }
    }
  }

  return (
    <div className="col-12 d-flex">
      <div id="chatMenuList" className="card card-chat border-right border-top-0 border-bottom-0 order-0 w380 ">
        <div className="px-4 py-3 py-md-4">
          <div className="input-group mb-3">
            <input type="text" className="form-control mb-1" placeholder="Search..." />
          </div>

          <div className="nav nav-pills justify-content-between text-center">
            <a className={`flex-fill rounded border-0 nav-link ${!isBot && "active"}`} href="#!" onClick={(e) => { e.preventDefault(); setIsBot(false) }}>1 : 1</a>
            <a className={`flex-fill rounded border-0 nav-link ${isBot && "active"}`} href="#!" onClick={(e) => { e.preventDefault(); setIsBot(true) }}>챗봇</a>
          </div>
        </div>
        <div className="tab-content border-top">
          <div className="tab-pane fade show active" id="tab-conatain1" role="tabpanel">
            <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
              {
                chatData.map((d, i) => {
                  if (d.data.length > 0)
                    return <li key={"545" + i} className={`list-group-item px-md-4 py-3 py-md-4 ${activeChatIndex === i ? 'open' : ''}`}>
                      <a href="#!" className="d-flex" onClick={(e) => { e.preventDefault(); setActiveChatIndex(i) }}>
                        <img className="avatar rounded-circle" src={Avatar[i % 10]} alt="" />
                        <div className="flex-fill ms-3 text-truncate">
                          <h6 className="d-flex justify-content-between mb-0"><span>{d.Name}({d.username})</span> <small className="msg-time">{new Date(d.data[d.data.length - 1].date).toLocaleDateString()}</small></h6>
                          <span className="text-muted">{d.data[d.data.length - 1].messages.length > 0 ? d.data[d.data.length - 1].messages[d.data[d.data.length - 1].messages.length - 1].message : ""}</span>
                        </div>
                      </a>
                    </li>
                  else
                    return <li></li>
                })
              }
            </ul>
          </div>
        </div>

      </div>
      <div className="card card-chat-body border-0 order-1 w-100 px-4 px-md-5 py-3 py-md-4">
        <div className="chat-header d-flex justify-content-between align-items-center border-bottom pb-3">
          <div className="d-flex">
            <a href="community" title="Home"><i className="icofont-arrow-left fs-4"></i></a>
            <a href="#!" title="">
              {/* <img className="avatar rounded" src={chatData[activeChatIndex].image} alt="avatar" /> */}
            </a>
            <div className="ms-3">
              <h6 className="mb-0">{chatData[activeChatIndex].Name}({chatData[activeChatIndex].username})</h6>
              <small className="text-muted">Last date: {new Date(chatData[activeChatIndex].data[chatData[activeChatIndex].data.length - 1]?.date).toLocaleDateString()}</small>
            </div>
          </div>
          <div className="d-flex">
            <a className="nav-link py-2 px-3 d-block d-xl-none chatlist-toggle" href="!#" onClick={(e) => onClickToggle(e)}><i className="fa fa-bars"></i></a>
          </div>
        </div>
        <ul id="chatHistory" className="chat-history list-unstyled mb-0 py-lg-5 py-md-4 py-3 flex-grow-1">
          {
              chatData[activeChatIndex].data.map((dates: any) => {
                return dates.messages.map((d: any, i: number) => {
                  return (
                    <li key={"messages" + i} className={d.type === 'user' ? "mb-3 d-flex flex-row align-items-end" : "mb-3 d-flex flex-row-reverse align-items-end"}>
                      <div className={`max-width-70 ${d.type === 'user' ? "" : "text-end"}`}>
                        <div className="user-info mb-1">
                          {d.type === 'user' ? <img className="avatar sm rounded-circle me-1" src={Avatar[activeChatIndex % 10]} alt="avatar" /> : null}
                          <span className="text-muted small">{new Date(dates.date).toLocaleDateString()}</span>
                          {/* <span className="text-muted small">{dates.messages.length}</span> */}
                        </div>
                        <div className={`card border-0 p-3 ${d.type === 'user' ? "" : "color-bg-100 text-light text-start"}`}>
                          <div className="message">
                            {d.message}
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })
              })
          }
        </ul>
        {
          !isBot &&
          <div className="chat-message">
            <textarea typeof="text" className="form-control"
              style={{ resize: 'none' }}
              value={txtMessage} placeholder="Enter text here..."
              onChange={(e) => { onChangeMessageText(e.target.value); }}
              onKeyDown={e => handleKeyEnter(e, chatData[activeChatIndex].username)} />
            <button className="btn btn-dark" type="button" onClick={_ => handleSubmit(chatData[activeChatIndex].username)}>Send</button>
          </div>
        }
      </div>
    </div>
  );
}



export default BagTalk;