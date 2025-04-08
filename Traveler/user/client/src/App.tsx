// 2025.01.21. 19:35 생성자: 이학수, HTML템플릿을 리엑트로 조정
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
// import "./css/magnific-popup.css" // 알수 없음. 문제가 생길시 주석을 해제해 볼 것
// import "./css/aos.css" // 알수 없음. 문제가 생길시 주석을 해제해 볼 것
// import "./css/jquery.timepicker.css" // 알수 없음. 문제가 생길시 주석을 해제해 볼 것
import './css/style.css' // 전체 스타일 관련 css
import "./css/animate.css" // 동적 UI 관련 css
import "./css/open-iconic-bootstrap.min.css" // 아이콘 관련 css
import "./css/ionicons.min.css" // 아이콘 관련 css
import "./css/flaticon.css" // 아이콘 관련 css
import "./css/icomoon.css" // 아이콘 관련 css
import "./css/owl.carousel.min.css" // 캐러셀 관련 css
import "./css/owl.theme.default.min.css" // 캐러셀 관련 css
import "./css/react-datepicker.css" // 날짜 선택 모듈 css
import "react-modal-video/css/modal-video.min.css"; // 비디오 모달 css
import Header from './Comm/Header';
import Footer from './Comm/Footer';
import Home from './Pages/Home/Home';
import ScrollToTop from './Comm/ScrollToTop';
// import Contact from './Pages/Contact/Contact';
import Hotel2 from './Pages/Hotel/Hotel2';
import Tour from './Pages/Tour/Tour';
import Test from './Test/Test';
import Coalition from './Pages/Coalition/Coalition';
import TourDetail from './Pages/Tour/TourDetail';
import CoalitionAccount from './Pages/Coalition/CoalitionAccount';
import Chat from './Pages/Chat/Chat';
import Login from './Pages/Login/Login';
import SignUp from './Pages/Login/SignUp';
import Transport from './Transport/Transport';
import CoalitionForm from './Pages/Coalition/CoalitionForm';
import TourRecommended from './Pages/Tour/TourRecommended';
import TourMusicRecommended from './Pages/Tour/TourMusicRecommended';
import SubwayDetail from './Transport/SubwayDetail';
import ReservationForm from './Pages/Hotel/ReservationForm';
import HotelDetail2 from './Pages/Hotel/HotelDetail2';
import MyPage from './Pages/MyPage/MyPage';
import WeatherAPI from './Pages/Weather/weather';
// import Airline from './Transport/Airline';
import Rate from './Transport/Rate';
import TourDiary from './Pages/TourDiary/TourDiary';
import SignSelect from './Pages/Login/SignSelect';
import Partner from './Pages/Login/Partner';
import CoalitionDetail from './Pages/Coalition/CoalitionDetail';
import Bookshelf from './Pages/TourDiary/Bookshelf';
import ContactToChat from './Pages/Contact/ContactToChat';
import Passwordless from './Pages/Login/Passwordless';
import MyDiary from './Pages/TourDiary/MyDiary';
import TourDiaryUpload from './Pages/TourDiary/TourDiaryUpload';
import BusReservation from './Transport/BusReservation';
import TourSchedule from './Pages/Tour/TourSchedule';
import BusForm from './Transport/BusForm';
import TravelTogether from './Pages/TravelTogether/TravelTogether';
import MyBookShelfRe from './Pages/TourDiary/MyBookShelfRe';
import Kakaologin from './Pages/Login/Kakaologin';
import BackpackList from './Pages/Community/BackpackList';
import BackpackDetail from './Pages/Community/BackpackDetail';
import BackpackForm from './Pages/Community/BackpackForm';
import Naverlogin from './Pages/Login/Naverlogin';
import BusList from './Transport/BusList';
import MusicRecommendation from './Pages/Music/MusicRecommendation';
import MyPay from './Transport/MyPay';

function App() {
  const { pathname } = useLocation();
  return (
    <>
      {/* 페이지 이동시 스크롤 상당으로 이동 시켜주는 컴포넌트 */}
      <ScrollToTop />
      {
        (!pathname.includes('kakao') && !pathname.includes('naver')) && <Header />
      }
      <Routes>
        <Route path='/traveler' element={<Test />} />
        <Route path='/traveler/home' element={<Home />} />
        <Route path='/traveler/tour' element={<Tour />} />
        <Route path='/traveler/rate' element={<Rate />} />
        <Route path='/traveler/mypay' element={<MyPay/>}/>
        <Route path='/traveler/tour/:tourId' element={<TourDetail />} />
        <Route path="/tours/:tourId/schedules" element={<TourSchedule />} />
        <Route path='/traveler/tour/recommended' element={<TourRecommended />} />
        <Route path='/traveler/tour/music' element={<TourMusicRecommended onClose={() => { }} />} />
        <Route path='/traveler/hotels' element={<Hotel2 />} />
        <Route path='/traveler/hotels/:num' element={<HotelDetail2 />} />
        <Route path='/traveler/hotels/ReservationForm' element={<ReservationForm />} />
        <Route path='/traveler/contact' element={<ContactToChat />} />
        <Route path='/traveler/coalition' element={<Coalition />} />
        <Route path='/traveler/coalition/:num' element={<CoalitionDetail />} />
        <Route path='/traveler/coalition/new' element={<CoalitionForm />} />
        <Route path='/traveler/coalition/account' element={<CoalitionAccount />} />
        <Route path='/traveler/community' element={<BackpackList />} /> {/*2025-02-07 조유경 추가 */}
        <Route path='/traveler/community/:num' element={<BackpackDetail />} />
        <Route path='/traveler/BackpackForm' element={<BackpackForm />} /> {/*2025-02-07 조유경 추가 */}
        <Route path='/traveler/mypage' element={<MyPage />} /> {/*2025-02-08 장지원 마이페이지 추가 */}
        <Route path='/traveler/travelTogether' element={<TravelTogether />} /> {/*2025-02-19 장지원 함께떠나요 추가 */}
        <Route path='/traveler/login' element={<Login />} />{/*2025-02-08 전준영 로그인 추가*/}
        <Route path='/traveler/passwordless' element={<Passwordless />} />{/*2025-02-08 전준영 패스워드리스로그인 추가*/}
        <Route path='/traveler/kakaologin/:token' element={<Kakaologin />} />
        <Route path='/traveler/naverlogin/:token' element={<Naverlogin />} />
        <Route path='/traveler/signup' element={<SignUp />} />{/*2025-02-08 전준영 회원가입 추가*/}
        <Route path='/traveler/signselect' element={<SignSelect />} />  {/*2025-02-10 전준영 회원가입 선택 추가*/}
        <Route path='/traveler/partner' element={<Partner />} />  {/*2025-02-10 전준영 제휴회사가입 추가*/}
        <Route path='/traveler/Transport' element={<Transport />} />  {/*2025-02-04최의진 추가 */}
        <Route path='/traveler/Transport/busform' element={<BusForm />} />{/*2025-02-10최의진 추가 */}
        <Route path='/traveler/Transport/busform/buslist' element={<BusList />} />{/*2025-02-15최의진 수정 */}
        <Route path='/traveler/Transport/busform/buslist/reservation' element={<BusReservation />} />{/*2025-02-15최의진 추가 */}
        <Route path='/traveler/Transport/Train' element={<SubwayDetail />} />{/*2025-02-06최의진 추가 */}
        <Route path='/traveler/Weather/weather' element={<WeatherAPI />} /> {/* 2025-02-10 황보도연 추가 */}
        <Route path='/traveler/diary/:num' element={<TourDiary />} />
        <Route path='/traveler/diary' element={<Bookshelf />} />
        <Route path='/traveler/mydiary' element={<MyBookShelfRe />} />
        <Route path='/traveler/mydiary/:num' element={<MyDiary />} />
        <Route path='/traveler/mydiary/diaryupload' element={<TourDiaryUpload />} />
        <Route path='/traveler/music' element={<MusicRecommendation/>} />

        {/* <Route path='/traveler/music' element={<Tour />} /> */}
      </Routes>
      {
        (!pathname.includes('kakao') && !pathname.includes('naver')) && <Footer />
      }
      {
        (!pathname.includes('contact') && !pathname.includes('kakao') && !pathname.includes('naver')) && < Chat />
      }
    </>
  );
}

export default App;
