import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EquipmentDetail.css';

interface EquipmentAdminVO {
    num: number;
    rname: string;
    state: string;
    cnt: number;
    edate: string;
    mfiles: string[];
    imgNames: string[];
}

interface EquipmentRentalVO {
    rentalId: number;
    userId: number;
    itemId: number;
    rdate: string;
}

const EquipmentDetail: React.FC = () => {
    const { num } = useParams<{ num: string }>();
    const [equipment, setEquipmnet] = useState<EquipmentAdminVO | null>(null);
    const [rentals, setRentals] = useState<EquipmentRentalVO[]>([]);
    const [nextDetail, setNextDetail] = useState<EquipmentAdminVO | null>(null);
    const [prevDetail, setPrevDetail] = useState<EquipmentAdminVO | null>(null);
    const navigate = useNavigate();
    const currentNum = parseInt(num as string);
    const filePath = 'http://localhost:81/noorigun/uploads/';

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:81/noorigun/api/equipment/detail?num=${currentNum}`);
                setEquipmnet(response.data);

                // 대여 기록 조회
                const rentalResponse = await axios.get(`http://localhost:81/noorigun/api/rental/${currentNum}`);
                setRentals(rentalResponse.data);

                // 이전, 다음 장비 상세 정보 조회
                if (currentNum > 1) {
                    const prevResponse = await axios.get(`http://localhost:81/noorigun/api/equipment/detail?num=${currentNum - 1}`);
                    setPrevDetail(prevResponse.data);
                } else {
                    setPrevDetail(null);
                }

                const nextResponse = await axios.get(`http://localhost:81/noorigun/api/equipment/detail?num=${currentNum + 1}`);
                setNextDetail(nextResponse.data);
            } catch (error) {
                console.error('Error fetching equipment details:', error);
            }
        };

        fetchDetail();
    }, [currentNum]);

    const handlePrevClick = () => {
        if (currentNum > 1) {
            navigate(`/equipment/${currentNum - 1}`);
        }
    };

    const handleNextClick = () => {
        navigate(`/equipment/${currentNum + 1}`);
    };

    const handleMainPageClick = () => {
        navigate('/equipment');
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:81/noorigun/api/equipment?num=${currentNum}`);
            navigate('/equipment');
        } catch (error) {
            console.log('Error deleting equipment:', error);
        }
    };

    const handleUpdate = () => {
        navigate(`/equipment/update/${currentNum}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (!equipment) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="EDEquipmentDetail">
            <div className="EDcontainer">
                <h1 className="EDtitle-section">{equipment.rname}</h1>
                {equipment && (
                    <>
                        <div className="EDpost-content">
                            <span className="EDinfo-left">대여 상태: {equipment.state}</span>
                            <span className="EDinfo-right">대여 가능 수량: {equipment.cnt}</span>
                            <span className="EDinfo-right">{formatDate(equipment.edate)}</span>
                        </div>

                        <div className="EDpost-content">
                            {equipment.imgNames && equipment.imgNames.map((item, index) => (
                                <img key={index} className="EDstyled-image" src={filePath + item} alt={equipment.rname} />
                            ))}
                            <p>{equipment.state}</p>
                        </div>

                        <div className="EDpost-content">
                            <p>첨부파일:
                                <a href="#">{equipment.rname}.pdf</a>
                            </p>
                        </div>

                        <div className="EDpost-content">
                            <h3>대여 정보 :</h3>
                            <ul>
                                {rentals.map((rental) => (
                                    <li key={rental.rentalId}>
                                        사용자 ID: {rental.userId}, 대여 날짜: {formatDate(rental.rdate)}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="EDstate-selector">
                            <div className="EDnav-item">
                                {prevDetail && (
                                    <>
                                        <p>이전글:
                                            <a href="#" onClick={handlePrevClick}>{prevDetail.rname}</a>
                                        </p>
                                        <span>{formatDate(prevDetail.edate)}</span>
                                    </>
                                )}
                            </div>

                            <div className="EDnav-item">
                                {nextDetail && (
                                    <>
                                        <p>다음글:
                                            <a href="#" onClick={handleNextClick}>{nextDetail.rname}</a>
                                        </p>
                                        <span>{formatDate(nextDetail.edate)}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="EDbutton-container">
                            <button className="EDbtn" onClick={handleUpdate}>수정</button>
                            <button className="EDbtn" onClick={handleDelete}>삭제</button>
                        </div>

                        <div className="EDbutton-container">
                            <button className="EDmain-button" onClick={handleMainPageClick}>리스트로</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EquipmentDetail;
