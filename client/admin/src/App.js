import "./App.css";
import { Button } from "antd";
import axios from "axios";
import { useState } from "react";
import Counter from "./components/counter";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

function App() {
  const [key, setKey] = useState(0);
  const handleClick = async () => {
    const { data } = await axios.get("carwash/key/generate");
    setKey(parseInt(data.key));
    console.log("key: ", key);
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='text-4xl m-6 text-blue-500 text-center font-bold'>
        YPF DUAL
      </div>
      <text className='mt-6 font-bold'>Lavadero</text>
      <Button className='mt-2' onClick={handleClick}>
        Generar Clave
      </Button>
      {key ? (
        <text className='text-sm mt-4'>La clave generada es: {key}</text>
      ) : null}
      <Counter />
    </div>
  );
}

export default App;
