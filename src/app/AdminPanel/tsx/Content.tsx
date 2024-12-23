import { Box, CircularProgress } from '@mui/material';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { lazy, Suspense } from 'react';
// const Clients = lazy(() => import('./Clients'));
// const NewShopEmployee = lazy(() => import('./Employees/NewShopEmployee'));
// const NewStorageEmployee = lazy(() => import('./Employees/NewStorageEmployee'));
// const ShopEmployees = lazy(() => import('./Employees/ShopEmployees'));
// const StorageEmployees = lazy(() => import('./Employees/StorageEmployees'));
// const FrameRemaining = lazy(() => import('./FrameRemaining'));
// const FrameWriteoff = lazy(() => import('./FrameWriteoff'));
// const FrameStorage = lazy(() => import('./FrameStorage'));
// const FrameShop = lazy(() => import('./FrameShop'));
// const NewShop = lazy(() => import('./FrameShopAddEdit'));
// const FrameStorageAddEdit = lazy(() => import('./FrameStorageAddEdit'));
// const FrameWare = lazy(() => import('./FrameWare'));
// const WareAddEditFrame = lazy(() => import('./FrameWareAddEdit'));
// const FrameBlog = lazy(() => import('./FrameBlog'));
// const FrameBlogAddEdit = lazy(() => import('./FrameBlogAddEdit'));
// const FrameSupply = lazy(() => import('./FrameSupply'));
// const FrameTransfer = lazy(() => import('./FrameTransfer'));
import Clients from './Clients';
import NewShopEmployee from './Employees/NewShopEmployee';
import NewStorageEmployee from './Employees/NewStorageEmployee';
import ShopEmployees from './Employees/ShopEmployees';
import StorageEmployees from './Employees/StorageEmployees';
import FrameRemaining from './FrameRemaining';
import FrameWriteoff from './FrameWriteoff';
import FrameStorage from './FrameStorage';
import FrameShop from './FrameShop';
import NewShop from './FrameShopAddEdit';
import FrameStorageAddEdit from './FrameStorageAddEdit';
import FrameWare from './FrameWare';
import WareAddEditFrame from './FrameWareAddEdit';
import FrameBlog from './FrameBlog';
import FrameBlogAddEdit from './FrameBlogAddEdit';
import FrameSupply from './FrameSupply';
import FrameTransfer from './FrameTransfer';
import useAdminPanelStore from '@/store/adminPanel';

export default function Content({ rolePermissions }) {
	const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
	const { shopEmployeeId, storageEmployeeId } = useAdminPanelStore();
	return (
		<>
			{rolePermissions.IsAdminPanelContent_Available && <Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
				}}
			>
				<Suspense fallback={<CircularProgress />}>
					{rolePermissions.IsFrameWare_Available && activeTab === 'products' && <FrameWare rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameWareAddEdit_Available && activeTab === 'addEditWare' && <WareAddEditFrame />}
					{rolePermissions.IsFrameStorage_Available && activeTab === 'warehousesList' && <FrameStorage rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameStorageAddEdit_Available && activeTab === 'addEditWarehouse' && <FrameStorageAddEdit />}
					{rolePermissions.IsFrameRemaining_Available && activeTab === 'remains' && <FrameRemaining />}
					{rolePermissions.IsFrameSupply_Available && activeTab === 'supplies' && <FrameSupply />}
					{rolePermissions.IsFrameTransfer_Available && activeTab === 'transfers' && <FrameTransfer />}
					{rolePermissions.IsFrameWriteoff_Available && activeTab === 'writeOffs' && <FrameWriteoff />}
					{rolePermissions.IsFrameShops_Available && activeTab === 'stores' && <FrameShop rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameShops_Button_AddShop_Available || rolePermissions.IsFrameShops_Button_EditShop_Available && activeTab === 'addNewShop' && <NewShop />}
					{rolePermissions.IsFrameShopEmployees_Available && activeTab === 'shopEmployees' && <ShopEmployees rolePermissions={rolePermissions} />}
					{(rolePermissions.IsFrameShopEmployees_Button_AddShopEmployee_Available || rolePermissions.canEditSelf(shopEmployeeId)) && activeTab === 'addShopEmployee' && <NewShopEmployee rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameStorageEmployees_Available && activeTab === 'storageEmployees' && <StorageEmployees rolePermissions={rolePermissions} />}
					{(rolePermissions.IsFrameStorageEmployees_Button_AddStorageEmployee_Available || rolePermissions.canEditSelf(storageEmployeeId)) && activeTab === 'addStorageEmployee' && <NewStorageEmployee rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameClients_Available && activeTab === 'clients' && <Clients rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameOrders_Available && activeTab === 'orders' && <div>Замовлення</div>}
					{rolePermissions.IsFrameBlog_Available && activeTab === 'blog' && <FrameBlog rolePermissions={rolePermissions} />}
					{(rolePermissions.IsFrameBlog_Button_AddBlog_Available || rolePermissions.IsFrameBlog_Button_EditBlog_Available) && activeTab === 'addEditBlog' && <FrameBlogAddEdit />}
					{/* {rolePermissions.IsFrameReviews_Available && activeTab === 'reviews' && <div>Відгуки</div>} */}
				</Suspense>
			</Box>}
		</>
	);
}