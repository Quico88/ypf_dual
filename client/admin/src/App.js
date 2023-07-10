import "./App.css";
import axios from "axios";
import CardContainer from "./components/cardContainer";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <div className='text-4xl m-6 text-blue-500 text-center font-bold'>
        YPF DUAL
      </div>
      <CardContainer />
    </div>
  );
}

export default App;
