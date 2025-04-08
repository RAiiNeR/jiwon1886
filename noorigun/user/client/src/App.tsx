import React, { useEffect, useState } from 'react';
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
import ChangePwd from './signup/ChangePwd';
import ProductPage from './product/ProductPage';
import ApplicationFormPage from './product/ApplicationFormPage';
import ReservationFormPage from './product/ReservationFormPage';

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
  }, [])

  return (
    <BrowserRouter>
      <Header key={checker} />
      <Routes>
        <Route path='/noorigun' element={<Home />} />
        <Route path='/noorigun/nooriGunEmployee' element={<NooriGunEmployee />} />
        <Route path='/noorigun/complaintProcese' element={<ComplaintProcesePage />} />
        <Route path='/noorigun/comple' element={<CompleBoardListPage />} />
        <Route path='/noorigun/comple/new' element={<CompleFormPage />} />
        <Route path='/noorigun/comple/:num' element={<CompleBoardDetailPage />} />
        <Route path='/noorigun/comple/edit/:num' element={<CompleBoardEditFormPage />} />
        <Route path='/noorigun/comple/chart' element={<CompleChartPage />} />
        <Route path='/noorigun/comple/chart/:deptno' element={<CompleChartDetailPage />} />
        <Route path='/noorigun/login' element={<LoginPage />} />
        <Route path='/noorigun/changepw' element={<ChangePwd/>}/>
        
        <Route path='/noorigun/kakaologin' element={<KaKaologin />} />
        <Route path='/noorigun/kakaologining' element={<KakaoLogining />} />
        <Route path='/noorigun/kakaologin/:code' element={<AfterKakaoLogin />} />
        <Route path='/noorigun/socialSignUp' element={<SocialSignup />} />

        <Route path='/noorigun/signup' element={<SignUp />} />
        <Route path='/noorigun/promote' element={<PromoteListPage />} />
        <Route path='/noorigun/promote/:num' element={<PromoteDetailPage />} />
        <Route path='/noorigun/faq' element={<FaqPage />} />
        <Route path='/noorigun/suggestion' element={<SuggestionListPage />} />
        <Route path='/noorigun/suggestion/new' element={<SuggestionFormPage />} />
        <Route path='/noorigun/suggestion/:num' element={<SuggestionDetailPage />} />
        <Route path='/noorigun/mypage/:id' element={<MyPage />} />
        <Route path='/noorigun/mypage/update/:id' element={<MyPageUpdate />} />
        <Route path='/noorigun/freeboard' element={<FreeboardListPage />} />
        <Route path='/noorigun/freeboard/new' element={<FreeboardFormPage />} />
        <Route path='/noorigun/freeboard/:num' element={<FreeboardDetailPage />} />
        <Route path='/noorigun/qna' element={<QnaBoardListPage />} />
        <Route path='/noorigun/qna/new' element={<QnaBoardFormPage />} />
        <Route path='/noorigun/qna/:num' element={<QnaBoardDetailPage />} />
        <Route path='/noorigun/directions' element={<MapRoad />} />
        <Route path='/noorigun/survey' element={<SurveyListPage />} />
        <Route path='/noorigun/survey/:num' element={<SurveyClientPage />} />
        <Route path='/noorigun/survey/result/:num' element={<SurveyClientResultPage />} />

        <Route path='/noorigun/program/:num' element={<ProgramDetailPage />} />
        <Route path='/noorigun/program' element={<ProgramListPage />} />
        <Route path='/noorigun/program/update' element={<MyProgramList />} />

        
        <Route path='/noorigun/rent' element={<ProductPage/>}/>
        <Route path='/noorigun/renting' element={<ApplicationFormPage/>}/>
        <Route path='/noorigun/reserve' element={<ReservationFormPage/>}/>
      </Routes>
      <Footer />
      <Chat />
      <Main />
    </BrowserRouter>
  );
}

export default App;
