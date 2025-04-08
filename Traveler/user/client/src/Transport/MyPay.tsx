import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequireAuth from '../Comm/RequireAuth';
import { useParams } from 'react-router-dom';
import { parseJwt } from '../Comm/jwtUtils';
import "../css/bus.css";
interface BusReservation {
    NUM: number;
    DESTINATION: string;
    SITNUM: string;
    DEPARTUREOFTIME: string;
    DESTINATIONOFTIME: string;
    DEPARTURE: string;
}

const MyPay: React.FC = () => {
    const [busreservationlist, setBusreservationlist] = useState<BusReservation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { id } = useParams();

    useEffect(() => {
        const getBusList = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('토큰이 없습니다.');
                setLoading(false);
                return;
            }
            const decodedToken = parseJwt(token);
            const membernum = decodedToken.num;
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/busreservation/${membernum}`);
                console.log('API Response:', response.data); // 응답을 확인

                // 응답이 올바른 형태일 경우 처리
                if (Array.isArray(response.data.buslist)) {
                    // 공백을 제거한 후 저장
                    const cleanedBusList = response.data.buslist.map((bus: any) => ({
                        ...bus,
                        DEPARTUREOFTIME: bus.DEPARTUREOFTIME.trim(),
                        DESTINATIONOFTIME: bus.DESTINATIONOFTIME.trim(),
                    }));

                    setBusreservationlist(cleanedBusList);
                } else {
                    console.error('잘못된 buslist 데이터');
                    setBusreservationlist([]);
                }
            } catch (error) {
                console.log('Error Message:', error);
            } finally {
                setLoading(false);
            }
        };

        getBusList();
    }, [id]);

    return (
        <RequireAuth>
            <div className='mypaylist'>
                <div
                    className="js-halfheight mb-4"
                    style={{
                        backgroundImage: 'url("./images/transport/reservation.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                        backgroundColor: "rgba(0, 0, 0, 0.3);",
                        width: "150%",
                        height: "300px"
                    }}
                ></div>
                <h2>개인 예매 내역</h2>
                <div className='row'>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <table className="reservation-table">
                            <thead>
                                <tr>
                                    <th>출발지</th>
                                    <th>출발시간</th>
                                    <th>도착지</th>
                                    <th>도착시간</th>
                                    <th>예약스케줄</th>
                                </tr>
                            </thead>
                            <tbody>
                                {busreservationlist.length > 0 ? (
                                    busreservationlist.map((item) => (
                                        <tr key={item.NUM}>
                                            <td className="table-cell">{item.DEPARTURE}</td>
                                            <td className="table-cell">{item.DEPARTUREOFTIME}</td>
                                            <td className="table-cell">{item.DESTINATION}</td>
                                            <td className="table-cell">{item.DESTINATIONOFTIME}</td>
                                            <td className="table-cell">{item.SITNUM}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="no-reservation">예약 내역이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </RequireAuth>
    );
}

export default MyPay;
