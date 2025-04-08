import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import MainIndex from "./screens/MainIndex";

function App(props: any) {
  const location = useLocation();
  const isLoginPage = location.pathname.includes("/login/login");

  const activekey = () => {
    let res = window.location.pathname;
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const baseUrlList = baseUrl?.split("/");
    let resList = res.split("/");
    if (!baseUrlList) return;
    res = res.length > 0 ? resList[baseUrlList.length] : "/";
    res = res ? "/" + res : "/";
    return res;
  };

  return (
      <div id="mytask-layout" className="theme-indigo">
        {/* 로그인 페이지가 아닐 때만 Sidebar 표시 */}
        {!isLoginPage && <Sidebar activekey={activekey()} />}
        <MainIndex />
      </div>
  );
}

export default App;
