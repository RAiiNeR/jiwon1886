import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
//이 인터페이스는 json구조와 같아야 한다
//data 
interface Upboard {
  num: number;
  title: string;
  writer: string;
  content: string;
  imgn: string;
  hit: number;
  reip: string;
  bdate: string;
}


//totalitems - count
//totalPages - 전체페이지
//currentPage - 현재페이지
//startPage - 시작페이지
//endPage - 끝페이지
const UpboardList: React.FC = () => {
  const [board, setBoard] = useState<Upboard[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); //기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  //검색을 위한 useState 생성
  const [searchType, setSearchType] = useState('1');
  const [searchValue, setSearchValue] = useState('');

  //한번에 보여줄 페이지 블록수
  const pagePerBlock = 5;

  const imageBasePath = 'http://192.168.0.90/myictstudy/resources/imgfile/'; // 이미지 기본 경로

  // 서버에서 목록을 가져오는 함수
  //비동기식으로 보낼때 page(인자값)를 넣어야한다
  const fetchUpboardList = async (page: number) => {
    try {
      //서버에 파라미터를 맵으로 전달한다.
      //이게 map으로 전달할때 자바스크립트 object 리터럴로, 즉 {key, value}로 됨 => @RequestParam Map<String, String> paramMap
      const response = await axios.get('http://192.168.0.90/myictstudy/upboard/upList', { params: { cPage: page,
        searchType:searchType, searchValue:searchValue }});
      setBoard(response.data.data);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
      setStartPage(response.data.startPage);
      setEndPage(response.data.endPage);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching upboard list", error);
    }
  };

  const handlerPageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleSearch = () => {
    fetchUpboardList(1);
  }

  useEffect(() => {
    //변화가 될 때마다 호출하는 것
    fetchUpboardList(currentPage);
  }, [currentPage]);

  const formDate = (date: string) => {
    const bdate = new Date(date);
    return bdate.toLocaleDateString() + ' ' + bdate.toLocaleTimeString();
  };

  return (
    <div>
      {/* <h2>리스트 페이지</h2> */}
      {/* <Link to="/upboard/new" className='btn btn-primary mb-3'>입력</Link> */}
      <div className="container mt-4">
        <h2 className="mb-4">Upboard List = {totalItems}</h2>
        <div>검수용 : totalPages {totalPages} / startPage : {startPage} / endPage : {endPage}</div>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <td colSpan={6}>현재페이지 : {currentPage}</td>
            </tr>
            <tr>
              <th className="text-center align-middle">Num</th>
              <th className="text-center align-middle">Title</th>
              <th className="text-center align-middle">Writer</th>
              <th className="text-center align-middle">Image</th>
              <th className="text-center align-middle">Hit</th>
              <th className="text-center align-middle">Date</th>
            </tr>
          </thead>
          <tbody>
            {board.map((item, index) => (
              <tr key={index}>
                <td className="text-center align-middle">{item.num}</td>
                <td className="text-center align-middle">
                  <Link to={`/upboard/${item.num}`}>{item.title}</Link>
                </td>
                <td className="text-center align-middle">{item.writer}</td>
                <td className="text-center align-middle">
                  {item.imgn ? (
                    <img
                      src={`${imageBasePath}${item.imgn}`}
                      alt={item.title}
                      style={{ width: '80px', height: 'auto' }}
                      className="img-thumbnail"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="text-center align-middle">{item.hit}</td>
                <td className="text-center align-middle">{formDate(item.bdate)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={6} className="text-center">
                <Link to="/upboard/new" className="btn btn-primary mb-3">Add New Post</Link>
              </th>
            </tr>
          </tfoot>
        </table>

        {/* 검색창 추가하기 */}
        <div className='mb-3 d-flex'>
          {/* select -> searchType */}
          <select className="form-select w-auto" aria-label="Default Select example" onChange={(e) => {setSearchType(e.target.value)}} value={searchType}>
            <option value="1">작성자</option>
            <option value="2">제목</option>
            <option value="3">내용</option>
          </select>
          {/* select -> searchValue */}
          <input type="text" onChange={(e) => {setSearchValue(e.target.value)}} value={searchValue}/>
          {/* 버튼이 클릭이 되면 axios로 검색데이터를 파라미터로 전송하는 함수를 호출 */}
          <button className='btn btn-warning' onClick={handleSearch}>검색</button>
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
  )
}

export default UpboardList