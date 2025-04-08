import React, { useEffect, useState } from 'react'
import "../../css/travelTogether.css";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subYears, format, max } from 'date-fns';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { parseJwt } from '../../Comm/jwtUtils';

interface UserResponse {
    num: number;
    name: string;
    profileImgNum: number;
}

interface FriendRequest {
    friendRequestId: number;
    fromUserName: string;
    profileImgNum: number; // ✅ 요청 보낸 사용자의 프로필 이미지 번호 추가
}

interface FriendList {
    friendName:string,
    friendId:number,
    profileImgNum:number
}

const TravelTogether: React.FC = () => {
    const [activeBox, setActiveBox] = useState<string>('f-box1');
    const [friends, setFriends] = useState<Array<FriendList>>([]);
    const [searchEmail, setSearchEmail] = useState<string>(''); // 이메일 입력값
    const [searchedUser, setSearchedUser] = useState<UserResponse | null>(null); // 검색된 사용자 정보
    const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false); // 친구 요청 상태
    const [friendRequests, setFriendRequests] = useState<Array<FriendRequest>>([]); // 친구 요청 목록 상태 선언
    // const { userNum } = useParams(); // URL에서 userNum 가져오기
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        const userNum = parseJwt(token as string).num;
        
            setIsLoggedIn(true);
            setUserToken(userNum);
        } else {
            setIsLoggedIn(false);
        }
    },[])

    const handleTabClick = (boxId: string) => {
        setActiveBox(boxId);
    };
    
    // const userNum = parseJwt(token as string).num;
    // 2025.02.24 친구목록
    const fetchFriends = async () => {
        try {
            // const requestBody = { userNum: userNum };
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/travelTogether/${userToken}`);

            console.log("📌 친구 목록 데이터:", response.data); // ✅ 디버깅 로그 추가

            setFriends(response.data);
        } catch (error) {
            console.error("❌ 친구 목록을 가져오는 데 실패했습니다.", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchFriends();
            fetchFriendRequests();
        }
    }, [isLoggedIn]);



    // 이메일로 사용자 검색 (Axios 사용)
    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const requestBody = { email: searchEmail }; // JSON으로 email 전달

            const response = await axios.post<UserResponse>(`${process.env.REACT_APP_BACK_END_URL}/api/travelTogether/search`, requestBody, {
                headers: { "Content-Type": "application/json" }
            });

            setSearchedUser(response.data);
        } catch (error) {
            console.error("검색 오류:", error);
            setSearchedUser(null);
            alert("사용자를 찾을 수 없습니다.");
        }
    };


    // 프로필 이미지 번호 반환 함수
    const getProfileImage = (userId: number): string => {
        const imageNumber = (userId % 5) + 1; // 이미지 5개 순환
        return `./images/profile_${imageNumber}.jpg`;
    };

    // 🔹 친구 요청 보내기 (Axios 사용)
    const handleSendFriendRequest = async () => {
        if (!searchedUser) return;
        try {
            const requestBody = {
                fromUserNum: userToken, // 로그인한 사용자의 번호
                toUserEmail: searchEmail // 친구 요청을 받을 사용자 이메일
            };

            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/travelTogether/send-request`, requestBody, {
                headers: { "Content-Type": "application/json" }
            });

            setFriendRequestSent(true);
            alert("친구 요청이 전송되었습니다!");
        } catch (error) {
            console.error("친구 요청 오류:", error);
            alert("친구 요청을 보내는 데 실패했습니다.");
        }
    };

    // 친구요청 목록
    const fetchFriendRequests = async () => {
        try {
            const requestBody = { userNum: userToken }; // JSON 요청

            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/travelTogether/requests`, requestBody, {
                headers: { "Content-Type": "application/json" }
            });

            setFriendRequests(response.data);
        } catch (error) {
            console.error("친구 요청 목록을 가져오는 데 실패했습니다.", error);
        }
    };


    // 친구 요청 수락 함수
    const handleAccept = async (friendRequestId: number) => {
        try {
            const requestBody = { friendRequestId, userNum:userToken };
            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/travelTogether/requests/accept`, requestBody, {
                headers: { "Content-Type": "application/json" }
            });

            // ✅ 1. 수락한 친구 찾기
            const acceptedFriend = friendRequests.find(req => req.friendRequestId === friendRequestId);

            if (!acceptedFriend) return; // 친구 요청이 없으면 종료

            // ✅ 2. 친구 요청 목록에서 제거
            setFriendRequests(prevRequests => prevRequests.filter(req => req.friendRequestId !== friendRequestId));

            // ✅ 3. 친구 목록에 추가
            setFriends(prevFriends => [...prevFriends, {
                friendId: friendRequestId,
                friendName: acceptedFriend.fromUserName,
                profileImgNum: acceptedFriend.profileImgNum
            }]);

            alert("친구 요청을 수락하였습니다!");
        } catch (error) {
            console.error("❌ 친구 요청 수락 오류:", error);
            alert("친구 요청을 수락하는 데 실패했습니다.");
        }
    };



    // 친구 요청 거절 함수
    const handleReject = async (friendRequestId: number) => {
        try {
            const requestBody = {
                friendRequestId: friendRequestId,
                userNum: userToken // 현재 로그인한 사용자 번호 (useParams에서 가져옴)
            };

            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/travelTogether/requests/reject`, requestBody, {
                headers: { "Content-Type": "application/json" }
            });

            alert("친구 요청을 거절했습니다.");
            fetchFriends(); // 거절 후 친구 목록 갱신
        } catch (error) {
            console.error("거절 처리 중 오류 발생", error);
            alert("거절 처리에 실패하였습니다.");
        }
    };



    // 주석처리한거는 나중에 back할때 데이터 연결을 위해 진짜 필요한것
    // const getRandomData = () => {
    //     const today = new Date();
    //     return Array.from({ length: 365 }, (_, i) => {
    //         return {
    //             date: format(subYears(today, 1), 'yyyy-MM-dd'),
    //             count: Math.floor(Math.random() * 4) // 0~3 사이의 랜덤 값
    //         };
    //     });
    // };
    const dummyData = [
        // 1월
        { date: '2024-01-05', count: 1 },
        { date: '2024-01-10', count: 3 },
        { date: '2024-01-15', count: 2 },
        { date: '2024-01-20', count: 4 },
        { date: '2024-01-25', count: 2 },

        // 2월
        { date: '2024-02-01', count: 1 },
        { date: '2024-02-05', count: 2 },
        { date: '2024-02-10', count: 3 },
        { date: '2024-02-15', count: 4 },
        { date: '2024-02-20', count: 2 },
        { date: '2024-02-25', count: 3 },

        // 3월
        { date: '2024-03-01', count: 1 },
        { date: '2024-03-05', count: 4 },
        { date: '2024-03-10', count: 2 },
        { date: '2024-03-15', count: 3 },
        { date: '2024-03-20', count: 1 },
        { date: '2024-03-25', count: 3 },

        // 4월
        { date: '2024-04-01', count: 2 },
        { date: '2024-04-05', count: 1 },
        { date: '2024-04-10', count: 3 },
        { date: '2024-04-15', count: 4 },
        { date: '2024-04-20', count: 2 },
        { date: '2024-04-25', count: 3 },

        // 5월
        { date: '2024-05-01', count: 3 },
        { date: '2024-05-05', count: 2 },
        { date: '2024-05-10', count: 1 },
        { date: '2024-05-15', count: 4 },
        { date: '2024-05-20', count: 2 },
        { date: '2024-05-25', count: 3 },

        // 6월
        { date: '2024-06-01', count: 1 },
        { date: '2024-06-05', count: 3 },
        { date: '2024-06-10', count: 2 },
        { date: '2024-06-15', count: 4 },
        { date: '2024-06-20', count: 2 },
        { date: '2024-06-25', count: 3 },

        // 7월
        { date: '2024-07-01', count: 2 },
        { date: '2024-07-05', count: 4 },
        { date: '2024-07-10', count: 3 },
        { date: '2024-07-15', count: 1 },
        { date: '2024-07-20', count: 2 },
        { date: '2024-07-25', count: 3 },

        // 8월
        { date: '2024-08-01', count: 1 },
        { date: '2024-08-05', count: 3 },
        { date: '2024-08-10', count: 2 },
        { date: '2024-08-15', count: 4 },
        { date: '2024-08-20', count: 2 },
        { date: '2024-08-25', count: 3 },

        // 9월
        { date: '2024-09-01', count: 3 },
        { date: '2024-09-05', count: 1 },
        { date: '2024-09-10', count: 4 },
        { date: '2024-09-15', count: 2 },
        { date: '2024-09-20', count: 3 },
        { date: '2024-09-25', count: 1 },

        // 10월
        { date: '2024-10-01', count: 2 },
        { date: '2024-10-05', count: 3 },
        { date: '2024-10-10', count: 4 },
        { date: '2024-10-15', count: 1 },
        { date: '2024-10-20', count: 2 },
        { date: '2024-10-25', count: 3 },

        // 11월
        { date: '2024-11-01', count: 3 },
        { date: '2024-11-05', count: 1 },
        { date: '2024-11-10', count: 4 },
        { date: '2024-11-15', count: 2 },
        { date: '2024-11-20', count: 3 },
        { date: '2024-11-25', count: 1 },

        // 12월
        { date: '2024-12-01', count: 2 },
        { date: '2024-12-05', count: 3 },
        { date: '2024-12-10', count: 4 },
        { date: '2024-12-15', count: 1 },
        { date: '2024-12-20', count: 2 },
        { date: '2024-12-25', count: 3 },
    ];

    const chartOptions = {
        chart: {
            type: 'column'
        },

        title: {
            text: ' '
        },
        xAxis: {
            categories: ['서울', '부산', '강원도', '제주도'], // X축 라벨
            title: {
                text: '지역 선호도 %'
            }
        },
        yAxis: [
            { // 첫 번째 Y축 (왼쪽, Employees)
                title: {
                    text: ' '
                },
                min: 0,
                max: 100
            },
        ],
        legend: {
            enabled: true
        },
        plotOptions: {
            column: {
                grouping: false, // 고정된 위치로 배치
                shadow: false,
                borderWidth: 0
            }
        },

        series: [
            isLoggedIn && {
                name: '우리들',
                data: [98, 65, 30, 80],
                color: 'rgba(255, 91, 91, 0.81)',
                pointPadding: 0.3,
                zIndex: 2
            },
            {
                name: '전체 회원 수',
                data: [100, 40, 20, 95],
                color: 'rgba(255, 157, 46, 0.88)',
                pointPadding: 0.2,
                zIndex: 1
            }
        ].filter(Boolean) // `null` 값 방지
    };

    return (
        <div className='TravelTogether'>
            <div className='t-container'>
                <div className="img-box">
                    <img src="./images/travelFriend.jpg" alt="여행친구" />
                    <div className='tt-box'>
                        <span>누군가와 추억을 쌓고 싶을때</span>
                        <h2>함께 떠나요</h2>
                    </div>
                </div>
                <div className='inner'>
                    <div className='travel1'>
                        <div className='travel-section'>
                            <h2 className='tt'>Group Travel</h2>
                            <span className='tspan'>함께 여행하는 우리들만의 이야기</span>
                            <div className='tf-box'>
                                <div className='travel-chart-box'>
                                    {isLoggedIn ? (
                                        <h2>우리들이 좋아하는 여행 지역!</h2>
                                    ) : (
                                        <h2>지금까지 함께 여행한 사람들은 이런 지역을 좋아했어요.</h2>
                                    )}
                                    <div className='travel-chart'>
                                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                                    </div>
                                </div>

                                {isLoggedIn ? (
                                    <div className='friend'>
                                        <h2>함께 떠날 친구를 찾아보세요!</h2>
                                        <div className='f-list'>
                                            <ul className='friend-list-big'>
                                                <li>
                                                    <a onClick={() => handleTabClick('f-box1')}
                                                        className={activeBox === 'f-box1' ? 'active' : ''}>
                                                        친구목록
                                                    </a>
                                                </li> {/* 검색도 있도록 만들기1 */}
                                                <li>
                                                    <a onClick={() => handleTabClick('f-box2')}
                                                        className={activeBox === 'f-box2' ? 'active' : ''}>
                                                        친구추가
                                                    </a>
                                                </li> {/* 검색도 있도록 만들기2 */}
                                                <li>
                                                    <a onClick={() => handleTabClick('f-box3')}
                                                        className={activeBox === 'f-box3' ? 'active' : ''}>
                                                        친구신청
                                                    </a>
                                                </li>
                                            </ul>
                                            <div className={`f-box1 ${activeBox === 'f-box1' ? 'active' : ''}`}>
                                                {friends.length > 0 ? (
                                                    <ul>
                                                        {friends.map((friend) => (
                                                            <li key={friend.friendId}>
                                                                <img
                                                                    src={`./images/profile_${friend.profileImgNum % 5 + 1}.jpg`}  // ✅ 기본값 설정
                                                                    alt={`${friend.friendName}의 프로필`}
                                                                />
                                                                {friend.friendName}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="no-friend-message">아직 친구가 없어요...</p>
                                                )}
                                            </div>

                                            <div className={`f-box2 ${activeBox === 'f-box2' ? 'active' : ''}`}>
                                                <form className='search-box' onSubmit={handleSearch}>
                                                    <input
                                                        type="text"
                                                        className='search-txt'
                                                        placeholder='이메일을 입력하세요.'
                                                        value={searchEmail}
                                                        onChange={(e) => setSearchEmail(e.target.value)}
                                                    />
                                                    <button className='searchFriend-btn' type='submit'>
                                                        <i className='fa-solid fa-magnifying-glass' />
                                                    </button>
                                                </form>
                                                {/* 🔹 검색된 사용자 정보 표시 */}
                                                {searchedUser && (
                                                    <ul className="search-result">
                                                        <li>
                                                            <div className='userProfile'>
                                                                <div className='userImage'>
                                                                    <img
                                                                        src={`./images/profile_${searchedUser.profileImgNum}.jpg`} // ✅ 여기 이미지 번호 선택!
                                                                        alt={`${searchedUser.name}의 프로필`}
                                                                    />
                                                                </div>
                                                                {searchedUser.name} {/* 🔹 사용자의 이름 출력 */}
                                                            </div>

                                                            <button
                                                                className="add-friend-btn"
                                                                onClick={handleSendFriendRequest}
                                                                disabled={friendRequestSent} // 요청이 이미 전송되었다면 버튼 비활성화
                                                            >
                                                                {friendRequestSent ? "요청됨" : "친구 신청"}
                                                            </button>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>

                                            <div className={`f-box3 ${activeBox === 'f-box3' ? 'active' : ''}`}>
                                                {friendRequests.length > 0 ? (
                                                    <ul>
                                                        {friendRequests.map((request) => (
                                                            <li key={request.friendRequestId}>
                                                                <div className='unknownFriend'>
                                                                    <img src={`./images/profile_${request.profileImgNum}.jpg`} alt={`${request.fromUserName}의 프로필`} />
                                                                    {request.fromUserName}
                                                                </div>
                                                                <div className='friend-btn'>
                                                                    <button onClick={() => handleAccept(request.friendRequestId)}>수락</button>
                                                                    <button onClick={() => handleReject(request.friendRequestId)}>거절</button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>친구요청이 없어요</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="not-logged-in-message">
                                        <p>친구와 함께 떠나는 여행! 어렵지 않아요.</p>
                                        <span>회원가입 또는 로그인해보세요</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isLoggedIn ? (
                        <div className='travel2'>
                            <div className='travel-section'>
                                <h2 className='tt2'>Our Tracks</h2>
                                <span className='tspan'>친구와 함께 남긴 지난 여정을 돌아보세요.</span>
                                <div className='group-travel-history'>
                                    <h2>우리들의 발자국들</h2>
                                    <CalendarHeatmap
                                        startDate={subYears(new Date(), 1)}
                                        endDate={new Date()}
                                        values={dummyData}
                                        classForValue={(value) => {
                                            if (!value) {
                                                return 'color-empty';
                                            }
                                            return `color-scale-${value.count}`;
                                        }}
                                        tooltipDataAttrs={(value) => {
                                            if (!value || !value.date) return {}; // 데이터가 없으면 툴팁 속성 자체를 추가하지 않음
                                            return {
                                                'data-tooltip-id': 'heatmap-tooltip',
                                                'data-tooltip-content': `📅 날짜: ${value.date}\n🔥 여행 횟수: ${value.count}`,
                                            };
                                        }}
                                    />
                                    <ReactTooltip id="heatmap-tooltip" place="top" style={{ backgroundColor: 'black', color: 'white' }} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>

        </div>
    )
}

export default TravelTogether