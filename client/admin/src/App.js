import "./App.css";
import { Button, Modal } from "antd";
import axios from "axios";
import { useState } from "react";
import Counter from "./components/counter";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [key, setKey] = useState(0);
  const [showCounterModal, setShowCounterModal] = useState(false);

  const handleClick = async () => {
    const { data } = await axios.get("carwash/key/generate");
    setKey(parseInt(data.key));
    console.log("key: ", key);
  };

  const toggleModal = () => {
    setShowCounterModal(!showCounterModal);
  };

  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <div className='text-4xl m-6 text-blue-500 text-center font-bold'>
        YPF DUAL
      </div>
      <text className='mt-6 font-bold'>Lavadero</text>
      <Button className='mt-2' onClick={handleClick}>
        Generar Clave
      </Button>
      {key ? (
        <text className='text-sm mt-4'>La clave generada es: {key}</text>
      ) : (
        ""
      )}
      <Button size='small' className='mt-16' onClick={toggleModal}>
        Aforo
      </Button>
      <Modal
        title='Aforo acumulado'
        className='text-center'
        open={showCounterModal}
        onCancel={toggleModal}
        footer={null}
      >
        <Counter />
      </Modal>
    </div>
  );
}

export default App;
