import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from 'react-data-table-component';
import AddNewUserModal from '../../components/common/BusModal';
import { PayListData } from '../../components/Data/MyPay';
import axios from 'axios';

interface BusReservation {
    num: string;
    departure: string;
    departureoftime: string;
    destination: string;
    destinationoftime: string;
    membernum: string;
    sitnum: string;
}

const MyPay: React.FC = () => {
    const [busreservationlist, setBusreservationlist] = useState<BusReservation[]>([]);
    // const [isAddUserModal, setIsAddUserModal] = useState(false);
    const [departure, setDeparture] = useState("");

    const getBusList = async (departure: string) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/busreservation`, {
                params: {
                    departure, // 출발지
                }
            });
            setBusreservationlist(response.data.content); // 데이터를 받아와서 상태에 저장
        } catch (error) {
            console.log('Error Message:', error);
        }
    }

    useEffect(() => {
        getBusList(departure);
    }, [departure]);

    return (
        <div className="container-xxl">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bus-front-fill" viewBox="0 0 16 16">
  <path d="M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.5 2.5 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A44 44 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43 43 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44 44 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994M8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1"/>
</svg>
            <PageHeader headerTitle="회원 예매 내역" />      
            <div className="row clearfix g-3">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <DataTable
                                title={PayListData.title}
                                columns={PayListData.columns}
                                data={busreservationlist} 
                                pagination
                                selectableRows={false}
                                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                highlightOnHover={true}
                                // onRowClicked={() => { setIsAddUserModal(true) }}
                            />
                          
                        </div>
                    </div>
                </div>
            </div>
            {/* <AddNewUserModal show={isAddUserModal} onClose={() => { setIsAddUserModal(false) }} /> */}
        </div>
    );
}

export default MyPay;
