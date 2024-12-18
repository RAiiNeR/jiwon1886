import React, { Key, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import './App.css'
import NooriGunEmployee from './orgchart/NooriGunEmployee';
import ComplaintProcesePage from './orgchart/ComplaintProcesePage';
import CompleChartPage from './complechart/CompleChartPage';
import LoginPage from './signup/LoginPage';
import SignUp from './signup/Sign_Up';
import PromoteListPage from './promote/PromoteListPage';
import FaqPage from './faq/FaqPage';
import SuggestionListPage from './suggestion/SuggestionListPage';
import SuggestionFormPage from './suggestion/SuggestionFormPage';
import MyPage from './mypage/MyPage';
import CompleChartDetailPage from './complechart/CompleChartDetailPage';
import PromoteDetailPage from './promote/PromoteDetailPage';
import CompleFormPage from './comple/CompleFormPage';
import MapRoad from './directions/MapRoad';
import QnaBoardListPage from './qna/QnaBoardListPage';
import QnaBoardFormPage from './qna/QnaBoardFormPage';
import QnaBoardDetailPage from './qna/QnaBoardDetailPage';
import CompleBoardEditFormPage from './comple/CompleBoardEditFormPage';
import CompleBoardDetailPage from './comple/CompleBoardDetailPage';
import CompleBoardListPage from './comple/CompleBoardListPage';
import SuggestionDetailPage from './suggestion/SuggestionDetailPage';
import Chat from './chatbot/Chat';
import MyPageUpdate from './mypage/MyPageUpdate';
import FreeboardDetailPage from './freeboard/FreeboardDetailPage';
import FreeboardFormPage from './freeboard/FreeboardFormPage';
import FreeboardListPage from './freeboard/FreeboardListPage';
import KakaoLogining from './kakaoLogin/KakaoLogining';
import KaKaologin from './kakaoLogin/KaKaologin';
import AfterKakaoLogin from './kakaoLogin/AfterKakaoLogin';
import SocialSignup from './kakaoLogin/SocialSignup';
import axios from 'axios';
import { useAppDispatch } from './signup/store';
import { closeAction } from './signup/action/authAction';
import SurveyListPage from './survey/SurveyListPage';
import SurveyClientPage from './survey/SurveyClientPage';
import SurveyClientResultPage from './survey/SurveyClientResultPage';
import ProgramListPage from './program/ProgramListPage';
import ProgramDetailPage from './program/ProgramDetailPage';
import MyProgramList from './mypage/MyProgramList';
import Main from './popup/Main';

function App() {
  const [checker, setChecker] = useState(0)
  // 페이지가 로딩될 때 토큰의 유효성 검사
  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkToken = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/auth/test`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.data) { // 토큰이 유효하지 않으면 로컬스토리지의 토큰 삭제
        await dispatch(closeAction());
        setChecker(1);
      }
    }
    checkToken()
  })

  return (
    <BrowserRouter>
      <Header key={checker}/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/nooriGunEmployee' element={<NooriGunEmployee />} />
        <Route path='/complaintProcese' element={<ComplaintProcesePage />} />
        <Route path='/comple' element={<CompleBoardListPage />} />
        <Route path='/comple/new' element={<CompleFormPage />} />
        <Route path='/comple/:num' element={<CompleBoardDetailPage />} />
        <Route path='/comple/edit/:num' element={<CompleBoardEditFormPage />} />
        <Route path='/comple/chart' element={<CompleChartPage />} />
        <Route path='/comple/chart/:deptno' element={<CompleChartDetailPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/kakaologin' element={<KaKaologin />} />
        <Route path='/kakaologining' element={<KakaoLogining />} />
        <Route path='/kakaologin/:code' element={<AfterKakaoLogin />} />
        <Route path='/socialSignUp' element={<SocialSignup />} />

        <Route path='/signup' element={<SignUp />} />
        <Route path='/promote' element={<PromoteListPage />} />
        <Route path='/promote/:num' element={<PromoteDetailPage />} />
        <Route path='/faq' element={<FaqPage />} />
        <Route path='/suggestion' element={<SuggestionListPage />} />
        <Route path='/suggestion/new' element={<SuggestionFormPage />} />
        <Route path='/suggestion/:num' element={<SuggestionDetailPage />} />
        <Route path='/mypage/:id' element={<MyPage />} />
        <Route path='/mypage/update/:id' element={<MyPageUpdate />} />
        <Route path='/freeboard' element={<FreeboardListPage />} />
        <Route path='/freeboard/new' element={<FreeboardFormPage />} />
        <Route path='/freeboard/:num' element={<FreeboardDetailPage />} />
        <Route path='/qna' element={<QnaBoardListPage />} />
        <Route path='/qna/new' element={<QnaBoardFormPage />} />
        <Route path='/qna/:num' element={<QnaBoardDetailPage />} />
        <Route path='/directions' element={<MapRoad />} />
        <Route path='/survey' element={<SurveyListPage />} />
        <Route path='/survey/:num' element={<SurveyClientPage />} />
        <Route path='/survey/result/:num' element={<SurveyClientResultPage />} />

        <Route path='/program/:num' element={<ProgramDetailPage />} />
        <Route path='/program' element={<ProgramListPage />} />
        <Route path='/program/update' element={<MyProgramList />} />
      </Routes>
      <Footer />
      <Chat />
      <Main />
    </BrowserRouter>
  );
}

export default App;
