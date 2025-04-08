// 2025.02.02. 23:17 생성자: 이학수, 페이지네이션 컴포넌트화
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface PagenationData {
  page: number;
  totalPages: number;
  pageChange: (page: number) => void
}

const Pagenation: React.FC<PagenationData> = (pagenation) => {
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const pagePerBlock = 5;

  // 페이지 블록 계산
  useEffect(() => {
    setStartPage((Math.floor((pagenation.page - 1) / pagePerBlock) * pagePerBlock) + 1); // 시작페이지 계산
    const end = Math.min((Math.floor((pagenation.page - 1) / pagePerBlock) + 1) * pagePerBlock, pagenation.totalPages); // 끝페이지 계산
    setEndPage(end);
  }, [pagenation])

  return (
    <div className="row mt-5">
      <div className="col text-center">
        <div className="block-27">
          <ul>
            {startPage > 1 && (
              <li>
                <Link
                  to=""
                  onClick={() => pagenation.pageChange(startPage - 1)}
                >
                  &lt;
                </Link>
              </li>
            )}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((currPage) => (
              <li key={currPage} className={`${currPage === pagenation.page ? 'active' : ''}`}>
                <Link to="" onClick={() => pagenation.pageChange(currPage)}>
                  {currPage}
                </Link>
              </li>
            ))}
            {endPage < pagenation.totalPages && (
              <li>
                <Link
                  to=""
                  onClick={() => pagenation.pageChange(endPage + 1)}>
                  &gt;
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Pagenation