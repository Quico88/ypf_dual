import "./App.css";
import { Button, Modal, Popconfirm } from "antd";
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
      <Popconfirm
        className='text-black'
        title='Generar clave'
        description='Estás seguro/a que querés generar una nueva clave?'
        okText='Si'
        cancelText='No'
        onConfirm={handleClick}
      >
        <Button className='mt-2'>Generar Clave</Button>
      </Popconfirm>
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
        showCounterModal={showCounterModal}
      >
        <Counter />
      </Modal>
    </div>
  );
}

export default App;
