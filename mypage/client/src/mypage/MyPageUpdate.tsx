import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

const MyPageUpdate: React.FC = () => {
    const { id } = useParams();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [addr, setAddr] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`http://localhost:81/back/api/mypage/detail?id=${id}`);
                const { phone, email, addr } = response.data;
                setPhone(phone);
                setEmail(email);
                setAddr(addr);
            } catch (error) {
                console.error('오류:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const requestBody = { phone, email, addr };

        try {
            await axios.post(`http://localhost:81/back/api/mypage/update?id=${id}`, requestBody, {
                headers: { 'Content-Type': 'application/json' },
            });
            navigate(`/mypage/${id}`);
        } catch (error) {
            console.error('수정 오류:', error);
        }
    };


  return (
    <div className='myPageUpdate'>
      <h2>수정할 정보를 입력해주세요</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3 row'>
            <label className='col-sm-3 col-form-label fw-bold label-font'>전화번호 : </label>
            <input type="text" name='phone' id='phone' value={phone}
                className="form-control update-text" onChange={e => setPhone(e.target.value)} required/>
        </div>

        <div className='mb-3 row'>
            <label className='col-sm-3 col-form-label fw-bold label-font'>이메일 : </label>
            <input type="text" name='email' id='email' value={email}
                className="form-control update-text" onChange={e => setEmail(e.target.value)} required/>
        </div>

        <div className='mb-3 row'>
            <label className='col-sm-3 col-form-label fw-bold label-font'>주소 : </label>
            <input type="text" name='addr' id='addr' value={addr}
                className="form-control update-text" onChange={e => setAddr(e.target.value)} required/>
        </div>

        <div className="d-flex justify-content-end mt-5 form-btnBox">
            <Link to={`/mypage/${id}`} className='btn btn-secondary'>뒤로가기</Link>
            <button type='submit' className='btn btn-primary'>수정하기</button>
        </div>
      </form>
    </div>
  )
}

export default MyPageUpdate