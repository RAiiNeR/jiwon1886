
import { loginSuccess, loginFailure, logout } from '../reducers/authReducer';
import axios from 'axios';
import { AppDispatch } from '../store';
// 로그인 및 로그아웃 액션 로직과 관련된 코드

export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    //const response = await fakeApiLogin(username, password);
    // 백엔드 API를 통해 로그인 요청
    const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/login`, { username, password });
    // console.log("token ===========> ", response.data.accessToken)
    // 서버에서 반환된 토큰 가져오기
    const token = response.data.accessToken;

    // 로컬 스토리지에 사용자 이름과 토큰 저장
    localStorage.setItem('managetName', username);
    localStorage.setItem('managerToken', token);
    // 성공적으로 로그인했다는 액션 디스패치
    dispatch(loginSuccess({ username, token }));
  } catch (error) {
    // 에러 처리
    if (error instanceof Error) {
      // 에러 메시지를 Redux 상태에 저장
      dispatch(loginFailure(error.message));
    } else {
      // 예기치 못한 에러를 처리
      dispatch(loginFailure('An unknown error occurred.'));
    }
  }
};
// 로그아웃 액션
export const logoutAction = () => async (dispatch: AppDispatch) => {
  // 로그아웃 요청을 서버로 보냄
  await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/auth/logout`);
  // 로컬 스토리지에서 사용자 이름과 토큰 제거
  localStorage.removeItem('managetName');
  localStorage.removeItem('managerToken');
  // 로그아웃 성공 액션 디스패치
  dispatch(logout());
};

// 로그아웃을 처리, 로컬 스토리지에서 사용자 데이터 제거
export const closeAction = () => (dispatch: AppDispatch) => {
  // 로컬 스토리지에서 사용자 데이터 제거
  localStorage.removeItem('managetName');
  localStorage.removeItem('managerToken');
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