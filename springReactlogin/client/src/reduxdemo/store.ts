import { configureStore } from '@reduxjs/toolkit';
import likesReducer from './likesSlice';
//리덕스 store는 모든 state상태값을 저장하는 곳이다.
//부모 컴포넌트에 선언한 변수를 자식 컴포넌트가 원래는 접근을 못하는데, 여기서 상태를 모드 정의할 수 있다.
//index.tsx에서 <Provider store="reduxdemo/store.ts"> <App> </Provider>
//App.tsx에 포함된 하위 컴포넌트 전역에 store를 적용하겠다.
const store = configureStore({ //configureStore sore의 환경설정을 하겠다.
    reducer: { //상태관리를 저장하는 곳
        likes : likesReducer,
    },
    middleware : (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;