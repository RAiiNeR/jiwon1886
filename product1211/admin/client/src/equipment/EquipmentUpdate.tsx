import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EquipmentUpdate.css';

// 비품 정보를 저장할 타입을 정의
interface EquipmentAdminVO {
    num: number;
    rname: string;
    state: string;
    cnt: number;
    imgNames: string[];
    edate: string;
}

const EquipmentUpdate: React.FC = () => {
    const { num } = useParams<{ num: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState<EquipmentAdminVO>({
        num: parseInt(num!),
        rname: '',
        state: '',
        cnt: 0,
        imgNames: [],
        edate: ''
    });
    const [mfile, setMfile] = useState<File[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:81/noorigun/api/equipment/detail?num=${num}`);
                setForm(response.data); // 가져온 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchDetail(); // 세부 정보 가져오기
    }, [num]);  // num 값이 변경될 때마다 호출됩니다.

     // 입력 값이 변경될 때마다 상태를 업데이트
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

         // 필수 입력 값이 비어 있으면 알림을 띄우고 제출 불가 
        if (!form.rname || !form.state) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        // *** 수정된 부분: FormData를 사용해 파일과 텍스트 데이터 함께 전송 ***
        const data = new FormData();
        data.append('num', form.num.toString());
        data.append('rname', form.rname);
        data.append('state', form.state);
        data.append('cnt', form.cnt.toString());
        mfile?.forEach(file => data.append('mfiles', file));

        setLoading(true); // 로딩 상태 시작
        try {
            await axios.put('http://localhost:81/noorigun/api/equipment', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('수정이 완료되었습니다!');
            navigate(`/equipment/${num}`); // 수정 후 상세 페이지로 이동
        } catch (error: any) {
            console.error('Error updating post:', error.response?.data || error.message);
            alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    return (
        <div className="EquipmentUpdate">
            <h2>홍보글 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">비품명:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="rname"
                        value={form.rname || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">상태:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">수량:</label>
                    <textarea
                        className="form-control"
                        name="cnt"
                        value={form.cnt}
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
    );
};

export default EquipmentUpdate;