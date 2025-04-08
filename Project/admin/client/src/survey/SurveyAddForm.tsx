import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/SurveyAddForm.css";
import RequireAuth from "../comp/RequireAuth";

const SurveyAddForm: React.FC = () => {
  const [sub, setSub] = useState("");
  const [code, setCode] = useState("2"); // 기본값 2로 설정
  const [surveyTitles, setSurveyTitles] = useState<string[]>(Array(2).fill("")); // 초기 2개의 빈 문항

  const navigate = useNavigate();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const numValue = parseInt(newValue);


    if (numValue >= 2 && numValue <= 5) {
      setCode(newValue);

      setSurveyTitles(prev => {
        const newArray = Array(numValue).fill("");

        return newArray.map((item, index) => prev[index] || "");
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const surveyData = {
        sub,
        code: parseInt(code),
        contents: surveyTitles.map(title => ({
          surveytitle: title,
        }))
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/survey/addsurvey`,
        surveyData
      );

      if (response.status === 200) {
        alert("설문이 등록되었습니다.");
        navigate("/survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("설문 등록에 실패했습니다.");
    }
  };


  const handleTitleChange = (index: number, value: string) => {
    const newTitles = [...surveyTitles];
    newTitles[index] = value;
    setSurveyTitles(newTitles);
  };

  return (
    <RequireAuth>
      <div className="surveyAddForm">
        <div id="container2">
          <h2>설문조사 등록</h2>
          <form onSubmit={handleSubmit}>
            <table>
              <thead>
                <tr><th colSpan={2}>설문조사 작성 폼</th></tr>
              </thead>
              <tbody>
                <tr>
                  <th>제목</th>
                  <td>
                    <input
                      type="text"
                      value={sub}
                      onChange={(e) => setSub(e.target.value)}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th>문항수 (2-5)</th>
                  <td>
                    <input
                      type="number"
                      min="2"
                      max="5"
                      value={code}
                      onChange={handleCodeChange}
                      required
                    />
                  </td>
                </tr>
                {surveyTitles.map((title, index) => (
                  <tr key={index}>
                    <th>설문문항{index + 1}</th>
                    <td>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(index, e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={2}>
                    <button type="submit" className="btn btn-primary">등록</button>
                    <button type="button" onClick={() => navigate("/survey")} className="btn btn-primary">
                      목록
                    </button>
                  </th>
                </tr>
              </tfoot>
            </table>
          </form>
        </div>
      </div>
    </RequireAuth>
  );
};

export default SurveyAddForm;