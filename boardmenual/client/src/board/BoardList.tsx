import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

interface BoardVO {
    num: number;
    title: string;
    writer: string;
    content: string;
    img_names: string[];
    hit: number;
    bdate: string;
}

const BoardList: React.FC = () => {
    const [boardList, setBoardList] = useState<BoardVO[]>([]);

    // 페이징 처리를 위한 useState 추가
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [title, setTitle] = useState('');
    //파일을 찾을 경로를 추가
    const filePath = 'http://localhost:81/back/resources/imgfile/';

    const getBoardList = async (page: number, title: string) => {
        try {
            const response = await axios.get('http://localhost:81/back/api/board', {
                //받아올 인자값 추가
                params: {
                    page: page,
                    size,
                    title,
                }
            });
            setBoardList(response.data.content);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    }

    //페이지처리된 정보를 받는다
    useEffect(() => {
        getBoardList(page, title);
    }, [page, title]);

    //검색버튼
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        setPage(1);
    };

    //
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder='검색어를 입력하세요...'
                    value={title}
                    onChange={handleSearchChange}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>대표이미지</th>
                        <th>조회수</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        boardList.map((item) => (
                            <tr key={item.num}>
                                <td>{item.num}</td>
                                <td><Link to={`/${item.num}`}>{item.title}</Link></td>
                                <td>{item.writer}</td>
                                <td><img src={filePath + item.img_names[0]} alt={item.title} style={{ width: '100px', height: '100px' }} /></td>
                                <td>{item.hit}</td>
                                <td>{item.bdate}</td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>
                            <Link to={'/boardForm'}>글쓰기</Link>
                        </td>
                    </tr>
                </tfoot>
            </table>
            {/* 페이지 버튼 UI 만들기 */}
            <div className='d-flex justify-content-center mt-4'>
                <nav>
                    <ul className='pagination'>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${i + 1 === page ? 'active' : ''}`}>
                                <button className='page-link' onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default BoardList