
import React, { useEffect, useState } from 'react';
import { Box, Button, circularProgressClasses, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import '../css/ShopsFrame.css'; // Імпортуємо CSS файл
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { deleteShop, getShops } from '@/pages/api/ShopApi';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import useAdminPanelStore from '@/store/adminPanel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00AAAD',
      contrastText: 'white',
    },
  },
});

export default function AllShops() {
  const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
  const [activeNewShop, setActiveNewShop] = useQueryState("new-edit", { clearOnDefault: true, scroll: false, history: "push", shallow: true });
  const [data, setData] = useState<any | null>([]);
  const [loading, setLoading] = useState(true);
  const { shopId, setShopId } = useAdminPanelStore();

  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 100,
  });

  const [searchTerm, setSearchTerm] = useState(''); // Стан для швидкого пошуку

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    city: false, // Приховуємо колонку "Місто"
    state: false, // Приховуємо колонку "Область"
    postalCode: false, // Приховуємо колонку "Поштовий індекс"
  });

  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const apiRef = useGridApiRef();

  // Функція для форматування значення
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    const roundedValue = Math.round(value * 100) / 100;
    return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
  };

  // Фільтрація даних на основі швидкого пошуку
  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  const handleDelete = (row) => {
    // Встановлюємо рядок для видалення та відкриваємо діалог
    console.log("row", row);
    setSelectedRow(row);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRow) {
      console.log("selectedRow", selectedRow);
      await deleteShop(selectedRow.id);
      setIsDialogOpen(false);
      // Оновлюємо список магазинів після видалення
      setData((prevData) => prevData.filter((item) => item.id !== selectedRow.id));
      toast.info('Склад успішно видалено!');
    }
  };

  // Створюємо масив колонок з перекладеними назвами
  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
    { field: 'name', headerName: 'Назва магазину', flex: 1, minWidth: 200 },
    { field: 'state', headerName: 'Область', flex: 1, minWidth: 150 },
    { field: 'city', headerName: 'Місто', flex: 0.8, minWidth: 150 },
    { field: 'street', headerName: 'Вулиця', flex: 1, minWidth: 150 },
    { field: 'houseNumber', headerName: '№ буд.', flex: 0.3, minWidth: 100 },
    { field: 'postalCode', headerName: 'Поштовий індекс', flex: 1, minWidth: 150 },
    {
      field: 'executedOrdersSum',
      headerName: 'Заг. сума товарів',
      flex: 0.5,
      cellClassName: 'text-right',
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'actions',
      headerName: 'Дії',
      flex: 0.5,
      minWidth: 175,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "5px", height: "100%" }}>

          <Button sx={{ minWidth: "10px", padding: 0, color: "#00AAAD" }} title='Редагувати' variant="outlined" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </Button>
          <Button sx={{ minWidth: "10px", padding: 0, color: '#be0f0f' }} title='Видалити' variant="outlined" color="secondary" onClick={() => handleDelete(params.row)}>

            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  const handleEdit = (row) => {
    setShopId(row.id);
    console.log("row.id :", row.id)
    setActiveTab("addNewShop"); // Змінюємо активну вкладку
  };

  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const storages = await getShops({
          SearchParameter: "Query",
          PageNumber: 1,

          PageSize: 150
        });
        setData(storages);
        setActiveNewShop(null);

      } catch (error) {
        console.error('Error fetching storage data:', error);
      } finally {
        setLoading(false);
      }
    };
    console.log(activeTab);
    fetchStorages();
  }, []);


  useEffect(() => {
    console.log(data)
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Магазини
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <TextField
            label="Швидкий пошук"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Оновлюємо стан для швидкого пошуку
          />
          <Button sx={{ backgroundColor: "#00AAAD" }} variant="contained" onClick={() => { setActiveNewShop('0'); setActiveTab('addNewShop') }}>
            Додати
          </Button>
        </Box>
        <Box sx={{ overflowX: 'auto' }} height="80vh"> {/* Додаємо прокрутку при переповненні */}
          <DataGrid
            rows={filteredData} // Використовуємо відфільтровані дані
            columns={columns}
            apiRef={apiRef}
            loading={loading}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            columnVisibilityModel={columnVisibilityModel} // Додаємо модель видимості колонок
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)} // Оновлюємо стан видимості колонок
            localeText={{
              filterOperatorContains: 'Містить',
              filterOperatorDoesNotContain: 'Не містить',
              filterOperatorEquals: 'Дорівнює',
              filterOperatorDoesNotEqual: 'Не дорівнює',
              filterOperatorStartsWith: 'Починається з',
              filterOperatorIsAnyOf: 'Є одним з',
              filterOperatorEndsWith: 'Закінчується на',
              filterOperatorIs: 'Дорівнює',
              filterOperatorNot: 'Не дорівнює',
              filterOperatorAfter: 'Після',
              filterOperatorOnOrAfter: 'Після або в цей день',
              filterOperatorBefore: 'До',
              filterOperatorOnOrBefore: 'До або в цей день',
              filterOperatorIsEmpty: 'Пусто',
              filterOperatorIsNotEmpty: 'Не пусто',
              columnMenuLabel: 'Меню стовпця',
              columnMenuShowColumns: 'Показати стовпці',
              columnMenuFilter: 'Фільтр',
              columnMenuHideColumn: 'Приховати стовпець',
              columnMenuUnsort: 'Скасувати сортування',
              columnMenuSortAsc: 'Сортувати за зростанням',
              columnMenuSortDesc: 'Сортувати за спаданням',
              toolbarDensity: 'Щільність',
              toolbarDensityLabel: 'Щільність',
              toolbarDensityCompact: 'Компактно',
              toolbarDensityStandard: 'Стандарт',
              toolbarDensityComfortable: 'Комфортно',
              toolbarColumns: 'Стовпці',
              toolbarColumnsLabel: 'Вибрати стовпці',
              toolbarFilters: 'Фільтри',
              toolbarFiltersLabel: 'Показати фільтри',
              toolbarFiltersTooltipHide: 'Сховати фільтри',
              toolbarFiltersTooltipShow: 'Показати фільтри',
              toolbarExport: 'Експорт',
              toolbarExportLabel: 'Експорт',
              toolbarExportCSV: 'Завантажити як CSV',
              toolbarExportPrint: 'Друк',
              noRowsLabel: 'Немає даних',
              noResultsOverlayLabel: 'Результатів не знайдено',
              footerRowSelected: (count) => `Вибрано рядків: ${count}`,
              MuiTablePagination: {
                labelRowsPerPage: 'Рядків на сторінці',
              },
            }}
          />
        </Box>

        <ConfirmationDialog
          title="Видалити магазин?"
          contentText={
            selectedRow
              ? `Ви справді хочете видалити цей магазин? : 
            ${selectedRow.name && `${selectedRow.name},`} 
            ${selectedRow.state && `${selectedRow.state},`} 
                    ${selectedRow.city && `${selectedRow.city},`} 
                    ${selectedRow.street && `${selectedRow.street},`}
                    ${selectedRow.houseNumber && `${selectedRow.houseNumber},`}
                    ${selectedRow.postalCode && `${selectedRow.postalCode}`}`
              : ''
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDialogOpen(false)}
          confirmButtonColor='#be0f0f'
          cancelButtonColor='#00AAAD'
          open={isDialogOpen}
        />

      </Box>
    </ThemeProvider>

  )
}
