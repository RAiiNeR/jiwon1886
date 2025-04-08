import React, { useEffect, useState } from "react";
import { Route, Routes as ReactRoutes, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Managers from "./Employee/Managers";
import PageHeader1 from "../components/common/PageHeader1";
import TourUpdate from "./Tour/TourUpdate";
import TourDashboard from "./Tour/TourDashboard";
import TourDiary from "./Tour/TourDiary";
import Community from "./Dashboard/Community";
import Members_C from "./Dashboard/Members_C";
import Talk from "./Dashboard/Talk";
import AiBlackList from "./Dashboard/AiBlackList";
import TourList from "./Tour/TourList";
import TourListDetail from "./Tour/TourListDetail";
import TourUpload from "./Tour/TourUpload";
import TourDiaryDetail from "./Tour/TourDiaryDetail";
import HotelReservationDetail from "./Hotels/HotelReservationDetail";
import HotelReservation from "./Hotels/HotelReservation";
import ServerManagement from "./OtherPages/ServerManagement";
import Transportissue from "./Projects/Transportissue";
import MyPay from "./Projects/MyPay";
import Login from "./Login/Login";
import MyDashboard from "./Dashboard/MyDashboard";
import UserList from "./Dashboard/UserList";
import HotelList from "./Hotels/HotelList";
import HotelListDetail from "./Hotels/HotelListDetail";


const MainIndex: React.FC = () => {
    const { pathname } = useLocation();
    const [activekey, setActivekey] = useState('')

    useEffect(() => {
        const pathList = pathname.split('/')
        setActivekey('/' + pathList[pathList.length - 1])
        // console.log('/' + pathList[pathList.length - 1]) aa
    }, [pathname])

    const isLoginPage = pathname.includes("/login/login");//로그인 페이지 체크여부(전준영0220)

    return (
        <div className="main px-lg-4 px-md-4">
            {!isLoginPage && activekey !== "/chat-app" ? activekey === "/documentation" ? <PageHeader1 /> : <Header /> : ""}
            <div className="body d-flex py-lg-3 py-md-2">
                <ReactRoutes>
                    <Route path={`/travelerAdmin`} element={<MyDashboard />} />
                    <Route path={`/travelerAdmin/login/login`} element={<Login />} />
                    {/* <Route path={`/travelerAdmin/black`} element={<Black />} /> */}
                    <Route path={`/travelerAdmin/community`} element={<Community />} /> {/*2025 02 07 장지원 커뮤니티 수정중 */}
                    <Route path={`/travelerAdmin/userlist`} element={<UserList />} /> {/*2025 02 07 장지원 회원목록 수정중 */}
                    <Route path={`/travelerAdmin/memberlist`} element={<Members_C />} /> {/*2025 02 07 장지원 멤버리스트 수정중 */}
                    <Route path={`/travelerAdmin/bagtalk`} element={<Talk />} /> {/*2025 02 07 장지원 배낭톡 수정중 */}
                    <Route path={`/travelerAdmin/blacklist`} element={<AiBlackList />} />
                    {/* <Route path={`/travelerAdmin/blacklist`} element={<AiBlackList />} /> 2025 02 07 장지원 배낭톡 수정중 */}
                    <Route path={`/travelerAdmin/pay`} element={<MyPay />} />{/*250211 최의진 완료*/}
                    <Route path={`/travelerAdmin/Transportissue`} element={<Transportissue />} />{/*250211 최의진 완료*/}
                    <Route path={`/travelerAdmin/tourlist`} element={<TourList />} />{/*250207 민다빈 완료*/}
                    <Route path={`/travelerAdmin/tourlist/tour/detail/:id`} element={<TourListDetail />} />{/*250207 민다빈 완료*/}
                    <Route path={`/travelerAdmin/tourlist/tour-upload`} element={<TourUpload />} />{/*250206 민다빈 완료*/}
                    <Route path={`/travelerAdmin/tourlist/edit/:tourId`} element={<TourUpdate />} />{/*250207 민다빈 완료*/}
                    <Route path={`/travelerAdmin/tourstaus`} element={<TourDashboard />} />{/*250207 민다빈 수정*/}
                    <Route path={`/travelerAdmin/tourdiary`} element={<TourDiary />} />{/*250206 민다빈 수정*/}
                    <Route path={`/travelerAdmin/tourdiary/detail/:num`} element={<TourDiaryDetail />} />
                    <Route path={`/travelerAdmin/HotelReservation`} element={<HotelReservation />} /> {/* 20250210 황보도연 변경 */}
                    <Route path={`/travelerAdmin/hotel`} element={<HotelList />} />
                    <Route path={`/travelerAdmin/hotel/:num`} element={<HotelListDetail />} />
                    <Route path={`/travelerAdmin/hotelReservationDetail/:num`} element={<HotelReservationDetail />} /> {/* 20250210 황보도연 변경 */}
                    <Route path={`/travelerAdmin/managers`} element={<Managers />} /> {/* 20250303 전준영 변경 */}
                    <Route path={`/travelerAdmin/ServerManagement`} element={<ServerManagement />} /> {/* 20250210 황보도연 추가 */}
                </ReactRoutes>
            </div>
        </div>
    )
}


export default MainIndex;