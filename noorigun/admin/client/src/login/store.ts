// login/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer from './reducers/index';
// Redux Toolkit을 통해 간단하게 store를 설정
const store = configureStore({
  reducer: rootReducer,// 루트 리듀서를 연결
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,// 직렬화할 때 발생하는 문제를 방지하기 위해 체크를 비활성화
    }),
});
// AppDispatch 타입 정의
export type AppDispatch = typeof store.dispatch;
//타입 안전성을 보장하기 위한 커스텀 Hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
//전체 상태 상태 구조를 타입으로 추론
export type RootState = ReturnType<typeof store.getState>;
//store를 다른 파일에서 Redux store로 사용할 수 있도록 내보내기
export default store;