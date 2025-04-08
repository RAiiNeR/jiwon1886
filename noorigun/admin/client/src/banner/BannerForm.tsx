import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './css/banner.css'
import axios from 'axios';
import RequireAuth from '../comp/RequireAuth';

const BannerForm: React.FC = () => {
    const [image, setImage] = useState<File>();//선택된 이미지 파일 저장
    const [preview, setPreview] = useState<string | ArrayBuffer | null>();//선택된 이미지 미리보기
    const navigate = useNavigate();//페이지 이동을 위해 사용
  //선택된 이미지 미리 볼 수 있게 설정(preview)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => { // 파일 stream이 읽어 오는 영역
                // console.log('파일 이미지가 감지됨');
                //console.log(reader.result);
                setPreview(reader.result);
            }
            reader.readAsDataURL(files[0]);

            setImage(files[0]);
        }
    };
 //제출할때 이미지도 같이 업로드 되어 서버로 이동
    const handleSubit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const addBanner = async () => {
            try {
                const formData = new FormData();
                if (image) {
                    formData.append("image", image);
                }
                const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/banner`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response.data);
                navigate('/noorigun/banner');
            } catch (error) {
                console.log("Error Message: " + error);
            }
        }

        addBanner();
    }

    return (
        <RequireAuth>
            <div className='bannerForm'>
                <div className='form-banner'>
                    <form onSubmit={handleSubit}>
                        <div className='mb-3'>
                            <label htmlFor="image" className='form-label'>배너 이미지 파일</label>
                            <input type="file" id='image' name='image' onChange={handleImageChange} className='form-control' />
                        </div>
                        {
                            preview && (
                                <div className='mb-3'> {/* 선택한 이미지파일 미리보기 */}
                                    <img src={preview as string} alt="" className='img-thumbnail'
                                    // 이미지 스타일 적용
                                        style={{ marginRight: "10px", marginBottom: '10px', width: '1200px', height: '300px' }} />
                                </div>
                            )
                        }
                        <div className='form-controller'>
                            <button type='submit' className='btn btn-primary'>전송</button>&nbsp;
                            <Link to='/noorigun/banner' className='btn btn-danger'>취소</Link>
                        </div>
                    </form>
                </div>
            </div>
        </RequireAuth>
    )
}

export default BannerForm