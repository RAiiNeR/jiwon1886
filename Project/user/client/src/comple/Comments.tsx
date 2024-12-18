import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Ccomm {
    num: number;
    writer: string;
    comments: string;
    ccdate: string;
}

interface CommentProps {
    cbnum: number; // 댓글이 있는 게시물 번호
}

const Comments: React.FC<CommentProps> = ({ cbnum }) => {
    const [comments, setComments] = useState<Ccomm[]>([]);
    const [newComment, setNewComment] = useState(''); // 새 댓글 내용
    const [commentWriter, setCommentWriter] = useState('');
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [size] = useState(5); // 한 페이지 당 댓글 개수
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const pagePerBlock = 5;


    const fetchComments = async (page: number, cbnum: number) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/ccomm/${cbnum}`, {
                params: {
                    page: page, // 현재 페이지
                    size, // 페이지당 항목 수
                    cbnum, // 게시글 번호
                }
            });
            setComments(response.data.content);
            setTotalPages(response.data.total_pages) // 페이지 수 설정
        } catch (error) {
            console.error('댓글 불러오기 실패:', error);
        }
    };

    // 페이지 블록 계산
    useEffect(() => {
        setStartPage((Math.floor((page - 1) / pagePerBlock) * pagePerBlock) + 1); // 시작페이지 계산
        let end = (Math.floor((page - 1) / pagePerBlock) + 1) * pagePerBlock; // 끝페이지 계산
        end = end > totalPages ? totalPages : end; // 끝 페이지가 전체 페이지를 초과하지 않도록 조정
        setEndPage(end);
    }, [comments])


    // 댓글 리스트 불러오기
    useEffect(() => {
        fetchComments(page, cbnum);
    }, [page, cbnum]); // page, cbnum 변경될 때 가져옴

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    // 댓글 작성
    const handleAddComment = async () => {
        // 댓글 작성자, 내용이 비어있을 경우
        if (!newComment.trim() || !commentWriter.trim()) {
            alert('작성자와 댓글 내용을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/ccomm`, {
                writer: commentWriter,
                comments: newComment,
                cbnum,
            });
            setComments([response.data, ...comments]); // 새 댓글 추가
            setNewComment(''); // 입력 필드 초기화
            setCommentWriter('');
        } catch (error) {
            console.error('댓글 작성 실패:', error);
        }
    };

    return (
        <div className="ccomm-container">
            <h4 className="ccomm-title">댓글</h4>
            <div className="ccomm-form">
                <input
                    type="text"
                    placeholder="작성자"
                    value={commentWriter}
                    onChange={(e) => setCommentWriter(e.target.value)}
                    className="ccomm-writer-input"
                />
                <input
                    type="text"
                    placeholder="댓글을 입력하세요"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="ccomm-comment-input"
                />
                <button type="button" onClick={handleAddComment} className="ccomm-submit-button">
                    댓글 작성
                </button>
            </div>

            {/* 댓글 리스트 */}
            {comments.length > 0 ? (
                <ul className="ccomm-list">
                    {comments.map((comment) => (
                        <li key={comment.num}>
                            <p className="ccomm-writer">{comment.writer}</p>
                            <p className="ccomm-comment">{comment.comments}</p>
                            <p className="ccomm-date">
                                {new Date(comment.ccdate).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>작성된 댓글이 아직 없습니다.</p> // 댓글이 없는 경우 표시
            )}
            <div className=' '>
                <nav>
                    <ul className='pagination'>
                        {startPage > 1 && (
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => setPage(startPage - 1)} >
                                    이전
                                </button>
                            </li>
                        )}
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((curr) => (
                            <li key={curr} className={`page-item ${curr === page ? 'active' : ''}`}>
                                <button className='page-link' onClick={() => handlePageChange(curr)}>
                                    {curr}
                                </button>
                            </li>
                        ))}
                        {endPage < totalPages && (
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => setPage(endPage + 1)}>
                                    다음
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Comments;
