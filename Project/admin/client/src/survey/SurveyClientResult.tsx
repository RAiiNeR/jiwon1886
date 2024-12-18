import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/SurveyClientResult.css";
import { Link, useParams } from "react-router-dom";
import RequireAuth from "../comp/RequireAuth";

interface SurveyContent {
  surveytype: string; // 선택 항목 유형
  surveytitle: string; // 투표 옵션 제목
  surveycnt: number;// 선택된 투표 수
}

interface Survey {
  num: number;
  sub: string;
  code: number;
  contents: SurveyContent[];// 설문 선택 항목 목록
}

const SurveyClientResult: React.FC = () => {
  const [survey, setSurvey] = useState<Survey | null>(null);// 설문 데이터를 저장할 상태
  const { num } = useParams();// URL 파라미터에서 설문 ID 가져오기

  useEffect(() => {
    // 설문 결과 데이터를 비동기적으로 가져오는 함수
    const fetchLatestSurvey = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/survey/${num}`);
        console.log(response.data);// 서버에서 받은 데이터 확인
        if (response.status === 200) {
          setSurvey(response.data);// 설문 결과 상태 업데이트
        }
      } catch (error) {
        console.error("Failed to fetch survey results:", error);
      }
    };

    fetchLatestSurvey();
  }, []);

  if (!survey) {
    return <div>결과를 불러오는 중...</div>;
  }

  // 전체 투표 수 계산
  const totalVotes = survey.contents.reduce((sum, content) => sum + content.surveycnt, 0);

  return (
    <RequireAuth>
      <div className="surveyClientResult">
        {/* 선택 항목 제목과 투표 수 표시 */}
        <div className="result-container">
          <h2>{survey.sub} - 투표 결과</h2>
          <div className="results">
            {survey.contents.map((content, index) => {
              const percentage = totalVotes > 0
                ? Math.round((content.surveycnt / totalVotes) * 100)
                : 0;

              return (
                <div key={index} className="result-item">
                  <div className="result-label">
                    {content.surveytitle} ({content.surveycnt}표)
                  </div>
                  {/* 진행 상태 표시를 위한 프로그레스 바 */}
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {/* 비율 표시 */}
                  <div className="percentage">{percentage}%</div>
                </div>
              );
            })}
          </div>
          {/* 전체 투표 수 표시 */}
          <div className="total-votes">
            총 투표 수: {totalVotes}
          </div>
          <Link to="/survey">목록으로</Link>
        </div>
      </div>
    </RequireAuth>
  );
};

export default SurveyClientResult;