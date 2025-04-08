import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
//Home.tsx에서 구현한 map과 동일하고 1017자에 한 BoardList내용을 참고하면 됨
interface GalleryData {
  HIT: number;
  NUM: number;
  WRITER: string;
  TITLE: string;
  IMAGENAME: string;
  REIP: string;
  GDATE: string;
  CONTENTS: string;
}
const GalleryList: React.FC = () => {
  const [galleryList, setGalleryList] = useState<GalleryData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); //기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const filePath = 'http://192.168.0.90/myictstudy/resources/imgfile/';

  const getList = async (page: number) => {
    try {
      const response = await axios.get('http://192.168.0.90/myictstudy/gallery/galleryList', {
        params: { cPage: page }
      });
      const result = await response.data;
      setGalleryList(result.data);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
      setStartPage(result.startPage);
      setEndPage(result.endPage);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.log("오류발생 : ", error);
    }
  }

  useEffect(() => {
    getList(currentPage);
  }, [currentPage]);

  const handlerPageChange = (page: number) => {
    setCurrentPage(page);
  }

  const formDate = (gdate: string) => {
    const date = new Date(gdate);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <div>
      <div className="container mt-4">
        <h1 className="mb-4">갤러리 리스트</h1>
        <Link className="btn btn-primary mb-4" to="/gallery/new">등록</Link>

        <div className="row">
          {galleryList.map((data, index) => (
            <div className="col-md-4" key={index}>
              <div className="card mb-4">
                <div className='overflow-hidden'>
                  <img src={filePath + data.IMAGENAME} className="card-img-top" alt={data.TITLE} />
                </div>

                <div className="card-body">
                  <h5 className="card-title">{data.TITLE}</h5>
                  <p className="card-text">{data.WRITER}</p>
                  <p className='card-text'>
                    <small className='text-muted'>
                      작성일 : {formDate(data.GDATE)}
                    </small>
                  </p>
                  <p className='card-text'>
                    <small className='text-muted'>조회수 : {data.HIT}</small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='d-flex mt-4 justify-content-center'>
          <nav>
            <ul className='pagination'>
              {/* NextPage 출력하기 : startPage가 1보다 클때 다음페이지가 있는 것으로 계산 */}
              {startPage > 1 && (
                <li className='page-item'>
                  <button className='page-link' onClick={() => handlerPageChange(startPage - 1)}>이전</button>
                </li>
              )}

              {/* 페이지 출력하기 */}
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((page) => (
                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                  <button className='page-link' onClick={() => { handlerPageChange(page) }}>{page}</button>
                </li>
              ))}

              {/* NextPage 출력하기 : totalPage보다 endPage가 적을때 다음페이지가 있는 것으로 계산 */}
              {endPage < totalPages && (
                <li className='page-item'>
                  <button className='page-link' onClick={() => handlerPageChange(endPage + 1)}>다음</button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
    </>
    
  )
}

export default GalleryList