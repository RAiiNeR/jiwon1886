import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Redux Provider 임포트
import store from './Pages/Login/store'; // Redux Store 경로 수정
import App from './App'; // App 컴포넌트 임포트
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>  {/* Redux Store를 Provider로 감싸서 앱에 제공 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
