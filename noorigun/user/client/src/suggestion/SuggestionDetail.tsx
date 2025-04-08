import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./css/SuggestionDetail.css";
import axios from 'axios';
import PollSection from './PollSection';
import Scomment from './Scomment';

interface Suggestion { // 제안
    num: number;
    title: string;
    writer: string;
    content: string;
    img_names: string[];
    hit: any; // 조회수 (타입이 명확하지 않아 any 사용)
    sdate: string;
    state: string;
};

const getSvgPosition = (state: string) => {
    switch (state) {
        case '등록':
            return { top: '-40px', left: '30px' };
        case '논의 중':
            return { top: '-40px', left: '293px' };
        case '채택':
            return { top: '-40px', left: '587px' };
        default:
            return {};
    }
};

//제안 디테일 json 데이터
const SuggestionDetail: React.FC<{ num: string }> = ({ num }) => {
    const [suggestion, setSuggestion] = useState<Suggestion>(); // 제안 데이터
    const navigate = useNavigate();
    const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`; // 이미지 경로


    /*----------------------------투표관련----------------------------------*/
    const [pollExpired, setPollExpired] = useState(false); // 투표 종료 여부
    const [poll, setPoll] = useState<any>({
        title: '',
        allowMultiple: false,
        anonymous: false,
        options: [], // 빈 배열로 초기화
    });
    // 서버에서 받은 투표 데이터 정리 함수
    const cleanPollData = (data: any) => {
        if (!data || !data.options) return data;

        return {
            ...data,
            options: data.options.map((option: any) => ({
                id: option.id,
                text: option.text,
                votes: option.votes,
                image_url: option.image_url,
                end_date: option.end_date,
                max_participants: option.max_participants,
            })),
        };
    };

    // 투표 데이터 가져오기
    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/polls/byPost/${num}`);
                console.log(response.data);
                if (response.data && response.data.options) {
                    const cleanedPoll = cleanPollData(response.data); // 데이터 정리
                    setPoll(cleanedPoll);

                    // 참여자 제한 및 종료일 확인
                    const currentParticipants = response.data.options.reduce(
                        (sum: number, option: any) => sum + option.votes,
                        0
                    );
                    const participantsLimitReached =
                        response.data.max_participants != null &&
                        currentParticipants >= response.data.max_participants;

                    if (participantsLimitReached) {
                        setPollExpired(true); // 참여자 수 초과 시 투표 종료 처리
                    }
                    if (response.data.end_date && new Date(response.data.end_date) < new Date()) {
                        setPollExpired(true); // 종료일이 지난 경우 종료 처리
                    }
                } else {
                    console.warn('투표 데이터 없음');
                    setPoll(null); // 투표 데이터가 없을 경우 null 처리
                }
            } catch (error: any) {
                console.error('투표 데이터 불러오기 오류:', error.response?.data || error.message);
                setPoll(null); // 오류가 발생해도 기본값을 설정
            }
        };

        if (num) fetchPoll();
    }, [num]);


    // 투표 실행
    const handleVote = async (selectedOptionIds: number[]) => {
        if (pollExpired) {
            alert('투표가 종료되었습니다.');
            return;
        }
        try {
            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/polls/vote`, {
                optionIds: selectedOptionIds, // 배열을 객체 형태로 감싸서 전송
            });
            alert('투표가 완료되었습니다!');

            // 투표 결과 갱신
            const pollResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/polls/byPost/${num}`);
            setPoll(cleanPollData(pollResponse.data));
        } catch (error) {
            console.error('투표 중 오류 발생:', error);
            alert('투표에 실패했습니다. 다시 시도해주세요.');
        }
    };
    /*------------------------------------------------------------------------------------------------*/

    useEffect(() => {
        const getDetail = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/suggestion/` + num);
                const changeData = changeContentData(response.data.content, response.data.img_names, 0);
                setSuggestion({ ...response.data, content: changeData });

            } catch (error) {
                console.log('Error Message: ' + error);
            }
        }
        getDetail();
    }, [num]);

    // 제안 내용에서 이미지 경로 업데이트
    const changeContentData = (data: string, imgNames: string[], fileIndex: number): string => {
        let start = data.indexOf(`IMG_PATH_`);
        let end = data.indexOf(`${imgNames[fileIndex]}`) + (!imgNames[fileIndex] ? 0 : imgNames[fileIndex].length);
        if (start === -1) return data;
        else {
            let dataFront = data.substring(0, start) + `src="${process.env.REACT_APP_BACK_IMG_URL}/${imgNames[fileIndex]}" class="content-img"`
            let dataElse = data.substring(end);
            return dataFront + changeContentData(dataElse, imgNames, fileIndex + 1);
        }
    }

    const handleDelete = async () => {
        try {
            /*----------------------투표관련------------------------------*/
            try {
                // 투표데이터 테이블이 게시글을 참조하고 있어 투표를 먼저 삭제 -> 차후 cascade 설정 요망
                await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/polls/byPost/${num}`);
            } catch (error) {
                console.log("투표가없습니다")
            }
            /*----------------------------------------------------------*/
            const response = await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/suggestion?num=` + num);
            console.log(response.data);
            navigate("/noorigun/suggestion");
        } catch (error) {
            console.log('Error Message: ' + error);

        }
    }

    // 날짜 포맷
    const changeDateForm = (date: string) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
    }

    

    const suggestionContent = () => {
        //div 안에 있는 친구를 호출후 timeout을 해서 호출하기
        const content = React.createElement('div', {
            id: 'dummyDiv'
        });
        setTimeout(() => {
            const data = document.getElementById('data');
            console.log(data);
            if (data) data.innerHTML = suggestion?.content as string;
        }, 1);  //0.001초 뒤에 출력
        return content;
    }

    if (!suggestion) {
        return <div>로딩중</div> //suggestion가 없으면 로딩중 메세지가 표시됨
    };

    return (
        <div className="suggestiondetailform">
            <div className="suggestiondetail" style={{ position: 'relative' }}>
                <div className="btn-container" style={{ ...getSvgPosition(suggestion.state), position: 'absolute' }}>
                    <button type="button" className="btn btn-primary">
                        현재진행도: {suggestion.state}
                    </button>
                </div>
                <div className="process">
                    <div className="responsive-wrapper">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="30" height="30"
                                fill="currentColor"
                                className="bi bi-lightbulb" viewBox="0 0 16 16">
                                <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1" />
                            </svg>

                            -------------------------------------

                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-telegram" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
                            </svg>

                            --------------------------------------

                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-hourglass-bottom" viewBox="0 0 16 16">
                                <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702s.18.149.5.149.5-.15.5-.15v-.7c0-.701.478-1.236 1.011-1.492A3.5 3.5 0 0 0 11.5 3V2z" />
                            </svg>
                        </div>
                        <div>
                            <h5 style={{ fontWeight: '100%' }}>등록-------------------------- 논의 중---------------------------채택
                            </h5>
                        </div>
                    </div>  {/**위에 호출된후 아래 호출된다 */}
                </div>
                <div className="post-content">
                    <h3>주제:{suggestion.title}</h3>

                    <hr className="divider" />
                    <p>번호: {suggestion.num}</p>
                    <p>작성자: {suggestion.writer}</p>
                    <p>내용</p>
                    <div id='data'>
                        {
                            suggestionContent()
                        }
                    </div>
                    {/* ---------------------------------------------------------------------- */}
                    {/* 투표 섹션 */}
                    <hr />
                    {poll?.options?.length > 0 ? (
                        <PollSection poll={poll} onVote={(selectedOptionIds) => handleVote(selectedOptionIds)} pollExpired={pollExpired} />
                    ) : (
                        <p>투표가 없습니다</p>
                    )}
                    <hr />
                    {/* ---------------------------------------------------------------------- */}
                    <p>작성일: {changeDateForm(suggestion.sdate)}</p>
                    <div className="btn-group">
                        <Link to="/noorigun/suggestion" className="list-btn">리스트</Link>
                        <button className="delete-btn" onClick={handleDelete}>삭제</button>
                    </div>
                </div>

                <hr className="divider" />


                {/*댓글 컴포넌트 추가* */}
                <Scomment num={num}/>
            </div>
        </div>

    );

}

export default SuggestionDetail