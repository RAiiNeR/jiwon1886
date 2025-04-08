import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Provider, LikeButton } from "@lyket/react";
import '../../css/backpackDetail.css';
import BackpackComm from './BackpackComm';

export interface Comment {
    num: number; // 댓글 ID
    content: string; // 댓글 내용
    bdate: string; // 작성 날짜
    backpacknum: number; // 해당 댓글이 속한 게시글 ID
    membernum: number; // 댓글 작성자의 회원 ID
    member?: { name: string; num: number }; // 작성자 정보 (회원 ID, 이름)
    parentnum: number; // 부모 댓글 ID (대댓글이면 부모 댓글의 ID, 일반 댓글이면 null)
    tag: string[]; // 태그 목록
    images: string[]; // 이미지 목록
}

const BackpackDetail: React.FC = () => {
    const { num } = useParams<{ num: string }>(); // URL에서 게시글 번호(num) 가져오기
    const backpacknum = Number(num); // 문자열을 숫자로 변환
    const [post, setPost] = useState<{ num: number; title: string; content: string; tag: string[], images: string[],  member?: { name: string; num: number } }>({ num: 0, title: '', content: '', tag: [], images: [],  member: { name: '', num: 0 }});
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                // 백엔드에서 게시글 데이터 가져오기
                const postRes = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/backpack/detail/${backpacknum}`);
                console.log("게시글 데이터:", postRes.data); 
                // 게시글 데이터 상태 업데이트 (member 정보가 없으면 기본값 설정)
                setPost({
                    ...postRes.data,
                    member: postRes.data.member || { name: "알 수 없음", num: 0 } 
                });
            } catch (error) {
                console.error("데이터 로딩 오류:", error);
            }
        };
        loadData();
    }, [backpacknum]);


    // 게시글 삭제 함수
    const handleDeletePost = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/backpack/delete/${backpacknum}`);
            alert("게시글이 삭제되었습니다.");
            navigate("/traveler/community"); // 목록 페이지로 이동
        } catch (error) {
            console.error("삭제 오류:", error);
            alert("게시글 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <Provider apiKey="acc0dbccce8e557db5ebbe6d605aaa">
            <div className='like-detail'>
                <div className="like-memo-hero-wrap js-halfheight"
                    style={{
                        backgroundImage: "url('../images/backpack.jpg')",
                        minHeight: '400px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}>
                    <div className="like-memo-overlay"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.3)',
                            pointerEvents: 'none'
                        }}></div>
                    <div className="like-memo-container text-center"
                        style={{ position: 'relative', zIndex: 2 }}>
                        <h1 className="like-memo-title mb-3 bread"
                            style={{ color: 'white', fontSize: '36px', fontWeight: 'bold' }}>나의 배낭</h1>
                    </div>
                </div>
                <section className="ftco-section ftco-degree-bg">
                    <div className="container">

                        {/* 게시글 */}
                        <div className="post-detail">
                            <h2>{post.title}</h2>
                            <p><strong>작성자:</strong> {post.member?.name || "알 수 없음"}</p>

                            <div className="image-container">
                                {post.images.length > 0 ? (
                                    post.images.map((image, idx) => (
                                        <div>
                                            <img
                                                key={idx}
                                                src={`${process.env.REACT_APP_FILES_URL}/img/backpack/${image}`}
                                                alt={`게시글 이미지 ${idx + 1}`}
                                                style={{ width: "100%", maxWidth: "500px", marginBottom: "10px" }}
                                            />
                                            <p>{post.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>이미지가 없습니다.</p>
                                )}
                            </div>

                        </div>

                        {/* 🔹 해시태그 목록 */}
                        <div className="tag-widget post-tag-container mb-5 mt-5">
                            <div className="tagcloud">
                                {post.tag.map((tag, idx) => (
                                    <Link key={idx} to="#" className="tag-cloud-link" style={{ textDecoration: 'none' }}>{tag}</Link>
                                ))}
                            </div>
                        </div>

                        {/* 🔹 좋아요 버튼 추가 */}
                        <div className="like-detail-like-button">
                            <LikeButton
                                namespace="testing-react"
                                id={`like-button-${backpacknum}`}
                                hideCounterIfLessThan={0}
                                component={({ handlePress, totalLikes }) => (
                                    <button onClick={handlePress} style={{ border: "none", background: "none", fontSize: "20px" }}>
                                        ❤️ {totalLikes}
                                    </button>
                                )}
                            />
                        </div>

                        <hr />

                        {/* 수정 및 삭제 버튼 추가 */}
                        <div className="post-actions">
                            {/* <button onClick={handleEditPost} className="edit-button">수정</button> */}
                            <button onClick={handleDeletePost} className="delete-button">삭제</button>
                        </div>
                        <BackpackComm backpacknum={backpacknum} />
                    </div>
                </section>
            </div>
        </Provider>
    );
};

export default BackpackDetail;