"use client";
import { useState } from "react";
import blogData from "../json/blog.json";
import { Box, Button, CssBaseline, TextField, MenuItem, Select, InputLabel, FormControl, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBlog, setSelectedBlog] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [data, setData] = useState(blogData.blogData);

    // Обработка поиска и фильтрации
    const filteredData = data.filter((item) => {
        return (
            (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                !searchQuery) &&
            (item.category === selectedCategory || !selectedCategory) &&
            (item.title === selectedBlog || !selectedBlog)
        );
    });

    // Функции для удаления и редактирования
    const handleDelete = (id: number) => {
        setData(data.filter((item) => item.id !== id));
    };

    const handleEdit = (id: number) => {
        console.log(`Редактировать запись с ID: ${id}`);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >
                <Typography variant="h3" gutterBottom>
                    Блог
                </Typography>

                {/* Строка поиска и фильтр */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        mb: 3,
                    }}
                >
                    {/* Поле поиска */}
                    <TextField
                        label="Поиск"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ width: { xs: "100%", md: "500px" }, mb: { xs: 2, md: 0 }, mr: { md: 3 } }}
                    />

                    {/* Фильтры */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {/* Фильтр по названию блога */}
                        <FormControl sx={{ minWidth: { xs: "100%", md: 250 } }}>
                            <InputLabel>Название блога</InputLabel>
                            <Select
                                value={selectedBlog}
                                onChange={(e) => setSelectedBlog(e.target.value)}
                                label="Название блога"
                            >
                                <MenuItem value="">
                                    <em>Все</em>
                                </MenuItem>
                                {data.map((item) => (
                                    <MenuItem key={item.id} value={item.title}>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Фильтр по категории */}
                        <FormControl sx={{ minWidth: { xs: "100%", md: 250 } }}>
                            <InputLabel>Категория</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                label="Категория"
                            >
                                <MenuItem value="">
                                    <em>Все</em>
                                </MenuItem>
                                {Array.from(new Set(data.map((item) => item.category))).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Таблица с блогами */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    borderBottom: '2px solid #696969',
                                    '&:last-child td, &:last-child th': { border: 0 },
                                }}
                            >
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }}>Название блога</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }}>Категория</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }} align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        borderBottom: '2px solid #696969',
                                        '&:last-child td, &:last-child th': { border: 0 },
                                    }}
                                >
                                    <TableCell sx={{ padding: '8px' }}>{row.title}</TableCell>
                                    <TableCell sx={{ padding: '8px' }}>{row.category}</TableCell>
                                    <TableCell sx={{ padding: '8px' }} align="right">
                                        <IconButton aria-label="edit" onClick={() => handleEdit(row.id)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}
