import React, { useEffect, useState } from 'react'
import "./css/user.css";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { genderData, genderOptions } from './MemberGender';
import { ageData, ageOptions } from './MemberAge';
import axios from 'axios';
import RequireAuth from '../comp/RequireAuth';
import { incrementData, incrementOptions } from './MemberIncrement';
//대시보드 화면
const MemberDash: React.FC = () => {
    //누적 회원 수 
    const [mCount, setMCount] = useState(0);
    //서버에서 누적된 회원을 가져오는 함수
    const memberCount = async () => {
        try {
            const response = await axios.get('http://localhost:82/noorigun/api/member/count')
            setMCount(response.data);
        } catch (error) {
            console.log("Error => " + error);
        }
    }
    //컴포넌트 마운트 후 데이터로드
    useEffect(() => {
        memberCount();
    }, [])

    return (
        <RequireAuth>
            <div style={{ paddingTop: "20px" }}>
                {/* 메인 컨테이너 */}
                <div className="user-container">
                    <div className="user-header">
                        <div>
                            <p className="user-text">&nbsp;User DashBoard</p>
                        </div>
                    </div>
                    <br></br>
                    {/* 회원수 정보 */}
                    <div className="user-dash">
                        <div className="user-info1">
                            <div>
                                <h3 className="user-info-text">누적 회원수</h3>
                                <div>
                                    {/* 누적 회원수 표시 */}
                                    <p className="user-info-textinfo">{mCount}명</p>
                                </div>
                            </div>
                            {/* SVG 이미지 */}
                            <div className="user-info2">
                                <img src="../img/memberdash/people.svg" className="user-svg"></img>
                            </div>
                        </div>
                    </div>
                    {/* 그래프 영역 */}
                    <div className="user-chart">
                        {/* 연령대, 성별, 이용 현황 차트 */}
                        <div className="user-chart-col">
                            {/* 연령별 이용자 통계 */}
                            <div className="user-chart-row" style={{ width: "calc(62% - 16px)" }}>
                                <div className="chart-name">연령별 이용자 통계</div>
                                {/* Line 차트 렌더링 */}
                                <Line options={ageOptions} data={ageData} />
                            </div>
                            <div className="user-chart-row" style={{ width: "calc(38% - 16px)" }}>
                                <div className="chart-name">성별 통계</div>
                                {/* Doughnut 차트 렌더링 */}
                                <Doughnut data={genderData} options={genderOptions} />
                            </div>
                        </div>
                        <div className="user-chart-col">
                            <div className="user-chart-row" style={{ width: "calc(100% - 16px)" }}>
                                <div className="chart-name">이용자 증가량</div>
                                {/* Line 차트 렌더링 */}
                                <Bar options={incrementOptions} data={incrementData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RequireAuth>
    )
}

export default MemberDash