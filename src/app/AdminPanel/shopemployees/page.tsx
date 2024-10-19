import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { green } from "@mui/material/colors";

export default function ShopEmployees() {
    const mockDataTeam = [
        {
          id: 1,
          name: "Jon Snow",
          email: "jonsnow@gmail.com",
          age: 35,
          phone: "(665)121-5454",
          access: "admin",
        },
        {
          id: 2,
          name: "Cersei Lannister",
          email: "cerseilannister@gmail.com",
          age: 42,
          phone: "(421)314-2288",
          access: "manager",
        },
        {
          id: 3,
          name: "Jaime Lannister",
          email: "jaimelannister@gmail.com",
          age: 45,
          phone: "(422)982-6739",
          access: "user",
        },
        {
          id: 4,
          name: "Anya Stark",
          email: "anyastark@gmail.com",
          age: 16,
          phone: "(921)425-6742",
          access: "admin",
        },
        {
          id: 5,
          name: "Daenerys Targaryen",
          email: "daenerystargaryen@gmail.com",
          age: 31,
          phone: "(421)445-1189",
          access: "user",
        },
        {
          id: 6,
          name: "Ever Melisandre",
          email: "evermelisandre@gmail.com",
          age: 150,
          phone: "(232)545-6483",
          access: "manager",
        },
        {
          id: 7,
          name: "Ferrara Clifford",
          email: "ferraraclifford@gmail.com",
          age: 44,
          phone: "(543)124-0123",
          access: "user",
        },
        {
          id: 8,
          name: "Rossini Frances",
          email: "rossinifrances@gmail.com",
          age: 36,
          phone: "(222)444-5555",
          access: "user",
        },
        {
          id: 9,
          name: "Harvey Roxie",
          email: "harveyroxie@gmail.com",
          age: 65,
          phone: "(444)555-6239",
          access: "admin",
        },
      ];
    const columns: GridColDef[] = [
        { field: "id", headerName: "ID" },
        {
          field: "name",
          headerName: "Name",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "age",
          headerName: "Age",
          type: "number",
          headerAlign: "left",
          align: "left",
        },
        {
          field: "phone",
          headerName: "Phone Number",
          flex: 1,
        },
        {
          field: "email",
          headerName: "Email",
          flex: 1,
        },
        {
          field: "accessLevel",
          headerName: "Access Level",
          flex: 1,
          renderCell: ({ row: { access } }) => {
            return (
              <Box
                width="60%"
                m="0 auto"
                p="5px"
                display="flex"
                justifyContent="center"
                color="white"
                sx={{
                    backgroundColor: '#4caf50', 
                    borderRadius: "4px"
                }}
                // backgroundColor={
                //    access === "admin"
                //     ? color: 
                   //  : access === "manager"
                //     ? colors.greenAccent[700]
                //     : colors.greenAccent[700]
                //}
              >
                {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
                {access === "manager" && <SecurityOutlinedIcon />}
                {access === "user" && <LockOpenOutlinedIcon />}
                <Typography color="white" sx={{ ml: "5px" }}>
                  {access}
                </Typography>
              </Box>
            );
          },
        },
      ];
  return (
    <Box m="20px">
        <Box m="40 0 0 0" height="75vh">
            <DataGrid rows={mockDataTeam} columns={columns} />
        </Box>
    </Box>
  )
}
