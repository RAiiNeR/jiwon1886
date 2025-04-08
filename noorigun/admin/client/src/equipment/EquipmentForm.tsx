import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './EquipmentForm.css';
import RequireAuth from '../comp/RequireAuth';

const EquipmentForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [equipment, setEquipment] = useState({
        rname: '',
        state: '대여 가능',
        cnt: '',
    });
    const [mfile, setMfile] = useState<File[]>([]);
    // const [isVisiable, setIsVisiable] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEquipment({ ...equipment, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setMfile(Array.from(e.target.files));
        }
    };

    // useEffect(()=>{
    //     console.log(equipment)
    // },[equipment])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 기본 유효성 검사
        if (!equipment.rname || !equipment.cnt) {
            alert('품목명과 수량을 입력해주세요');
            return;
        }

        if (parseInt(equipment.cnt) <= 0) {
            alert('수량은 1개 이상이어야 합니다.');
            return;
        }

        const data = new FormData();
        data.append('rname', equipment.rname);
        data.append('state', equipment.state);
        data.append('cnt', equipment.cnt);
        mfile?.forEach(img => data.append('mfiles', img))
        setLoading(true); // 로딩 상태 시작 
        try {
            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/equipment`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('업로드가 완료되었습니다!');
            navigate('/noorigun/equipment');
        } catch (error: any) {
            console.error('Error:', error.response?.data || error.message);
            alert('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };


    return (
        <RequireAuth>
            <div className="EFupPromoteContainer">
                <h2 className="EFmb-4">비품 업로드</h2>
                <form onSubmit={handleSubmit}>
                    <div className="EFmb-3">
                        <input
                            type="text"
                            className="EFform-control"
                            name="rname"
                            placeholder="비품명 입력"
                            value={equipment.rname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="EFmb-3">
                        <input
                            type='number'
                            name="cnt"
                            className="EFform-control"
                            placeholder="수량을 입력하세요"
                            value={equipment.cnt}
                            onChange={handleChange}
                            required
                            min={1} // 최소값 1로 설정
                        />
                    </div>

                    <div className="EFmb-3">
                        <select
                            name="state"
                            className="EFform-control"
                            value={equipment.state}
                            onChange={handleChange}
                            required
                        >
                            <option value="대여 가능">대여 가능</option>
                            <option value="대여 불가">대여 불가</option>
                        </select>
                    </div>

                    <div className="EFmb-3">
                        <label className="EFform-label">첨부파일</label>
                        <input
                            type="file"
                            className="EFform-control"
                            name="mfile"
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>

                    <button type="submit" className="EFbtn EFbtn-primary" disabled={loading}>
                        {loading ? '업로드 중...' : '업로드'}
                    </button>
                </form>
            </div>
        </RequireAuth>
    )
}

export default EquipmentForm