import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Додаємо стилі для редактора
import { Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useInvoiceStore from '@/store/invoiceStore';

function InvoiceForm() {
    // Використовуємо Zustand store для доступу до rows та методів
    const { rows, addRow, removeRow, updateRow, clearRows, wareDetails, setWareDetails } = useInvoiceStore();

    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
                <h4>Докладний опис товару</h4>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
                {/* Використовуємо react-quill для введення докладного опису товару */}
                <ReactQuill
                    value={wareDetails}
                    onChange={(value) => setWareDetails(value)}
                    placeholder="Введіть докладний опис товару..."
                    style={{
                        width: '100%', marginBottom: '50px'
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
                <h4>Характеристики товару</h4>
            </Box>
            {rows.map((row, index) => (
                <div style={{ display: "flex", flexDirection: "row", alignItems: "start" }} key={index}>
                    <Box key={row.id} sx={{ display: 'flex', gap: '16px', alignItems: 'stretch', mb: "50px", maxWidth: "75vw" }}>
                        {/* Використовуємо ReactQuill для редагування назви характеристики */}
                        <ReactQuill
                            value={row.propertyName}
                            onChange={(value) => updateRow(row.id, 'propertyName', value)}
                            placeholder="Назва характеристики"
                            style={{
                                width: 'clamp(150px,35vw,500px)',
                                //height: '100%',  // Задаємо висоту на 100% від доступної висоти
                                //border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                //overflowY: 'auto' // Додатково, щоб текст не виходив за межі
                            }}
                        />
                        {/* Використовуємо ReactQuill для редагування значення характеристики */}
                        <ReactQuill
                            value={row.propertyValue}
                            onChange={(value) => updateRow(row.id, 'propertyValue', value)}
                            placeholder="Значення характеристики"
                            style={{
                                width: 'clamp(150px,35vw,500px)',
                                //height: '100%',  // Задаємо висоту на 100% від доступної висоти
                                //border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                //overflowY: 'auto' // Додатково, щоб текст не виходив за межі
                            }}
                        />
                    </Box>
                    <IconButton onClick={() => removeRow(row.id)} color="error" sx={{ justifySelf: "self-start" }}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addRow}
                    sx={{ mt: 2 }}
                >
                    Додати рядок характеристик
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={clearRows}
                    sx={{ mt: 2 }}
                >
                    Очистити всі характеристики
                </Button>
                {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => console.log("rows", rows)}
                    sx={{ mt: 2 }}
                >
                    Вивести в консоль
                </Button> */}
            </Box>
        </div>
    );
}

export default InvoiceForm;
