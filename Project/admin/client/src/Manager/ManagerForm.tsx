import React, { useState } from 'react'
import RequireAuth from '../comp/RequireAuth'
import './css/Manager.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ManagerForm: React.FC = () => {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [idChecker, setIdChecker] = useState(false);
    const [pwd, setPwd] = useState('');
    const [deptno, setDeptno] = useState('11');
    const [role, setRole] = useState('EMPLOYEE');
    const [mfile, setMfile] = useState<File>();
    const [preview, setPreview] = useState<string | ArrayBuffer | null>();//선택된 이미지 미리보기
    const navigate = useNavigate();

    // 아이디 중복확인
    const idCheck = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACK_END_URL}/api/manager/${id}`); // 사용자 ID 전송
            if (res.data === 0) {
                alert("사용가능한 아이디 입니다.");
                setIdChecker(true);
            } else {
                alert("이미 사용중");
                setIdChecker(false);
            }
        } catch (error) {
            alert("인증번호 오류발생");
            console.log("Error", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => { // 파일 stream이 읽어 오는 영역
                // console.log('파일 이미지가 감지됨');
                //console.log(reader.result);
                setPreview(reader.result);
            }
            reader.readAsDataURL(files[0]);

            setMfile(files[0]);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!idChecker) {
            alert("아이디 중복을 확인해 주세요.");
            return;
        }
        const pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;
        const pwdCheck = pattern.test(pwd);
        if(!pwdCheck){
            alert("비밀번호가 규칙에 어긋납니다.");            
            return;
        }
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('id', id);
            formData.append('pwd', pwd);
            formData.append('role', role);
            formData.append('deptno', deptno);
            if (mfile) formData.append('mfile', mfile);

            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/manager`,
                formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.status === 200) {
                navigate('/manager')
            }
        } catch (error) {

        }
    }

    return (
        <RequireAuth>
            <div style={{ padding: '50px' }}>
                <div className='managerForm'>
                    <h1>관리자 등록</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 row">
                            <label htmlFor="name" className="col-sm-3 col-form-label fw-bold">
                                이름
                            </label>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" id="name"
                                    placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                        </div>

                        {/* 아이디 입력 */}
                        <div className="mb-3 row">
                            <label htmlFor="userId" className="col-sm-3 col-form-label fw-bold">
                                아이디
                            </label>
                            <div className="col-sm-7 button-container">
                                <input type="text" className="form-control input-container" id="username"
                                    placeholder="아이디 입력" value={id} onChange={(e) => setId(e.target.value)} required />
                            </div>
                            <div className="col-sm-2 button-container">
                                <button type="button" className="btn btn-outline-secondary check-btn" onClick={idCheck}>
                                    중복 확인
                                </button>
                            </div>
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="mb-3 row">
                            <label htmlFor="pwd" className="col-sm-3 col-form-label fw-bold">
                                비밀번호
                            </label>
                            <div className="col-sm-9">
                                <input type="password" className="form-control" id="pwd" placeholder="영문 대문자와 숫자, 특수문자를 포함한 8자리 이상"
                                    value={pwd} onChange={(e) => setPwd(e.target.value)} required />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            {/* 부서 입력 */}
                            <label htmlFor="deptno" className="col-sm-3 col-form-label fw-bold">
                                부서
                            </label>
                            <div className="col-sm-3">
                                <select name="deptno" id="deptno" onChange={e => setDeptno(e.target.value)}>
                                    <option value="11">감사담당관</option>
                                    <option value="12">기획예산담당관</option>
                                    <option value="21">홍보담당관</option>
                                    <option value="22">안전복지정책관</option>
                                    <option value="23">민원토지관</option>
                                    <option value="31">일자리경제관</option>
                                    <option value="32">정원산림관</option>
                                </select>
                            </div>

                            {/* 권한 입력 */}
                            <label htmlFor="role" className="col-sm-3 col-form-label fw-bold">
                                권한
                            </label>
                            <div className="col-sm-3">
                                <select name="role" id="role" onChange={e => setRole(e.target.value)}>
                                    <option value="SUPERVISOR">군수</option>
                                    <option value="MANAGER">부서장</option>
                                    <option value="EMPLOYEE" selected>직원</option>
                                </select>
                            </div>
                        </div>


                        {/* 사진 등록 */}
                        <div className="mb-3 row">
                            <div className="col-sm-12">
                                <input type="file" className="form-control" id="mfile" onChange={handleFileChange} required />
                            </div>
                        </div>
                        {
                            preview && (
                                <div className='mb-3'> {/* 선택한 이미지파일 미리보기 */}
                                    <img src={preview as string} alt="" className='img-thumbnail'
                                        // 이미지 스타일 적용
                                        style={{ marginRight: "10px", marginBottom: '10px', width: '100px', height: '150px' }} />
                                </div>
                            )
                        }

                        {/* 선택 버튼 */}
                        <div className="d-flex justify-content-between mt-4">
                            <Link to="/manager" className="btn btn-secondary">뒤로가기</Link>
                            <button type="submit" className="btn btn-primary">
                                가입하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </RequireAuth>
    )
}

export default ManagerForm