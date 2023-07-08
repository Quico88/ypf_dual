import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row } from 'antd';
import moment from 'moment';

const Counter = (showCounterModal)=> {

    const [MTDCount, setMTDCount] = useState(0);
    const [currentShiftCount, setCurrentShiftCount] = useState(0);
    const [prevShiftCount, setPrevShiftCount] = useState(0);

    const SHIFTS = {
        morning: "Mañana",
        afternoon: "Tarde",
      };

      const hour = moment().hour();
      const currentShift = hour < 14 ? SHIFTS.morning : SHIFTS.afternoon;

    useEffect(()=> {
       if(showCounterModal){ const countKeys = async () =>{
            let { data: { MTDCount, currentShiftCount, prevShiftCount } } = await axios.get("carwash/key/counter");
            setMTDCount(MTDCount);
            setCurrentShiftCount(currentShiftCount);
            setPrevShiftCount(prevShiftCount);
        }
        countKeys().catch(e => console.log(e))
}
    },[showCounterModal])

    return (
        <Row className="mt-2 flex flex-col justify-center items-center border-2 border-blue-200 rounded-lg">
            {/* <Col className='text-sm font-semibold'>Aforo Acumulado</Col> */}
            <Row className='m-2 text-sm font-semibold'>Turno: {currentShift}</Row>    
            <Row>           
                <Col className="m-4 flex flex-col justify-center items-center">
                    <Row className='text-sm font-medium'>Turno actual</Row>
                    <Row>{currentShiftCount}</Row>
                </Col>
                <Col className="mx-4 flex flex-col justify-center items-center">
                    <Row className='text-sm font-medium'>Turno anterior</Row>
                    <Row>{prevShiftCount}</Row>
                </Col>
                <Col className="mx-4 flex flex-col justify-center items-center">
                    <Row className='text-sm font-medium'>Mes</Row>
                    <Row>{MTDCount}</Row>
                </Col>
            </Row>

        </Row>
    )
}

export default Counter;
