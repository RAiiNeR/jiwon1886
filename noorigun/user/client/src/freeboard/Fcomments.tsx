import React, { useEffect, useState } from 'react'
import './css/FreeBoardDetail.css';
import axios from 'axios';

interface FcommVO {
    num: string;
    writer: string;
    comment: string;
    fcdate: string;
}
interface CommentProps {
    fbnum: number; // 댓글이 있는 게시물 번호
}

const Fcomments: React.FC<CommentProps> = ({ fbnum }) => {
    const [comment, setComment] = useState<FcommVO[]>([]);
    const [newFcomment, setNewFcomment] = useState(''); // 새 댓글 내용
    const [fcommentWriter, setFcommentWriter] = useState('');
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [size] = useState(5); // 한 페이지 당 댓글 개수
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const pagePerBlock = 5; // 페이지 블록당 페이지 수

    const fetchComments = async (page: number, fbnum: number) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/fcomm/${fbnum}`, {
                params: {
                    page: page, // 현재 페이지
                    size, // 페이지당 항목 수
                    fbnum, // 게시글 번호
                }
            });
            setComment(response.data.content);
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
    }, [comment])

    // 댓글 리스트 불러오기
    useEffect(() => {
        fetchComments(page, fbnum);
    }, [page, fbnum]); // page, fbnum 변경될 때 가져옴

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    // 댓글 작성
    const handleAddComment = async () => {
        // 댓글 작성자, 내용이 비어있을 경우
        if (!newFcomment.trim() || !fcommentWriter.trim()) {
            alert('작성자와 댓글 내용을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/fcomm`, {
                writer: fcommentWriter,
                comment: newFcomment,
                fbnum,
            });
            setComment([response.data, ...comment]); // 새 댓글 추가
            setNewFcomment(''); // 입력 필드 초기화
            setFcommentWriter('');
        } catch (error) {
            console.error('댓글 작성 실패:', error);
        }
    };

    return (
        <div className="comment-form">
            <h3>댓글 달기</h3>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="작성자"
                    value={fcommentWriter}
                    onChange={(e) => setFcommentWriter(e.target.value)}
                    className="form-group"
                />
                <input
                    type="text"
                    placeholder="댓글을 입력하세요"
                    value={newFcomment}
                    onChange={(e) => setNewFcomment(e.target.value)}
                    className="form-group"
                />
                <button type="button" onClick={handleAddComment} className="submit-btn">
                    댓글 작성
                </button>
            </div>

            {/* 댓글 리스트 */}
            {comment.length > 0 ? (
                <ul className="ccomm-list">
                    {comment.map((fcomment) => (
                        <li key={fcomment.num}>
                            <p className="ccomm-writer">{fcomment.writer}</p>
                            <p className="ccomm-comment">{fcomment.comment}</p>
                            <p className="ccomm-date">
                                {new Date(fcomment.fcdate).toLocaleString('ko-KR', {
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
                            <li className="freebboard-page">
                                <button
                                    className="freebboard-page"
                                    onClick={() => handlePageChange(startPage - 1)} >
                                    이전
                                </button>
                            </li>
                        )}
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((currPage) => (
                            <li key={currPage} className={`page-item ${currPage === page ? 'active' : ''}`}>
                                <button className='page-link' onClick={() => handlePageChange(currPage)}>
                                    {currPage}  {/* 페이지 번호 표시 */}
                                </button>
                            </li>
                        ))}
                        {endPage < totalPages && (
                            <li className="freebboard-page">
                                <button
                                    className="freebboard-page"
                                    onClick={() => handlePageChange(endPage + 1)}>
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

export default Fcomments