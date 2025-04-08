import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Product.css';
import { Link } from 'react-router-dom';

interface EquipmentVO {
  num: number;
  rname: string;
  state: string;
  cnt: number;
  rcnt: number;
  edate: string;
  mfiles: string;
  img_names: string[];
}

const Product: React.FC = () => {
  // 대여 가능한 물품들의 전체 데이터를 저장하는 상태
  const [equipment, setEquipment] = useState<EquipmentVO[]>([]);
  // 페이지네이션 관련 상태
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9); // 항목
  const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pagePerBlock = 5;
  const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`;

  const getProduct = async (page: number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/rent`, {
        params: { page: page, size },
      });
      console.log(response.data); // 응답 데이터 구조 확인
      setEquipment(response.data.productData);
      const calculatedTotalPages = Math.ceil(response.data.totalItems / size);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  useEffect(() => {
    setStartPage((Math.floor((page - 1) / pagePerBlock) * pagePerBlock) + 1);
    console.log("setStartPage 확인 : " + setStartPage);
    let end = (Math.floor((page - 1) / pagePerBlock) + 1) * pagePerBlock;
    end = end > totalPages ? totalPages : end;
    console.log("확인중" + end);
    setEndPage(end);
  }, [equipment])

  useEffect(() => {
    getProduct(page);
  }, [page])

  useEffect(() => {
    console.log('페이지 Page:', page);
    console.log('시작 페이지 Start Page:', startPage, '끝 페이지 End Page:', endPage);
    console.log('전체 페이지 : Total Pages:', totalPages);
  }, [page, startPage, endPage, totalPages]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };


  if (!equipment || equipment.length === 0) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="product">
      <div className='inner'>
        <div className="product-tt">
          <h2>누리군의 나눔 물품!</h2>
          <p>누리군이 관리하는 물품은 깔끔하게 관리되고 있습니다.</p>
        </div>
        <div className="container">
          <div className="row-flex">
            {equipment.map((data, index) => (
              <div className="col pd-box" key={index}>
                <div className='img-box'>
                  {data.img_names && data.img_names.length > 0 ? (
                    <img src={filePath + data.img_names[0]} alt={data.rname} />
                  ) : (
                    <img src="/default-image.jpg" alt="기본 이미지" /> // 기본 이미지 설정
                  )}
                </div>
                <div className='tt-box'>
                  <ul>
                    <li>{data.rname}</li>
                    <li>남은 갯수: {data.cnt}개</li>
                    <li>{data.cnt === 0 ? "품절" : "재고있음"}</li>
                  </ul>
                  <div className="pd-btn">
                    <button><Link to={'/noorigun/renting'} style={{ textDecoration: 'none' }} className='link-btn'>신청하기</Link></button>
                    <button><Link to={'/noorigun/reserve'} style={{ textDecoration: 'none' }} className='link-btn'>예약하기</Link></button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className="d-flex mt-4 justify-content-center">
          <nav>
            <ul className="pagination">
              {startPage > 1 && (
                <li className="page-item">
                  {" "}
                  <button className="page-link" onClick={() => handlePageChange(startPage - 1)}>이전</button>
                </li>
              )}

              {/* 페이지 출력하기 */}
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((curr) => ( // 인덱스(i)를 기반으로 페이지 번호를 렌더링
                <li key={curr} className={`page-item ${curr === page ?
                  'active' : ''}`}>
                  <button className='page-link' // 버튼을 누르면 handlePageChange(i + 1) 호출
                    onClick={() => handlePageChange(curr)}>
                    {curr}
                    {/* 페이지 번호로 사용(배열 인덱스는 0부터 시작하므로 1을 더함) */}
                  </button>
                </li>
              ))}



              {endPage < totalPages && (
                <li className="page-item">
                  <button className="page-link" onClick={() => handlePageChange(endPage + 1)}>다음</button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Product;