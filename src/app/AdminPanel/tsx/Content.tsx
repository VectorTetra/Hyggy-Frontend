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
import useAdminPanelStore from '@/store/adminPanel';

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
const FrameOrder = lazy(() => import('./FrameOrder'));

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
					{(rolePermissions.IsFrameShops_Button_AddShop_Available || rolePermissions.IsFrameShops_Button_EditShop_Available) && activeTab === 'addNewShop' && <NewShop />}
					{rolePermissions.IsFrameShopEmployees_Available && activeTab === 'shopEmployees' && <ShopEmployees rolePermissions={rolePermissions} />}
					{(rolePermissions.IsFrameShopEmployees_Button_AddShopEmployee_Available || rolePermissions.canEditSelf(shopEmployeeId)) && activeTab === 'addShopEmployee' && <NewShopEmployee rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameStorageEmployees_Available && activeTab === 'storageEmployees' && <StorageEmployees rolePermissions={rolePermissions} />}
					{(rolePermissions.IsFrameStorageEmployees_Button_AddStorageEmployee_Available || rolePermissions.canEditSelf(storageEmployeeId)) && activeTab === 'addStorageEmployee' && <NewStorageEmployee rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameClients_Available && activeTab === 'clients' && <Clients rolePermissions={rolePermissions} />}
					{rolePermissions.IsFrameOrders_Available && activeTab === 'orders' && <FrameOrder />}
					{rolePermissions.IsFrameBlog_Available && activeTab === 'blog' && <FrameBlog rolePermissions={rolePermissions} />}
					{(rolePermissions.IsFrameBlog_Button_AddBlog_Available || rolePermissions.IsFrameBlog_Button_EditBlog_Available) && activeTab === 'addEditBlog' && <FrameBlogAddEdit />}
					{/* {rolePermissions.IsFrameReviews_Available && activeTab === 'reviews' && <div>Відгуки</div>} */}
				</Suspense>
			</Box>}
		</>
	);
}