// 
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./css/banner.css"
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../comp/RequireAuth';

interface Banner {
    num: number;//배너 번호
    imgname: string;//이미지 이름
}

const BannerList: React.FC = () => {
    const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/banner/`//이미지 파일 경로
    const [banner, setBanner] = useState<Banner[]>([]);//배너 목록
    const [refresh, setRefresh] = useState(false);//새로고침 상태
    const [delNum, setDelNum] = useState<number[]>([]);//삭제할 배너 번호
    const [checkstate, setCheckstate] = useState<boolean[]>([]);//체크박스 상태
    const [allChecker, setAllChecker] = useState(false)//전체선택 체크상태
    const navigate = useNavigate();//페이지 이동 hook
 //삭제할 배너번호 상태확인
    useEffect(() => {
        console.log(delNum);
    }, [delNum])
//전체 가져와서 목록보기
    useEffect(() => {
        const getBanners = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/banner`)
                setBanner(response.data);
                if (checkstate.length === 0) {
                    const cState: boolean[] = [];
                    response.data.forEach(() => {
                        cState.push(false);
                    });
                    setCheckstate(cState);
                }
            } catch (error) {
                console.log("Error Message: " + error);
            }
        }
        getBanners();
    }, [refresh]);// `refresh` 상태 변경 시 배너 목록 새로고침
//전체선택 상태관리
    useEffect(() => {
        if (checkstate.includes(false)) {
            setAllChecker(false);
        } else {
            setAllChecker(true);
        }
    }, [checkstate])
 //배너삭제
    const deleteBanner = async () => {
        const check = prompt("삭제하기 위하여 '삭제'를 입력하여 주세요.");
        console.log(check)
        if (check === '삭제') {
            try {
                const formData = new FormData();
                delNum.forEach((num) => {
                    formData.append('num', `${num}`);
                });
                await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/banner`, {
                    data: formData
                });
                alert("삭제 완료")
                setDelNum([]);
                setRefresh(!refresh);
            } catch (error) {
                console.log('Error');
            }
        }
    }
 //5개 초과 배너추가 시 alert
    const handleAddClick = () => {
        if (banner.length >= 5) {
            alert("배너는 5개까지 등록가능합니다. 삭제 후 다시 진행해 주세요.");
        } else {
            navigate("/noorigun/banner/new");
        }
    }
//개별 배너 삭제상태 체크
    const checkDelNum = (num: number, index: number) => {
        if (!delNum.includes(num)) {
            setDelNum([...delNum, num])
        } else {
            const dNum = delNum.filter((item) => item !== num);
            setDelNum(dNum);
        }
        const cState: boolean[] = [];
        checkstate.forEach((item, i) => {
            if (i === index) {
                cState.push(!item);
            } else {
                cState.push(item);
            }
        });
        setCheckstate(cState);
    }
 //전체 선택, 전체 해제
    const chanegCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cState: boolean[] = [];
        checkstate.forEach((_) => {
            cState.push(e.target.checked);
        });
        const dNum: number[] = [];
        checkstate.forEach((_, i) => {
            if (e.target.checked) {
                dNum.push(banner[i].num);
            }
        });
         //상태 업데이트
        setDelNum(dNum);
        setCheckstate(cState);
        setRefresh(!refresh);
    }

    return (
        <RequireAuth>
            <div className='bannerList'>
                <div>
                    <h2>배너 목록</h2>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                 {/* 전체 선택, 해제 */}
                                <th><input type='checkbox' onChange={chanegCheck} checked={allChecker} /></th>
                                <th>배너 번호</th>
                                <th>이미지</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                banner.map((item, i) => (
                                    <tr key={item.num}>
                                          {/* 개별 체크박스 */}
                                        <td><input type='checkbox' checked={checkstate[i]} onChange={_ => checkDelNum(item.num, i)} /></td>
                                        <td>{item.num}</td>
                                        <td><img src={filePath + item.imgname} alt='' style={{ width: "90%", height: "300px" }} className='d-block mx-auto' /></td>
                                        {/* 배너 이미지 */}
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3}>
                                    <div className='d-flex justify-content-between px-3'>
                                        <button className='btn btn-danger' onClick={deleteBanner}>삭제</button>
                                        <button className='btn btn-primary' onClick={handleAddClick}>추가</button>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </RequireAuth>
    )
}

export default BannerList