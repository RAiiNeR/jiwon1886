import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import { LeaveRequestData } from "../../components/Data/AppData";
import axios from "axios";

// 신고된 글 목록 (20개)
const reportedPosts = [
    "무료로 최신 스마트폰 지급! 한정 수량, 선착순 100명!",
    "대출 500만원을 공짜로 지급해드립니다. 지금 당장 연락하세요!",
    "이 글을 공유하면 1,000만원 당첨 확률이 올라갑니다!",
    "VIP 투자 그룹 초대! 하루 10배 수익 가능!",
    "초보자를 위한 주식 투자, 1주일 만에 부자 되기!",
    "한 달 만에 5천만원 벌기, 지금 바로 시작하세요!",
    "무료 경품 이벤트! 응모하면 100% 당첨!",
    "이 채널을 구독하면 모든 비밀이 밝혀집니다!",
    "파격 세일! 단 1시간 동안 모든 제품 90% 할인!",
    "비트코인 100% 상승 보장! 안전한 투자!",
    "특정인을 비방하는 내용이 포함된 게시물입니다.",
    "과도한 광고 및 허위 사실이 포함된 게시물입니다.",
    "무분별한 링크 공유로 인한 악성 코드 위험이 있습니다.",
    "개인정보 유출 가능성이 있는 게시물입니다.",
    "커뮤니티 규정을 위반하는 부적절한 게시물입니다.",
    "차별적 발언 및 혐오 표현이 포함된 게시물입니다.",
    "사기 및 금전적 피해 가능성이 있는 게시물입니다.",
    "허위 정보 유포로 인해 다수의 신고를 받은 게시물입니다.",
    "비정상적인 댓글 조작이 의심되는 게시물입니다.",
    "지나친 도배 및 스팸성 게시물입니다."
];

// 신고 사유 목록 (20개)
const reportReasons = [
    "비방적인 표현이 포함된 게시물입니다. 모욕적인 언어 사용이 감지되었습니다.",
    "이 글에는 혐오 발언이 포함되어 있습니다. 규정을 위반하는 콘텐츠입니다.",
    "과도한 욕설 및 비속어 사용이 감지된 게시물입니다. 신고 대상입니다.",
    "다른 사용자를 비방하는 내용이 포함된 글입니다. 검토가 필요합니다.",
    "사회적으로 부적절한 언급 및 차별적 발언이 포함된 게시물입니다.",
    "사칭 및 허위 사실 유포로 인해 신고되었습니다.",
    "상대방을 조롱하거나 비난하는 언어가 포함된 게시물입니다.",
    "개인정보 노출 및 명예 훼손 가능성이 있는 콘텐츠로 신고되었습니다.",
    "일반적인 커뮤니티 가이드를 위반하는 불법 게시물입니다.",
    "과도한 비속어 사용으로 인해 자동 감지된 신고 대상 게시물입니다.",
    "공격적인 언행 및 위협적인 내용이 포함된 게시물입니다.",
    "정치적 선동 및 허위 조작 정보가 포함된 게시물입니다.",
    "특정 집단을 비하하는 표현이 감지되었습니다.",
    "음란물 및 부적절한 이미지가 포함된 게시물입니다.",
    "불법적인 상품 판매 및 사기 가능성이 있는 게시물입니다.",
    "허위 리뷰 및 조작된 평점이 포함된 게시물입니다.",
    "악의적인 허위 사실 유포로 신고된 게시물입니다.",
    "타인을 협박하거나 명예를 훼손하는 내용이 포함되었습니다.",
    "과도한 광고성 게시물로 인해 불편을 초래하고 있습니다.",
    "무분별한 욕설과 비방이 포함된 게시물입니다."
];

// 랜덤 신고된 글 & 신고 사유 선택 함수
const getRandomReportedPost = () => reportedPosts[Math.floor(Math.random() * reportedPosts.length)];
const getRandomReportReason = () => reportReasons[Math.floor(Math.random() * reportReasons.length)];

const AiBlackList: React.FC = () => {
    const [isModal, setIsModal] = useState(false);
    const [isConfirmModal, setIsConfirmModal] = useState(false); // 취소 확인 모달
    const [isMailSentModal, setIsMailSentModal] = useState(false); // 메일 발송 완료 모달
    const [selectedReportedPost, setSelectedReportedPost] = useState("");
    const [selectedReason, setSelectedReason] = useState("");
    const [reportDate, setReportDate] = useState("");
    const [postDate, setPostDate] = useState("");

    // 모달 열 때 랜덤 신고된 글 & 신고 사유 설정
    const handleOpenModal = () => {
        setSelectedReportedPost(getRandomReportedPost());
        setSelectedReason(getRandomReportReason());
        setIsModal(true);
    };

    // 메일 발송 함수
    const handleSendEmail = async () => {

        console.log("📨 발송할 이메일:", "jims1209@naver.com");
        console.log("📝 신고된 글:", selectedReportedPost);
        console.log("📌 신고 사유:", selectedReason);
        try {
            await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/sendEmail`, {
                email: "jims1209@naver.com", // 실제 회원 이메일로 변경
                reportedPost: selectedReportedPost,
                reportReason: selectedReason,
                reportDate,
                postDate
            });

            setIsModal(false); // 기존 모달 닫기
            setIsMailSentModal(true); // 메일 발송 완료 모달 열기
        } catch (error) {
            console.error("❌ 메일 발송 오류:", error);
            alert("메일 발송 실패: " + error);
        }
    };

    const columnT = [
        { name: "회원 ID", selector: (row: any) => row.employeeId, sortable: true },
        {
            name: "프로필",
            selector: (row: any) => row.image,
            cell: (row: any) => <img className="avatar rounded-circle" src={row.image} alt="프로필" width="40" height="40" />
        },
        { name: "가입일", selector: (row: any) => row.from, sortable: true },
        { name: "경고메일 전송", cell: () => <button className="btn btn-outline-secondary" onClick={handleOpenModal}>신고 사유</button> }
    ];

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="블랙리스트 목록" renderRight={() => null} />
            <DataTable title="Blacklist" columns={columnT} data={LeaveRequestData.rows} pagination highlightOnHover />

            {/* 신고 사유 모달 */}
            <Modal centered show={isModal} onHide={() => setIsConfirmModal(true)}>
                <Modal.Header closeButton><Modal.Title>신고사유</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p><b>신고된 글:</b> {selectedReportedPost}</p>
                    <p><b>신고 사유:</b> {selectedReason}</p>
                    {/* <div className="mb-3">
                        <label className="form-label">작성된 날짜</label>
                        <input type="date" className="form-control" value={postDate} onChange={(e) => setPostDate(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">신고된 날짜</label>
                        <input type="date" className="form-control" value={reportDate} onChange={(e) => setReportDate(e.target.value)} />
                    </div> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsConfirmModal(true)}>취소하기</Button>
                    <Button variant="primary" onClick={handleSendEmail}>메일 발송하기</Button>
                </Modal.Footer>
            </Modal>

            {/* 취소 확인 모달 */}
            <Modal centered show={isConfirmModal} onHide={() => setIsConfirmModal(false)}>
                <Modal.Header closeButton><Modal.Title>확인</Modal.Title></Modal.Header>
                <Modal.Body>정말 취소하시겠습니까?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsConfirmModal(false)}>아니오</Button>
                    {/* <Button variant="danger" onClick={() => setIsModal(false)}>예</Button> */}
                    <Button variant="danger" onClick={() => {
                        setIsModal(false);
                        setIsConfirmModal(false); 
                    }}>예</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AiBlackList;
