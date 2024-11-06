import React, { useEffect }  from "react";
import Nevbar from "./components/Nevbar";
import Home from "./components/Home";
import Add from "./components/Add";
import Table from "./components/Table";

import{
  BrowserRouter,
  Routes,
  Route,
}from "react-router-dom"


function App(){
  

  return(
    <div>
      <Nevbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/add" element={<Add/>}/>
          <Route path="/data" element={<Table/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App