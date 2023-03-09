
import React, { useState, useEffect, useRef } from 'react';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import { useExportData } from "react-table-plugins";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

import { useTable } from 'react-table';
function App() {
  const [csvData, setCsvData] = useState([]);
  const [data, setData] = useState([]);
  const [columns, setColumn] = useState([]);
  
  const fetchData = async () => {

    try {
      const response = await axios.get(`https://api.devsrvofads.com/api/user?usertype=ADVERTISER`)
      console.log(response)
      console.log(response.data.data)
      setData(response.data.data)
      
      //   console.log(Object.keys(response.data.data[0]).map((key) => ({
      //     Header: key,
      //     accessor: key
      // }))
      setColumn(Object.keys(response.data.data[0]).map((key) => ({
        Header: key,
        accessor: key
      }))
      )


    } catch (err) {
      console.log(err)
    }
  }

  // setData(data);


  useEffect(() => {
    fetchData();
  }, []);
 
  console.log("column", columns)
  // const columns = React.useMemo(
  //   () => [
  //     {
  //       Header: 'user_id',
  //       accessor: 'user_id'
  //     },
  //     {
  //       Header: 'membership_code',
  //       accessor: 'membership_code'
  //     },
  //     {
  //       Header: 'fname',
  //       accessor: 'fname'
  //     },
  //     {
  //       Header: 'manager_name',
  //       accessor: 'manager_name'
  //     },
  //     {
  //       Header: 'email',
  //       accessor: 'email'
  //     },
  //     {
  //       Header: 'company_name',
  //       accessor: 'company_name'
  //     },

  //     {
  //       Header: 'group_name',
  //       accessor: 'group_name'
  //     },
  //     {
  //       Header: 'account_type',
  //       accessor: 'account_type'
  //     },
  //     {
  //       Header: 'created_at',
  //       accessor: 'created_at'
  //     },
  //     {
  //       Header: 'assigned_group',
  //       accessor: 'assigned_group'
  //     },
  //     {
  //       Header: 'is_setup_complete',
  //       accessor: 'is_setup_complete'
  //     },
  //     {
  //       Header: 'user_type',
  //       accessor: 'user_type'
  //     },
  //     {
  //       Header: 'active',
  //       accessor: 'active'
  //     },
  //     {
  //       Header: 'customer_type',
  //       accessor: 'customer_type'
  //     },
  //     {
  //       Header: 'available_balance',
  //       accessor: 'available_balance'
  //     },
  //   ],
  //   []
  // );


  // const column = [
  //   {
  //     Header: 'id',
  //     accessor: 'id'
  //   },
  //   {
  //     Header: 'label',
  //     accessor: 'label'
  //   },
  //   {
  //     Header: 'code',
  //     accessor: 'code'
  //   }
  // ];

  const handleExport = () => {
    setCsvData(data);
  };

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, allColumns } = tableInstance;
  const tableRef = useRef();

  const {

    // for export
    exportData
  } = useTable(
    {
      columns,
      data,
      getExportFileBlob
    },
    useExportData
  );

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "pdf") {
      console.log("col", columns)
      const headerNames = columns
        .filter((c) => c.Header != "Action")
        .map((column) => column.exportValue);

      const doc = new jsPDF();

      doc.autoTable({
        head: [headerNames],
        body: data,
        styles: {
          headStyles: {
            lineWidth: 0.1,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
            fontSize: 5,
            cellWidth: 'auto',
          },

          fontSize: 4,

          cellWidth: 'auto',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255]
        }
      });

      doc.save(`aa.pdf`);
    }
    return false;
  };
  return (
    <div className="App">
      <button className='border bg-green-600' onClick={handleExport}>
        <CSVLink data={csvData} filename="Countries.csv">
          <div className='flex p-2 text-white text-center transform motion-safe:hover:scale-105'>
            <div className='text-xl'>
              Export
            </div>
          </div>
        </CSVLink>
      </button>
      <button onClick={() => {
        exportData("pdf", true);
      }}>Export to PDF</button>

      <table {...getTableProps()} ref={tableRef}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>


    </div>
  );
}

export default App;
