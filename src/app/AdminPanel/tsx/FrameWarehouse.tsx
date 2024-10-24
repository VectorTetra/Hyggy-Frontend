import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel, gridColumnsTotalWidthSelector } from '@mui/x-data-grid';
import { deleteStorage, getStorages } from '@/pages/api/StorageApi';
import SearchField from './SearchField';
import { useQueryState } from 'nuqs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDebounce } from 'use-debounce';
import useAdminPanelStore from '@/store/adminPanel'; // Імпортуємо Zustand
import '../css/WarehouseFrame.css';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { toast } from 'react-toastify';

export default function WarehouseFrame() {
	const [data, setData] = useState<any | null>([]);
	const [filteredData, setFilteredData] = useState<any | null>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm] = useDebounce(searchTerm, 700);

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

	const handleConfirmDelete = async () => {
		if (selectedRow) {
			console.log("selectedRow", selectedRow);
			await deleteStorage(selectedRow.id);
			setIsDialogOpen(false);
			// Оновлюємо список складів після видалення
			setData((prevData) => prevData.filter((item) => item.id !== selectedRow.id));
			toast.info('Склад успішно видалено!');
		}
	};

	useEffect(() => {
		const fetchStorages = async () => {
			try {
				if (activeTab !== "warehousesList") return;
				setLoading(true);
				console.log('Fetching storages...');
				const storages = await getStorages({
					SearchParameter: "Query",
					PageNumber: 1,
					PageSize: 1000
				});
				console.log('Storages fetched:', storages);
				setData(storages);
			} catch (error) {
				console.error('Error fetching storage data:', error);
			} finally {
				console.log('Setting loading to false');
				setLoading(false);
			}
		};

		fetchStorages();
	}, []);


	useEffect(() => {
		const fetchFilteredData = () => {
			setLoading(true);
			try {
				if (debouncedSearchTerm) {
					// Фільтруємо дані локально по будь-якому полю
					const filteredStorages = data.filter(item =>
						Object.values(item).some(value =>
							// Перевіряємо, чи є значення строкою та чи містить воно термін пошуку
							typeof value === 'string' && value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
						)
					);
					setFilteredData(filteredStorages); // Оновлюємо відфільтровані дані
				} else {
					setFilteredData(data); // Якщо немає терміна пошуку, використовуємо всі дані
				}
			} catch (error) {
				console.error('Error filtering data:', error);
			} finally {
				if (data.length > 0)
					setLoading(false);
			}
		};

		fetchFilteredData();
	}, [debouncedSearchTerm, data]);


	return (
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
				backgroundColor: 'white', // Задаємо фон, щоб панель не зливалась із DataGrid
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
					<Button variant="contained" sx={{ backgroundColor: "#248922" }} onClick={() => {
						setWarehouseId(0);
						setActiveTab("addEditWarehouse");
					}}>
						Додати
					</Button>
				</Box>
			</Box>
			<Box className="dataGridContainer" sx={{ flexGrow: 1 }} height="80vh">
				{filteredData.length === 0 && !loading ? (
					<Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
						Нічого не знайдено
					</Typography>
				) : (
					<DataGrid
						className="dataGrid"
						rows={filteredData}
						columns={columns}
						apiRef={apiRef}
						loading={loading}

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
						slots={{ toolbar: GridToolbar }}
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
							opacity: loading ? 0.5 : 1, // Напівпрозорість, якщо завантажується
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
				cancelButtonColor='#248922'
				open={isDialogOpen}
			/>
		</Box>

	);

}
