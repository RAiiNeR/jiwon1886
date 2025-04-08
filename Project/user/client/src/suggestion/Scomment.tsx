import axios from 'axios';
import React, { useEffect, useState } from 'react'


interface ScommVO { // 댓글
    num: number;
    writer: string;
    comments: string;
    scdate: string | Date;
    sbnum: string; // 댓글이 있는 게시물 번호
}

const Scomment: React.FC<{ num: string }> = ({ num }) => {
    // 댓글 데이터
    const [comments, setComments] = useState<ScommVO[]>([]);
    const [commentContent, setCommentContent] = useState<string>('');
    const [commentAuthor, setCommentAuthor] = useState<string>('');
    const [page, setPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    const pagePerBlock = 5; // 한 블럭에 표시할 페이지 수


    // 댓글 내용 입력 처리
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentContent(e.target.value);
    };

    // 댓글 작성자 입력 처리
    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentAuthor(e.target.value);
    };

    const getComm = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/scomm/${num}`, {
                params: {
                    page,
                    size: 5,
                }
            });
            setComments(response.data.content);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    }


    useEffect(() => {
        getComm();
    }, [page, num])

    // 댓글 등록 처리
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentContent || !commentAuthor) {
            alert('댓글 내용과 작성자명을 입력해주세요.');
            return;
        }

        const newComment: ScommVO = {
            num: Date.now(),
            writer: commentAuthor,
            comments: commentContent,
            scdate: new Date(),  // 현재 날짜와 시간을 가져옵니다.
            sbnum: num,
        };

        try {
            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/scomm`, newComment);
            getComm();
        } catch (error) {

        }

        // 댓글을 추가
        //setComments([newComment, ...comments]);

        // 입력란 초기화
        setCommentContent('');
        setCommentAuthor('');
    };

    // 페이지 블록 계산
    useEffect(() => {
        setStartPage((Math.floor((page - 1) / pagePerBlock) * pagePerBlock) + 1); // 시작페이지 계산
        let end = (Math.floor((page - 1) / pagePerBlock) + 1) * pagePerBlock; // 끝페이지 계산
        end = end > totalPages ? totalPages : end; // 끝 페이지가 전체 페이지를 초과하지 않도록 조정
        setEndPage(end);
    }, [comments]);

    // 날짜 포맷
    const changeDateForm = (date: string) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
    }

    // 패이지 변경
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    return (
        <>
            <div className="comment-form">
                <h3>댓글 달기</h3>
                <form onSubmit={handleCommentSubmit}>
                    <div className="form-group">
                        <label htmlFor="author">작성자</label>
                        <input
                            type="text"
                            id="author"
                            value={commentAuthor}
                            onChange={handleAuthorChange}
                            placeholder="작성자 이름을 입력하세요"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">댓글 내용</label>
                        <textarea
                            id="comment"
                            value={commentContent}
                            onChange={handleCommentChange}
                            placeholder="댓글을 입력하세요"
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        등록
                    </button>
                </form>
            </div>

            {/* 저장된 댓글 */}
            <div className="comments-list">
                <h3>댓글 목록</h3>
                {comments.length === 0 ? (
                    <p>댓글이 없습니다.</p>
                ) : (
                    <>
                        {
                            comments.map((comment) => (
                                <div key={comment.num} className="comment-item">
                                    <p><strong>{comment.writer}</strong> ({changeDateForm(comment.scdate as string)})</p>
                                    <p>{comment.comments}</p>
                                </div>
                            ))
                        }
                        <div className='d-flex justify-content-center mt-4'>
                            <nav>
                                <ul className='pagination'>
                                    {startPage > 1 && (
                                        <li className="page-item">
                                            {" "}
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(startPage - 1)} >
                                                이전
                                            </button>
                                        </li>
                                    )}
                                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((currpage) => ( // 인덱스(i)를 기반으로 페이지 번호를 렌더링
                                        <li key={currpage} className={`page-item ${currpage === page ?
                                            'active' : ''}`}>
                                            <button className='page-link' // 버튼을 누르면 handlePageChange(currpage) 호출
                                                onClick={() => handlePageChange(currpage)}>
                                                {currpage}
                                            </button>
                                        </li>
                                    ))}
                                    {endPage < totalPages && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(endPage + 1)}>
                                                다음
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Scomment