import React from 'react';
import { Navigate} from 'react-router-dom'; // useNavigate를 import
import Avatar6 from "../../assets/images/xs/avatar6.jpg";

import ktx from "../../assets/images/transport/ktx.jpg";
import airport from "../../assets/images/transport/airport.jpg";

export const TrafficData = {
    title: "Leaders List",
    columns: [
        {
            name: "대중교통수단",
            selector: (row) => row.leadername,
            sortable: true,
            cell: row => (
                <div>
                    <img className="avatar rounded-circle" src={row.image} alt="" /> <span className="fw-bold ms-1">{row.leadername}</span>
                </div>
            ),
            minWidth: "250px"
        },
        {
            name: "STATUS",
            sortable: true,
            cell: row => <span className="badge bg-success">{row.status}</span>
        },
        // {
        //     name: "실시간 모니터링",
        //     sortable: true,
        //     cell: () => {

        //         const handleClick = () => {
        //             Navigate(`${process.env.REACT_APP_BASE_URL}/Transportissue/Roadissue`); 
        //             // Navigate(`${process.env.REACT_APP_BASE_URL}/Transportissue/Trainissue`); 

        //         };
               

        //         return (
        //             <div className="btn-group" role="group" aria-label="Basic outlined example">
        //                 <button 
        //                     type="button" 
        //                     className="btn btn-outline-secondary"
                            
        //                 >
        //                 <i class="bi bi-check-square-fill"></i>
        //                 </button>
                     
        //             </div>
        //         );
        //     }
        // }
    ],
    rows: [
        {
            leadername: "기차",
            image: ktx,
            project: "Gob Geeklords",
            totaltask: "2명",
            email: "PhilGlover@gmail.com",
            status: "클릭",
        },
        {
            leadername: "도로교통",
            image: Avatar6,
            project: "Rhinestone",
            totaltask: "5명",
            email: "RobertAnderson@gmail.com",
            status: "클릭",
        },
    ]
};