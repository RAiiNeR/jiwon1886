// login/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer from './reducers/index';

/*
  * Redux Toolkit을 사용한 Redux Store 설정
  - configureStore는 Redux Store를 설정하는데 필요한 옵션을 간단하게 제공
  - 애플리케이션의 리듀서를 설정
  - rootReducer: 모든 리듀서를 합친 루트 리듀서
*/ 

const store = configureStore({
  reducer: rootReducer,
  // Redux 미들웨어 설정
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, // 비직렬화 가능 데이터에 대한 검사 비활성화(Redux 허용여부)
    }),
});

export type AppDispatch = typeof store.dispatch; // useDispatch를 사용할 때 타입 안정성을 제공
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Redux 액션을 디스패치할 때 타입 오류를 방지
export type RootState = ReturnType<typeof store.getState>; // 컴포넌트에서 Redux 상태를 조회할 때 사용
/* 
 store : Redux Store 객체
        - 애플리케이션 전체 상태를 중앙에서 관리, 리듀서와 미들웨어가 연결
        - 상태를 업데이트 하거나 조회
        - 다른 파일에서 Redux Store를 사용할 수 있도록 내보내기
*/
export default store;