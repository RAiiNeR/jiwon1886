import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../../css/mypage.css";
import axios from "axios";
import { parseJwt } from "../../Comm/jwtUtils";
import { useNavigate } from "react-router-dom";

interface UserInfo {
    name: string;
    email: string;
    phone: string;
    mdate: string;
    intro: string;
}
const MyPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<number | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [recentUserQuestionsFromBot, setRecentUserQuestionsFromBot] = useState<string[]>([]);
    const [recentUserQuestionsFromAdmin, setRecentUserQuestionsFromAdmin] = useState<string[]>([]);
    const [hotelReservations, setHotelReservations] = useState<string[]>([]);
    const [recentBackPacks, setRecentBackPacks] = useState<string[]>([]);
    const [recentTourContents, setRecentTourContents] = useState<string[]>([]);
    const [recentHotelContents, setRecentHotelContents] = useState<string[]>([]);
    const [recentDiaries, setRecentDiaries] = useState<{ id: number; title: string }[]>([]);
    // const [recentBusList, setRecentBusList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const navigateToDiary = (diaryId: number) => {
        navigate(`/traveler/mydiary/${diaryId}`);
    };

    // ✅ 로그인된 사용자 정보 가져오기 (JWT 토큰에서 userNum 추출)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const userNum = parseJwt(token as string).num;
            setIsLoggedIn(true);
            setUserToken(userNum);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // ✅ userNum을 기반으로 마이페이지 데이터 가져오기
    useEffect(() => {
        if (!userToken) return;

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/mypage/${userToken}`);
                const data = response.data;

                console.log("백엔드 응답 데이터:", data);

                setUserInfo(data.userInfo || null);
                setRecentUserQuestionsFromBot(data.recentUserQuestionsFromBot || []);
                setRecentUserQuestionsFromAdmin(data.recentUserQuestionsFromAdmin || []);
                setHotelReservations(data.hotelReservations || []);
                setRecentBackPacks(data.recentBackPacks || []);
                setRecentTourContents(data.recentTourContents || []);
                setRecentHotelContents(data.recentHotelContents || []);
                setRecentDiaries(data.recentDiaries || []);
                // setRecentBusList(data.recentBusList || []);
            } catch (error) {
                console.error("데이터 불러오기 실패", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userToken]); // userToken이 변경될 때 실행

    // ✅ 회원정보 수정 기능
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editIntro, setEditIntro] = useState("");

    // 수정 모드 시작
    const handleEditClick = () => {
        if (!userInfo) return;
        setIsEditing(true);
        setEditName(userInfo.name);
        setEditPhone(userInfo.phone);
        setEditEmail(userInfo.email);
        setEditIntro(userInfo.intro);
    };

    // ✅ 회원 정보 수정 요청 (userNum 사용)
    const handleSaveClick = async () => {
        if (!userToken) return;

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACK_END_URL}/api/mypage/update/${userToken}`,
                {
                    name: editName,
                    phone: editPhone,
                    email: editEmail,
                    intro: editIntro
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            console.log("회원정보 수정 성공:", response.data);
            alert("회원정보가 성공적으로 수정되었습니다.");

            // 상태 업데이트
            setUserInfo({
                name: editName,
                phone: editPhone,
                email: editEmail,
                intro: editIntro,
                mdate: userInfo?.mdate || ""
            });

            setIsEditing(false);
        } catch (error) {
            console.error("회원정보 수정 실패:", error);
            alert("회원정보 수정에 실패했습니다.");
        }
    };

    // ✅ Donut Race Animation (값 변경)
        useEffect(() => {
            const interval = setInterval(() => {
                setChartOptions((prevOptions) => {
                    let newData = prevOptions.series[0].data.map((item) => ({
                        ...item,
                        y: Math.floor(Math.random() * 30), // ✅ 0~30 사이의 랜덤값 변경
                    }));
    
                    return {
                        ...prevOptions,
                        series: [{ ...prevOptions.series[0], data: newData }],
                    };
                });
            }, 2000); // ✅ 2초마다 값 변경 (레이스 애니메이션 효과)
    
            return () => clearInterval(interval);
        }, []);

    // ✅ Donut Chart Race 설정
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: "pie",
            animation: true,
            backgroundColor: "transparent",
            height: "auto",
            spacingBottom: 10, // ✅ 차트 아래쪽 여백 최소화
        },
        title: {
            text: "",
            align: "left",
        },
        plotOptions: {
            pie: {
                innerSize: "50%", // ✅ 도넛 차트 설정
                depth: 45,
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.y}",
                },
            },
        },
        series: [
            {
                name: "값",
                data: [
                    { name: "조회수", y: 22, color: "#FBB36B" },
                    { name: "하트", y: 15, color: "#F27F62" },
                    { name: "댓글 수", y: 8, color: "#ABBC85" },
                ],
            },
        ],
        responsive: [
            {
                // ✅ 화면이 작아지면 자동으로 차트 크기 줄이기
                rules: [
                    {
                        condition: {
                            maxWidth: 600, // 600px 이하일 때
                        },
                        chartOptions: {
                            chart: {
                                height: 250, // ✅ 차트 높이를 줄여서 반응형 적용
                            },
                        },
                    },
                    {
                        condition: {
                            maxWidth: 400, // 400px 이하일 때
                        },
                        chartOptions: {
                            chart: {
                                height: 200, // ✅ 더 작은 화면에서는 차트 높이를 더 줄이기
                            },
                        },
                    },
                ],
            },
        ],
    });

    const [logChartOptions, setLogChartOptions] = useState({
        chart: {
            type: "line",
            backgroundColor: "transparent",
            height: 230,
        },
        title: {
            text: "",
            align: "left",
        },
        xAxis: {
            type: "category",
            categories: ["일", "월", "화", "수", "목", "금", "토"], // ✅ X축 (주 단위)
        },
        yAxis: {
            type: "logarithmic", // ✅ 로그 축 적용
            title: {
                text: "다이어리 수",
            },
            minorTickInterval: 0.1,
            min: 1, // ✅ 최소값 설정하여 너무 아래로 내려가는 것 방지
            max: 30, // y축 최대값 조정하여 그래프 압축
        },
        series: [
            {
                name: "다이어리 개수",
                data: [1, 3, 2, 27, 10, 2, 5], // ✅ 로그 축에서 잘 보이는 데이터 예제
                color: "#F27F62",
            },
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 600,
                    },
                    chartOptions: {
                        chart: {
                            height: 230, // 모바일 화면에서는 230px
                        },
                        yAxis: {
                            max: 20, // 모바일에서는 더 작은 값으로 압축
                        },
                    },
                },
            ],
        },
    });

    // ✅ 회원번호를 기반으로 프로필 이미지 경로 결정 (1~5번)
    const profileImageSrc = userToken
        ? `./images/profile_${(userToken % 5) + 1}.jpg`
        : "./images/default_profile.png";

    if (loading) {
        return <p>로딩중입니다...</p>;
    }

    return (
        <div className='MyPage'>
            <div className='inner'>
                <div className='title-box'>
                    <h2 className='title'>배낭 프로필</h2>
                    {isEditing ? (
                        <div className='btn-flex'>
                            <button className='btn btn-primary' onClick={handleSaveClick}>완료</button>
                            <button className='btn btn-secondary' onClick={() => setIsEditing(false)}>취소</button>
                        </div>
                    ) : (
                        <button className='btn btn-secondary' onClick={handleEditClick}>수정</button>
                    )}
                </div>

                <div className='profile-box'>
                    <div className='profile'>
                        <div className='pro-left'>
                            <img src={profileImageSrc} alt="프로필 이미지" />
                        </div>
                        <div className='pro-right'>
                            <div className='right-box'>
                                {userInfo ? (
                                    <div>
                                        {isEditing ? (
                                            <div className='edit-form'>
                                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="이름" />
                                                <textarea value={editIntro} onChange={(e) => setEditIntro(e.target.value)} placeholder="소개"></textarea>
                                                <div className='edit-list'>
                                                    <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="전화번호" className='list-input' />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className='text-box'>
                                                    <p>{userInfo.name}</p>
                                                    <span>{userInfo.intro}</span>
                                                </div>
                                                <ul className='my-prolist'>
                                                    <li><span>이메일</span><p>{userInfo.email}</p></li>
                                                    <li><span>전화번호</span><p>{userInfo.phone}</p></li>
                                                    <li><span>가입일</span><p>{userInfo.mdate}</p></li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p>사용자 정보를 불러올 수 없습니다.</p>
                                )}

                            </div>
                        </div>
                    </div>
                    {/* <div className='mbti'>
                        <h2>나의 MBTI는?</h2>
                        <button className="learn-more">검사 시작하기</button>
                    </div> */}
                </div>

                <div className='my-history'>
                    <div className='history-container'>
                        <div className='chatting'>
                            <h2>문의내역</h2>
                            <div className='talkBox'>
                                <div className='talk'>
                                    <div className='tt'>
                                        <p>챗봇 기록</p>
                                        <i className="fa fa-commenting" aria-hidden="true"></i>
                                    </div>
                                    <div className='tt-list'>
                                        <ul>
                                            {recentUserQuestionsFromBot.length > 0 ? (
                                                recentUserQuestionsFromBot.map((question, index) => (
                                                    <li key={index}><a href="#">{question}</a></li>
                                                ))
                                            ) : (
                                                <li>챗봇 문의 내역이 없습니다.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className='talk'>
                                    <div className='tt'>
                                        <p>배낭톡 기록</p>
                                        <i className="fa fa-suitcase" aria-hidden="true"></i>
                                    </div>
                                    <div className='tt-list'>
                                        <ul>
                                            {recentUserQuestionsFromAdmin.length > 0 ? (
                                                recentUserQuestionsFromAdmin.map((question, index) => (
                                                    <li key={index}><a href="#">{question}</a></li>
                                                ))
                                            ) : (
                                                <li>관리자 문의 내역이 없습니다.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='myChart'>
                            <h2>일간 차트 데이터</h2>
                            <div className='chart-container w-full'>
                                {/* ✅ Chart 컴포넌트에서 올바른 타입 사용 */}
                                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                                {/* <img src="/images/myBlog.png" alt="차트일러" /> */}
                            </div>
                        </div>
                    </div>

                </div>

                <div className='log'>
                    <div className='my-Box'>
                        <div className='my-list'>
                            <div className='my-blog'>
                                <div className='my-blog-text'>
                                    <h2>나의 최근 게시물</h2>
                                    <a href='/traveler/community'><i className="fa fa-plus" aria-hidden="true"></i>더보기</a>
                                </div>
                                <ol>
                                    {recentBackPacks.length > 0 ? (
                                        recentBackPacks.map((post, index) => (
                                            <li key={index}><a href="#">{post}</a></li>
                                        ))
                                    ) : (
                                        <li>게시물이 없습니다.</li>
                                    )}
                                </ol>
                            </div>
                        </div>
                        {/* <div className='my-buslist'>
                            <div className='my-bus'>
                                <div className='my-bus-text'>
                                    <h2>개인 예매 내역</h2>
                                </div>
                                <ul>
                                    {recentBusList.length > 0 ? (
                                        recentBusList.map((schedule, index) => (
                                            <li key={index}><a href="#">✅ {schedule}</a></li>
                                        ))
                                    ) : (
                                        <li>예약내역이 없습니다.</li>
                                    )}
                                </ul>
                            </div>
                        </div> */}

                        <div className='foot'>
                            <h2>발자국</h2>
                            <div className='box-container'>
                                <div className='mybox2'>
                                    <p>여행</p>
                                    <ul>
                                        {recentTourContents.length > 0 ? (
                                            recentTourContents.map((tour, index) => (
                                                <li key={index}><a href="#">{tour}</a></li>
                                            ))
                                        ) : (
                                            <li>여행 발자국이 없습니다.</li>
                                        )}
                                    </ul>
                                </div>

                                <div className='mybox2'>
                                    <p>교통</p>
                                    <ul>
                                        {recentHotelContents.length > 0 ? (
                                            recentHotelContents.map((hotel, index) => (
                                                <li key={index}><a href="#">{hotel}</a></li>
                                            ))
                                        ) : (
                                            <li>여행 발자국이 없습니다.</li>
                                        )}
                                    </ul>
                                </div>

                                <div className='mybox2'>
                                    <p>플레이리스트</p>
                                    <ul>
                                        <li><a href="#">여행 - 볼빨간사춘기</a></li>
                                        <li><a href="#">바람이 불었으면 좋겠어 - 박명수&거미</a></li>
                                        <li><a href="#">떠나자 - 크라잉넛</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="diary-container">
                        <div className='diary-box'>
                            <div className='my-blog-text'>
                                <h2>다이어리 목록</h2>
                                <a href='/traveler/mydiary'><i className="fa fa-plus" aria-hidden="true"></i>더보기</a>
                            </div>
                            <div className='big-box'>
                                {recentDiaries.length > 0 ? (
                                    recentDiaries.map((diary) => (
                                        <div className='diary' key={diary.id}>
                                            <img src="./images/diary01.png" alt="다이어리 이미지 예시" />
                                            <p>{diary.title}</p>
                                            <button className='diary-btn' onClick={() => navigateToDiary(diary.id)}>
                                                바로가기
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-diary">
                                        <p>최근 작성한 다이어리가 없습니다.</p>
                                        <a href="/traveler/mydiary/diaryupload">작성하기</a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="diary-chart">
                            <h2>요일당 내가 쓴 다이어리 수</h2>
                            <div className="diary-chart-container">
                                {/* ✅ Logarithmic Line Chart 추가 */}
                                <HighchartsReact highcharts={Highcharts} options={logChartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPage