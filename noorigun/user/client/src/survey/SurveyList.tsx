import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './css/SurveyList.css';
import PageNation from '../comp/PageNation';

interface SurveyVO {
    NUM: number; // 설문조사 번호
    SDATE: string; // 설문조사 등록일일
    CNT: string; // 설문조사 총 투표수수
    SUB: number; // 설문조사 제목목
}

const SurveyList: React.FC = () => {
    const [survey, setSurvey] = useState<SurveyVO[]>() // 설문조사 목록
    const [page, setPage] = useState(1);//현재 페이지 번호
    const [size, setSize] = useState(10);//한페이지당 게시물 수
    const [totalPages, setTotalPages] = useState(1);//전체 페이지 수 관리

    useEffect(() => {
        const getSurveyList = async () => {
            try {
                // 서버에서 설문조사 데이터를 비동기식으로 가져옴
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/survey`,{
                    params:{
                        page,
                        size
                    }
                });
                setSurvey(response.data.content) // survey에 저장
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.log("error => " + error)
            }
        }
        getSurveyList();
    }, [page]);

    const navigate = useNavigate(); // 페이지 이동

    const handleResult = (num:number) => { 
    navigate(`/noorigun/survey/result/${num}`) // 설문조가 결과로 이동
    }

    // survey.map(()=>(  survey 뒤에 ?가 생기면 작성하기
    // survey 상태가 null일 때, "로딩중" 메시지를 화면에 표시
    if(!survey){
        return <div>로딩중......</div>
    }

    // 날짜 포맷
    const formatDate = (gdate: string) => {
        const date = new Date(gdate);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      }

    return (
        <div className="SurveyList">
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>총 투표수</th>
                        <th>등록일</th>
                        <th>결과보기</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        survey.map((item)=>( // 항목을 테이블 행으로 랜더링
                            <tr key={item.NUM}>
                                <td>{item.NUM}</td>
                                <td><Link to={`/noorigun/survey/${item.NUM}`}>{item.SUB}</Link></td> {/* 제목을 클릭하면 해당 설문조사 페이지로 이동 */}
                                <td>{item.CNT}</td>
                                <td>{formatDate(item.SDATE)}</td>
                                <td><button onClick={_ => handleResult(item.NUM)}>결과보기</button></td> {/* 결과보기 버튼 클릭 시 handleResult 호출 */}
                            </tr>
                            
                        ))
                    }
                </tbody>
            </table>
            <PageNation page={page} totalPages={totalPages} pageChange={setPage}/>
        </div>
    )
}

export default SurveyList