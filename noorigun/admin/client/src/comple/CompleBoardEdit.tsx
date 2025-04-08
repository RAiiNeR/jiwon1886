import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./css/AdminCompleBoard.css";
import RequireAuth from "../comp/RequireAuth";

interface CompleBoardVO {
  num: number;
  title: string;
  content: string;
  writer: string;
  state: string;
  deptno: number;
}

const CompleBoardEdit: React.FC = () => {
  const [formData, setFormData] = useState<Partial<CompleBoardVO>>({});//데이터 상태
  const [loading, setLoading] = useState(true);//로딩
  const [error, setError] = useState<string | null>(null);//에러

  const { num } = useParams<{ num: string }>();//url 에서 게시글 번호 가져오기
  const navigate = useNavigate();

  // 부서 번호와 이름 매핑
  const deptMap: { [key: number]: string } = {
    11: "감사담당관",
    12: "기획예산담당관",
    21: "홍보담당관",
    22: "안전복지정책관",
    23: "민원토지관",
    31: "일자리경제관",
    32: "정원산림관",
  };

  const stateOptions = ["접수중", "담당부서 지정", "처리 중", "완료"];// 상태 선택 옵션 목록
  //데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/comple/detail?num=${num}`);
        //폼 데이터 상태 업데이트
        setFormData({
          ...response.data,
          state: response.data.state || stateOptions[0], // 기본값 설정
          deptno: response.data.deptno || 11, // 기본값: 감사담당관
        });
        setLoading(false);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, [num]);
  //입력 필드 값 변경
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "deptno" ? parseInt(value) : value, // deptno를 숫자로 변환
    }));
  };
  //작성한 내용 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.state || !formData.deptno) {
      alert("상태와 부서를 모두 선택해주세요.");
      return;
    }
    //서버에 내용수정 요청
    try {
      axios.put(`${process.env.REACT_APP_BACK_END_URL}/api/comple/update`, null, {
        params: {
          num: formData.num,
          state: formData.state,
          deptno: formData.deptno,
        },
      });
      alert("게시글이 수정되었습니다.");
      navigate(`/noorigun/comple/${num}`);//수정되면 목록페이지로 이동
    } catch (err) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;//에러 발생 시 

  return (
    <RequireAuth>
      <div className="admin-comple-background">
        <div className="admin-comple-edit">
          <h1>게시글 수정</h1>
          <div className="form-group">
            <label>제목</label>
            <div>{formData.title}</div>
          </div>
          <div className="form-group">
            <label>내용</label>
            <div>{formData.content}</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>상태</label>
              <select
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
              >
                {stateOptions.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>부서</label>
              <select
                name="deptno"
                value={formData.deptno || ""}
                onChange={handleChange}
              >
                {Object.entries(deptMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit">수정 완료</button>
              <Link to={`/noorigun/comple/${num}`} className="btn btn-danger">취소</Link>
            </div>
          </form>
        </div>
      </div>
    </RequireAuth>
  );
};

export default CompleBoardEdit;
