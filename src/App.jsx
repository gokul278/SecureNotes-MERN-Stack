import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IndexPage } from './pages/IndexPage';
import { Dashboard } from './pages/Dashboard';
import { LoginAgain } from './pages/components/LoginAgain';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<IndexPage/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="*" element={<LoginAgain/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
