import React from 'react'
import { useState , useEffect , useCallback , useMemo} from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { Button } from 'reactstrap';


const Table = () => {
  const [item, setItem] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(()=>{
    const fecthAllParcel = async ()=>{
        try{
            const res = await axios.get("http://localhost:8081/users")
            console.log(res.data);
            setItem(res.data)
        }catch(err){
            console.log(err);
        }
    }
    fecthAllParcel()
  },[])

  const columns = [
    {
      name: "ID",selector: row => row.ParcelID,
      width: '50px'
    },
    {
      name: "Customer",selector: row => row.Name,
      width: '200px'
    },
    {
      name: "Tel.",selector: row => row.Tel,
      width: '200px'
    },
    {
      name: "Address",selector: row => row.Address,
      width: '400px'
    },
    {
      name: "PostalCode",selector: row => row.Postal_Code
    }
  ]

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
    console.log('Selected Rows:', state.selectedRows); // log แถวที่ถูกเลือก
  }, []);

  const contextActions = useMemo(() => {
    const handleSubmit = () => {
      // Submitting the selected rows without any dynamic filtering
      if (selectedRows.length > 0) {
        const selectedData = selectedRows.map(row => ({
          ParcelID: row.ParcelID,
          Address: row.Address,
          Postal_Code: row.Postal_Code
        }));
        console.log('Selected Data:', selectedData);

        axios.post('http://localhost:8081/your-api-endpoint', selectedData)
        .then(response => {
          console.log('Data submitted successfully:', response.data);

          // แสดงผลลัพธ์ของการค้นหาจาก Longdo API
          response.data.selectedData.forEach(item => {
            console.log(`ParcelID: ${item.ParcelID}, Address: ${item.Address}`);
            console.log('Geocoding Result:', item.geocodingResult);
          });
        })
        .catch(error => {
          console.error('Error submitting data:', error);
        });
      } else {
        alert('No rows selected!');
      }
    };

    return (
      <Button key="submit" onClick={handleSubmit} color="primary">
        Submit Selected
      </Button>
    );
  }, [selectedRows]);
  
  return (
    <div>
      <DataTable 
        title="Parcel List"
        columns={columns}
        data={item}
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        fixedHeader
        pagination
      />
    </div>
  )
}

export default Table