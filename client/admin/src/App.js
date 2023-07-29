import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home";
import KeyHistory from "./components/keyHistory";

export const devices = [
  { name: "Lavadero", url: "carwash" },
  // { name: "Inflador", url: "inflator" },
  // { name: "Aspiradora", url: "vacuum" },
];

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin/history/:device' element={<KeyHistory />} />
      </Routes>
    </div>
  );
}

export default App;
