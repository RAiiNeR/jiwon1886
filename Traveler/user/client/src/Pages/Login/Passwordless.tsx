import React, { useEffect, useState } from 'react';
import '../../css/passwordless.css';  // 경로를 올바르게 수정
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { login } from './action/authAction';
import axios from 'axios';



let loginStatus = false;
let servicePassword: string;
let check_millisec = 0;
let timeoutId: any = null;
let passwordless_milisec = 0;
let passwordless_terms = 0;
let btnLoginText = '로그인';
let sessionId: string | null = ''
let checkType = '';
let pushConnectorUrl = '';
let pushConnectorToken = '';
let qrSrc = '';
let serverUrl = '';
let registerKey = '';

const Passwordless: React.FC = () => {

  const [title, setTitle] = useState('Password 로그인');
  const [checkMod, setCheckMod] = useState(true);
  const [selPasswordNo, setSelPasswordNo] = useState(2);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/traveler/home';
  const dispatch = useDispatch<AppDispatch>();

  // Password 로그인 & Passwordless 로그인 선택 radio 버튼
  const selPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === '1') {
      setSelPasswordNo(1);
    } else if (value === '2') {
      setSelPasswordNo(2);
    }
  }

  // passwordless 관리페이지 이동
  const moveManagePasswordless = () => {
    setSelPasswordNo(3);
    setTitle('PasswordLess 등록/해지');
    btnLoginText = 'PasswordLess 등록/해지';
    setCheckMod(true);
  }

  // 로그인화면으로 이동
  const cancelManage = () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    setPw('');
    setSelPasswordNo(2);

    const login_content = document.getElementById('login_content');
    if (login_content) login_content.style.display = 'block';
    const passwordless_reg_content = document.getElementById('passwordless_reg_content');
    if (passwordless_reg_content) passwordless_reg_content.style.display = 'none';
    const passwordless_unreg_content = document.getElementById('passwordless_unreg_content');
    if (passwordless_unreg_content) passwordless_unreg_content.style.display = 'none';
  }

  const callApi = async (data: any) => {
    let ret_val;
    await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/member/passwordlessCallApi`, null, {
      params: {
        url: data.url,
        params: data.params
      },
      withCredentials: true,
    })
      .then(res => { ret_val = res.data; })
      .catch(res => {
        console.log("[ERROR] code: " + res.xhr.status + ", message: " + res.xhr.responseText + ", status: " + res.status + ", ERROR: " + res.error);
      });

    return ret_val;
  }

  // 로그인 취소
  const cancelLogin = async () => {
    loginStatus = false;

    if (timeoutId != null) {
      // console.log(timeoutId)
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    const passwordless_bar = document.getElementById('passwordless_bar');
    if (passwordless_bar) passwordless_bar.style.width = '0%';

    const passwordless_num = document.getElementById('passwordless_num');
    if (passwordless_num) passwordless_num.innerHTML = "--- ---";

    sessionId = localStorage.getItem('session_id');

    const data = {
      url: "cancelUrl",
      params: "userId=" + id + "&sessionId=" + sessionId
    }

    const result: any = await callApi(data);
    const resultData = result.data;
    const jsonData = JSON.parse(resultData);
    const msg = jsonData.msg;
    const code = jsonData.code;

    localStorage.removeItem('session_id');


    btnLoginText = '로그인';

    const btn_login = document.getElementById('btn_login');
    if (btn_login) btn_login.innerHTML = btnLoginText;
    // console.log(btnLoginText)
  }

  // 인증기가 등록여부 확인 요청
  const passwordlessCheckID = async (QRReg: string) => {
    let ret_val = "";
    const data = {
      url: "isApUrl",
      params: "userId=" + id + "&QRReg=" + QRReg
    }

    const result: any = await callApi(data);
    console.log(result);

    const strResult = result.result;
    if (strResult === "OK") {
      const resultData = result.data;
      const jsonData = JSON.parse(resultData);
      const msg = jsonData.msg;
      const code = jsonData.code;

      //console.log("result=" + strResult);
      //console.log("data=" + data);
      //console.log("msg [" + msg + "] code [" + code + "]");

      if (code === "000" || code === "000.0") {
        const exist = jsonData.data.exist;
        if (exist) ret_val = "T";
        else ret_val = "F";
      }
      else {
        ret_val = msg;
      }
    }
    else {
      ret_val = strResult;
    }

    return ret_val;
  }

  // onetime token 요청
  const getTokenForOneTime = async () => {
    let ret_val = "";
    const data = {
      url: "getTokenForOneTimeUrl",
      params: "userId=" + id
    }

    const result: any = await callApi(data);
    const resultData = result.data;
    const jsonData = JSON.parse(resultData);
    const msg = jsonData.msg;
    const code = jsonData.code;

    // console.log("msg [" + msg + "] code [" + code + "]");

    if (code === "000" || code === "000.0") {
      const oneTimeToken = result.oneTimeToken;
      ret_val = oneTimeToken;
    }
    else {
      alert("Onetime Token Request error : [" + code + "] " + msg);
    }

    return ret_val;
  }

  // OTP code & 타이머 출력
  const drawPasswordlessLogin = () => {
    // console.log("----- drawPasswordlessLogin -----");
    const today = new Date();
    const gap_second = Math.ceil((today.getTime() - passwordless_milisec) / 1000);

    if (loginStatus === true) {
      if (gap_second < passwordless_terms) {
        const today = new Date();
        const now_millisec = today.getTime();
        let gap_millisec = now_millisec - check_millisec;

        if (gap_millisec > 1500) {
          check_millisec = today.getTime();
          //loginPasswordlessCheck();	// polling 방식일때 주석 제거
        }

        gap_millisec = now_millisec - passwordless_milisec;
        const ratio = 100 - (gap_millisec / passwordless_terms / 1000) * 100 - 1;
        if (ratio > 0) {
          let tmpPassword = servicePassword;
          if (tmpPassword.length === 6)
            tmpPassword = tmpPassword.substr(0, 3) + " " + tmpPassword.substr(3, 6);

          if (loginStatus === true) {
            const passwordless_bar = document.getElementById('passwordless_bar');
            if (passwordless_bar) passwordless_bar.style.width = `${ratio}%`;
            const passwordless_num = document.getElementById('passwordless_num');
            if (passwordless_num) passwordless_num.innerHTML = tmpPassword;
          }
        }

        timeoutId = setTimeout(drawPasswordlessLogin, 100);
      }
      else {
        clearTimeout(timeoutId);

        const rest_time = document.getElementById('rest_time');
        if (rest_time) rest_time.innerHTML = '0 : 00';

        setTimeout(() => alert('Passwordless 로그인 시간이 만료되었습니다.'), 100);
        setTimeout(() => cancelLogin, 100);
      }
    }
  }

  const loginPasswordlessStart = async (token: any) => {
    const paramData = {
      url: "getSpUrl",
      params: "userId=" + id + "&token=" + token
    }

    const result: any = await callApi(paramData);
    const resultData = result.data;
    const jsonData = JSON.parse(resultData);
    const msg = jsonData.msg;
    const code = jsonData.code;

    // console.log("msg [" + msg + "] code [" + code + "]");
    // console.log(jsonData.data);

    if (code === "000" || code === "000.0") {
      const term = jsonData.data.term;
      servicePassword = jsonData.data.servicePassword;
      pushConnectorUrl = jsonData.data.pushConnectorUrl;
      pushConnectorToken = jsonData.data.pushConnectorToken;
      sessionId = result.sessionId;

      localStorage.setItem('session_id', result.sessionId);

      const today = new Date();
      passwordless_milisec = today.getTime();
      passwordless_terms = parseInt(`${term - 1}`);
      // console.log("term=" + term + ", servicePassword=" + servicePassword);
      connWebSocket();
      drawPasswordlessLogin();
    }

    else if (code === "200.6") {
      sessionId = localStorage.getItem('session_id');
      //console.log("Already request authentication --> send [cancel], sessionId=" + sessionId);

      if (sessionId !== undefined && sessionId !== null && sessionId !== "") {
        const data = {
          url: "cancelUrl",
          params: "userId=" + id + "&sessionId=" + sessionId
        }

        const result: any = await callApi(data);
        const resultData = result.data;
        const jsonData = JSON.parse(resultData);
        const msg = jsonData.msg;
        const code = jsonData.code;

        if (code === "000" || code === "000.0") {
          localStorage.removeItem('session_id');
          setTimeout(() => loginPasswordlessStart(token), 500);
        }
        else {
          cancelLogin();
          alert('Try again later.');
        }
      }
      else {
        cancelLogin();
        alert('Try again later.');
      }
    }
    else if (code === "200.7") {
      cancelLogin();
      alert('Passwordless 계정이 중지되었습니다.\n계정관리자에게 문의하세요.');
    }
  }

  // Passwordless 로그인 요청
  const loginPasswordless = async () => {
    checkType = "LOGIN";

    const existId = await passwordlessCheckID("");
    // console.log("existId=" + existId);

    if (existId === "T") {
      const token = await getTokenForOneTime();
      if (token !== "") {
        loginStatus = true;
        loginPasswordlessStart(token);
      }
    }
    else if (existId === "F") {
      alert('Passwordless 서비스에 등록되어 있지 않습니다.\nPasswordless 등록이 필요합니다.');
    }
    else {
      alert(existId);
    }
  }

  // 승인 대기
  const loginPasswordlessCheck = async () => {
    //console.log("----- loginPasswordlessCheck -----");

    const today = new Date();
    const now_millisec = today.getTime();
    const gap_millisec = now_millisec - passwordless_milisec;

    if (gap_millisec < passwordless_terms * 1000 - 1000) {
      const data = {
        url: "resultUrl",
        params: "userId=" + id + "&sessionId=" + sessionId
      }

      const result: any = await callApi(data);
      const token = result.token;
      localStorage.setItem('token', token);
      const resultData = result.data;
      const jsonData = JSON.parse(resultData);
      const msg = jsonData.msg;
      const code = jsonData.code;

      if (code === "000" || code === "000.0") {

        var auth = jsonData.data.auth;
        if (auth === "Y") {
          clearTimeout(timeoutId);
          window.localStorage.removeItem('session_id');

          //alert("Login OK");
          navigate(`${redirectPath}`);
        }
        else if (auth === "N") {
          cancelLogin();
          setTimeout(() => alert('인증을 거부하였습니다.'), 100);
        }
      }
    }
  }

  // Passwordless 서비스 등록 체크
  const regPasswordlessOK = async () => {
    const existId = await passwordlessCheckID("T");

    if (existId === "T") {
      clearTimeout(timeoutId);
      const login_content = document.getElementById('login_content');
      if (login_content) login_content.style.display = 'none';
      const passwordless_reg_content = document.getElementById('passwordless_reg_content');
      if (passwordless_reg_content) passwordless_reg_content.style.display = 'block';

      cancelManage();
    }
  }

  const connWebSocket = () => {

    const qrSocket = new WebSocket(pushConnectorUrl);

    qrSocket.onopen = (e) => {
      // console.log("######## WebSocket Connected ########");
      const send_msg = '{"type":"hand","pushConnectorToken":"' + pushConnectorToken + '"}';
      // console.log("url [" + pushConnectorUrl + "]");
      // console.log("send [" + send_msg + "]");
      qrSocket.send(send_msg);
    }

    qrSocket.onmessage = async (event) => {
      // console.log("######## WebSocket Data received [" + qrSocket.readyState + "] ########");

      try {
        if (event !== null && event !== undefined) {
          const result = await JSON.parse(event.data);
          if (result.type === "result") {
            if (checkType === "LOGIN")
              loginPasswordlessCheck();
            else if (checkType === "QR")
              regPasswordlessOK();
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    qrSocket.onclose = (event) => {
      if (event.wasClean)
        console.log("######## WebSocket Disconnected - OK !!! [" + qrSocket.readyState + "] ########");
      else
        console.log("######## WebSocket Disconnected - Error !!! [" + qrSocket.readyState + "] ########");

      console.log("=================================================");
      console.log(event);
      console.log("=================================================");
    }

    qrSocket.onerror = (error) => {
      console.log("######## WebSocket Error !!! [" + qrSocket.readyState + "] ########");
      console.log("=================================================");
      console.log(error);
      console.log("=================================================");

      // $("#login_mobile_check").show();
      // $("#reg_mobile_check").show();
    }
  }

  const drawPasswordlessReg = () => {
    const today = new Date();
    const gap_second = Math.ceil((today.getTime() - passwordless_milisec) / 1000);

    if (gap_second < passwordless_terms) {

      const tmp_min = parseInt(`${(passwordless_terms - gap_second) / 60}`);
      let tmp_sec: any = parseInt(`${(passwordless_terms - gap_second) % 60}`);

      if (tmp_sec < 10)
        tmp_sec = "0" + tmp_sec;

      const rest_time = document.getElementById('rest_time');
      if (rest_time) rest_time.innerHTML = `${tmp_min} : ${tmp_sec}`;

      timeoutId = setTimeout(drawPasswordlessReg, 300);

      const today = new Date();
      const now_millisec = today.getTime();
      const gap_millisec = now_millisec - check_millisec;
      if (gap_millisec > 1500) {
        check_millisec = today.getTime();
        //regPasswordlessOK();	// polling 방식일때 주석 제거
      }
    }
    else {
      clearTimeout(timeoutId);

      const rest_time = document.getElementById('rest_time');
      if (rest_time) rest_time.innerHTML = "0 : 00";

      const login_content = document.getElementById('login_content');
      if (login_content) login_content.style.display = 'block';
      const passwordless_reg_content = document.getElementById('passwordless_reg_content');
      if (passwordless_reg_content) passwordless_reg_content.style.display = 'none';

      setTimeout(() => alert('Passwordless QR 등록시간이 만료되었습니다.'), 100);
      setTimeout(() => cancelLogin(), 100);
    }
  }

  // Passwordless 등록 QR코드 정보요청
  const getPasswordlessQRinfo = async (PasswordlessToken: any) => {

    checkType = "QR";
    // console.log(PasswordlessToken)
    const paramData = {
      url: "joinApUrl",
      params: "userId=" + id + "&token=" + PasswordlessToken
    }

    const result: any = await callApi(paramData);
    console.log(result);
    const resultData = result.data;
    const jsonData = JSON.parse(resultData);
    const msg = jsonData.msg;
    const code = jsonData.code;

    // console.log(paramData);
    // console.log("msg [" + msg + "] code [" + code + "]");

    if (code === "000" || code === "000.0") {
      const data = jsonData.data;
      // console.log("------------ info -----------");
      console.log(data);

      qrSrc = data.qr;
      registerKey = data.registerKey;
      serverUrl = data.serverUrl;
      const qrImg = document.getElementById('qr');
      if (qrImg) qrImg.setAttribute("src", qrSrc);

      const register_key = document.getElementById('register_key');
      if (register_key) register_key.innerHTML = registerKey;

      const server_url = document.getElementById('server_url');
      if (server_url) server_url.innerHTML = serverUrl;

      const corpId = data.corpId;
      const terms = data.terms;
      const userId = data.userId;

      // console.log("qr: " + qr);
      // console.log("corpId: " + corpId);
      // console.log("registerKey: " + registerKey);
      // console.log("terms: " + terms);
      // console.log("serverUrl: " + serverUrl);
      // console.log("userId: " + userId);

      pushConnectorUrl = data.pushConnectorUrl;
      pushConnectorToken = data.pushConnectorToken;

      // console.log("pushConnectorUrl: " + pushConnectorUrl);
      // console.log("pushConnectorToken: " + pushConnectorToken);

      const login_content = document.getElementById('login_content');
      if (login_content) login_content.style.display = 'none';
      const passwordless_reg_content = document.getElementById('passwordless_reg_content');
      if (passwordless_reg_content) passwordless_reg_content.style.display = 'block';

      let tmpRegisterKey = "";
      const tmpInterval = 4;
      for (var i = 0; i < registerKey.length / tmpInterval; i++) {
        tmpRegisterKey = tmpRegisterKey + registerKey.substring(i * tmpInterval, i * tmpInterval + tmpInterval);
        if (registerKey.length > i * tmpInterval)
          tmpRegisterKey = tmpRegisterKey + " ";
      }
      registerKey = tmpRegisterKey;

      var today = new Date();
      passwordless_milisec = today.getTime();
      passwordless_terms = parseInt(`${terms - 1}`);
      check_millisec = today.getTime();

      connWebSocket();
      drawPasswordlessReg();
    }
    else {
      alert("[" + code + "] " + msg);
    }
  }

  // Passwordless 관리요청
  const managePasswordless = async () => {
    if (id.trim() === "") {
      alert('ID를 입력하세요.');
      document.getElementById('id')?.focus();
      return false;
    }

    if (pw.trim() === "") {
      alert('PASSWORD를 입력하세요.');
      document.getElementById('pw')?.focus();
      return false;
    }

    let PasswordlessToken = "";

    await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/member/passwordlessManageCheck`, null, {
      params: {
        id: id.trim(),
        pw: pw.trim()
      },
      withCredentials: true,
    }).then(res => {
      console.log(res.data);
      if (res.data.result === "OK") {
        PasswordlessToken = res.data.PasswordlessToken;
      }
      else {
        alert(res.data.result);
        setPw('');
      }
    }).catch(res => {
      alert(res.msg);
    });

    console.log("PasswordlessToken=" + PasswordlessToken);
    const passwordlessToken = document.getElementById('passwordlessToken') as HTMLInputElement;
    if (passwordlessToken) passwordlessToken.value = PasswordlessToken;

    if (PasswordlessToken !== "") {
      const existId = await passwordlessCheckID("");
      console.log("existId=" + existId);

      if (existId === "T") {
        const login_content = document.getElementById('login_content');
        if (login_content) login_content.style.display = 'none';
        const passwordless_unreg_content = document.getElementById('passwordless_unreg_content');
        if (passwordless_unreg_content) passwordless_unreg_content.style.display = 'block';
      }
      else {
        getPasswordlessQRinfo(PasswordlessToken);
      }
    }
  }

  const loginPwl = async () => {

    if (id.trim() === "") {
      alert('ID를 입력하세요.');
      document.getElementById('id')?.focus();
      return false;
    }
    // console.log(selPasswordNo, loginStatus);

    // Passwordless 로그인
    if (selPasswordNo === 2) {
      if (loginStatus === true)
        cancelLogin();
      else {
        btnLoginText = '취소';
        const btn_login = document.getElementById('btn_login');
        if (btn_login) btn_login.innerHTML = btnLoginText;
        loginPasswordless();
      }
    }

    // Passwordless manage
    else if (selPasswordNo === 3) {
      managePasswordless();
    }
  }

  const changepw = () => {
    navigate('/changepw');
  }

  // Passwordless 서비스 해지
  const unregPasswordless = async () => {
    const passwordlessToken = document.getElementById('passwordlessToken') as HTMLInputElement;
    let token;
    if (passwordlessToken) token = passwordlessToken.value;
    const data = {
      url: "withdrawalApUrl",
      params: "userId=" + id + "&token=" + token
    }

    const result: any = await callApi(data);
    console.log(result);
    const strResult = result.data.result;
    if (strResult === "OK") {
      var resultData = result.data;
      var jsonData = JSON.parse(resultData);
      var msg = jsonData.msg;
      var code = jsonData.code;

      //console.log("data=" + data);
      //console.log("msg [" + msg + "] code [" + code + "]");

      if (code === "000" || code === "000.0") {
        localStorage.removeItem('passwordless');
        alert('Passwordless 서비스가 해지되었습니다.\n\n사용자 Password로 로그인하세요.\n\nPasswordless로 로그인하고 싶다면\nPasswordless 서비스를 먼저 등록하세요.');
        setSelPasswordNo(1);
        cancelManage();
      }
      else {
        cancelManage();
        alert("[" + code + "] " + msg);
      }
    }
    else {
      cancelManage();
      alert(strResult);
    }
  }


  const handleUnregPwl = () => {
    if (window.confirm("Passwordless 서비스를 해지하시겠습니까?")) {
      unregPasswordless();
    }
  }

  useEffect(() => {
    if (selPasswordNo === 1) {
      // setTitle('Password 로그인');
      // btnLoginText = '로그인';
      // setCheckMod(true);
      navigate('/traveler/login');
    } else if (selPasswordNo === 2) {
      setTitle('PasswordLess 로그인');
      btnLoginText = '로그인';
      setCheckMod(false);
    }
  }, [selPasswordNo]);

  return (
    <div className='passwordless'>
      <div className=" main_container">
        <div className="loginModal">
          <div className="login_article">
            <div className="title"><em style={{ width: "100%", textAlign: "center" }} id="login_title">{title}</em></div>
            <div className="content">
              <div id="login_content">
                <form id="frm">
                  <div className="input_group">
                    <input type="text" id="id" name="id" value={id} onChange={e => setId(e.target.value)} placeholder="ID" />
                  </div>
                  <div className="input_group" id="pw_group" style={{ display: checkMod ? 'block' : 'none' }}>
                    <input type="password" id="pw" name="pw" value={pw} onChange={e => setPw(e.target.value)} placeholder="PASSWORD" />
                  </div>
                </form>
                <div className="input_group" id="bar_group" style={{ display: checkMod ? 'none' : 'block' }}>
                  <div className="timer" id="bar_content" style={{ position: "relative", borderRadius: "8px", backgroundSize: "cover" }}>
                    <div className="pbar" id="passwordless_bar" style={{ background: "rgb(55 138 239 / 70%)", height: "50px", width: "0%", borderRadius: "8px", animationDuration: "0ms" }}></div>
                    <div className="OTP_num" id="passwordless_num" style={{ textShadow: "2px 2px 3px rgba(0,0,0,0.7)", top: "0", position: "absolute", fontSize: "22px", color: "#ffffff", textAlign: "center", height: "50px", width: "100%", lineHeight: "50px", fontWeight: "800", letterSpacing: "1px" }}>
                      --- ---
                    </div>
                  </div>
                </div>

                <div id="passwordlessSelButton" style={{ height: "30px", marginTop: "10px", marginBottom: "10px", display: selPasswordNo !== 3 ? 'block' : 'none' }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", padding: "6px 10px 16px 10px", textAlign: "right" }}>
                      <label htmlFor="selLogin1" style={{ margin: "0", padding: "0", fontFamily: "'Noto Sans KR', sans-serif", fontWeight: "300", fontSize: "medium" }}>
                        <input type="radio" id="selLogin1" name="selLogin" value="1" onChange={selPassword} checked={checkMod} />
                        Password
                      </label>
                    </span>
                    <span style={{ display: "inline-block", padding: "6px 10px 16px 10px", textAlign: "right" }}>
                      <label htmlFor="selLogin2" style={{ margin: "0", padding: "0", fontFamily: "'Noto Sans KR', sans-serif", fontWeight: "300", fontSize: "medium" }} >
                        <input className="radio_btn" type="radio" id="selLogin2" name="selLogin" value="2" onChange={selPassword} checked={!checkMod} />
                        Passwordless
                      </label>
                    </span>
                  </div>
                </div>

                {
                  selPasswordNo === 3 && (
                    <div id="passwordlessNotice">
                      <div style={{ textAlign: "center", lineHeight: "24px" }}>
                        Passwordless 서비스를 등록/해지 하려면<br />사용자 인증이 필요합니다.
                      </div>
                    </div>
                  )
                }

                <div className="btn_zone">
                  <a onClick={loginPwl} className="btn active_btn" id="btn_login">{btnLoginText}</a>
                </div>

                <div className="menbership" id="login_bottom1" style={{ textAlign: "center", display: selPasswordNo !== 3 ? 'block' : 'none' }}>
                  <Link to='/signup'>회원가입</Link>
                  <a onClick={checkMod ? changepw : moveManagePasswordless} style={{ fontWeight: checkMod ? 'normal' : "800" }}>{checkMod ? '비밀번호찾기' : 'Passwordless 등록/해지'}</a>
                </div>

                <div className="menbership" id="manage_bottom" style={{ textAlign: "center", display: selPasswordNo === 3 ? 'block' : 'none' }}>
                  <a onClick={changepw}>비밀번호찾기</a>
                  <a onClick={cancelManage} style={{ fontWeight: "800" }}>로그인</a>
                </div>
              </div>

              <div id="passwordless_reg_content" style={{ display: "none"}}>
                <div style={{ textAlign: "center" }}>
                  <span style={{ width: "100%", textAlign: "center", fontWeight: "500", fontSize: "24px" }}>
                    <br />
                    Passwordless 서비스 등록
                  </span>
                  <br />
                  <img id="qr" src={qrSrc} width="300px" height="300px" style={{ display: "inline-block", marginTop: "10px" }} />
                  <p style={{ width: "100%", padding: "0% 0%", fontWeight: "500", fontSize: "16px", lineHeight: "24px;" }}>
                    스마트폰에 Passwodless X1280앱을<br />설치한 후 QR코드를 스캔하세요.
                  </p>
                  <br />
                  <span style={{ display: "inline-block", width: "100%", fontSize: "18px", padding: "10px", marginBottom: "20px" }}>
                    <div style={{ gap: "10px", display: "flex", justifyContent: "center", margin: "8px 0", fontSize: "13px" }}>
                      <div style={{ width: "88%", textAlign: "left" }}>
                        <span style={{ width: "30%" }}>[ 서버 URL ]</span>
                        <span id="server_url" style={{ fontWeight: "800" }}></span></div>
                    </div>
                    <div style={{ gap: "10px", display: "flex", justifyContent: "center", margin: "8px 0", fontSize: "13px" }}>
                      <div style={{ width: "88%", textAlign: "left" }}>
                        <span style={{ width: "30%" }}>[ 등록 코드 ]</span>
                        <span id="register_key" style={{ fontWeight: "800" }}></span></div>
                    </div>
                    <br />
                    <b><span id="rest_time" style={{ fontSize: "24px", textShadow: "1px 1px 2px rgba(0,0,0,0.9)", color: "#afafaf" }}></span></b>
                  </span>
                </div>
                <div className="btn_zone">
                  <a onClick={cancelManage} className="btn active_btn" id="btn_login">취소</a>
                </div>
              </div>
              <input type="hidden" id="passwordlessToken" name="passwordlessToken" value="" />
              <div id="passwordless_unreg_content" style={{ display: "none", width: "100%", textAlign: "center", fontWeight: "500", fontSize: "24px", lineHeight: "35px" }}>
                Passwordless 서비스 해지
                <br />
                <br />
                <div className="passwordless_unregist">
                  <div style={{ padding: "0px" }}>
                    <button type="button" id="btn_unregist" name="btn_unregist" onClick={handleUnregPwl}
                      style={{ height: "120px", borderRadius: "4px", color: "#FFFFFF", background: "#3C9BEE", borderColor: "#3090E0", padding: "4px 20px", fontSize: "20px", lineHeight: "40px" }}>
                      Passwordless 서비스<br />해지하기
                    </button>
                  </div>
                  <div>
                    &nbsp;
                    <br />
                    <p style={{ width: "100%", padding: "0% 0%", fontWeight: "500", fontSize: "16px", lineHeight: "24px" }}>
                      Passwodless서비스를 해지하면<br />사용자 패스워드로 로그인해야 합니다.
                    </p>
                  </div>
                  <br />
                  <div className="btn_zone">
                    <a onClick={cancelManage} className="btn active_btn" id="btn_login">취소</a>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </div >
      </div >
    </div>
  );
};

export default Passwordless;