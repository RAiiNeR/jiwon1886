import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MapForm from './MapForm';
import Map from './Map';
import RequireAuth from '../comp/RequireAuth';

interface Data {
    placeaddr: string;
    placename: string;
    latitude: number;
    longitude: number;
}

const PromoteBoardForm: React.FC = () => { // useState로 입력 데이터를 상태로 관리
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [warning, setWarning] = useState(""); // 경고 메시지
    const [promote, setPromote] = useState({
        title: '',
        content: '',
        placeaddr: '',
        placename: '',
        latitude: 0,
        longitude: 0
    });
    const [mfile, setMfile] = useState<File[]>();
    const [isVisiable, setIsVisiable] = useState(false)
    //입력 상태 업데이트
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPromote({ ...promote, [name]: value });
    };
    //첨부파일 선택 시 상태 업데이트
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setMfile(Array.from(e.target.files));
        }
    };

    useEffect(() => {
        console.log(promote)
    }, [promote])
    //유효성 검사 후 서버로 데이터 전송
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 기본 유효성 검사
        if (!promote.title || !promote.content) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        // 추가 유효성 검사
        if (!promote.placeaddr) {
            setWarning("장소를 추가해 주세요.");
            return;
        }
        // 폼 데이터를 서버로 전송할 준비
        const data = new FormData();
        data.append('title', promote.title);
        data.append('content', promote.content);
        mfile?.forEach(img => data.append('mfiles', img));// 첨부 파일 추가
        data.append('placeaddr', promote.placeaddr);
        data.append('placename', promote.placename);
        data.append('latitude', `${promote.latitude}`);
        data.append('longitude', `${promote.longitude}`);
        setLoading(true); // 로딩 상태 시작
        try {
            await axios.post('http://localhost:82/noorigun/api/promote', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('업로드가 완료되었습니다!');
            navigate('/promote');
        } catch (error: any) {
            console.error('Error:', error.response?.data || error.message);
            alert('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };
    // 지도 선택 폼 닫기 핸들러
    const handleColse = () => {
        setIsVisiable(false);
    }
    //선택한 장소 데이터 상태에 저장
    const handleGetMapData = (data: Data) => {
        setPromote({
            ...promote,
            placeaddr: data.placeaddr,
            placename: data.placename,
            latitude: data.latitude,
            longitude: data.longitude
        });
        setIsVisiable(false);// 지도 선택 폼 닫기
    }

    return (
        <RequireAuth>
            <div style={{ padding: '50px' }}>
                <div className="upPromoteContainer">
                    <h2 className="mb-4">행사글 업로드</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                placeholder="제목을 입력하세요"
                                value={promote.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <textarea
                                name="content"
                                className="form-control"
                                placeholder="내용을 입력하세요"
                                value={promote.content}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">첨부파일</label>
                            <input
                                type="file"
                                className="form-control"
                                name="mfile"
                                onChange={handleFileChange}
                                required
                                multiple
                            />
                        </div>
                        {/* 지도 정보 처리 영역 */}
                        <div className='mb-3'>
                            {
                                promote.placename !== '' ? (
                                    <Map map={{
                                        placeaddr: promote.placeaddr,
                                        placename: promote.placename,
                                        latitude: promote.latitude,
                                        longitude: promote.longitude
                                    }} />
                                ) : (
                                    <>
                                        {
                                            warning && (<p className='text-danger'>{warning}</p>)
                                        }
                                    </>
                                )
                            }
                        </div>
                        <div className='mb-3'>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? '업로드 중...' : '업로드'}
                            </button>
                            <button type="button" className="btn btn-danger" disabled={loading}
                                onClick={_ => navigate("/promote")}>
                                목록으로
                            </button>
                            <button type='button' className="btn btn-primary" onClick={e => setIsVisiable(!isVisiable)}>
                                {isVisiable ? "취소" : "장소 추가"}
                            </button>
                        </div>
                        {/* 지도 선택 폼 렌더링 */}
                        {
                            isVisiable && (
                                <MapForm onChange={handleGetMapData} onClose={handleColse} />
                            )
                        }
                    </form>
                </div>
            </div>
        </RequireAuth>
    )
}

export default PromoteBoardForm