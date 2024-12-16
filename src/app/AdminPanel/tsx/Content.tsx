import { Box, CircularProgress } from '@mui/material';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { lazy, Suspense } from 'react';
import Clients from './Clients';
import NewShopEmployee from './Employees/NewShopEmployee';
import NewStorageEmployee from './Employees/NewStorageEmployee';
import ShopEmployees from './Employees/ShopEmployees';
import StorageEmployees from './Employees/StorageEmployees';
import FrameRemaining from './FrameRemaining';
import FrameWriteoff from './FrameWriteoff';
import { isOwner, isAdmin, isAccountant, isGeneralAccountant, isSaler, isStorekeeper } from '@/pages/api/TokenApi';
const FrameStorage = lazy(() => import('./FrameStorage'));
const FrameShop = lazy(() => import('./FrameShop'));
const NewShop = lazy(() => import('./FrameShopAddEdit'));
const FrameStorageAddEdit = lazy(() => import('./FrameStorageAddEdit'));
const FrameWare = lazy(() => import('./FrameWare'));
const WareAddEditFrame = lazy(() => import('./FrameWareAddEdit'));
const FrameBlog = lazy(() => import('./FrameBlog'));
const FrameBlogAddEdit = lazy(() => import('./FrameBlogAddEdit'));
const FrameSupply = lazy(() => import('./FrameSupply'));
const FrameTransfer = lazy(() => import('./FrameTransfer'));

export default function Content() {
	const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
	const checkIsOwner = isOwner();
	const checkIsAdmin = isAdmin();
	const checkIsAccountant = isAccountant();
	const checkIsGeneralAccountant = isGeneralAccountant();
	const checkIsSaler = isSaler();
	const checkIsStorekeeper = isStorekeeper();

	// Кому доступний фрейм "Товари"
	const IsFrameWare_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Додати товар" на фреймі "Товари"
	const IsFrameWare_Button_AddWare_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Змінити товар" на фреймі "Товари"
	const IsFrameWare_Button_EditWare_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Видалити товар" на фреймі "Товари"
	const IsFrameWare_Button_DeleteWare_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Склади"
	const IsFrameStorage_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Додати склад" на фреймі "Склади"
	const IsFrameStorage_Button_AddStorage_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Змінити склад" на фреймі "Склади"
	const IsFrameStorage_Button_EditStorage_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Видалити склад" на фреймі "Склади"
	const IsFrameStorage_Button_DeleteStorage_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Залишки"
	const IsFrameRemaining_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Поставки"
	const IsFrameSupply_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Переміщення"
	const IsFrameTransfer_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Блог"
	const IsFrameBlog_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Додати запис у блозі" на фреймі "Блог"
	const IsFrameBlog_Button_AddBlog_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Змінити запис у блозі" на фреймі "Блог"
	const IsFrameBlog_Button_EditBlog_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Видалити запис у блозі" на фреймі "Блог"
	const IsFrameBlog_Button_DeleteBlog_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Клієнти"
	const IsFrameClients_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Замовлення"
	const IsFrameOrders_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Магазини"
	const IsFrameShops_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Додати магазин" на фреймі "Магазини"
	const IsFrameShops_Button_AddShop_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Змінити магазин" на фреймі "Магазини"
	const IsFrameShops_Button_EditShop_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Видалити магазин" на фреймі "Магазини"
	const IsFrameShops_Button_DeleteShop_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Співробітники магазину"
	const IsFrameShopEmployees_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Додати співробітника магазину" на фреймі "Співробітники магазину"
	const IsFrameShopEmployees_Button_AddShopEmployee_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Змінити співробітника магазину" на фреймі "Співробітники магазину"
	const IsFrameShopEmployees_Button_EditShopEmployee_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Видалити співробітника магазину" на фреймі "Співробітники магазину"
	const IsFrameShopEmployees_Button_DeleteShopEmployee_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Співробітники складу"
	const IsFrameStorageEmployees_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Додати співробітника складу" на фреймі "Співробітники складу"
	const IsFrameStorageEmployees_Button_AddStorageEmployee_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Змінити співробітника складу" на фреймі "Співробітники складу"
	const IsFrameStorageEmployees_Button_EditStorageEmployee_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступна кнопка "Видалити співробітника складу" на фреймі "Співробітники складу"
	const IsFrameStorageEmployees_Button_DeleteStorageEmployee_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	// Кому доступний фрейм "Відгуки"
	const IsFrameReviews_Available = checkIsOwner || checkIsAdmin || checkIsAccountant || checkIsGeneralAccountant || checkIsSaler || checkIsStorekeeper;
	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				p: 3,
			}}
		>
			<Suspense fallback={<CircularProgress />}>
				{activeTab === 'products' && <FrameWare />}
				{activeTab === 'addEditWare' && <WareAddEditFrame />}
				{activeTab === 'warehousesList' && <FrameStorage />}
				{activeTab === 'addEditWarehouse' && <FrameStorageAddEdit />}
				{activeTab === 'remains' && <FrameRemaining />}
				{activeTab === 'supplies' && <FrameSupply />}
				{activeTab === 'transfers' && <FrameTransfer />}
				{activeTab === 'writeOffs' && <FrameWriteoff />}
				{activeTab === 'stores' && <FrameShop />}
				{activeTab === 'addNewShop' && <NewShop />}
				{activeTab === 'shopEmployees' && <ShopEmployees />}
				{activeTab === 'addShopEmployee' && <NewShopEmployee />}
				{activeTab === 'storageEmployees' && <StorageEmployees />}
				{activeTab === 'addStorageEmployee' && <NewStorageEmployee />}
				{activeTab === 'clients' && <Clients />}
				{activeTab === 'orders' && <div>Замовлення</div>}
				{activeTab === 'blog' && <FrameBlog />}
				{activeTab === 'addEditBlog' && <FrameBlogAddEdit />}
				{activeTab === 'reviews' && <div>Відгуки</div>}
			</Suspense>
		</Box>
	);
}