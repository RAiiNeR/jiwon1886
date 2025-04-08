import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface ManagerVO {
    sabun: string;
    pwd: string;
    name: string;
    imgname: string;
    role: string;
    mdate: string;
    loginlog: {
        ldate: string;
        accessip: string;
    }
}

const ManagerCard: React.FC<{ sabun: string }> = (prop) => {
    const [manager, setManager] = useState<ManagerVO | null>(null);
    useEffect(() => {
        const getManagerVO = async () => {
            const result = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/manager/${prop.sabun}`);
            // console.log(result)
            setManager({...result.data, loginlog: result.data.loginlog[result.data.loginlog.length - 1]});
        }
        if (prop.sabun !== "") getManagerVO();
    }, [prop.sabun]);

    const changeDateFormat = (date: string) => {
        return new Date(date).toLocaleDateString();
    }

    if (!manager) {
        return <div>로딩 중~</div>
    }
    return (
        <div className="card h-100">
            <div className="card-header p-0 text-center bg-transparent">
                <div className="mt-3">
                    <h3>로그인 정보</h3>
                    <div className="pt-4 pb-2" style={{
                        background: 'linear-gradient(to right,rgb(126, 178, 255),rgb(117, 211, 255),rgb(126, 178, 255))',
                    }}>
                        {/**C:\Users\ICT-27\Desktop\2025.03.10 누리다원(TeamB)\admin\client\public\imgs\manager\HWANGBODOYEON.jpg */}
                        <img src={`${process.env.REACT_APP_FILES_URL}/img/manager/${manager.imgname}`} alt="" className="border rounded-circle d-block mx-auto mb-2" width='100px' height='100px' />
                        <span className="text-white h2 text-decoration-underline">{manager.name}</span>
                    </div>
                </div>
            </div>
            <div className="card-body p-0 my-3" >
                <div className="row mb-2">
                    <div className="col-6">
                        <p className="h6 text-center m-0">최근 접속</p>
                    </div>
                    <div className="col-6">
                        <p className="h6 text-center m-0">{changeDateFormat(manager.loginlog.ldate)}</p>
                    </div>
                </div>
                <hr />
                <div className="row mb-2">
                    <div className="col-6">
                        <p className="h6 text-center m-0">접속 IP</p>
                    </div>
                    <div className="col-6">
                        <p className="h6 text-center m-0">{manager.loginlog.accessip}</p>
                    </div>
                </div>
                <hr />
                <div className="row mb-2">
                    <div className="col-6">
                        <p className="h6 text-center m-0">입사일</p>
                    </div>
                    <div className="col-6">
                        <p className="h6 text-center m-0">{changeDateFormat(manager.mdate)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerCard