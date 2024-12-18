import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RequireAuth from '../comp/RequireAuth';

interface NotificationData {
    HIT: number;
    NUM: number;
    NDATE: string;
    TITLE: string;
    CONTENT: string;
    DNAME: string;
    TYPE: number;
}

const NotificationDetail: React.FC = () => {
    const { num } = useParams();
    const [notiData, setNotiData] = useState<NotificationData>();
    const navigate = useNavigate();

    useEffect(() => {
        const getNotification = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/noti/${num}`);
                console.log(response.data)
                setNotiData(response.data);
            } catch (error) {
                console.log(error);
            }

        }

        getNotification()
    }, [num]);

    useEffect(() => {
        const content_div = document.getElementById('noti-content');
        if (content_div) content_div.innerHTML = notiData?.CONTENT as string;
    }, [notiData])

    const changeDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    const changeType = (type: number) => {
        if (type === 1) {
            return <div className='noti-type bg-danger text-white'>긴급</div>
        } else if (type === 2) {
            return <div className='noti-type bg-info'>일반</div>
        } else {
            return <div className='noti-type bg-success text-white'>조치</div>
        }
    }

    const handleDelete = () => {

    }


    if (!notiData) {
        return <div>로딩 중</div>
    }

    return (
        <RequireAuth>
            <div style={{ padding: "50px" }}>
                <div className='noti-detail'>
                    <h2 className='w-100'>{notiData.TITLE}</h2>
                    <p>
                        게시부서: {notiData.DNAME} / 게시일: {changeDate(notiData.NDATE)}
                    </p>
                    <hr />
                    <div className='noti-content mb-3' id='noti-content'>
                    </div>

                    <div className='button-box d-flex justify-content-end'>
                        <button className='btn btn-success' onClick={_ => navigate(-1)}>이전</button>
                        <button className='btn btn-danger' onClick={handleDelete}>삭제</button>
                    </div>
                </div>
            </div>
        </RequireAuth>
    )
}

export default NotificationDetail