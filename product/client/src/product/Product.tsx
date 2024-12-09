import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Product.css';
import { Link } from 'react-router-dom';

interface ProductVO {
  num:number;
  rname: string;
  cnt: number;
}

const Product: React.FC = () => {
  // 대여 가능한 물품들의 전체 데이터를 저장하는 상태
  const [productData, setProductData] = useState<ProductVO[]>([]);
  // 페이지네이션 관련 상태
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9); // 항목
  const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const pagePerBlock = 5;

    const getProduct = async (page: number) => {
      try {
        const response = await axios.get('http://localhost:81/back/api/rent', {
          params: { page: page, size },
        });
        console.log('Fetching page:', page);
        console.log('Response data:', response.data);
  
        setProductData(response.data.productData); // 서버 응답 데이터에 맞춰 수정
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    useEffect(() => {
      setStartPage((Math.floor((currentPage - 1) / pagePerBlock) * pagePerBlock) + 1);
      let end = (Math.floor((currentPage - 1) / pagePerBlock) + 1) * pagePerBlock;
      end = end > totalPages ? totalPages : end;
      setEndPage(end);
    }, [productData])

    useEffect(() => {
      getProduct(page);
    }, [page])
  
    const handlePageChange = (newPage: number) => {
      setPage(newPage);
    };
  

  if (!productData || productData.length === 0) {
    return <div>실행중 아님</div>;
  }

  return (
    <div className="product">
      <div className='inner'>
        <div className="product-tt">
          <h2>당일 저녁 무료 배송, 지금 바로 대여하세요!</h2>
          <p>누리군이 관리하는 물품은 깔끔하게 관리되고 있습니다.</p>
        </div>

        <div className="container">
          <div className="row row-cols-3 pd-flex">
            {productData.map((data, index) => (
              <div className="col pd-box" key={index}>
                <div className='img-box'>
                    <img src="" className="pd-img"  alt={data.rname || 'Product Image'} />
                </div>
                <div className='tt-box'>
                  <ul>
                    <li>{data.rname}</li>
                    <li>남은 갯수: {data.cnt}개</li>
                    <li>{data.cnt === 0 ? "품절":"재고있음"}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="pd-btn">
                    <button><Link to={'/renting'} style={{textDecoration:'none'}} className='link-btn'>신청하기</Link></button>
                    <button><Link to={'/renting'} style={{textDecoration:'none'}} className='link-btn'>예약하기</Link></button>
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
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((_, i) => ( // 인덱스(i)를 기반으로 페이지 번호를 렌더링
                <li key={i} className={`page-item ${i + 1 === page ?
                  'active' : ''}`}>
                  <button className='page-link' // 버튼을 누르면 handlePageChange(i + 1) 호출
                    onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
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