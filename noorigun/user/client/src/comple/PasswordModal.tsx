import React, { useEffect, useState } from 'react';
import './css/CompleBoard.css';  // CSS 파일 임포트

interface PasswordModalProps {
  isOpen: boolean; // 모달이 열려 있는지 여부
  onClose: () => void; // 모달 닫는 함수
  onConfirm: (password: string, setErrorMessage: (message: string) => void) => void;
  // 비밀번호 확인 처리 함수. 입력된 비밀번호와 에러 메시지 설정 함수를 인자로 받음
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState(''); // 입력된 비밀번호 저장
  const [errorMessage, setErrorMessage] = useState(''); // 에러메세지 저장

  // 모달이 열릴 때 비밀번호, 에러 메세지 초기화
  useEffect(() => {
    if (isOpen) {
      setPassword(''); // 입력값 초기화
      setErrorMessage(''); // 에러 메시지도 초기화
    }
  }, [isOpen]); // isOpen가 변경될 때 실행

  const handleConfirm = () => {
    onConfirm(password, setErrorMessage); // 입력된 비밀번호 전달

  };

  // Enter 키를 눌렀을 때 확인 버튼과 동일한 동작 수행
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm(); // 엔터 키로도 확인
    }
  };

  if (!isOpen) {
    return null; // 모달이 열리지 않으면 렌더링하지 않음
  }

  return (
    <div className="complepass-modal-overlay">
      <div className="complepass-modal-content">
        <button className="complepass-close-button" onClick={onClose}>
          ✖
        </button>
        <h3 className="complepass-modal-title">비밀번호 입력</h3>
        {errorMessage && <p className="complepass-error-message">{errorMessage}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress} // 엔터 키 이벤트 추가
          className="complepass-input-field"
          maxLength={4} // 입력창에서 최대 4자리만 허용
          placeholder="숫자 1~4자리 입력"
        />
        <div className="complepass-modal-actions">
          <button className="complepass-cancel-button" onClick={onClose}>
            취소
          </button>
          <button className="complepass-confirm-button" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;