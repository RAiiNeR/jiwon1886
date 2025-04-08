import React from "react";
import { Link } from "react-router-dom";
import "../../css/login_main.css";
import "../../css/login_util.css";

const SignSelect = () => {
  return (
    <div className="limiter">
      <div className="container-login100" style={{ backgroundImage: "url('./images/bg-01.jpg')" }}>
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54 login-box">
          <span className="login100-form-title p-b-49">회원가입 선택</span>
          
          <div className="container-login100-form-btn" style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
            <div className="wrap-login100-form-btn" style={{ flex: 1, textAlign: "center" }}>
              <div className="login100-form-bgbtn"></div>
              <Link to="/traveler/signup" className="login100-form-btn text-center" style={{ padding: "15px", borderRadius: "0px", backgroundColor: "#6200ea", color: "white", fontWeight: "bold", border: "2px solid #6200ea" }}>
                일반 사용자
              </Link>
            </div>
            
            <div className="wrap-login100-form-btn" style={{ flex: 1, textAlign: "center" }}>
              <div className="login100-form-bgbtn"></div>
              <Link to="/traveler/partner" className="login100-form-btn text-center" style={{ padding: "15px", borderRadius: "0px", backgroundColor: "#6200ea", color: "white", fontWeight: "bold", border: "2px solid #6200ea" }}>
               새로운 제휴회사
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignSelect;
