import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';

const Main: React.FC = () => {
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [postNumbers, setPostNumbers] = useState<number[]>([]);  // 최신 3개의 num
  const [postnum1, setPostnum1] = useState(0);
  const [postnum2, setPostnum2] = useState(0);
  const [postnum3, setPostnum3] = useState(0);

  // 최신 3개의 num 값을 가져오는 함수
  const fetchLatestPostNumbers = async () => {
    try {
      const response = await axios.get('http://localhost:81/noorigun/api/program/latest');
      const latestPosts = response.data;  // 서버에서 최신 게시글 데이터 받기
      if (latestPosts.length >= 3) {
        setPostNumbers([latestPosts[0].num, latestPosts[1].num, latestPosts[2].num]); // num 값만 추출하여 배열로 저장
      }
      setPostnum1(latestPosts[0].num);
      setPostnum2(latestPosts[1].num);
      setPostnum3(latestPosts[2].num);
    } catch (error) {
      console.log('Error fetching latest posts: ', error);
    }
  };

  useEffect(() => {
    fetchLatestPostNumbers(); // 최신 게시글 번호를 가져오는 함수 호출

    // 로컬 스토리지에서 VisitCookie 확인
    const VISITED_BEFORE_DATE_1 = localStorage.getItem('modal1-VisitCookie');
    const VISITED_BEFORE_DATE_2 = localStorage.getItem('modal2-VisitCookie');
    const VISITED_BEFORE_DATE_3 = localStorage.getItem('modal3-VisitCookie');

    // 첫 번째 모달
    if (VISITED_BEFORE_DATE_1 === null) {
      setModalVisible1(true); //모달 열기
    } else {
      const visitedDate1 = new Date(parseInt(VISITED_BEFORE_DATE_1));
      if (visitedDate1.getTime() <= new Date().getTime()) {
        setModalVisible1(true); //모달 열기
      } else {
        setModalVisible1(false); //모달 닫기
      }
    }

    // 두 번째 모달
    if (VISITED_BEFORE_DATE_2 === null) {
      setModalVisible2(true);
    } else {
      const visitedDate2 = new Date(parseInt(VISITED_BEFORE_DATE_2));
      if (visitedDate2.getTime() <= new Date().getTime()) {
        setModalVisible2(true);
      } else {
        setModalVisible2(false);
      }
    }

    // 세 번째 모달
    if (VISITED_BEFORE_DATE_3 === null) {
      setModalVisible3(true);
    } else {
      const visitedDate3 = new Date(parseInt(VISITED_BEFORE_DATE_3));
      if (visitedDate3.getTime() <= new Date().getTime()) {
        setModalVisible3(true);
      } else {
        setModalVisible3(false);
      }
    }
  }, []);

  return (
    <div>
      {/* 모달 상태가 true일 때만 모달을 렌더링 */}
      {isModalVisible1 && postNumbers[0] && (
        <Modal
          visible={isModalVisible1} // 모달의 표시 여부
          onClose={setModalVisible1} // 모달 닫는 함수
          maskClosable={true} // 마스크 클릭 시 닫기 여부
          closable={true} // 닫기 버튼 표시 여부
          imgUrl={`http://localhost:81/noorigun/api/program/${postNumbers[2]}`} 
          modalId="modal1" //모달 id
        />
      )}
      {isModalVisible2 && postNumbers[1] && (
        <Modal
          visible={isModalVisible2}
          onClose={setModalVisible2}
          maskClosable={true}
          closable={true}
          imgUrl={`http://localhost:81/noorigun/api/program/${postNumbers[1]}`} 
          modalId="modal2"
        />
      )}
      {isModalVisible3 && postNumbers[2] && (
        <Modal
          visible={isModalVisible3}
          onClose={setModalVisible3}
          maskClosable={true}
          closable={true}
          imgUrl={`http://localhost:81/noorigun/api/program/${postNumbers[0]}`} 
          modalId="modal3"
        />
      )}
    </div>
  ); 
};

export default Main;
