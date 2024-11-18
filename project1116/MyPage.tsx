import React from 'react'
import './MyPageCss.css'

const MyPage: React.FC = () => {
  return (
    <div>
      <div className='mypage'>
        <h2>나의 누리</h2>
        <table>
          <tbody>
            <tr>
              <th>이름</th>
              <td>테스형</td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>010-1234-5678</td>
            </tr>
            <tr>
              <th>e-mail</th>
              <td>nooridawon0317@naver.com</td>
            </tr>
            <tr>
              <th>주소</th>
              <td>누리시 누리동 101호</td>
            </tr>
          </tbody>
        </table>

        <div className='mypage-box'>
          <p>이곳에서 쉽게 찾아보세요!</p>
          <div className='flexbox'>
            <div className='left-box'>
              <h2>민원</h2>
              <span>내가 신청한 민원은?</span>
              <p>34<span>건</span></p>
              <div className='imgBox'>
                <img src='./images/img4.png' alt='제안' />
              </div>
            </div>

            <div className='right-box'>
              <h2>제안</h2>
              <span>내가 신청한 제안은?</span>
              <p>10<span>건</span></p>
              <div className='imgBox'>
                <img src='./images/img3.png' alt='제안' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage