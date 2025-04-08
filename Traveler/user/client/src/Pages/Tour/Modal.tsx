import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface ModalProps {
    isOpenModal: boolean;
    onClose: () => void;
    tourNum: number;
    fetchAverageRating: () => void;
    fetchReviews: (tourId: string, page: number) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpenModal, onClose, tourNum, fetchAverageRating,fetchReviews }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    if (!isOpenModal) return null;

    const stars = [1, 2, 3, 4, 5];

    const submitReview = async () => {
        if (!review || rating === 0) {
            alert('별점과 리뷰 내용을 입력해주세요.');
            return;
        }
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACK_END_URL}/api/reviews/add-review`,
                { 
                    tourNum: tourNum,
                    userName: "테스트 사용자",
                    rating: rating, 
                    content: review 
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            console.log("📌 리뷰 등록 성공:", response.data);
            alert('리뷰가 등록되었습니다!');
    
            onClose();
            setReview('');
            setRating(0);
    
            fetchAverageRating(); // ✅ 기존 평균 평점 업데이트
            fetchReviews(tourNum.toString(), 1) // ✅ 새로 작성한 리뷰가 목록에 반영되도록 추가
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('서버 응답 데이터:', (error as AxiosError).response?.data);
            } else {
                console.error('알 수 없는 오류 발생:', error);
            }
            alert('리뷰 등록 중 오류가 발생했습니다.');
        }
    };
    
    
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '50%',
                    maxWidth: '500px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                }}
            >
                <button
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                    }}
                    onClick={onClose}
                >
                    ✖
                </button>

                <h2 style={{ textAlign: 'center' }}>리뷰 작성</h2>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>별점</label>
                    <div>
                        {stars.map((star) => (
                            <span
                                key={star}
                                style={{
                                    cursor: 'pointer',
                                    color: star <= rating ? 'gold' : 'gray',
                                    fontSize: '24px',
                                    marginRight: '5px',
                                }}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ fontWeight: 'bold' }}>리뷰 내용</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        style={{
                            width: '100%',
                            height: '100px',
                            resize: 'none',
                            overflow: 'auto',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                        placeholder="여행에 대한 리뷰를 남겨주세요..."
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                    <button
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            padding: '8px 15px',
                            marginRight: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={submitReview}
                    >
                        제출
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;