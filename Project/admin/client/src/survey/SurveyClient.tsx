import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/SurveyClient.css";
import { useNavigate, useParams } from "react-router-dom";
import RequireAuth from "../comp/RequireAuth";


interface SurveyContent {
  surveytype: string;
  surveytitle: string;
  surveyCnt: number;
}

interface Survey {
  num: number;
  sub: string;
  code: number;
  contents: SurveyContent[];
}

const SurveyClient: React.FC = () => {
  const { num } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selectedSurveyType, setSelectedSurveyType] = useState<string | null>(null);
  const navigate = useNavigate();
  // 서버에서 최신 설문 데이터를 가져오는 함수
  const fetchLatestSurvey = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/survey/${num}`);
      if (response.status === 200) {
        console.log(response.data);
        setSurvey(response.data);
      } else {
        console.log("No survey data available.");
      }
    } catch (error) {
      console.error("Failed to fetch survey:", error);
    }
  };

  useEffect(() => {
    fetchLatestSurvey();
  }, []);

  if (!survey) {
    return <div>설문 데이터를 불러오는 중...</div>;
  }

  return (
    <RequireAuth>
      <div className="surveyClient">
        <div className="container">
          <h2>{survey.sub}</h2>
          <p>문항 수: {survey.code}</p>
          {survey.contents.map((content, index) => (
            <div key={index} className="mb-3">
              {/* <label className="form-label">
              {content.surveytype}. {content.surveytitle}
            </label> */}
              <div>
                <input type="radio" name="surveytype" value={content.surveytype}
                  onChange={(e) => setSelectedSurveyType(e.target.value)} /> {content.surveytitle}
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-primary" onClick={_ => navigate("/survey")}>목록으로</button>

        </div>
      </div>
    </RequireAuth>
  );
};

export default SurveyClient;
