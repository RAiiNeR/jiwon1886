import React, { useEffect, useState } from 'react'
import './css/PageNation.css'

interface PageNationData {
    page: number;
    totalPages: number;
    pageChange: (page: number) => void
}

const PageNation: React.FC<PageNationData> = (pageNation) => {

    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const pagePerBlock = 5;


    // 페이지 블록 계산
    useEffect(() => {
        setStartPage((Math.floor((pageNation.page - 1) / pagePerBlock) * pagePerBlock) + 1); // 시작페이지 계산
        const end = Math.min((Math.floor((pageNation.page - 1) / pagePerBlock) + 1) * pagePerBlock , pageNation.totalPages); // 끝페이지 계산
        setEndPage(end);
    }, [pageNation])

    return (
        <>
            {/* 페이지 네비게이션 */}
            <div className="pagination-container">
                <nav>
                    <ul className='pagination'>
                        {startPage > 1 && (
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => pageNation.pageChange(startPage - 1)} >
                                    이전
                                </button>
                            </li>
                        )}
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((currPage) => (
                            <li key={currPage} className={`page-item ${currPage === pageNation.page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => pageNation.pageChange(currPage)}>
                                    {currPage}
                                </button>
                            </li>
                        ))}
                        {endPage < pageNation.totalPages && (
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => pageNation.pageChange(endPage + 1)}>
                                    다음
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default PageNation