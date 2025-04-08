import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/PromoteBoardUpdate.css'
import RequireAuth from '../comp/RequireAuth';

interface PromoteBoardVO {
    num: number;
    title: string;
    writer: string;
    content: string;
    hit: number;
    imgNames: string[];
    pdate: string;
}

const PromoteBoardUpdate: React.FC = () => {
    const { num } = useParams<{ num: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState<PromoteBoardVO>({
        num: parseInt(num!),
        title: '',
        writer: '',
        content: '',
        hit: 0,
        imgNames: [],
        pdate: ''
    });
    const [mfile, setMfile] = useState<File[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:82/noorigun/api/promote/detail?num=${num}`);
                setForm(response.data);
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchDetail();
    }, [num]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // *** 추가된 부분: 파일 선택 핸들러 추가 ***
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setMfile(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 기본 유효성 검사
        if (!form.title || !form.content) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        // *** 수정된 부분: FormData를 사용해 파일과 텍스트 데이터 함께 전송 ***
        const data = new FormData();
        data.append('num', form.num.toString());
        data.append('title', form.title);
        data.append('writer', form.writer);
        data.append('content', form.content);
        mfile?.forEach(file => data.append('mfiles', file));

        setLoading(true); // 로딩 상태 시작
        try {
            await axios.put('http://localhost:82/noorigun/api/promote', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('수정이 완료되었습니다!');
            navigate(`/promote/${num}`); // 수정 후 상세 페이지로 이동
        } catch (error: any) {
            console.error('Error updating post:', error.response?.data || error.message);
            alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    return (
        <RequireAuth>
            <div style={{padding:'50px'}}>
                <div className="PromoteBoardUpdate">
                    <h2>홍보글 수정</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">제목:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">작성자:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="writer"
                                value={form.writer}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">내용:</label>
                            <textarea
                                className="form-control"
                                name="content"
                                value={form.content}
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
                                multiple
                            />

                            {form.imgNames.length > 0 && (
                                <div className="mt-2">
                                    <p>현재 첨부된 파일:</p>
                                    <ul>
                                        {form.imgNames.map((name, index) => (
                                            <li key={index}>{name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? '수정 중...' : '수정 완료'}
                        </button>
                    </form>
                </div>
            </div>
        </RequireAuth>
    );
};

export default PromoteBoardUpdate;
