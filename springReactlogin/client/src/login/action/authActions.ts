import axios from 'axios';
import { loginSuccess, loginFailure, logout } from '../reducers/authReducer';
import { AppDispatch } from '../store';
//로그인 액션
export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    // back/api/auth/login , post , username, password 
    //const response = await fakeApiLogin(username, password);
    //@RequestBody AuthRequest authRequest
    const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/auth/login`,{username,password});
    console.log("access_token =>"+response.data.access_token);
    const { token } = response.data.access_token;
    localStorage.setItem('username', username);
    localStorage.setItem('token', response.data.access_token);
    dispatch(loginSuccess({ username, token }));
  } catch (error) {
    if (error instanceof Error) {
      dispatch(loginFailure(error.message));
    } else {
      dispatch(loginFailure('An unknown error occurred.'));
    }
  }
};
//로그아웃 액션 
export const logoutAction = () => async (dispatch: AppDispatch) => {
  //백에서도 로그아웃을 통해서 토큰을 삭제
  await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/auth/logout`);
  // 로컬에서 삭제
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  //Redux의 logout상태 호출  
  dispatch(logout());
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