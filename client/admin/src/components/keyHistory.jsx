import { Button, Dropdown, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { devices } from "../App";

const KeyHistory = () => {
  const [tableData, setTableData] = useState([]);

  const { device } = useParams();

  const utcDifference = process.env.REACT_APP_UTC_DIF || 0;

  const getKeyHistory = async () => {
    const {
      data: { keyHistory },
    } = await axios.get(`${device}/key/history`);

    const processedData = keyHistory.map((row) => ({
      date: moment(row.createdAt)
        .subtract(utcDifference, "hours")
        .format("DD/MM/YYYY"),
      shift: moment(row.createdAt).hour() >= 14 ? "tarde" : "mañana",
      used: row.used,
    }));

    const countsTotal = {};
    const countsUnused = {};

    processedData.forEach((x) => {
      countsTotal[`${x.date}_${x.shift}`] =
        (countsTotal[`${x.date}_${x.shift}`] || 0) + 1;
      if (!x.used) {
        countsUnused[`${x.date}_${x.shift}`] =
          (countsUnused[`${x.date}_${x.shift}`] || 0) + 1;
      }
    });

    const orderedData = [];

    for (let row in countsTotal) {
      orderedData.push({
        fecha: row.split("_")[0],
        turno: row.split("_")[1],
        cant: countsTotal[row],
        cant_no_usada: countsUnused[row] || 0,
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
    {
      title: "Claves no usadas",
      dataIndex: "cant_no_usada",
    },
  ];

  const items = devices.map((elem) => ({
    key: elem.url,
    label: <a href={`/admin/history/${elem.url}`}>{elem.name}</a>,
  }));

  const name = devices.find((elem) => elem.url === device).name;

  return (
    <div>
      <div className='text-4xl m-6 text-blue-500 text-center font-bold'>
        YPF DUAL
      </div>
      <h1 className='text-blue-800 font-bold text-xl m-6'>
        Historial claves generadas
      </h1>
      <Dropdown
        menu={{
          items,
        }}
        placement='bottom'
        arrow
      >
        <Button>{name}</Button>
      </Dropdown>
      <div className='m-10'>
        <Table dataSource={tableData} columns={columns} />
      </div>
    </div>
  );
};

export default KeyHistory;
