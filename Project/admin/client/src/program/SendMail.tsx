import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './css/SendMail.css';  // CSS 파일 import

const SendMail: React.FC = () => {
  const { num } = useParams<{ num: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  //메일주소
  const emails = location.state?.emails || [];
  console.log(emails);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: '',
    text: ''
  });

  // 로딩 상태 추가
  const [loading, setLoading] = useState(false);

  // 입력값 변경 처리 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 로딩 시작

    // 서버로 보낼 데이터
    const data = {
      title: formData.title,
      text: formData.text,
    };

    try {
      for (let email of emails) {
        // 서버로 JSON 데이터를 전송
        await axios.post('http://localhost:82/noorigun/api/program/sendmail', { ...data, receiver: email }, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      alert('메일이 성공적으로 전송되었습니다!');
      navigate(`/program/student/${num}`);
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      alert('메일 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false); // 요청 완료 후 로딩 종료
    }
  };

  return (
    <div className="sendmail">
      <h1>메일 보내기</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>제목</td>
              <td>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="보낼 내용을 입력하세요"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" disabled={loading}>
          {loading ? '발송 중...' : '발송'}
        </button>
      </form>

      {loading && <p>로딩 중...</p>} {/* 로딩 중 메시지 */}
    </div>
  );
};

export default SendMail;
