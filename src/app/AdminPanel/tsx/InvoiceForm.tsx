import React from 'react';
import { TextField, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useInvoiceStore from '@/store/invoiceStore';

function InvoiceForm() {
    // Використовуємо Zustand store для доступу до rows та методів
    const { rows, addRow, removeRow, updateRow, clearRows } = useInvoiceStore();

    return (
        <div>
            {rows.map((row) => (
                <Box key={row.id} sx={{ display: 'flex', gap: '16px', alignItems: 'center', mb: 2 }}>
                    <TextField
                        label="Назва характеристики"
                        variant="outlined"
                        value={row.propertyName}
                        onChange={(e) => updateRow(row.id, 'propertyName', e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Значення характеристики"
                        variant="outlined"
                        value={row.propertyValue}
                        onChange={(e) => updateRow(row.id, 'propertyValue', e.target.value)}
                        fullWidth
                    />
                    <IconButton onClick={() => removeRow(row.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button
                variant="contained"
                color="primary"
                onClick={addRow}
                sx={{ mt: 2 }}
            >
                Додати рядок
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={clearRows}
                sx={{ mt: 2 }}
            >
                Очистити все
            </Button>
        </div>
    );
}

export default InvoiceForm;
