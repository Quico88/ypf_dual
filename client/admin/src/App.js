import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home";
import KeyHistory from "./components/keyHistory";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin/keys/history' element={<KeyHistory />} />
      </Routes>
    </div>
  );
}

export default App;
