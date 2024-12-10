import themeFrame from '@/app/AdminPanel/tsx/ThemeFrame';
import useAdminPanelStore from '@/store/adminPanel';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material';
function FrameExpandableBlock() {
    const { frameRemainsSelectedWare, setFrameRemainsSidebarVisibility } = useAdminPanelStore();

    return (
        <ThemeProvider theme={themeFrame}>
            <Box sx={{ zIndex: 1000, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ textWrap: "wrap" }} variant="h6" gutterBottom>
                        Залишки на складах : {frameRemainsSelectedWare?.description}
                    </Typography>
                    <Button onClick={() => setFrameRemainsSidebarVisibility(false)}>Закрити</Button>
                </Box>
                <TableContainer component={Paper} sx={{ width: '100%' }} onBlur={() => setFrameRemainsSidebarVisibility(false)}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ fontWeight: 1000 }}>
                                <TableCell><Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>Склад</Typography></TableCell>
                                <TableCell align="right"><Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>Залишки</Typography></TableCell>
                                <TableCell align="right"><Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>Загальна сума</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {frameRemainsSelectedWare?.wareItems.map((wareItem) => (
                                <TableRow key={wareItem.id}>
                                    <TableCell>{wareItem.storage.shopName}</TableCell>
                                    <TableCell align="right">{wareItem.quantity}</TableCell>
                                    <TableCell align="right">{wareItem.totalSum}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow key={frameRemainsSelectedWare?.id} sx={{ fontWeight: 700 }}>
                                <TableCell><Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>Усього : </Typography></TableCell>
                                <TableCell align="right"><Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>{frameRemainsSelectedWare?.totalWareItemsQuantity}</Typography></TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>{frameRemainsSelectedWare?.totalWareItemsSum}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </ThemeProvider>
    );
}
export default FrameExpandableBlock;

