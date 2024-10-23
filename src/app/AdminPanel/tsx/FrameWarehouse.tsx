import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel } from '@mui/x-data-grid';
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
		{ field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
		{
			field: 'shopName',
			headerName: 'Назва магазину',
			flex: 1,
			minWidth: 200,
			renderCell: (params) => {
				// Перевіряємо, чи значення shopName пусте або null
				if (!params.value) {
					return (
						<Typography
							variant="body2"
							sx={{
								fontStyle: 'italic',
								color: 'blue',
								display: "flex",
								alignItems: "center", // Центруємо по вертикалі
								height: "100%", // Задаємо висоту для центрування
							}}
						>
							=&gt; (Загальний склад)
						</Typography>
					);
				}
				// Якщо значення не пусте, відображаємо його
				return (
					<Typography
						variant="body2"
						sx={{
							display: "flex",
							alignItems: "center", // Центруємо по вертикалі
							height: "100%", // Задаємо висоту для центрування
						}}
					>
						{params.value}
					</Typography>
				);
			},
		},
		{ field: 'state', headerName: 'Область', flex: 1, minWidth: 150 },
		{ field: 'city', headerName: 'Місто', flex: 0.8, minWidth: 150 },
		{ field: 'street', headerName: 'Вулиця', flex: 1, minWidth: 150 },
		{ field: 'houseNumber', headerName: '№ буд.', flex: 0.3, minWidth: 100 },
		{ field: 'postalCode', headerName: 'Поштовий індекс', flex: 1, minWidth: 150 },
		{
			field: 'storedWaresSum',
			headerName: 'Заг. сума товарів',
			flex: 0.5,
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
	}, [activeTab]);


	useEffect(() => {
		const fetchFilteredData = async () => {
			setLoading(true);
			try {
				if (debouncedSearchTerm) {
					const filteredStorages = await getStorages({
						SearchParameter: "Query", // Параметр пошуку
						QueryAny: debouncedSearchTerm.length > 0 ? debouncedSearchTerm : null,
						PageNumber: 1,
						PageSize: 1000 // Завантажити 1000 записів для фільтрації
					});
					setFilteredData(filteredStorages); // Оновлюємо відфільтровані дані
				}
				else {
					setFilteredData(data); // Якщо немає терміна пошуку, використовуємо всі дані
				}
			} catch (error) {
				console.error('Error fetching filtered data:', error);
			} finally {
				if (data.length > 0)
					setLoading(false);
			}
		};

		fetchFilteredData();
	}, [debouncedSearchTerm, data]);

	return (
		<Box sx={{ overflowX: "auto" }}>
			<Typography variant="h5" sx={{ marginBottom: 2 }}>
				Склади : {loading ? <CircularProgress size={24} /> : filteredData.length}
			</Typography>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
				<SearchField
					searchTerm={searchTerm}
					onSearchChange={(event) => setSearchTerm(event.target.value)}
				/>
				<Button variant="contained" color="primary" onClick={() => {
					setWarehouseId(0);
					setActiveTab("addEditWarehouse");
				}}>
					Додати
				</Button>
			</Box>
			<Box className="dataGridContainer"> {/* Додаємо новий клас */}
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
									pageSize: 50,
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
						pageSizeOptions={[5, 10, 20, 50, 100]}
						disableRowSelectionOnClick
						slots={{ toolbar: GridToolbar }}
						columnVisibilityModel={columnVisibilityModel}
						onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
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
						}}
					/>
				)}
			</Box>
			<ConfirmationDialog
				title="Видалити склад?"
				contentText={
					selectedRow
						? `Ви справді хочете видалити цей склад? : ${selectedRow.state}, ${selectedRow.city}, ${selectedRow.street}, ${selectedRow.houseNumber}, ${selectedRow.postalCode}`
						: ''
				}
				onConfirm={handleConfirmDelete}
				open={isDialogOpen}
			/>
		</Box>
	);

}
