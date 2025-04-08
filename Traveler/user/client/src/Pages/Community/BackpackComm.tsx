import React, { useState, useEffect } from 'react';
import '../../css/backpackDetail.css';
import { parseJwt } from '../../Comm/jwtUtils';
import axios from 'axios';

interface Comment {
  num: number; // 댓글 ID
  backpacknum: number; // 해당 댓글이 속한 게시글 ID
  parentnum: number; // 부모 댓글 ID (대댓글이면 부모 댓글의 ID, 일반 댓글이면 null)
  member: { num: number; name: string } | null; // 작성자 정보 (회원 ID, 이름)
  content: string; // 댓글 내용
  bdate: string; // 작성 날짜
  replies: Comment[]; // 대댓글 목록
}

// 댓글 컴포넌트의 Props 타입 (게시글 ID)
interface BackpackCommProps {
  backpacknum: number;
}

const BackpackComm: React.FC<BackpackCommProps> = ({ backpacknum }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [writer, setWriter] = useState("");  // 현재 로그인한 사용자의 이름
  const [content, setContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({}); // 사용자가 입력한 대댓글 내용 (댓글 ID별로 저장)
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: boolean }>({});  // 특정 댓글에 대댓글 입력창을 열지 여부를 저장
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);  // 로그인 상태 확인 (true: 로그인됨, false: 로그인 안 됨)
  const [userToken, setUserToken] = useState<number | null>(null);  // 현재 로그인한 사용자의 ID (null이면 로그인 안 된 상태)

  // 컴포넌트가 처음 렌더링될 때 실행되는 함수
  useEffect(() => {
    // 1. 로그인 정보 확인 및 사용자 정보 설정
    const token = localStorage.getItem("token"); // 브라우저 로컬 스토리지에서 로그인 토큰 가져오기
    if (token) {
      try {
        const decodedToken = parseJwt(token); // 토큰을 해석하여 사용자 정보 추출
        if (decodedToken && decodedToken.name) {
          setWriter(decodedToken.name); // 사용자 이름 설정
          setUserToken(decodedToken.num); // 사용자 ID 설정
          setIsLoggedIn(true); // 로그인 상태로 변경
        } else {
          console.error("토큰에서 사용자 정보를 찾을 수 없습니다.");
          setWriter("알 수 없음");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("토큰 파싱 오류:", error);
        setWriter("알 수 없음");
        setIsLoggedIn(false);
      }
    } else {
      setWriter("로그인 필요");
      setIsLoggedIn(false);
    }

    // 2. 댓글 목록 가져오기
    fetchComments();
  }, [backpacknum]); // 게시글 ID가 변경될 때마다 실행

  // 백엔드에서 댓글 목록을 가져오는 함수
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/bcomm/list/${backpacknum}`
      );
      console.log("댓글 데이터:", response.data);

      // 응답 데이터 검증
      const commentsArray = response.data?.comments || [];
      if (!Array.isArray(commentsArray)) {
        throw new Error("댓글 데이터 형식이 올바르지 않습니다.");
      }

      // replies가 null이면 빈 배열 []로 변환, member 객체가 없을 경우 기본값 설정
      const formattedComments = commentsArray.map((comment: Comment) => ({
        ...comment,
        replies: comment.replies || [], // replies가 null이면 빈 배열로 변환
        member: comment.member || { num: 0, name: "알 수 없음" }, // member가 null이면 기본값 설정
      }));

      setComments(formattedComments); // 댓글 목록 업데이트
    } catch (error) {
      console.error("댓글 불러오기 오류:", error);
    }
  };

  // 댓글 등록 
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 동작 방지
    if (!content.trim()) return; // 빈 내용이면 등록 안 함
    if (!userToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 백엔드로 댓글 추가 요청
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/bcomm/add`,
        {
          backpacknum,
          membernum: userToken,
          content,
          parentnum: null, // 일반 댓글이므로 parentnum 없음
        }
      );

      // 새로운 댓글 객체 생성
      const newComment: Comment = {
        ...response.data,
        replies: [],
        member: response.data.member || { num: userToken, name: writer }, // member 객체 설정
      };

      // 기존 댓글 목록에 추가
      setComments([...comments, newComment]);
      setContent(""); // 입력창 초기화
    } catch (error) {
      console.error("댓글 추가 오류:", error);
      alert("댓글 추가 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 등록
  const handleReplySubmit = async (e: React.FormEvent, parentnum: number) => {
    e.preventDefault();
    if (!replyContent[parentnum]?.trim()) return;
    if (!userToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 백엔드로 대댓글 추가 요청
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/bcomm/add`,
        {
          backpacknum,
          membernum: userToken,
          content: replyContent[parentnum],
          parentnum,
        }
      );

      // 새로운 대댓글 객체 생성
      const newReply: Comment = {
        ...response.data,
        replies: [],
        member: response.data.member || { num: userToken, name: writer }, // 백엔드 응답이 없으면 직접 채우기
      };

      // 부모 댓글의 replies 배열에 추가
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.num === parentnum
            ? { ...comment, replies: [...(comment.replies ?? []), newReply] }
            : comment
        )
      );

      setReplyContent({ ...replyContent, [parentnum]: "" }); // 입력창 초기화
    } catch (error) {
      console.error("대댓글 추가 오류:", error);
      alert("대댓글 추가 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACK_END_URL}/api/bcomm/delete/${commentId}`
      );

      // 삭제된 댓글을 목록에서 제거
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.num !== commentId)
      );
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 입력창 표시 여부 토글
  const toggleReplyInput = (commentNum: number) => {
    setReplyInputs((prev) => ({ ...prev, [commentNum]: !prev[commentNum] }));
  };

  const renderComments = (comments: Comment[], depth: number = 0) => {
    return comments.map((comment) => (
      <div key={comment.num} style={{ marginLeft: `${depth * 20}px` }}>
        <li className="list-group-item">
          <strong>{comment.member ? comment.member.name : "알 수 없음"}</strong>
          <span className="text-muted">({formatDate(comment.bdate)})</span>
          <p>{comment.content}</p>

          {isLoggedIn && (
            <>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => toggleReplyInput(comment.num)}
              >
                {replyInputs[comment.num] ? "취소" : "대댓글 달기"}
              </button>

              {comment.parentnum === null && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteComment(comment.num)}
                >
                  삭제
                </button>
              )}

              {replyInputs[comment.num] && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={writer}
                    className="form-control mb-2"
                    readOnly
                  />
                  <textarea
                    placeholder="대댓글 내용"
                    value={replyContent[comment.num] || ""}
                    onChange={(e) =>
                      setReplyContent({
                        ...replyContent,
                        [comment.num]: e.target.value,
                      })
                    }
                    className="form-control mb-2"
                    style={{ minHeight: "80px", marginBottom: "10px" }}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => handleReplySubmit(e, comment.num)}
                  >
                    대댓글 등록
                  </button>
                </div>
              )}
            </>
          )}
        </li>

        {/* 대댓글이 존재하면 렌더링 */}
        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
      </div>
    ));
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="mt-4">
      <h4>댓글</h4>

      {isLoggedIn ? (
        <form onSubmit={handleCommentSubmit} className="mb-3">
          <div className="mb-2">
            <input
              type="text"
              value={writer}
              className="form-control"
              readOnly
            />
          </div>
          <div className="mb-2">
            <textarea
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              style={{ minHeight: "100px", marginBottom: "10px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            댓글 등록
          </button>
        </form>
      ) : (
        <p className="text-muted">로그인 후 댓글을 작성할 수 있습니다.</p>
      )}

      <ul className="list-group">{renderComments(comments)}</ul>
    </div>
  );
};

export default BackpackComm;
