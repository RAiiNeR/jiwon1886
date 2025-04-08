import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/SurveyClientResult.css";
import { Link, useParams } from "react-router-dom";

interface SurveyContent {
  surveytype: string; // 항목 유형
  surveytitle: string; // 항목 제목
  surveycnt: number; // 항목 응답 수
}

interface Survey {
  num:number;
  sub: string; // 설문 제목
  code: number; // 설문에 포함된 문항 수
  contents: SurveyContent[]; // 설문 항목 리스트
}

const SurveyClientResult: React.FC = () => {
  const {num} = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null); // 설문 데이터를 저장

  useEffect(() => {
    // 서버에서 최신 설문 데이터를 가져오는 함수
    const fetchLatestSurvey = async () => {
     
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/survey/result/${num}`);
        console.log(response.data) // 요청 성공
        if (response.status === 200) { // 서버로 부터 받은 데이터를 콘솔에 출력
          setSurvey(response.data); // 설문데이터 저장
       
        }
      } catch (error) {
        console.error("Failed to fetch survey results:", error);
      }
    };

    fetchLatestSurvey();
  }, []);

  if (!survey) { // 설문데이터가 로드되지 않았을 경우
    return <div>결과를 불러오는 중...</div>;
  }

  // 전체 투표 수 계산                                         // 각 항목 투표 수 합산
  const totalVotes = survey.contents.reduce((sum, content) => sum + content.surveycnt, 0);
  console.log(''+ totalVotes)
  return (
    <div className="SurveyClientResult">
      <h2>{survey.sub} - 투표 결과</h2>
      <div className="results">
        {survey.contents.map((content, index) => {
          // 각 항목의 투표 비율 계산
          const percentage = totalVotes > 0 // 전체 투표 수사 0보다 큰 경우 확인(0일 때는 백분율 계산이 불가 - 0으로 나눌 수 없음)
            ? Math.round((content.surveycnt / totalVotes) * 100) // Math.round : 소수점을 반올림하여 정수로 반환 
            : 0; // 거짓일 때: 0

          return (
            <div key={index} className="result-item">
              <div className="result-label">
                {content.surveytitle} ({content.surveycnt}표) {/* 항목 제목과 투표 수 */}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${percentage}%` }} // 진행 바의 넓이를 백분율로 설정
                />
              </div>
              <div className="percentage">{percentage}%</div> {/* 투표 비율 표시 */}
            </div>
          );
        })}
      </div>
      <div className="total-votes">
        총 투표 수: {totalVotes}
      </div>
      <Link to="/noorigun/survey"> 목록으로</Link>
    </div>
  );
};

export default SurveyClientResult;