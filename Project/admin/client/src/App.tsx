import React from 'react';
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

function App() {
  return (
    <BrowserRouter>
      <div id='app'>
        <SideBar />
        <div id='main'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/banner' element={<BannerList />} />
            <Route path='/banner/new' element={<BannerForm />} />
            <Route path='/chart/member' element={<MemberDash />} />
            <Route path='/chart/comple' element={<CompleDash />} />
            <Route path='/chart/vote' element={<PollStatistics />} />

            <Route path='/noti' element={<NotificationList />} />
            <Route path='/noti/new' element={<NotificationForm />} />
            <Route path='/noti/:num' element={<NotificationDetail />} />

            <Route path='/comple' element={<CompleBoardList />} />
            <Route path='/comple/:num' element={<CompleBoardDetail />} />
            <Route path='/comple/edit/:num' element={<CompleBoardEdit />} />
            <Route path='/suggest' element={<SuggestionList />} />
            <Route path='/suggest/:num' element={<SuggestionDetail />} />
            <Route path='/member' element={<MemberList />} />
            <Route path='/manager' element={<ManagerList />} />
            <Route path='/manager/new' element={<ManagerForm />} />
            <Route path='/freeboard' element={<FreeBoardList />} />
            <Route path='/freeboard/:num' element={<FreeboardDetail />} />
            <Route path='/faq' element={<FaqList />} />
            <Route path='/faq/new' element={<FaqForm />} />
            <Route path='/qna' element={<QnaBoardList />} />
            <Route path='/qna/new' element={<QnaBoardForm />} />
            <Route path='/qna/:num' element={<QnaBoardDetail />} />
            <Route path="/promote" element={<PromoteBoardList />} />
            <Route path="/promote/new" element={<PromoteBoardForm />} />
            <Route path="/promote/:num" element={<PromoteBoardDetail />} />
            <Route path="/promote/update/:num" element={<PromoteBoardUpdate />} />
            <Route path='/survey' element={<SurveyList />} />
            <Route path='/survey/new' element={<SurveyAddForm />} />
            <Route path='/survey/:num' element={<SurveyClient />} />
            <Route path='/survey/result/:num' element={<SurveyClientResult />} />
            <Route path='/program' element={<ProgramList/>}/>
            <Route path='/program/:num' element={<ProgramDetail/>}/>
            <Route path='/program/new' element={<ProgramForm/>}/>
            <Route path='/program/update/:num' element={<ProgramUpdate/>}/>
            <Route path='/program/student/:num' element={<ProgramStudentList/>}/>
            <Route path='/program/mail/:num' element={<SendMail/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
