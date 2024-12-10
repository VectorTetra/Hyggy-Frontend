import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColumnVisibilityModel, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useQueryState } from 'nuqs';
import { useDebounce } from 'use-debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { useWareItems, useCreateWareItem, useUpdateWareItem, useDeleteWareItem } from '@/pages/api/WareItemApi';
import SearchField from './SearchField';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import useAdminPanelStore from '@/store/adminPanel';
import '../css/WarehouseFrame.css';

export default function FrameSupply() {
    const { mutate: deleteWareItem } = useDeleteWareItem();
    const { data: wareItems = [], isLoading: dataLoading, isSuccess: success } = useWareItems({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
    }, true);

    const [filteredData, setFilteredData] = useState<any | null>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
    const [loading, setLoading] = useState(true);

    const { setWarehouseId } = useAdminPanelStore();
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        id: false,
        storageId: false,
    });
    const apiRef = useGridApiRef();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            minWidth: 50,
        },
        {
            field: 'wareId',
            headerName: 'ID Товара',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storageId',
            headerName: 'ID Складу',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'quantity',
            headerName: 'Кількість',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'actions',
            headerName: 'Дії',
            flex: 0,
            width: 100,
            disableExport: true,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "5px", height: "100%" }}>
                    <Button sx={{ minWidth: "10px", padding: 0 }} title='Редагувати' variant="outlined" color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </Button>
                    <Button sx={{ minWidth: "10px", padding: 0 }} title='Видалити' variant="outlined" color="secondary" onClick={() => handleDelete(params.row)}>
                        <DeleteIcon />
                    </Button>
                </Box>
            ),
        },
    ];

    const handleEdit = (row) => {
        setWarehouseId(row.id);
        // Если нужно редактировать запись
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedRow) {
            deleteWareItem(selectedRow.id, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.info('Поставку успішно видалено!');
                },
            });
        }
    };

    useEffect(() => {
        if (success) {
            setFilteredData(wareItems);
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [wareItems]);

    useEffect(() => {
        const fetchFilteredData = () => {
            setLoading(true);
            if (debouncedSearchTerm) {
                const filteredItems = wareItems.filter(item =>
                    Object.values(item).some(value =>
                        typeof value === 'string' && value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                    )
                );
                setFilteredData(filteredItems);
            } else {
                setFilteredData(wareItems);
            }
            setLoading(false);
        };

        fetchFilteredData();
    }, [debouncedSearchTerm]);

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'normal',
                marginBottom: '1rem',
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: 1,
                width: "100%",
                padding: '0'
            }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Постачання : {loading ? <CircularProgress size={24} /> : filteredData.length}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <SearchField
                        searchTerm={searchTerm}
                        onSearchChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <Button variant="contained" onClick={() => {
                        setWarehouseId(0);
                        // Открытие формы для добавления новой поставки
                    }}>
                        Додати
                    </Button>
                </Box>
            </Box>

            <Box className="dataGridContainer" sx={{ flexGrow: 1 }} height="80vh" width="100%" overflow="auto">
                {filteredData.length === 0 && !loading && success ? (
                    <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
                        Нічого не знайдено
                    </Typography>
                ) : (
                    <DataGrid
                        className="dataGrid"
                        rows={filteredData}
                        columns={columns}
                        apiRef={apiRef}
                        loading={loading || dataLoading}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 100,
                                    page: 0,
                                },
                            },
                            sorting: {
                                sortModel: [{ field: 'wareId', sort: 'asc' }],
                            },
                        }}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        disableRowSelectionOnClick
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                csvOptions: { fileName: 'Постачання', delimiter: ';', utf8WithBom: true },
                                printOptions: { hideFooter: true, hideToolbar: true },
                            },
                        }}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                    />
                )}
            </Box>

            <ConfirmationDialog
                title="Видалити постачання?"
                contentText={selectedRow ? `Ви справді хочете видалити це постачання?` : ''}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDialogOpen(false)}
                confirmButtonColor='#be0f0f'
                cancelButtonColor='#248922'
                open={isDialogOpen}
            />
        </Box>
    );
}
