import React, { useEffect, useState } from 'react'
import './MyPageCss.css'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

interface MyProfile{
    id:string;
    name:string;
    phone:string;
    email:string;
    addr:string;
}

const MyPage: React.FC = () => {
  const { id } = useParams();
  const [mypage, setMypage] = useState<MyProfile>();

  useEffect(() => {
    const getDetail = async() => {
        try {
            const response = await axios.get('http://localhost:81/back/api/mypage/detail?id=' + id);
            console.log(response.data);
            setMypage(response.data);
        } catch (error) {
            console.log('오류발생 : ', error);
        }
    }
    getDetail();
  },[id]);

  if (!mypage) {
    return <div>로딩중입니다...</div>
  }

  return (
    <div className='mypage'>
      <div className='mypage-container'>
        <h2>나의 누리</h2>
        <table>
          <tbody>
            <tr>
              <th>이름</th>
              <td>{mypage.name}</td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>{mypage.phone}</td>
            </tr>
            <tr>
              <th>e-mail</th>
              <td>{mypage.email}</td>
            </tr>
            <tr>
              <th>주소</th>
              <td>{mypage.addr}</td>
            </tr>
          </tbody>
        </table>
        <div className='btn'>
            <Link to={`/mypage/update/${id}`} style={{textDecoration:'none'}} className='link-btn'>프로필 수정</Link>
        </div>

        <div className='mypage-box'>
          <p>이곳에서 쉽게 찾아보세요!</p>
          <div className='flexbox'>
            <div className='left-box'>
              <h2>민원</h2>
              <span>내가 신청한 민원은?</span>
              <p>34<span>건</span></p>
              <div className='page-box'>
                <Link to={'/comple'} style={{textDecoration:'none'}} className='page-btn'>바로가기</Link>
              </div>
              <div className='imgBox'>
                <img src='/images/img4.png' alt='제안' />
              </div>
            </div>

            <div className='right-box'>
              <h2>제안</h2>
              <span>내가 신청한 제안은?</span>
              <p>10<span>건</span></p>
              <div className='page-box'>
                <Link to={'/comple'} style={{textDecoration:'none'}} className='page-btn'>바로가기</Link>
              </div>
              <div className='imgBox'>
                <img src='/images/img3.png' alt='제안' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage