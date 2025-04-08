import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Portal from './Potal';
import { Link } from 'react-router-dom';


interface ModalProps {
    className?: string;
    onClose: (visible: boolean) => void;
    maskClosable?: boolean;
    closable?: boolean;
    visible: boolean;
    imgUrl: string;
    modalId: string;
  }
  
  const Modal: React.FC<ModalProps> = ({ className, onClose, maskClosable, closable, visible, imgUrl, modalId }) => {
    const [img, setImg] = useState('');
    const [num, setNum] = useState();
    
    const onMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose(false);  // 마스크 클릭 시 모달 닫기
      }
    };

  // 메인 페이지에서만 모달을 띄우기 위한 조건
  const isMainPage = window.location.pathname === '/';
  
    // const fetchImage = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:81/noorigun/api/program/1");
    //     setImg(response.data.img);
    //   } catch (error) {
    //     console.log('Error Message: ' + error);
    //   }
    // };
  
    useEffect(() => {
        if (imgUrl) {
            const fetchImage = async () => {
              try {
                const response = await axios.get(imgUrl); // imgUrl에서 이미지 가져오기
                setImg(response.data.img);  // 응답에서 이미지를 추출해 상태로 저장
                console.log("response.data.num : "+response.data.num);
                setNum(response.data.num);
                console.log(num);
              } catch (error) {
                console.error('이미지 로드 실패:', error);
              }
            };
            fetchImage();
          }
        }, [imgUrl]);  // imgUrl이 변경될 때마다 이미지 로드 시도
  
    // 오늘 하루 닫기
    const Dayclose = () => {
      if (onClose) {
        onClose(false);  // 오늘 하루 동안 모달을 닫음
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1);
        const expiryDate = expiry.getTime();
        localStorage.setItem(`${modalId}-VisitCookie`, expiryDate.toString());
      }
    };
  
    // 그냥 닫기
    const close = () => {
      if (onClose) {
        onClose(false);
      }
    };

  if (!isMainPage) {
    return null; // 메인 페이지가 아니면 모달을 렌더링하지 않음
  }
  
    return (
      <Portal elementId="modal-root">
        <ModalOverlay visible={visible} onClick={maskClosable ? onMaskClick : undefined} />
        <ModalWrapper className={className} visible={visible} onClick={(e) => e.stopPropagation()}>
          <ModalInner>
            <ImgStyle>
              <Link to={`http://localhost:3001/program/${num}`} rel="noopener noreferrer" target="_blank">
                <img src={`${process.env.REACT_APP_BACK_IMG_URL}/${img}`} style={{ width: '100%', height: '100%' }} alt="Modal Content" />
              </Link>
            </ImgStyle>
            {closable && (
              <CloseStyle>
                <Close className="modal-close" onClick={Dayclose}>
                  오늘 하루 닫기
                </Close>
                <Close className="modal-close" onClick={close}>
                  닫기
                </Close>
              </CloseStyle>
            )}
          </ModalInner>
        </ModalWrapper>
      </Portal>
    );
  };

// 스타일 컴포넌트
const ModalWrapper = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`;

const ModalOverlay = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 360px;
  max-width: 480px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 40px 20px;
  border-radius: 8px;
`;

const ImgStyle = styled.div`
  width: 100%;
  height: auto;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

const CloseStyle = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #282828;
  width: 100%;
  padding: 15px;
  border-radius: 0 0 15px 15px;
  color: #ffffff;
`;

const Close = styled.span`
  cursor: pointer;
`;

export default Modal;
