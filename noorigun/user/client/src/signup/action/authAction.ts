
import { loginSuccess, loginFailure, logout } from '../reducers/authReducer';
import axios from 'axios';
import { AppDispatch } from '../store';
/*
  - Redux를 활용하여 로그인 상태를 관리
  - 로그인 성공 시 액세스 토큰을 로컬 스토리지에 저장, 로그아웃시 제거
*/

// 사용자가 입력한 username, password를 서버로 전송 후 로그인 처리
export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    //const response = await fakeApiLogin(username, password);
    // 서버에 로그인 요청
    const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/login`, { username, password });
    // console.log("token ===========> " + response.data.access_token)
    // 서버로부터 받은 액세스 토큰을 변수에 저장
    const token = response.data.access_token;

    // 로컬 스토리지에 사용자 이름과 토큰 저장
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    dispatch(loginSuccess({ username, token })); // Redux 업데이트 (로그인 성공)
  } catch (error) {
    if (error instanceof Error) {
      dispatch(loginFailure(error.message)); // 에러 메시지를 Redux저장 (로그인 실패)
    } else {
      dispatch(loginFailure('An unknown error occurred.'));
    }
  }
};

// 사용자가 입력한 username, password를 서버로 전송 후 로그인 처리
export const socaillogin = (username:string, email: string) => async (dispatch: AppDispatch) => {
  try {
    //const response = await fakeApiLogin(username, password);
    // 서버에 로그인 요청
    const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/socaillogin`, { email });
    // console.log("token ===========> " + response.data.access_token)
    // 서버로부터 받은 액세스 토큰을 변수에 저장
    const token = response.data.access_token;
    // 로컬 스토리지에 사용자 이름과 토큰 저장
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    dispatch(loginSuccess({ username, token })); // Redux 업데이트 (로그인 성공)
  } catch (error) {
    if (error instanceof Error) {
      dispatch(loginFailure(error.message)); // 에러 메시지를 Redux저장 (로그인 실패)
    } else {
      dispatch(loginFailure('An unknown error occurred.'));
    }
  }
};

const kakoLogout = async (token: string) => {
  localStorage.removeItem('kakaoToken');
  await axios.post("https://kapi.kakao.com/v1/user/logout", null, {
      headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
  });
  // const res = await axios.get(`https://kauth.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_KAKAO_API_KEY}&logout_redirect_uri=${process.env.REACT_APP_KAKAO_LOGOUT_REDIRECT_URI}`);
}

// 로그아웃을 처리, 로컬 스토리지에서 사용자 데이터 제거
export const logoutAction = () => async (dispatch: AppDispatch) => {
  const kToken = localStorage.getItem('kakaoToken');
  if (kToken) kakoLogout(kToken);
  else {
    // 서버에 로그아웃 요청
    await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/auth/logout`);
  }
  // 로컬 스토리지에서 사용자 데이터 제거
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  localStorage.removeItem('kakaoToken');
  dispatch(logout()); // Redux 초기화 (로그아웃 처리)
};

// 로그아웃을 처리, 로컬 스토리지에서 사용자 데이터 제거
export const closeAction = () => (dispatch: AppDispatch) => {
  // 로컬 스토리지에서 사용자 데이터 제거
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  const kToken = localStorage.getItem('kakaoToken');
  if (kToken) kakoLogout(kToken);
  dispatch(logout()); // Redux 초기화 (로그아웃 처리)
};

// const fakeApiLogin = (username: string, password: string): Promise<{ data: { token: string } }> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (username === 'test' && password === '11') {
//         resolve({ data: { token: 'fake-jwt-token' } });
//       } else {
//         reject(new Error('Invalid credentials'));
//       }
//     }, 1000);
//   });
// };