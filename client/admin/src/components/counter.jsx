import axios from "axios";
import { useEffect, useState } from "react";

const Counter = ()=> {

    const [count, setCount] = useState(0);

    console.log(count)

    useEffect(()=> {
        const countKeys = async () =>{
            let { data: { count } } = await axios.get("carwash/key/counter");
            console.log(count)
            setCount(count);
        }
        countKeys().catch(e => console.log(e))

    },[])

    return (
        <div className="mt-4">
            <div className='text-sm font-medium'>Aforo Acumulado</div>
            <text className='text-sm'>Turno actual:</text>
            <text className='text-sm'>Turno anterior:</text>
            <text className='text-sm'>Mes: {count}</text>
        </div>
    )
}

export default Counter;
