import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/SurveyClient.css";
import { useNavigate, useParams } from "react-router-dom";


interface SurveyContent {
  surveytype: string; // 항목 유형
  surveytitle: string; // 항목 제목
  surveyCnt: number; // 항목 응답 수
}

interface Survey {
  num:number;
  sub: string; // 설문 제목
  code: number; // 설문에 포함된 문항 수
  contents: SurveyContent[]; // 설문 항목 리스트
}

const SurveyClient: React.FC = () => {
  const {num} = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null); // 설문 데이터를 저장
  const [selectedSurveyType, setSelectedSurveyType] = useState<string | null>(null); // 선택된 설문 항목
  const navigate = useNavigate();
  // 서버에서 최신 설문 데이터를 가져오는 함수
  const fetchLatestSurvey = async () => { 
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/survey/${num}`); // 설문 번호를 포함한 URL
      if (response.status === 200) { // 요청 성공
        console.log(response.data); // 서버로 부터 받은 데이터를 콘솔에 출력
        setSurvey(response.data); // 설문데이터 저장
      } else {
        console.log("No survey data available."); // 데이터가 없는 경우
      }
    } catch (error) {
      console.error("Failed to fetch survey:", error);
    }
  };

  const submitSurvey = async (e: React.FormEvent) => { // 설문 제출 함수
    e.preventDefault(); // 폼 기본 동작 방지
    if (!selectedSurveyType || !survey) {
      alert("항목을 선택해주세요.");
      return;
    }

    try {
      // 선택된 설문 항목을 서버로 전송
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/survey/updateCount`, {
        subcode: survey.num, // 설문 번호
        surveytype: selectedSurveyType, // 선택된 설문 유형
      });

      if (response.status === 200) {
        alert("설문이 성공적으로 제출되었습니다.");
        //fetchLatestSurvey(); // 제출 후 설문 데이터 다시 로드
        navigate(`/noorigun/survey/result/${num}`); // 설문조사 이후 결과로 이동
      } else {
        alert("설문 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to submit survey:", error);
      alert("설문 제출 중 오류가 발생했습니다."); // 사용자에 알림
    }
  };

  useEffect(() => {
    fetchLatestSurvey(); // 설문데이터 서버에서 가져옴
  }, []);

  if (!survey) { // 설문데이터가 로드되지 않았을 경우
    return <div>설문 데이터를 불러오는 중...</div>;
  }

  return (
    <div className="SurveyClient">
      <h2>{survey.sub}</h2> {/* 설문 제목 */}
      <p>문항 수: {survey.code}</p> {/* 설문에 포함된 문항 수 */}

      <form onSubmit={submitSurvey}>
        {survey.contents.map((content, index) => (
          <div key={index} className="mb-3">
            {/* <label className="form-label">
              {content.surveytype}. {content.surveytitle}
            </label> */}
            <div>
              {/* 라디오 버튼으로 설문 항목 표시 */}
              <input type="radio" name="surveytype" value={content.surveytype} 
              onChange={(e) => setSelectedSurveyType(e.target.value)} /> {content.surveytitle}
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">제출</button>
      </form>
    </div>
  );
};

export default SurveyClient;
