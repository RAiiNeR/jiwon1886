import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const ApplicationForm: React.FC = () => {
    //신청서 폼
  const [id, setId] = useState('');
  const [rname, setRname] = useState('');
  const [cnt, setCnt] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const formData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/rent/renting`);
        setId(response.data);
        setRname(response.data);
        setCnt(response.data);
      } catch (error) {
        console.log("오류발생 : ",error);
      }
    };
    formData();
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      // 서버로 POST 요청 보내기
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/rent/renting`, {
        id,        // 입력받은 아이디
        rname,     // 입력받은 물품 이름
        cnt,       // 입력받은 수량
      });
  
      console.log('Response:', response.data);  // 성공적인 응답을 콘솔에 출력
      alert("신청되었습니다");  // 신청 완료 알림
      navigate('/noorigun/rent');  // 성공 후 'rent' 페이지로 이동
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('수정 오류:', error.response?.data || error.message);  // 오류 메시지 출력
        alert(error.response?.data || "오류가 발생했습니다.");  // 사용자에게 오류 메시지 알림
      } else {
        console.log('예상치 못한 오류:', error);
        alert("예상치 못한 오류가 발생했습니다.");
      }
    }
  };
  
  

  return (
    <div className='applicationForm'>
      <div className='appli-container'>
          <h2>신청서 작성 페이지</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3 row'>
              <label className='col-sm-3 col-form-label fw-bold label-font'>아이디를 입력해주세요 : </label>
              <div className='id'>
                  <input type="text" name='id' id='id' value={id}
                      className="form-control update-text phone-box" onChange={e => setId(e.target.value)} required
                  />
              </div>
            </div>

            <div className='mb-3 row'>
              <label className='col-sm-3 col-form-label fw-bold label-font'>빌려가실 품목을 입력해주세요 : </label>
              <div className='rname'>
                  <input type="text" name='rname' id='rname' value={rname}
                      className="form-control update-text phone-box" onChange={e => setRname(e.target.value)} required
                  />
              </div>
            </div>

            <div className='mb-3 row'>
              <label className='col-sm-3 col-form-label fw-bold label-font'>품목의 갯수를 입력해주세요</label>
              <div className='cnt'>
                  <input type="number" name='cnt' id='cnt' value={cnt}
                      className="form-control update-text phone-box" onChange={e => setCnt(e.target.value)} required maxLength={3}
                  />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-5 form-btnBox">
              <Link to={`/noorigun/rent`} className='btn btn-secondary'>뒤로가기</Link>
              <button type='submit' className='btn btn-primary'>신청하기</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default ApplicationForm