import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SideBar from './SideBar';
import BannerList from './banner/BannerList';
import BannerForm from './banner/BannerForm';
import './App.css'
import LoginPage from './login/LoginPage';
import Home from './Home';
import NotificationForm from './notification/NotificationForm';
import MemberDash from './memberChart/MemberDash';
import CompleBoardList from './comple/CompleBoardList';
import CompleBoardDetail from './comple/CompleBoardDetail';
import CompleBoardEdit from './comple/CompleBoardEdit';
import SuggestionList from './suggestion/SuggestionList';
import SuggestionDetail from './suggestion/SuggestionDetail';
import MemberList from './member/MemberList';
import FreeBoardList from './freeboard/FreeboardList';
import FreeboardDetail from './freeboard/FreeboardDetail';
import FaqList from './faq/FaqList';
import FaqForm from './faq/FaqForm';
import QnaBoardList from './qna/QnaBoardList';
import QnaBoardForm from './qna/QnaBoardForm';
import QnaBoardDetail from './qna/QnaBoardDetail';
import PromoteBoardList from './promote/PromoteBoardList';
import PromoteBoardForm from './promote/PromoteBoardForm';
import PromoteBoardDetail from './promote/PromoteBoardDetail';
import PromoteBoardUpdate from './promote/PromoteBoardUpdate';
import PollStatistics from './votechart/PollStatistics';
import SurveyList from './survey/SurveyList';
import SurveyAddForm from './survey/SurveyAddForm';
import SurveyClient from './survey/SurveyClient';
import SurveyClientResult from './survey/SurveyClientResult';
import NotificationList from './notification/NotificationList';
import NotificationDetail from './notification/NotificationDetail';
import ManagerList from './Manager/ManagerList';
import ManagerForm from './Manager/ManagerForm';
import CompleDash from './comleChart/CompleDash';
import ProgramList from './program/ProgramList';
import ProgramDetail from './program/ProgramDetail';
import ProgramForm from './program/ProgramForm';
import ProgramUpdate from './program/ProgramUpdate';
import ProgramStudentList from './program/ProgramStudentList';
import SendMail from './program/SendMail';
import { useAppDispatch } from './login/store';
import axios from 'axios';
import { closeAction } from './login/action/authAction';
import EquipmentList from './equipment/EquipmentList';
import EquipmentForm from './equipment/EquipmentForm';
import EquipmentDetail from './equipment/EquipmentDetail';
import EquipmentUpdate from './equipment/EquipmentUpdate';
import ReserveList from './equipment/ReserveList';
import RentList from './equipment/RentList';

function App() {
  const [checker, setChecker] = useState(0);
  // 페이지가 로딩될 때 토큰의 유효성 검사
  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkToken = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/auth/test`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('managerToken')}`
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
      <div id='app' key={checker} >
        <SideBar />
        <div id='main'>
          <Routes>
            <Route path='/noorigun' element={<Home />} />
            <Route path='/noorigun/login' element={<LoginPage />} />
            <Route path='/noorigun/banner' element={<BannerList />} />
            <Route path='/noorigun/banner/new' element={<BannerForm />} />
            <Route path='/noorigun/chart/member' element={<MemberDash />} />
            <Route path='/noorigun/chart/comple' element={<CompleDash />} />
            <Route path='/noorigun/chart/vote' element={<PollStatistics />} />

            <Route path='/noorigun/noti' element={<NotificationList />} />
            <Route path='/noorigun/noti/new' element={<NotificationForm />} />
            <Route path='/noorigun/noti/:num' element={<NotificationDetail />} />

            <Route path='/noorigun/comple' element={<CompleBoardList />} />
            <Route path='/noorigun/comple/:num' element={<CompleBoardDetail />} />
            <Route path='/noorigun/comple/edit/:num' element={<CompleBoardEdit />} />
            <Route path='/noorigun/suggest' element={<SuggestionList />} />
            <Route path='/noorigun/suggest/:num' element={<SuggestionDetail />} />
            <Route path='/noorigun/member' element={<MemberList />} />
            <Route path='/noorigun/manager' element={<ManagerList />} />
            <Route path='/noorigun/manager/new' element={<ManagerForm />} />
            <Route path='/noorigun/freeboard' element={<FreeBoardList />} />
            <Route path='/noorigun/freeboard/:num' element={<FreeboardDetail />} />
            <Route path='/noorigun/faq' element={<FaqList />} />
            <Route path='/noorigun/faq/new' element={<FaqForm />} />
            <Route path='/noorigun/qna' element={<QnaBoardList />} />
            <Route path='/noorigun/qna/new' element={<QnaBoardForm />} />
            <Route path='/noorigun/qna/:num' element={<QnaBoardDetail />} />
            <Route path="/noorigun/promote" element={<PromoteBoardList />} />
            <Route path="/noorigun/promote/new" element={<PromoteBoardForm />} />
            <Route path="/noorigun/promote/:num" element={<PromoteBoardDetail />} />
            <Route path="/noorigun/promote/update/:num" element={<PromoteBoardUpdate />} />
            <Route path='/noorigun/survey' element={<SurveyList />} />
            <Route path='/noorigun/survey/new' element={<SurveyAddForm />} />
            <Route path='/noorigun/survey/:num' element={<SurveyClient />} />
            <Route path='/noorigun/survey/result/:num' element={<SurveyClientResult />} />
            <Route path='/noorigun/program' element={<ProgramList />} />
            <Route path='/noorigun/program/:num' element={<ProgramDetail />} />
            <Route path='/noorigun/program/new' element={<ProgramForm />} />
            <Route path='/noorigun/program/update/:num' element={<ProgramUpdate />} />
            <Route path='/noorigun/program/student/:num' element={<ProgramStudentList />} />
            <Route path='/noorigun/program/mail/:num' element={<SendMail />} />

            <Route path="/noorigun/equipment" element={<EquipmentList />} />
            <Route path="/noorigun/equipment/new" element={<EquipmentForm />} />
            <Route path="/noorigun/equipment/:num" element={<EquipmentDetail />} />
            <Route path="/noorigun/equipment/update/:num" element={<EquipmentUpdate />} />
            <Route path="/noorigun/equipment/reservers" element={<ReserveList />} />
            <Route path="/noorigun/equipment/rent" element={<RentList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
