import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';
import Main from './Main';
import Setting from './Setting';
import Game from './Game';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/:roomCode/setting" element={<Setting />} />
      <Route path="/:roomCode/:nickname" element={<Game />} />
    </Routes>
  </Router>
);
