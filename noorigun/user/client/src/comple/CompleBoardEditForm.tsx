import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CompleBoard.css'; // 스타일 파일

const CompleBoardEditForm: React.FC<{ num: string }> = ({ num }) => {
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    const [state, setState] = useState('접수중'); // 기본값 접수중
    const [pri, setPri] = useState('1'); // 공개여부 기본값 공개(2: 비공개)
    const [pwd, setPwd] = useState(''); // 비밀번호
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACK_END_URL}/api/compleboard/detail?num=${num}`
                );
                const { title, writer, content, state, pri, pwd } = response.data;
                setTitle(title || ''); // 데이터가 없을 경우 빈 문자열 설정
                setWriter(writer || '');
                setContent(content || '');
                setState(state || '접수중');
                setPri(String(pri || '1')); // 숫자를 문자열로 변환
                setPwd(String(pwd || '')); // 비밀번호를 문자열로 변환
            } catch (error) {
                console.error('게시글 데이터를 가져오는 중 오류 발생:', error);
            }
        };
        fetchBoard();
    }, [num]); // num이 변경될 때마다 실행

    // 비밀번호 입력 재한
    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // /.../: 리터럴, ^: 문자열 시작, \d: 숫자(0-9), {0,4}: 숫자반복 횟수, $: 문자열 끝
        if (/^\d{0,4}$/.test(value)) { 
            setPwd(value); // 숫자만 입력되게 4자리까지만 허용
        }
    };

    // 엔터키 입력시 기본 폼 제출 방지
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 엔터키로 폼 제출 방지
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 폼 기본동작 방지

        if (!title.trim() || !writer.trim() || !content.trim()) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        try {
            // 업데이트할 데이터 구성
            const updatedData = { num, title, writer, content, state, pri, pwd };
            // 서버에 수정 요청
            const response = await axios.put(
                `${process.env.REACT_APP_BACK_END_URL}/api/compleboard/edit?num=${num}`,
                updatedData
            );
            console.log('수정 성공:', response.data);
            navigate(`/noorigun/comple/${num}`); // 수정 후 상세페이지로 이동
        } catch (error) {
            console.error('수정 실패:', error);
        }
    };

    return (
        <div className="comple-form">
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                {/* 제목 입력 */}
                <div>
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required // 필수입력 필드
                    />
                </div>

                {/* 작성자 입력 */}
                <div>
                    <label htmlFor="writer">작성자</label>
                    <input
                        type="text"
                        id="writer"
                        value={writer}
                        onChange={(e) => setWriter(e.target.value)}
                        required // 필수입력 필드
                    />
                </div>

                {/* 내용 입력 */}
                <div>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required // 필수입력 필드
                        style={{ width: '100%', height: '150px', resize: 'vertical' }} // 내용 칸 스타일
                    />
                </div>

                {/* 상태 출력 (읽기 전용) */}
                <div>
                    <label htmlFor="state">상태</label>
                    <input
                        type="text"
                        id="state"
                        value={state}
                        readOnly
                    />
                </div>

                {/* 공개 여부 선택 */}
                <div>
                    <label>공개여부</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="pri"
                                value="1"
                                checked={pri === '1'}
                                onChange={(e) => setPri(e.target.value)}
                            />
                            공개
                        </label>
                        <label style={{ marginLeft: '10px' }}>
                            <input
                                type="radio"
                                name="pri"
                                value="2"
                                checked={pri === '2'}
                                onChange={(e) => setPri(e.target.value)}
                            />
                            비공개
                        </label>
                    </div>
                </div>

                {/* 비공개 선택 시 비밀번호 입력 */}
                {pri === '2' && (
                    <div>
                        <label htmlFor="pwd">패스워드</label>
                        <input
                            type="password"
                            id="pwd"
                            value={pwd}
                            onChange={handlePwdChange}
                            required
                            maxLength={4}
                            placeholder="숫자만 4자리까지 입력"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    style={{ backgroundColor: 'green', color: 'white' }} // 초록색 수정 버튼
                >
                    수정
                </button>
                <button type="button" onClick={() => navigate(`/noorigun/comple/${num}`)}>
                    취소
                </button>
            </form>
        </div>
    );
};

export default CompleBoardEditForm;
