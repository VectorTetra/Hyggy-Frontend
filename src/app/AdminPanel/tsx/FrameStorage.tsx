import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { useDeleteStorage, useStorages } from '@/pages/api/StorageApi';
import useAdminPanelStore from '@/store/adminPanel'; // Імпортуємо Zustand
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColumnVisibilityModel, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import '../css/WarehouseFrame.css';
import SearchField from './SearchField';
//import { useQueryClient } from 'react-query';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#00AAAD',
			contrastText: 'white',
		},
	},
});

export default function FrameStorage() {
	const { mutate: deleteStorage } = useDeleteStorage();
	//const queryClient = useQueryClient();
	const { data: data = [], isLoading: dataLoading, isSuccess: success } = useStorages({
		SearchParameter: "Query",
		PageNumber: 1,
		PageSize: 1000
	});

	const [filteredData, setFilteredData] = useState<any | null>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
	const [loading, setLoading] = useState(true);

	const { warehouseId, setWarehouseId } = useAdminPanelStore();
	const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
	const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
		id: false,
		state: false,
		postalCode: false,
	});
	const apiRef = useGridApiRef();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any | null>(null);

	const columns = [
		{
			field: 'id',
			headerName: 'ID',
			minWidth: 50,
			renderCell: (params) => (
				<Typography
					variant="body2"
					title={params.value}
					sx={{
						display: "flex",
						alignItems: "center",
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '100%',
						height: "100%",
					}}
				>
					{params.value}
				</Typography>
			),
		},
		{
			field: 'shopName',
			headerName: 'Назва магазину',
			flex: 2,
			minWidth: 300,
			renderCell: (params) => {
				if (params.value === "-> (Загальний склад)") {
					return (
						<Typography
							variant="body2"
							title={params.value}
							sx={{
								fontStyle: 'italic',
								color: 'blue',
								display: "flex",
								alignItems: "center",
								height: "100%",
							}}
						>
							{params.value}
						</Typography>
					);
				}
				return (
					<Typography
						variant="body2"
						title={params.value}
						sx={{
							display: "flex",
							alignItems: "center",
							height: "100%",
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							maxWidth: '100%',
						}}
					>
						{params.value}
					</Typography>
				);
			},
		},
		{
			field: 'state',
			headerName: 'Область',
			flex: 1,
			minWidth: 150,
			renderCell: (params) => (
				<Typography
					variant="body2"
					title={params.value}
					sx={{
						display: "flex",
						alignItems: "center",
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '100%',
						height: "100%",
					}}
				>
					{params.value}
				</Typography>
			),
		},
		{
			field: 'city',
			headerName: 'Місто',
			flex: 0.8,
			minWidth: 150,
			renderCell: (params) => (
				<Typography
					variant="body2"
					title={params.value}
					sx={{
						display: "flex",
						alignItems: "center",
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '100%',
						height: "100%",
					}}
				>
					{params.value}
				</Typography>
			),
		},
		{
			field: 'street',
			headerName: 'Вулиця',
			flex: 1,
			minWidth: 250,
			renderCell: (params) => (
				<Typography
					variant="body2"
					title={params.value}
					sx={{
						display: "flex",
						alignItems: "center",
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '100%',
						height: "100%",
					}}
				>
					{params.value}
				</Typography>
			),
		},
		{
			field: 'houseNumber',
			headerName: '№ буд.',
			flex: 0.3,
			minWidth: 100,
			renderCell: (params) => (
				<Typography
					variant="body2"
					title={params.value}
					sx={{
						display: "flex",
						alignItems: "center",
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '100%',
						height: "100%",
					}}
				>
					{params.value}
				</Typography>
			),
		},
		{
			field: 'postalCode',
			headerName: 'Поштовий індекс',
			flex: 1,
			minWidth: 150,
			renderCell: (params) => (
				<Typography
					variant="body2"
					title={params.value}
					sx={{
						display: "flex",
						alignItems: "center",
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '100%',
						height: "100%",
					}}
				>
					{params.value}
				</Typography>
			),
		},
		{
			field: 'storedWaresSum',
			headerName: 'Заг. сума товарів',
			flex: 1.5,
			cellClassName: 'text-right',
			renderCell: (params) => formatCurrency(params.value),
		},
		{
			field: 'actions',
			headerName: 'Дії',
			flex: 0,
			width: 75,
			disableExport: true,
			renderCell: (params) => (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "5px", height: "100%" }}>
					<Button sx={{ minWidth: "10px", padding: 0, color: "#00AAAD" }} title='Редагувати' variant="outlined" onClick={() => handleEdit(params.row)}>
						<EditIcon />
					</Button>
					<Button sx={{ minWidth: "10px", padding: 0, color: '#be0f0f', borderColor: '#be0f0f' }} title='Видалити' variant="outlined" onClick={() => handleDelete(params.row)}>
						<DeleteIcon />
					</Button>
				</Box>
			),
		},
	];


	const formatCurrency = (value) => {
		if (value === null || value === undefined) return '';
		const roundedValue = Math.round(value * 100) / 100;
		return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
	};

	const handleEdit = (row) => {
		// Встановлюємо warehouseId для редагування обраного складу
		setWarehouseId(row.id); // Встановлюємо Id складу для редагування
		console.log("row.id :", row.id)
		setActiveTab("addEditWarehouse"); // Змінюємо активну вкладку
	};

	const handleDelete = (row) => {
		// Встановлюємо рядок для видалення та відкриваємо діалог
		console.log("row", row);
		setSelectedRow(row);
		setIsDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (selectedRow) {
			console.log("selectedRow", selectedRow);
			deleteStorage(selectedRow.id, {
				onSuccess: () => {
					setIsDialogOpen(false);
					toast.info('Склад успішно видалено!');
					// Якщо потрібно оновити локальний стан:
					// setData((prevData) => prevData.filter((item) => item.id !== selectedRow.id));
				}
			});
		}
	};

	useEffect(() => {
		// if (data.length === 0)
		// 	queryClient.invalidateQueries('storages');
		if (success) {
			setFilteredData(data);
			setLoading(false);
		}
		else {
			setLoading(true);
		}
	}, [data]);


	useEffect(() => {
		const fetchFilteredData = () => {
			setLoading(true);
			try {
				//if (data.length === 0) { toast.error('data не ініціалізована!'); return; }
				if (debouncedSearchTerm) {
					// Фільтруємо дані локально по будь-якому полю
					const filteredStorages = data.filter(item =>
						Object.values(item).some(value =>
							// Перевіряємо, чи є значення строкою та чи містить воно термін пошуку
							typeof value === 'string' && value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
						)
					);
					setFilteredData(filteredStorages); // Оновлюємо відфільтровані дані
					//toast.info('Встановлено filteredStorages!');
				} else {
					setFilteredData(data); // Якщо немає терміна пошуку, використовуємо всі дані
					console.log(data);
					//toast.info('Встановлено data!');
				}
			} catch (error) {
				console.error('Error filtering data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchFilteredData();
	}, [debouncedSearchTerm]);


	return (
		<ThemeProvider theme={theme}>
			<Box>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					alignItems: 'normal',
					marginBottom: '1rem',
					position: 'sticky', // Фіксована позиція
					top: 0, // Залишається зверху
					left: 0,
					//backgroundColor: 'white', // Задаємо фон, щоб панель не зливалась із DataGrid
					zIndex: 1, // Вищий z-index, щоб бути поверх DataGrid
					width: "100%",
					padding: '0' // Додаємо відступи для панелі
				}}>
					<Typography variant="h5" sx={{ marginBottom: 2 }}>
						Склади : {loading ? <CircularProgress size={24} /> : filteredData.length}
					</Typography>
					<Box sx={{
						display: 'flex',
						justifyContent: 'space-between',
					}}>
						<SearchField
							searchTerm={searchTerm}
							onSearchChange={(event) => setSearchTerm(event.target.value)}
						/>
						<Button variant="contained" sx={{ backgroundColor: "#00AAAD" }} onClick={() => {
							setWarehouseId(0);
							setActiveTab("addEditWarehouse");
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
									sortModel: [
										{
											field: 'shopName',
											sort: 'asc', // 'asc' для зростання або 'desc' для спадання
										},
									],
								},
							}}
							pageSizeOptions={[5, 10, 25, 50, 100]}
							disableRowSelectionOnClick
							slots={{
								toolbar: GridToolbar

							}}
							slotProps={{
								toolbar: {
									csvOptions: {
										fileName: 'Склади',
										delimiter: ';',
										utf8WithBom: true,
									},
									printOptions: {
										hideFooter: true,
										hideToolbar: true,
									},
								},
							}}
							columnVisibilityModel={columnVisibilityModel}
							onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
							localeText={{
								MuiTablePagination: { labelRowsPerPage: 'Рядків на сторінці' },
								columnsManagementReset: "Скинути",
								columnsManagementSearchTitle: "Пошук",
								toolbarExport: 'Експорт',
								toolbarExportLabel: 'Експорт',
								toolbarExportCSV: 'Завантажити як CSV',
								toolbarExportPrint: 'Друк',
								columnsManagementShowHideAllText: "Показати / Сховати всі",
								filterPanelColumns: 'Стовпці', // Переклад для "Columns"
								filterPanelOperator: 'Оператор', // Переклад для "Operator"
								// filterPanelValue: 'Значення', 
								// filterPanelFilterValue: 'Значення фільтра',
								toolbarExportExcel: "Експорт",
								filterPanelInputLabel: "Значення",
								filterPanelInputPlaceholder: 'Значення фільтра',
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
								toolbarColumnsLabel: 'Оберіть стовпці',
								toolbarFilters: 'Фільтри',
								toolbarFiltersLabel: 'Показати фільтри',
								toolbarFiltersTooltipHide: 'Приховати фільтри',
								toolbarFiltersTooltipShow: 'Показати фільтри',
								toolbarQuickFilterPlaceholder: 'Пошук...',
								toolbarQuickFilterLabel: 'Пошук',
								toolbarQuickFilterDeleteIconLabel: 'Очистити',
							}}
							sx={{
								opacity: loading || dataLoading ? 0.5 : 1, // Напівпрозорість, якщо завантажується
								flexGrow: 1, // Займає доступний простір у контейнері
								minWidth: 800, // Мінімальна ширина DataGrid
								"& .MuiDataGrid-scrollbar--horizontal": {
									position: 'fixed',
									bottom: "5px"
								}
							}}
						/>
					)}
				</Box>
				<ConfirmationDialog
					title="Видалити склад?"
					contentText={
						selectedRow
							? `Ви справді хочете видалити цей склад? : ${selectedRow.state && `${selectedRow.state},`} 
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
	);

}
