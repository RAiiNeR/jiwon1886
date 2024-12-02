import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface UpBoardCommProps {
    num: number;
}

interface Comment {
    num: number;
    ucode: number;
    uwriter: string;
    ucontent: string;
    reip: string;
    uregdate: string;
}

const UpBoardComm: React.FC<UpBoardCommProps> = ({ num }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); //기본 1값을 초기화
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);


    useEffect(() => {
        console.log("Num" + num);
        fetchComments(currentPage);
    }, [currentPage]);

    const handlerPageChange = (page: number) => {
        setCurrentPage(page);
    }
    
    const fetchComments = async (page: number) => {
        try {
            const response = await axios.get('http://192.168.0.90/myictstudy/upboard/upcommList', {
                params: { num: num, cPage: page }
            });
            setComments(response.data.data);

            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("Error fetching comments", error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const commentData = {
            ucode: num,
            uwriter: writer,
            ucontent: content,
            reip: "192.168.0.90"
        };

        try {
            await axios.post(`http://192.168.0.90/myictstudy/upboard/upcommAdd`, commentData, {
                headers: { 'Content-Type': 'application/json' }
            });
            setWriter("");
            setContent("");
            fetchComments(currentPage);
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    return (
        <div className="mt-4">
            <h4>Comments</h4>
            <form onSubmit={handleCommentSubmit} className="mb-3">
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Writer"
                        value={writer}
                        onChange={(e) => setWriter(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-2">
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-control"
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Add Comment</button>
            </form>

            <ul className="list-group">
                {comments.map((comment) => (
                    <li key={comment.num} className="list-group-item">
                        <strong>{comment.uwriter}</strong> <span className="text-muted">({comment.uregdate})</span>
                        <p>{comment.ucontent}</p>
                    </li>
                ))}
            </ul>

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
    );
};

export default UpBoardComm