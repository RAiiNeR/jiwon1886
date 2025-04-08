import React, { useEffect, useState } from 'react'
import './css/MyPageCss.css'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import RequireAuth from '../comp/RequireAuth';

interface MyProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  addr: string;
}

interface MyComple {
  TOTAL: number; // 전체 게시글 수
  RECEIPT: number; // 민원 완료 수
  RECEIPTING: number; // 민원처리 중 수
  DESIGNATEDEPT: number; // 민원 담당부서 지정 수
  ACCEPTING: number; // 민원접수 중 수
}

interface MySuggestion {
  TOTAL: number; // 전체 게시글 수
  COMPLETED: number; // 제안 채택 수
  IN_PROGRESS: number; // 제안 논의 중 수
  RECEIVED: number; // 제안 등록 수
}

const MyPage: React.FC = () => {
  const { id } = useParams(); // URL에서 id 추출
  const [mypage, setMypage] = useState<MyProfile | null>(null); // 사용자 프로필 정보
  const [myComple, setMyComple] = useState<MyComple>(); // 민원처리 리스트
  const [mySuggestion, setMySuggestion] = useState<MySuggestion>(); // 제안처리 리스트

  // 컴포넌트가 마운트되거나 id가 변경될 때 실행
  useEffect(() => {
    const getDetail = async () => {
      try {
        // 서버에서 사용자 데이터 가져옴
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/mypage/detail?id=${id}`);
        setMypage(response.data.user); // 사용자 정보 저장
        setMyComple(response.data.mycomple); // 민원처리 리스트 저장
        setMySuggestion(response.data.mysuggestion); // 제안처리 리스트 저장
      } catch (error) {
        console.log('오류발생 : ', error);
      }
    }
    getDetail();
  }, [id]); // id가 변경될 때마다 실행

  // 데이터가 없는 경우 로딩중 표시
  if (!mypage) {
    return <div>로딩중입니다...</div>
  }
  if (!myComple) {
    return <div>로딩중입니다...</div>
  }

  if (!mySuggestion) {
    return <div>로딩중입니다...</div>
  }

  return (
    <RequireAuth>
      <div className='mypage'>
        <div className='mypage-container'>
          <h2>나의 누리</h2>
          <table className='profile-table'>
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
          <div className='d-flex justify-content-end align-items-center'>
            <div className='program'>
              {/**개인 강좌 신청 현황 들어가는곳 12.12추가 */}
              <Link to={`/noorigun/program/update`} style={{ textDecoration: 'none' }} className='link-btn'>개인강좌신청현황</Link>
            </div>
            {/* 프로필 수정 버튼 */}
            <div className='btn'>
              <Link to={`/noorigun/mypage/update/${id}`} style={{ textDecoration: 'none' }} className='link-btn'>프로필 수정</Link>
            </div>
          </div>





          <div className='mypage-box'>
            <p>이곳에서 쉽게 찾아보세요!</p>
            <div className='flexbox'>
              <div className='left-box'>
                <div className='text-box'>
                  <div className='count'>
                    <h2>민원</h2>
                    <span>내가 신청한 민원은?</span>
                  </div>
                  <p>{myComple.TOTAL}<span>건</span></p> {/* 전체 게시글 표시 */}
                </div>
                <div className='page-box'>
                  <Link to={'/noorigun/comple'} style={{ textDecoration: 'none' }} className='page-btn'>바로가기</Link>
                </div>
                <table className='boxTable'>
                  {/* <colgroup>
                  <col width={'40%'} />
                  <col width={'20%'} />
                  <col width={'20%'} />
                  <col width={'20%'} />
                </colgroup> */}
                  <thead>
                    <tr>
                      <th>접수중</th>
                      <th>담당부서지정</th>
                      <th>처리중</th>
                      <th>완료</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{myComple.ACCEPTING || 0}</td>
                      <td>{myComple.DESIGNATEDEPT || 0}</td>
                      <td>{myComple.RECEIPTING || 0}</td>
                      <td>{myComple.RECEIPT || 0}</td>
                    </tr>
                  </tbody>
                </table>
                <img src='../images/mypage/img4.png' alt='제안' />
              </div>

              <div className='right-box'>
                <div className='text-box'>
                  <div className='count'>
                    <h2>제안</h2>
                    <span>내가 신청한 제안은?</span>
                  </div>
                  <p>{mySuggestion.TOTAL}<span>건</span></p>
                </div>
                <div className='page-box'>
                  <Link to={'/noorigun/suggestion'} style={{ textDecoration: 'none' }} className='page-btn'>바로가기</Link>
                </div>
                <table className='boxTable'>
                  <thead>
                    <tr>
                      <th>접수중</th>
                      <th>처리중</th>
                      <th>완료</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{mySuggestion.RECEIVED || 0}</td>
                      <td>{mySuggestion.IN_PROGRESS || 0}</td>
                      <td>{mySuggestion.COMPLETED || 0}</td>
                    </tr>
                  </tbody>
                </table>
                <img src='../images/mypage/img3.png' alt='제안' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

export default MyPage