import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './css/SurveyList.css';
import RequireAuth from '../comp/RequireAuth';
import PageNation from '../comp/PageNation';
//설문 데이터
interface SurveyVO {
    num: number;
    sub: string;
    cnt: number;
    sdate: string;
}

const SurveyList: React.FC = () => {
    const [survey, setSurvey] = useState<SurveyVO[]>([]);// 설문조사 목록 상태
    const [selecttopics, setSelectTopics] = useState<Set<number>>(new Set());// 선택한 설문 관리하는 상태
    const [page, setPage] = useState(1);//현재 페이지 번호
    const [size, setSize] = useState(10);//한페이지당 게시물 수
    const [totalPages, setTotalPages] = useState(1);//전체 페이지 수 관리

    const getSurveyList = async () => {
        try {
            // 서버에서 설문조사 데이터를 비동기식으로 가져옴
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/survey`, {
                params: {
                    page,
                    size
                }
            });
            console.log(response.data)
            setSurvey(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log("Error => " + error);
        }
    };
    // 컴포넌트 마운트 후 한 번만 설문조사 목록 가져옴
    useEffect(() => {
        getSurveyList();
    }, [page]);


    const navigate = useNavigate();
    // 특정 설문 결과로 이동하는 함수
    const handleResult = (num: number) => {
        navigate("/noorigun/survey/result/" + num);
    };
    // 설문 선택/해제 처리 함수
    const handleSelect = (id: number) => {
        const newSelectedSurvey = new Set(selecttopics);
        if (newSelectedSurvey.has(id)) {
            newSelectedSurvey.delete(id);
        } else {
            newSelectedSurvey.add(id);
        }
        setSelectTopics(newSelectedSurvey);
    };
    // 전체 선택/해제 처리 함수
    const handleSelectAll = () => {
        if (selecttopics.size === survey.length) {
            setSelectTopics(new Set());
        } else {
            const allMemberIds = new Set(survey.map((survey) => survey.num));
            setSelectTopics(allMemberIds);
        }
    };
    // 선택한 설문조사를 삭제하는 함수
    const handleDeleteSelected = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/survey`, {
                data: {
                    numbers: Array.from(selecttopics) // 선택된 설문 ID 배열로 변환
                }
            });
            getSurveyList(); // 삭제 후 최신 설문 목록을 다시 불러옴
        } catch (error) {
            console.log(error)
        }
        setSelectTopics(new Set());
    };

    if (!survey) {
        return <div>로딩중</div>;
    }

    // 날짜 포맷
    const formatDate = (gdate: string) => {
        const date = new Date(gdate);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }

    return (
        <RequireAuth>
            <div style={{ padding: '50px' }}>
                <div className='SurveyList'>
                    <h2>설문조사 목록</h2>
                    <div className='mt-3 d-flex justify-content-start' style={{ width: "80%" }}>
                        <button onClick={handleDeleteSelected} disabled={selecttopics.size === 0} // 선택된 항목이 없으면 비활성화
                            className='btn btn-danger del-btn'>
                            선택된 항목 삭제
                        </button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td className="checkbox-cell-main">
                                    {/* 전체 선택/해제 기능 */}
                                    <input
                                        type="checkbox"
                                        checked={selecttopics.size === survey.length}// 전체 선택 여부 확인
                                        onChange={handleSelectAll}
                                    />
                                </td>
                                <th>번호</th>
                                <th>제목</th>
                                <th>총 투표수</th>
                                <th>등록일</th>
                                <th>결과보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                survey.map((item) => (
                                    <tr key={item.num}>
                                        <td className="checkbox-cell">
                                            {/* 개별 선택 기능 */}
                                            <input
                                                type="checkbox"
                                                checked={selecttopics.has(item.num)}
                                                onChange={() => handleSelect(item.num)}
                                            />
                                        </td>
                                        <td>{item.num}</td>
                                        <td><Link to={`/noorigun/survey/${item.num}`}>{item.sub}</Link></td>
                                        <td>{item.cnt}</td>
                                        <td>{formatDate(item.sdate)}</td>
                                        <td><button onClick={_ => handleResult(item.num)}>결과보기</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4}>  {/* 새로운 설문조사를 작성하는 버튼 */}
                                    <button onClick={_ => navigate("/noorigun/survey/new")}>투표 작성</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <PageNation page={page} totalPages={totalPages} pageChange={setPage} />
                </div>
            </div>
        </RequireAuth>
    )
}

export default SurveyList;
