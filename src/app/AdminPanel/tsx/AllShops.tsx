
import React, { useEffect, useState } from 'react';
import { Box, Button, circularProgressClasses, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import '../css/ShopsFrame.css'; // Імпортуємо CSS файл
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { getShops } from '@/pages/api/ShopApi';
import NewShop from './NewShop';

export default function AllShops() {
  const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
  const [activeNewShop, setActiveNewShop] = useQueryState("new-edit", { clearOnDefault:true, scroll: false, history: "push", shallow: true });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Стан для швидкого пошуку
  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 100,
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    city: false, // Приховуємо колонку "Місто"
    state: false, // Приховуємо колонку "Область"
    postalCode: false, // Приховуємо колонку "Поштовий індекс"
  });
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
          <Button sx={{ minWidth: "10px", padding: 0 }} title='Редагувати' variant="outlined" color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </Button>
          <Button sx={{ minWidth: "10px", padding: 0 }} title='Видалити' variant="outlined" color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  const handleEdit = (row) => {
    // Логіка для редагування
    console.log('Редагувати рядок:', row);
  };

  const handleDelete = (id) => {
    // Логіка для видалення
    console.log('Видалити рядок з ID:', id);
  };

  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const storages = await getShops({
          SearchParameter: "Query",
          PageNumber: 1,
          PageSize: 1000
        });
        setData(storages);
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
        <Button variant="contained" color="primary" onClick={() => { setActiveNewShop('0'); setActiveTab('addNewShop') }}>
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
    </Box>


  )
}
