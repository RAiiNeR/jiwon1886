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
        const response = await axios.post('http://localhost:81/back/api/rent/renting');
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
      const response = await axios.post('http://localhost:81/back/api/rent/renting', {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Response:', response.data); // 성공적인 응답을 콘솔에 출력
      alert("신청완료");
      navigate('/rent'); // 성공 후 'rent' 페이지로 이동
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios 오류 처리
        console.log('수정 오류:', error.response?.data || error.message);  // 오류 메시지 출력
      } else {
        console.log('예상치 못한 오류:', error);
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
              <Link to={`/rent`} className='btn btn-secondary'>뒤로가기</Link>
              <button type='submit' className='btn btn-primary'>신청하기</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default ApplicationForm