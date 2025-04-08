import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';

const Main: React.FC = () => {
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [postNumbers, setPostNumbers] = useState<number[]>([]);//최신 게시글들의 번호를 저장하는 배열
  const [post, setPost] = useState<number>(0);//최신 게시글의 개수

  const fetchLatestPostNumbers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/program/latest`);
      const latestPosts = response.data || []; // 서버에서 최신 게시글 데이터 받기
      setPostNumbers(latestPosts.map((post:{num:Number}) => post.num));//각 게시글의 번호를 postNumbers배열에 저장장
      setPost(latestPosts.length);
    } catch (error) {
      console.error('Error fetching latest posts:', error);
    }
  };

  useEffect(() => {
    fetchLatestPostNumbers();// 최신 게시글 번호를 가져오는 함수
  }, []);


  //localStorage.getItem()을 사용하여 사용자가 해당 모달을 방문한 시간(modal1-VisitCookie)을 확인하고, 
  //그 시간 이후에만 모달이 보이게 한다
  //localStorage에서 이전에 방문한 기록이 없으면, 또는 기록된 날짜가 현재 시간보다 이전이면 모달이 보이도록 설정합니다.
  useEffect(() => {
    if (postNumbers.length >= 1) {
      const VISITED_BEFORE_DATE_1 = localStorage.getItem('modal1-VisitCookie');
      setModalVisible1(VISITED_BEFORE_DATE_1 === null || new Date(parseInt(VISITED_BEFORE_DATE_1)).getTime() <= new Date().getTime());
    }

    if (postNumbers.length >= 2) {
      const VISITED_BEFORE_DATE_2 = localStorage.getItem('modal2-VisitCookie');
      setModalVisible2(VISITED_BEFORE_DATE_2 === null || new Date(parseInt(VISITED_BEFORE_DATE_2)).getTime() <= new Date().getTime());
    }

    if (postNumbers.length >= 3) {
      const VISITED_BEFORE_DATE_3 = localStorage.getItem('modal3-VisitCookie');
      setModalVisible3(VISITED_BEFORE_DATE_3 === null || new Date(parseInt(VISITED_BEFORE_DATE_3)).getTime() <= new Date().getTime());
    }
  }, [postNumbers]);

  return (
    <div>
      {isModalVisible1 && postNumbers[0] && (
        <Modal
          visible={isModalVisible1}// 모달의 표시 여부
          onClose={setModalVisible1}// 모달 닫는 함수
          maskClosable={true}// 마스크 클릭 시 닫기 여부
          closable={true} // 닫기 버튼 표시 여부
          imgUrl={`${process.env.REACT_APP_BACK_END_URL}/api/program/detail?num=${postNumbers[0]}`}//이미지의 URL
          modalId="modal1"//모달 id
        />
      )}
      {isModalVisible2 && postNumbers[1] && (
        <Modal
          visible={isModalVisible2}
          onClose={setModalVisible2}
          maskClosable={true}
          closable={true}
          imgUrl={`${process.env.REACT_APP_BACK_END_URL}/api/program/detail?num=${postNumbers[1]}`}
          modalId="modal2"
        />
      )}
      {isModalVisible3 && postNumbers[2] && (
        <Modal
          visible={isModalVisible3}
          onClose={setModalVisible3}
          maskClosable={true}
          closable={true}
          imgUrl={`${process.env.REACT_APP_BACK_END_URL}/api/program/detail?num=${postNumbers[2]}`}
          modalId="modal3"
        />
      )}
    </div>
  );
};

export default Main;
