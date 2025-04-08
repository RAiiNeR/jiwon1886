import React from "react";
import { ProgressBar } from "react-bootstrap";

const RecommendTask: React.FC = () => {
  const images = [
    "/imgs/img1.jpg",
    "/imgs/img2.jpg",
    "/imgs/img3.jpg",
    "/imgs/img4.jpg",
    "/imgs/img5.jpg",
    "/imgs/img6.jpg",
  ];
  
  const recommendhotel = [
    { id: 1, name: "숙소명1", role: "제휴숙소", comment: "서울시 강남구" },
    { id: 2, name: "숙소명2", role: "", comment: "경기도 인천시 남동구" },
    { id: 3, name: "숙소명3", role: "", comment: "서울시 서초구 세종구" },
  ];

  return (
    <div className="card" style={{ width: "100%" }}>
      <div className="card-header d-flex justify-content-between align-items-center border-bottom pb-2" style={{height: "50px"}}>
        <h6 className="mb-0 fw-bold">추천 숙소 관리</h6>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> 
        </button>
      </div>

      <div className="card-body"> 
        <div className="flex-grow-1 mem-list">
          {recommendhotel.map((hotel, index) => (
            <div key={hotel.id} className="py-2 d-flex align-items-center border-bottom">
              <div className="d-flex align-items-center flex-fill">
                <img 
                  src={images[index % images.length]} 
                  className="avatar lg img-thumbnail" 
                  alt="review image" 
                />
                <div className="d-flex flex-column ps-2">
                  <h6 className="fw-bold mb-0">{hotel.name}</h6>
                  <span className="small text-muted">{hotel.role}</span>
                  {hotel.comment && <p>{hotel.comment}</p>}
                </div>
              </div>
              <button type="button" className="btn light-danger-bg text-end" data-bs-toggle="modal" data-bs-target="#dremovetask">
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendTask;
