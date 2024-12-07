import React, { useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function FrameExpandableBlock({ storages }) {
    const filteredStorages = storages.filter((storage) => storage.quantity > 0);

    return (
        <TableContainer component={Paper} sx={{ width: '100%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Склад</TableCell>
                        <TableCell align="right">Залишки</TableCell>
                        <TableCell align="right">Загальна сума</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredStorages.map((storage) => (
                        <TableRow key={storage.id}>
                            <TableCell>{storage.name}</TableCell>
                            <TableCell align="right">{storage.quantity}</TableCell>
                            <TableCell align="right">{storage.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default FrameExpandableBlock;

