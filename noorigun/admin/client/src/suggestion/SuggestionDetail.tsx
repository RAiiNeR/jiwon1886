import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './css/SuggestionDetail.css';
import axios from 'axios';
import Scomments from './Scomments';
import RequireAuth from '../comp/RequireAuth';
import PollSection from './PollSection';

interface Suggestion {
    num: number;
    title: string;
    writer: string;
    content: string;
    imgNames?: string[];
    hit: number;
    state: string;
    sdate: string;
}

interface PollOption {
    id: number;
    text: string;
    votes: number;
    image_url?: string;
}

interface Poll {
    title: string;
    options: PollOption[];
    allow_multiple: boolean;
    max_participants?: number;
}

const SuggestionDetail: React.FC = () => {
    const { num } = useParams();
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
    const [showScomments, setShowScomments] = useState(false);
    const [poll, setPoll] = useState<Poll | null>(null);
    const [state, setState] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const suggestionResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/suggestion/${num}`);
                const suggestionData = suggestionResponse.data;
                const updatedContent = changeContentData(
                    suggestionData.content,
                    suggestionData.imgNames,
                    0
                );
                setSuggestion({ ...suggestionData, content: updatedContent });
                setState(suggestionData.state);

                const pollResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/admin/polls/${num}`);
                setPoll(pollResponse.data);
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        };

        fetchData();
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
        if(window.confirm("정말로 삭제하시겠습니까?")){
        try {
            await axios.delete(
                `${process.env.REACT_APP_BACK_END_URL}/api/suggestion?num=${num}`
                 );
                alert("게시글이 삭제되었습니다.")
            navigate('/noorigun/suggest');
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
        }
    };
};
    const handleStateChange = async (newState: string) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACK_END_URL}/api/suggestion/state`, {
                num,
                state: newState,
            });
            setState(newState);
        } catch (error) {
            console.error('상태 변경 실패:', error);
        }
    };

    const toggleComments = () => {
        setShowScomments((prev) => !prev);
    };

    if (!suggestion) {
        return <div>로딩중...</div>;
    }

    return (
        <RequireAuth>
            <div style={{ padding: '50px' }}>
                <div className="suggestiondetail">
                    <div className="post-content">
                        <h3>주제: {suggestion.title}</h3>
                        <hr className="divider" />
                        <p>번호: {suggestion.num}</p>
                        <p>작성자: {suggestion.writer}</p>
                        <p>내용</p>
                        <div
                            id="content-data"
                            dangerouslySetInnerHTML={{ __html: suggestion.content }}
                        ></div>
                        <p>작성일: {suggestion.sdate}</p>

                        {poll && <PollSection poll={poll} onVote={() => {}} pollExpired={true} />}

                        <div className="state-selector">
                            <label>상태:</label>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        name="state"
                                        value="등록"
                                        checked={state === '등록'}
                                        onChange={() => handleStateChange('등록')}
                                    />
                                    등록
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="state"
                                        value="논의 중"
                                        checked={state === '논의 중'}
                                        onChange={() => handleStateChange('논의 중')}
                                    />
                                    논의 중
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="state"
                                        value="채택"
                                        checked={state === '채택'}
                                        onChange={() => handleStateChange('채택')}
                                    />
                                    채택
                                </label>
                            </div>
                        </div>

                        <p></p>
                        <Link to="/noorigun/suggest">리스트</Link>
                        <button type="button" onClick={handleDelete} className="delete-btn">삭제</button>
                        <button type="button" onClick={toggleComments} className="scomm-toggle-btn">
                            {showScomments ? "댓글 숨기기" : "댓글 보기"}
                        </button>
                    </div>

                    <hr className="divider" />

                    {showScomments && <Scomments sbnum={suggestion.num} />}
                </div>
            </div>
        </RequireAuth>
    );
};

export default SuggestionDetail;