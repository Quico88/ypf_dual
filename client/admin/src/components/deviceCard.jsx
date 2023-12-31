import { Button, Modal, Popconfirm, Row } from "antd";
import Counter from "./counter";
import { useEffect, useState } from "react";
import axios from "axios";

const DeviceCard = ({ name, url }) => {
  const [key, setKey] = useState(0);
  const [showCounterModal, setShowCounterModal] = useState(false);

  const [lastKeys, setLastKeys] = useState([]);

  const [MTDCount, setMTDCount] = useState(0);
  const [currentShiftCount, setCurrentShiftCount] = useState(0);
  const [prevShiftCount, setPrevShiftCount] = useState(0);

  const keyEndPoint = `${url}/key/generate`;
  const counterEndPoint = `${url}/key/counter`;

  const handleClick = async () => {
    const { data } = await axios.get(keyEndPoint);
    setKey(parseInt(data.key));
    console.log("key: ", key);
  };

  const latsKeysLength = 5;

  useEffect(() => {
    const keys = [...lastKeys];
    if (key !== 0) keys.unshift(key);
    if (keys.length > latsKeysLength + 1) {
      keys.pop();
    }
    setLastKeys(keys);
  }, [key]);

  const countKeys = async () => {
    let {
      data: { MTDCount, currentShiftCount, prevShiftCount },
    } = await axios.get(counterEndPoint);
    setMTDCount(MTDCount);
    setCurrentShiftCount(currentShiftCount);
    setPrevShiftCount(prevShiftCount);
  };

  const toggleModal = async () => {
    setShowCounterModal(!showCounterModal);
    await countKeys().catch((e) => console.log(e));
  };

  return (
    <div className='flex flex-col justify-center items-center py-4 px-16 h-1/3 border-2 border-blue-200 rounded-lg bg-slate-100 m-4'>
      <text className='mt-6 font-bold'>{name}</text>
      <Popconfirm
        className='text-black'
        title={`Generar clave ${name}`}
        description='Estás seguro/a que querés generar una nueva clave?'
        okText='Sí'
        cancelText='No'
        okType='default'
        onConfirm={handleClick}
      >
        <Button className='mt-2'>Generar Clave</Button>
      </Popconfirm>
      {key ? (
        <text className='text-sm mt-4'>La clave generada es: {key}</text>
      ) : (
        <text className='text-sm text-slate-100 mt-4'>
          La clave generada es: 000
        </text>
      )}

      <Button size='small' className='mt-10' onClick={toggleModal}>
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
        <Counter
          showCounterModal={showCounterModal}
          MTDCount={MTDCount}
          currentShiftCount={currentShiftCount}
          prevShiftCount={prevShiftCount}
        />
      </Modal>
      <Row>
        <text className='text-xs mt-4'>Últimas claves generadas: </text>
      </Row>
      <Row>
        <text className='text-xs mt-2 h-2'>
          {lastKeys
            ? lastKeys.map((elem, index) =>
                index !== 0
                  ? index !== latsKeysLength
                    ? ` ${elem}, `
                    : ` ${elem} `
                  : ""
              )
            : null}
        </text>
      </Row>
    </div>
  );
};

export default DeviceCard;
