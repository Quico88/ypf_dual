import { Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";

const KeyHistory = () => {
  const [tableData, setTableData] = useState([]);

  const getKeyHistory = async () => {
    const {
      data: { keyHistory },
    } = await axios.get("carwash/key/history");

    const processedData = keyHistory.map((row) =>
      moment(row.createdAt)
        .format("DD/MM/YYYY")
        .concat("_", moment(row.createdAt).hour() > 14 ? "tarde" : "mañana")
    );
    console.log("processedData", processedData);

    const counts = {};

    processedData.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
    });

    const orderedData = [];

    console.log("row: ", counts);

    for (let row in counts) {
      orderedData.push({
        fecha: row.split("_")[0],
        turno: row.split("_")[1],
        cant: counts[row],
      });
    }

    setTableData(orderedData);
  };

  useEffect(() => {
    getKeyHistory();
  }, []);

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
    },
    {
      title: "Turno",
      dataIndex: "turno",
    },
    {
      title: "Claves generadas",
      dataIndex: "cant",
    },
  ];

  return (
    <div>
      <h1 className='text-blue-800 font-bold text-xl m-6'>
        Historial claves generadas
      </h1>
      <div className='m-10'>
        <Table dataSource={tableData} columns={columns} />
      </div>
    </div>
  );
};

export default KeyHistory;
