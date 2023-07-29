import { devices } from "../App";
import DeviceCard from "./deviceCard";

const CardContainer = () => {
  return (
    <div className='flex flex-wrap justify-center items-center h-full w-full'>
      {devices.map((device, index) => (
        <DeviceCard key={index} name={device.name} url={device.url} />
      ))}
    </div>
  );
};

export default CardContainer;
