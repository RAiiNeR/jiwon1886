import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './EquipmentList.css';

interface EquipmentAdminVO {
    num: number;
    rname: string;
    state: string;
    cnt: number;
    rcnt: number;
    edate: string;
}

const EquipmentList: React.FC = () => {
    const [equipmentList, setEquipmentList] = useState<EquipmentAdminVO[]>([]);
    const [allPosts, setAllPosts] = useState<EquipmentAdminVO[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [rename, setReName] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<EquipmentAdminVO[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const getEquipmentList = async () => {
        try {
            const response = await axios.get('http://localhost:81/noorigun/api/equipment/equipmentList');
            console.log('API Response:', response.data);

            if (Array.isArray(response.data)){
                setAllPosts(response.data);  
                setFilteredPosts(response.data); // 초기에는 전체 데이터를 필터된 데이터로 설정
                setTotalItems(response.data.length);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));            
            } else {
                console.log("Received data is not an array:", response.data);
            }
        } catch (error) {
            console.log('Error Message:' + error);
        }
    };
    // 컴포넌트 로드 시 데이터 가져오기
    useEffect(() => {
        getEquipmentList();
    }, []);

    // 페이징 처리 및 데이터 필터링
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setEquipmentList(filteredPosts.slice(startIndex, endIndex));

        const newStartPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
        setStartPage(newStartPage);
        setEndPage(Math.min(newStartPage + 4, totalPages));
    }, [filteredPosts, currentPage, totalPages]);

    // 체크박스 핸들러
    const handleCheckboxChange = (num: number) => {
        const updatedSelectedItems = new Set(selectedItems);
        if (updatedSelectedItems.has(num)) {
            updatedSelectedItems.delete(num);
          } else {
            updatedSelectedItems.add(num);
          }
          setSelectedItems(updatedSelectedItems);
    };

    // 게시글 삭제
    const handleDelete = async () => {
        try {
            // 선택된 항목들 삭제 요청 
            for(const itemNum of selectedItems) {
                await axios.delete(`http://localhost:81/noorigun/api/equipment?num=${itemNum}`);
            }
            // 선택된 항목들을 목록에서 제거
            getEquipmentList();
            setSelectedItems(new Set());
        } catch (error) {
            console.error('Error while deleting items:', error);
        }
    };

    // 검색 핸들러
    const handleSearchClick = () => {
        const result = allPosts.filter((item) => item.rname.includes(rename));
        setFilteredPosts(result);
        setTotalItems(result.length);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
        setCurrentPage(1); // 검색 시 첫 페이지로 초기화
    };

    // 검색 입력 변경 핸들러
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReName(e.target.value);
    };

     // 페이지 변경 핸들러
    const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!equipmentList) {
    return <div>로딩 중...</div>;
  }



  return (
    <div className="ELEquipmentList">
    <div className="ELmpcontainer">
      <h2>비품 대여 리스트</h2>
      <table className="ELtable table-bordered table-hover">
        <thead className="EL-thead">
          <tr>
            <th>선택</th>
            <th>비품 이름</th>
            <th>대여 가능 상태</th>
            <th>남은 수량</th>
            <th>등록 일자</th>
          </tr>
        </thead>
        <tbody>
        {equipmentList.length === 0 ? (
                          <tr>
                              <td colSpan={6}>등록된 게시글이 없습니다.</td>
                          </tr>
                      ) : (
                          equipmentList.map((item, index) => {
                              const availableQuantity = item.cnt - item.rcnt;
                              const availabilityStatus = availableQuantity > 0 ? "대여 가능" : "대여 불가";
                              return (
                                  <tr key={index}> 
                                      <td>
                                          <input
                                              type="checkbox"
                                              checked={selectedItems.has(item.num)}
                                              onChange={() => handleCheckboxChange(item.num)}
                                          />
                                      </td>
                                      <td>
                                          <Link to={`/equipment/${item.num}`}>{item.rname}</Link> 
                                      </td>
                                      <td>{availabilityStatus}</td>
                                      <td>{item.cnt}</td>
                                      <td>{item.edate}</td>
                                  </tr>
                              );
                          })
                      )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              <Link to={'/equipment/new'}>비품 등록</Link>
            </td>
          </tr>
        </tfoot>
      </table>
  
      {/* 검색어 입력 */}
      <div className="ELsearch-container">
        <input
          type="text"
          className="ELform-control"
          placeholder="검색어를 입력하세요..."
          value={rename}
          onChange={handleSearchChange}
        />
        <button className="ELbtn ELbtn-primary" onClick={handleSearchClick}>
          검색
        </button>
      </div>
  
      {/* 등록 및 삭제 버튼 */}
      <div className="pagination">
        <button className="ELbtn ELbtn-danger" onClick={handleDelete}>
          선택 삭제
        </button>
      </div>
  
      {/* 페이징 버튼 */}
      <div className="d-flex mt-4 justify-content-center">
        <nav>
          <ul className="pagination">
            {startPage > 1 && (
              <li>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(startPage - 1)}
                >
                  이전
                </button>
              </li>
            )}
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => i + startPage
            ).map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              </li>
            ))}
            {endPage < totalPages && (
              <li>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(endPage + 1)}
                >
                  다음
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  </div>
  
  );
};
export default EquipmentList