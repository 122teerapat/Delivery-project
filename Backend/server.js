const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const app = express()
const axios = require('axios')

app.use(cors())

app.use(express.json())
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password:'mydb101',
    database: 'delivery_db'
})


app.get('/', (re, res)=> {
    return res.json("From Backend Side");
})

app.post('/your-api-endpoint', async (req, res) => {
    const selectedData = req.body; // Data sent from client
    console.log('Received selected data:', selectedData);
    
    try {
        // สร้าง array สำหรับการร้องขอ Longdo API สำหรับแต่ละที่อยู่
        const requests = selectedData.map(async (data) => {
            const address = '618/4 หมู่บ้าน q prime ซอย อ่อนนุช 46 เขตสวนหลวง 10250';
            const longdoUrl = `https://search.longdo.com/addresslookup/api/addr/geocoding?text=${encodeURIComponent(address)}&key=cc745901eb8217cb6ebb62d653d95305`;

            const response = await axios.get(longdoUrl);
            return {
            ParcelID: data.ParcelID,
            Address: data.Address,
            Postal_Code: data.Postal_Code,
            geocodingResult: response.data.data[0].point[0], // ส่งผลลัพธ์จาก API
            };
        });

        // รอให้ทุกคำขอเสร็จสิ้น
        const results = await Promise.all(requests);

        // ส่งผลลัพธ์ทั้งหมดกลับไปที่ client
        res.json({
            message: 'Data received successfully',
            selectedData: results, // รวมผลลัพธ์ของแต่ละที่อยู่
        });
    } catch (error) {
    console.error('Error fetching data from Longdo API:', error);
    res.status(500).json({ message: 'Error fetching data from Longdo API', error: error.message });
    }
    
});


app.get('/users' , (req, res)=>{
    const q = `SELECT Parcel.ParcelID, CONCAT(Fname,' ', Lname) AS Name  , Customer.Tel ,CONCAT(Address_line1,' ', Address_line2,' ',City) AS Address , Postal_Code 
                FROM ((Parcel
                INNER JOIN Address ON Parcel.AddressID = Address.AddressID)
                INNER JOIN Customer ON Parcel.CustomerID = Customer.CustomerID);`;
    db.query(q, (err , data)=> {
       
        if(err) return res.json(err); 
        return res.json(data);
    })
})

app.post('/parcel' , (req, res)=>{
    const parcelCreate = "INSERT INTO Parcel(ParcelID, Width, Height, Length, Weight, Price) VALUES (?)"
    
    const values = [
        req.body.ParcelID,
        req.body.Width,
        req.body.Height,
        req.body.Length,
        req.body.Weight,
        req.body.Price
    ];

    if (!values[0]) {
        return res.status(400).json({
            error: 'Missing required fields (ParcelID, CustomerID, or AddressID)'
        });
    }

    db.query(parcelCreate,[values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("Parcel have been created")
    })
})



app.listen(8081, ()=> {
    console.log("listening")
})