import React, { useState } from 'react';
import './css/VoteModal.css';
import axios from 'axios';

interface VoteOption { // 투표 옵션
    text: string;
    image: File | null;
    image_url: string | null; // 서버에서 반환된 이미지 URL
}

interface VoteModalProps {
    isOpen: boolean; // 모달이 열려있는지 여부
    onClose: () => void; // 모달 닫기
    onSave: (data: {
        cbnum?: number; // 게시글 번호
        title: string;
        options: { text: string; image_url: string | null }[]; // 옵션 배열
        allow_multiple: boolean; // 복수 선택 허용 여부
        anonymous: boolean; // 익명 투표 여부
        autoEndType: 'date' | 'participants' | 'none'; // 자동 종료 조건
        end_date?: string; // 종료 날짜(자동종료가 date일 경우)
        max_participants?: number;  // 최대 참여자 수
        showResults: 'after_vote' | 'always'; // 투표결과 표시

    }) => void;
    cbnum?: number;
}

const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose, onSave, cbnum }) => {
    const [voteTitle, setVoteTitle] = useState('');
    const [options, setOptions] = useState<VoteOption[]>([]);
    const [allow_multiple, setAllow_multiple] = useState(false); // 복수 선택 허용 여부
    const [anonymous, setAnonymous] = useState(false); // 익명 투표 여부
    const [autoEndType, setAutoEndType] = useState<'date' | 'participants' | 'none'>('none');// 자동 종료 설정
    const [end_date, setEnd_date] = useState('');// 종료일
    const [max_participants, setMax_participants] = useState(0);// 최대 참여자 수
    const [showResults, setShowResults] = useState<'after_vote' | 'always'>('after_vote');

    // 옵션 추가 함수
    const handleAddOption = () => {
        setOptions((prevOptions) => [
            ...prevOptions,
            { text: '', image: null, image_url: null },
        ]);
    };

    // 옵션 텍스트 변경 처리
    const handleOptionTextChange = (index: number, text: string) => {
        setOptions((prevOptions) => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index].text = text;
            return updatedOptions;
        });
    };

    // 이미지 업로드 처리
    const handleImageUpload = async (index: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log("이미지 업업")
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/polls/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // 업로드된 이미지 URL 설정
            setOptions((prevOptions) => {
                const updatedOptions = [...prevOptions];
                updatedOptions[index].image_url = response.data.url;
                return updatedOptions;
            });
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드에 실패했습니다.');
        }
    };
    // 이미지 제거 처리
    const handleImageRemove = (index: number) => {
        setOptions((prevOptions) => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index].image = null;
            updatedOptions[index].image_url = null;
            return updatedOptions;
        });
    };
    // 저장 버튼 클릭 시 처리
    const handleSave = () => {
        const pollData = {
            cbnum,
            title: voteTitle,
            options: options.map((option) => ({
                text: option.text,
                image_url: option.image_url || null, // null도 허용
            })),
            allow_multiple,
            anonymous,
            autoEndType,
            end_date: autoEndType === 'date' ? end_date : undefined, // 종료 날짜가 필요한 경우만 포함
            max_participants: autoEndType === 'participants' ? max_participants : undefined,  // 최대 참여자 수 포함 여부
            showResults,

        };
        onSave(pollData); //부모 컴포넌트에 데이터 전달
        onClose(); // 모달 닫기
    };
    // 모달이 닫힌 상태라면 렌더링하지 않음
    if (!isOpen) return null;

    return (
        <div className="complevote vote-modal-overlay">
            <div className="vote-modal-content">
                <button className="vote-close-button" onClick={onClose}>
                    ✖
                </button>
                <h3 className="vote-modal-title">투표 설정</h3>
                <div>
                    <label>투표 제목</label>
                    <input
                        type="text"
                        value={voteTitle}
                        onChange={(e) => setVoteTitle(e.target.value)}
                        placeholder="투표 제목을 입력하세요"
                    />
                </div>
                <div className="vote-options">
                    {options.map((option, index) => (
                        <div key={index} className="vote-option">
                            <input
                                type="text"
                                placeholder="항목 입력"
                                value={option.text}
                                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                            />
                            <div className="image-container">
                                {option.image_url ? (
                                    <div className="image-preview">
                                        <img
                                            src={`${process.env.REACT_APP_BACK_IMG_URL}/${option.image_url}`} // 반환된 이미지 URL 사용
                                            alt="미리보기"
                                            className="preview-image"
                                        />
                                        <button onClick={() => handleImageRemove(index)}>×</button>
                                    </div>
                                ) : (
                                    <label className="image-icon-label">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    handleImageUpload(index, e.target.files[0]);
                                                }
                                            }}
                                        />
                                        <span className="image-icon">📷</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={handleAddOption} className="vote-add-option">
                    항목 추가
                </button>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={allow_multiple}
                            onChange={(e) => setAllow_multiple(e.target.checked)}
                        />
                        복수 선택 허용
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                        />
                        무기명 투표
                    </label>
                </div>
                <div>
                    <label>투표 현황 보기</label>
                    <select
                        value={showResults}
                        onChange={(e) =>
                            setShowResults(e.target.value as 'after_vote' | 'always')
                        }
                    >
                        <option value="after_vote">투표 참여 후 보기</option>
                        <option value="always">항상 보기</option>
                    </select>
                </div>

                <div>
                    <label>자동 종료 설정</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="autoEndType"
                                value="none"
                                checked={autoEndType === 'none'}
                                onChange={() => setAutoEndType('none')}
                            />
                            자동 종료 없음
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="autoEndType"
                                value="date"
                                checked={autoEndType === 'date'}
                                onChange={() => setAutoEndType('date')}
                            />
                            종료일 설정
                        </label>
                        {autoEndType === 'date' && (
                            <div>
                                <input
                                    type="datetime-local"
                                    value={end_date}
                                    onChange={(e) => setEnd_date(e.target.value)}
                                />
                            </div>
                        )}
                        <label>
                            <input
                                type="radio"
                                name="autoEndType"
                                value="participants"
                                checked={autoEndType === 'participants'}
                                onChange={() => setAutoEndType('participants')}
                            />
                            참여자 수 설정
                        </label>
                        {autoEndType === 'participants' && (
                            <div>
                                <input
                                    type="number"
                                    min="1"
                                    value={max_participants}
                                    onChange={(e) =>
                                        setMax_participants(Number(e.target.value))
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <button type="button" onClick={onClose}>
                        취소
                    </button>
                    <button type="button" onClick={handleSave}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteModal;
