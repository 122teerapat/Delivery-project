import React from 'react'
import { useState , useEffect } from 'react'
import axios from 'axios'
import Table from './Table'


const Home = () => {
    const [parcels,setParcels] = useState([])

    useEffect(()=>{
        const fecthAllParcel = async ()=>{
            try{
                const res = await axios.get("http://localhost:8081/users")
                setParcels(res.data);
            }catch(err){
                console.log(err);
            }
        }
       fecthAllParcel()
    },[])

    return (
        <div>
            <h1>Home</h1>
            <div>
                <Table></Table>
            </div>
        </div>
    )
}

export default Home