
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { useDeleteShop, useShops } from '@/pages/api/ShopApi';
import useAdminPanelStore from '@/store/adminPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, TextField, ThemeProvider, Typography } from '@mui/material';
import { DataGrid, GridColumnVisibilityModel, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { useState } from 'react';
import { toast } from 'react-toastify';
import '../css/ShopsFrame.css'; // Імпортуємо CSS файл
import themeFrame from './ThemeFrame';

export default function FrameShop({ rolePermissions }) {
  const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
  const { data: data = [], isLoading: loading } = useShops({
    SearchParameter: "Query",
    PageNumber: 1,
    PageSize: 150,
  });

  const { mutateAsync: deleteShop } = useDeleteShop();
  const { setShopId } = useAdminPanelStore();

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
      toast.info('Склад успішно видалено!');
    }
  };

  // Створюємо масив колонок з перекладеними назвами
  let columns = [
    { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
    { field: 'name', headerName: 'Назва магазину', flex: 1, minWidth: 200 },
    { field: 'state', headerName: 'Область', flex: 1, minWidth: 150 },
    { field: 'city', headerName: 'Місто', flex: 0.8, minWidth: 150 },
    { field: 'street', headerName: 'Вулиця', flex: 1, minWidth: 150 },
    { field: 'houseNumber', headerName: '№ буд.', flex: 0.3, minWidth: 100 },
    { field: 'postalCode', headerName: 'Поштовий індекс', flex: 1, minWidth: 150 },
    {
      field: 'executedOrdersSum',
      headerName: 'Заг. сума виконаних замовлень',
      flex: 0.5,
      cellClassName: 'text-right',
      renderCell: (params) => {
        if (rolePermissions.canReadShopExecutedOrdersSum(params.row.id)) {
          return formatCurrency(params.value)
        }
        else {
          return null;
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Дії',
      flex: 0,
      width: 75,
      renderCell: (params) => {
        if (rolePermissions.IsFrameShops_Button_EditShop_Available || rolePermissions.IsFrameShops_Button_DeleteShop_Available) {
          return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "5px", height: "100%" }}>
            {rolePermissions.IsFrameShops_Button_EditShop_Available && rolePermissions.canEditShopAsAdmin(params.row.id) &&
              <Button sx={{ minWidth: "10px", padding: 0, color: "#00AAAD" }} title='Редагувати' variant="outlined" onClick={() => handleEdit(params.row)}>
                <EditIcon />
              </Button>}
            {rolePermissions.IsFrameShops_Button_DeleteShop_Available &&
              <Button sx={{ minWidth: "10px", padding: 0, color: '#be0f0f' }} title='Видалити' variant="outlined" color="secondary" onClick={() => handleDelete(params.row)}>
                <DeleteIcon />
              </Button>}
          </Box>
        }
        else {
          return null;
        }
      },
    },
  ];
  if (!rolePermissions.IsFrameShops_Cell_ExecutedOrdersSum_Available) {
    columns = columns.filter((column) => column.field !== 'executedOrdersSum');
  }
  if (!rolePermissions.IsFrameShops_Cell_Actions_Available) {
    columns = columns.filter((column) => column.field !== 'actions');
  }
  const handleEdit = (row) => {
    setShopId(row.id);
    console.log("row.id :", row.id)
    setActiveTab("addNewShop"); // Змінюємо активну вкладку
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ThemeProvider theme={themeFrame}>
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
          {rolePermissions.IsFrameShops_Button_AddShop_Available && <Button sx={{ backgroundColor: "#00AAAD" }} variant="contained" onClick={() => {
            setShopId(0); setActiveTab('addNewShop')
          }}>
            Додати
          </Button>}
        </Box>
        <Box sx={{ overflowX: 'auto', maxWidth: process.env.NEXT_PUBLIC_ADMINPANEL_BOX_DATAGRID_MAXWIDTH }} height="80vh"> {/* Додаємо прокрутку при переповненні */}
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
      </ThemeProvider>
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
        confirmButtonBackgroundColor='#be0f0f'
        confirmButtonBorderColor='#be0f0f'
        confirmButtonColor='#fff'
        cancelButtonBackgroundColor='#fff'
        cancelButtonBorderColor='#00AAAD'
        cancelButtonColor='#00AAAD'
        open={isDialogOpen}
      />
    </Box>
  )
}
