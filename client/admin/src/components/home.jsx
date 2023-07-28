import CardContainer from "./cardContainer";

function Home() {
  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <div className='text-4xl m-6 text-blue-500 text-center font-bold'>
        YPF DUAL
      </div>
      <CardContainer />
    </div>
  );
}

export default Home;
