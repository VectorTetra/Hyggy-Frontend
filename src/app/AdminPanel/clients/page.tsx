"use client"

import axios from 'axios';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridToolbar  } from '@mui/x-data-grid';
//import { color } from '@mui/system';

export type Customer = {
  id: string;
  name: string;
  surname: string;
  email: string;
  
}
const Clients = () => {
    const [paginationModel, setPaginationModel] = React.useState({
        page: 1,
        pageSize: 5,
      });
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [sort, setSort] = useState([{}]);
    const [search, setSearch] = useState('');


    useEffect(() => {
    axios.get(`https://localhost:7288/api/Customer?SearchParameter=GetPaged&PageNumber=${paginationModel.page}&PageSize=${paginationModel.pageSize}`).then( response => {
            setCustomers(response.data);
        });
    },[paginationModel])
    
    useEffect(() => {
        console.log(customers)
    },[customers])

    const columns: GridColDef[] = [
        {
        field: "id",
        headerName: "Номер",
        flex: 1
        },
        {
            field: "name",
            headerName: "Ім'я",
            flex: 1
        },
        {
            field: "surname",
            headerName: "Прізвище",
            flex: 1
        },
        {
            field: "email",
            headerName: "Пошта",
            flex: 1
        }
    ]
  return (
    <Box m="1.5rem 2.5rem">
        <h1 className="text-xl uppercase text-gray-500">Клієнти</h1>
        <Box height="80vh">
            <DataGrid 
            
            slots={{
                toolbar: GridToolbar,
              }}
                getRowId={(row) => row.id}
                rows={(customers) || []}
                columns={columns}
                pageSizeOptions={[5, 10, 15, 20]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                
             />
        </Box>
    </Box>
  )
}

export default Clients