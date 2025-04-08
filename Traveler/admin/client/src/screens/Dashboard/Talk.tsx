import React, { useEffect, useState } from "react";
// import { chatAppData } from "../../components/Data/AppData";
import BagTalk from "../../components/Dashboard/BagTalk";
import axios from "axios";

interface ChatLogs {
  logfile: string;
  cdate: string;
  type: number;
}

interface ChatLogByUsers {
  name: string;
  username: string;
  chatlog: Array<ChatLogs>;
}

interface ChatingLog {
  Name: string;
  username: string;
  data: Array<{ date: string; messages: Array<{ message: string; type: string; }> }>;
}

const Talk: React.FC = () => {
  const [chats, setChats] = useState<ChatLogByUsers[]>([]);
  const [isLoading, setIsLoading] = useState(0);
  const [isConnect, setIsConnect] = useState(true);
  const [isBot, setIsBot] = useState(false);
  const [chatAppData, setChatAppData] = useState<ChatingLog[]>([]);


  const getFileList = async () => {
    const result = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/chat`);
    const chatLogByUsers = result.data;

    const sortedData = chatLogByUsers.map((user: any) => ({
      ...user,
      chatlog: user.chatlog.sort((a: any, b: any) => new Date(a.cdate).getTime() - new Date(b.cdate).getTime())
    }));

    setChats(sortedData);
    // console.log(sortedData)
    await test(chatLogByUsers);
  }

  const test = async (chatList: ChatLogByUsers[]) => {
    // console.log("파일 읽는 중")
    const chatAppData: ChatingLog[] = [];
    for (const chat of chatList) {
      const name = chat.name;
      const username = chat.username;
      const chatlog = chat.chatlog.filter((item: ChatLogs) => item.type === (isBot ? 1 : 0));
      const chats = await fetchLogContent(chatlog);

      const data: any = chats.map((chat) => ({
        date: chat.date,
        messages: chat.chats.map((c) => ({
          message: c.content,
          type: c.isUser ? "user" : "admin",
        })),
      }));

      chatAppData.push({ Name: name, username:username, data });
    }
    setChatAppData(chatAppData)
    // console.log(3, chatAppData)
    setIsLoading(0);
  }

  useEffect(() => {
    if (chats.length > 0) {
      test(chats);
    }
  }, [chats, isBot])

  const fetchLogContent = async (chatList: ChatLogs[]) => {
    setIsLoading(1);
    // console.log(0, chatList)
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
    // setChatings(data);
    // console.log(2, data);
    return data;
  }

  useEffect(() => {
    getFileList();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_BACK_END_URL}/ws/folder-watch`);

    ws.onmessage = (event) => {
      getFileList();

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

  if (chatAppData.length === 0 && isConnect) {
    return <div>로딩</div>
  }

  // console.log(chatAppData)

  return (
    <div className="container-xxl">
      <div key={isLoading} className="row clearfix g-3">
        {/* <Chattile data={chatAppData} /> */}
        <BagTalk data={chatAppData} isBot={isBot} setIsBot={e => setIsBot(e)} />
      </div>
    </div>
  )

}

export default Talk;