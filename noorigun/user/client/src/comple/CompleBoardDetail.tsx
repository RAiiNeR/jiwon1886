import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/CompleBoard.css';
import Comments from './Comments';
import PasswordModal from './PasswordModal';
import CompleReply from './CompleReply';

interface CompleBoardVO {
    num: number;
    title: string;
    content: string;
    writer: string;
    img_names: string[];
    cdate: string;
    state: string; // 상태 (예: 접수중, 처리중 등)
    pri: number; // 공개 여부 (1: 공개, 0: 비공개)
    hit: number;
    pwd: number;
}

const CompleBoardDetail: React.FC<{ num: string }> = ({ num }) => {
    const [compleBoard, setCompleBoard] = useState<CompleBoardVO | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
    const [modalAction, setModalAction] = useState<'edit' | 'delete'>('edit'); // 수정/삭제 구분
    const navigate = useNavigate();


    // 상태에 따른 이미지 매핑
    const stateImages: { [key: string]: string } = {
        '접수중': 'state01.png',
        '담당부서 지정': 'state02.png',
        '처리 중': 'state03.png',
        '완료': 'state04.png',
    };

    const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`; // 이미지 파일 경로

    // 게시글 데이터 불러오기
    useEffect(() => {
        const getDetail = async () => {
            try {
                const response = await axios.get(
                    // API 요청: 특정 게시글의 상세 데이터를 가져오기 위한 GET 요청
                    `${process.env.REACT_APP_BACK_END_URL}/api/compleboard/detail?num=${num}`
                );
                setCompleBoard(response.data); // API 응답 데이터를 상태로 저장
            } catch (error) {
                console.error('게시글 데이터를 가져오는 중 오류 발생:', error);
            }
        };
        getDetail();
    }, [num]); // num이 변경될 때마다 실행

    // 수정
    const handleEditClick = () => {
        setModalAction('edit'); // 수정 모드 설정
        setIsModalOpen(true); // 모달 열기
    };

    // 삭제
    const handleDeleteClick = () => {
        setModalAction('delete'); // 삭제 모드 설정
        setIsModalOpen(true); // 모달 열기
    };

    // 날짜
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    // 비밀번호 확인
    const handlePasswordConfirm = async (inputPassword: string, setErrorMessage: (message: string) => void) => {
        try {
            const response = await axios.get(
                // 비밀번호 확인을 위한 GET 요청
                `${process.env.REACT_APP_BACK_END_URL}/api/compleboard/verifyPassword`,
                {
                    params: {
                        num: Number(num), // 게시글 번호
                        pwd: inputPassword, // 입력된 비밀번호
                    },
                }
            );

            if (response.data === true) {
                setIsModalOpen(false); // 비밀번호 성공시 모달 닫기

                if (modalAction === 'edit') {
                    // 수정 페이지로 이동
                    navigate(`/noorigun/comple/edit/${num}`);
                } else if (modalAction === 'delete') {
                    // 삭제 처리
                    await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/compleboard?num=${num}`);
                    alert('게시글이 삭제되었습니다.');
                    navigate('/noorigun/comple'); // 리스트 페이지로 이동
                }
            } else {
                setErrorMessage('비밀번호가 틀렸습니다.'); // 비밀번호 오류 메세지
            }
        } catch (error) {
            console.error('비밀번호 확인 중 오류 발생:', error);
            setErrorMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    // 로딩 상태
    if (!compleBoard) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="comple-detail">
            {/*상태에 따른 이미지 표시 */}
            <div className="state-image">
                <img
                    src={`../images/complestate/${stateImages[compleBoard.state]}`}
                    alt={compleBoard.state}
                    style={{ width: '50%', height: 'auto', objectFit: 'cover' }}
                />
            </div>
            {/* 헤더 부분 */}
            <div className="detail-header">
                <h3>{compleBoard.title}</h3>
                <div className="detail-meta">
                    <span><strong>작성자:</strong> {compleBoard.writer}</span>
                    <span><strong>등록일:</strong> {formatDateTime(compleBoard.cdate)}</span>
                    <span><strong>조회수:</strong> {compleBoard.hit}</span>
                    <span><strong>상태:</strong> {compleBoard.state}</span>
                    <span><strong>공개:</strong> {compleBoard.pri === 1 ? '공개' : '비공개'}</span>
                </div>
            </div>

            {/* 내용 부분 */}
            <div className="detail-content">
                <p>{compleBoard.content}</p>
                {compleBoard.img_names?.length > 0 && (
                    <div>
                        {compleBoard.img_names.map((item, index) => (
                            <img
                                key={index}
                                src={`${filePath}${item}`}
                                alt={`이미지 ${index + 1}`}
                                style={{ width: '150px', height: '150px', margin: '10px' }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 버튼 섹션 */}
            <div className="action-buttons">
                <Link to="/noorigun/comple" className="list-btn">리스트</Link>
                <button type="button" className="edit-btn" onClick={handleEditClick}>
                    수정
                </button>
                <button type="button" className="delete-btn" onClick={handleDeleteClick}>
                    삭제
                </button>
            </div>

            <CompleReply cbnum={compleBoard.num} />  

            {/* 댓글 컴포넌트 */}
            <Comments cbnum={compleBoard.num} />

            {/* 비밀번호 입력 모달 */}
            <PasswordModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handlePasswordConfirm}
            />
        </div>
    );
};

export default CompleBoardDetail;
