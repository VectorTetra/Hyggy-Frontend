import React, { useState, useEffect } from 'react';
import {
	Box,
	TextField,
	List,
	ListItem,
	ListItemButton,
	CircularProgress,
	Radio,
	RadioGroup,
	FormControlLabel,
	Button,
	Typography,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import useAdminPanelStore from '@/store/adminPanel';
import { customIcon } from '../../shops/components/Map';
import { getStorages, postStorage, putStorage } from '@/pages/api/StorageApi';
import { getAddresses, postAddress, putAddress } from '@/pages/api/AddressApi';
import { useQueryState } from 'nuqs';
import { toast } from 'react-toastify';

const WarehouseAddEditFrame = () => {
	const [address, setAddress] = useState('');
	const [oldAddress, setOldAddress] = useState('');
	const [AddressStreet, setAddressStreet] = useState('');
	const [AddressHouseNumber, setAddressHouseNumber] = useState('');
	const [AddressCity, setAddressCity] = useState('');
	const [AddressState, setAddressState] = useState('');
	const [AddressPostalCode, setAddressPostalCode] = useState('');
	const [AddressLatitude, setAddressLatitude] = useState<number | null>(null);
	const [AddressLongitude, setAddressLongitude] = useState<number | null>(null);
	const [suggestions, setSuggestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
	const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
	const warehouseId = useAdminPanelStore((state) => state.warehouseId);
	useEffect(() => {
		if (warehouseId === null) {
			//setSelectedPosition(null);
			setActiveTab('warehousesList');
		}
	}, []);
	const isSaveDisabled =
		AddressLatitude === null ||
		AddressLongitude === null;

	useEffect(() => {
		const fetchAddress = async (id: number) => {

			try {
				if (id === 0) {
					return;
				}
				const warehouses = await getStorages({ SearchParameter: 'Query', Id: id });
				if (warehouses && warehouses.length > 0) {
					const { street, houseNumber, city, state, postalCode, latitude, longitude } = warehouses[0];
					const formattedAddress = `${street} ${houseNumber}, ${city}, ${state}, ${postalCode}`;
					setAddress(formattedAddress);
					setOldAddress(formattedAddress);
					setAddressStreet(street);
					setAddressHouseNumber(houseNumber);
					setAddressCity(city);
					setAddressState(state);
					setAddressPostalCode(postalCode || '');
					setAddressLatitude(latitude);
					setAddressLongitude(longitude);
					setSelectedPosition([latitude, longitude]);
				} else {
					console.error('Склад не знайдено або відповідь пуста.');
				}
				console.log('Відправлений Id складу:', id);
				console.log('Отриманий склад:', warehouses);
			} catch (error) {
				console.error('Error fetching address data:', error);
			}
		};

		if (warehouseId && warehouseId !== 0) {
			fetchAddress(warehouseId);
		}
	}, [warehouseId]);

	const searchAddress = async (query: string) => {
		setLoading(true);
		try {
			const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
				params: {
					q: query,
					format: 'json',
					addressdetails: 1,
					limit: 10,
					countrycodes: 'UA',
				},
			});
			setSuggestions(response.data);
		} catch (error) {
			console.error('Error fetching address suggestions:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setAddress(value);
		if (value.length > 2) {
			searchAddress(value);
		} else {
			setSuggestions([]);
		}
	};

	const handleSuggestionSelect = (lat: number, lon: number, displayName: string) => {
		setAddress(displayName);
		setSelectedPosition([lat, lon]);
		setSelectedSuggestion(displayName);

		// Використовуйте geocoding API для отримання детальної інформації
		fetchDetailedAddress(lat, lon);
	};

	const fetchDetailedAddress = async (lat: number, lon: number) => {
		try {
			const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
				params: {
					lat,
					lon,
					format: 'json',
					addressdetails: 1,
				},
			});

			if (response.data && response.data.address) {
				const addressDetails = response.data.address;
				console.log("addressDetails", addressDetails);
				// Визначте частини адреси, використовуючи їх ключі
				setAddressStreet(addressDetails.road || '');
				setAddressHouseNumber(addressDetails.house_number || '');
				setAddressCity(addressDetails.city || addressDetails.town || addressDetails.village || '');
				setAddressState(addressDetails.state || '');
				setAddressPostalCode(addressDetails.postcode || '');
				setAddressLatitude(lat);
				setAddressLongitude(lon);
			}
		} catch (error) {
			console.error('Error fetching detailed address:', error);
		}
	};


	const handleMapClick = async (event: any) => {
		const { lat, lng } = event.latlng;
		setSelectedPosition([lat, lng]);
		try {
			const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
				params: {
					lat,
					lon: lng,
					format: 'json',
					addressdetails: 1,
				},
			});
			if (response.data) {
				const { address } = response.data;
				const formattedAddress = `${address.road || ''} ${address.house_number || ''}, ${address.city || ''}, ${address.state || ''}, ${address.postcode || ''}`;

				setAddress(formattedAddress);
				setAddressStreet(address.road || '');
				setAddressHouseNumber(address.house_number || '');
				setAddressCity(address.city || '');
				setAddressState(address.state || '');
				setAddressPostalCode(address.postcode || '');
				setAddressLatitude(lat);
				setAddressLongitude(lng);

				// Викликати handleAddressChange з новою адресою
				handleAddressChange({
					target: { value: formattedAddress },
				} as React.ChangeEvent<HTMLInputElement>);
			}
		} catch (error) {
			console.error('Error fetching address from coordinates:', error);
		}
	};


	const handleSave = async () => {
		try {
			let newStorageDTOCollection: any[] | null = null;
			// Перевірка на існуючу адресу
			let checkExistedAddressDTO = await getAddresses({
				SearchParameter: "Query",
				HouseNumber: AddressHouseNumber,
				City: AddressCity,
				State: AddressState,
				Street: AddressStreet,
				PostalCode: AddressPostalCode,
				Latitude: AddressLatitude,
				Longitude: AddressLongitude,
			});
			// Перевірка, чи це новий склад
			if (warehouseId === 0) {



				// Якщо адреса існує
				if (checkExistedAddressDTO.length > 0) {
					if (!checkExistedAddressDTO[0].storageId) {
						// Створити новий склад для існуючої адреси
						newStorageDTOCollection = await postStorage({ AddressId: checkExistedAddressDTO[0].id });
					} else {
						// Адреса вже має асоційований склад
						toast.error("Склад з такою адресою вже існує!");
						return; // Виходимо, якщо склад вже існує
					}
				} else {
					// Якщо адреса не існує, спочатку створюємо адресу
					let newAddressDTO = await postAddress({
						HouseNumber: AddressHouseNumber,
						City: AddressCity,
						State: AddressState,
						Street: AddressStreet,
						PostalCode: AddressPostalCode,
						Latitude: AddressLatitude,
						Longitude: AddressLongitude,
					});
					console.log("newAddressDTO", newAddressDTO);
					// Тепер створюємо склад для нової адреси
					newStorageDTOCollection = await postStorage({ AddressId: newAddressDTO.id });
				}

				// Перевірка, чи склад успішно створений
				if (newStorageDTOCollection) {
					toast.success("Склад успішно створено!");
					setActiveTab("warehousesList");
				}
			} else if (warehouseId !== null && warehouseId !== undefined) {
				// Перезаписуємо адресу і оновлюємо склад
				if (checkExistedAddressDTO.length > 0) {
					if (!checkExistedAddressDTO[0].storageId) {
						// Створити новий склад для існуючої адреси
						newStorageDTOCollection = await postStorage({ AddressId: checkExistedAddressDTO[0].id });
					} else {
						// Адреса вже має асоційований склад
						toast.error("Склад з такою адресою вже існує!");
						return; // Виходимо, якщо склад вже існує
					}
				}
				let oldAddress = await getAddresses({ SearchParameter: "Query", StorageId: warehouseId });
				console.log("oldAddress", oldAddress);
				let newAddressDTO = await putAddress({
					Id: oldAddress[0].id,
					StorageId: warehouseId,
					ShopId: oldAddress[0].shopId,
					HouseNumber: AddressHouseNumber,
					City: AddressCity,
					State: AddressState,
					Street: AddressStreet,
					PostalCode: AddressPostalCode,
					Latitude: AddressLatitude,
					Longitude: AddressLongitude,
				});
				console.log("newAddressDTO", newAddressDTO);
				// Оновлення існуючого складу
				newStorageDTOCollection = await putStorage({
					Id: warehouseId,
					AddressId: newAddressDTO.id,
					ShopId: oldAddress[0].shopId // Якщо адреса існує, беремо shopId, якщо ні - null
					// Додайте інші поля, які потрібно оновити
				});
				toast.success("Склад успішно оновлено!");
				setActiveTab("warehousesList");
			}
		} catch (error) {
			console.error('Error while saving:', error);
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
			{warehouseId !== null && warehouseId > 0 ? (
				<Typography variant="h5" color="textPrimary">
					Редагування складу
				</Typography>
			) :
				(<Typography variant="h5" color="textPrimary">
					Cтворення нового складу
				</Typography>
				)}
			{oldAddress && (
				<Typography variant="h6" color="textSecondary">
					Стара адреса: {oldAddress}
				</Typography>
			)}
			<TextField
				placeholder="Введіть адресу складу"
				label="Адреса"
				value={address}
				onChange={handleAddressChange}
				fullWidth
				variant="outlined"
				autoComplete="off"
			/>
			{loading && <CircularProgress size={24} />}
			<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '400px', gap: '10px' }}>
				<Box sx={{ flex: 1, overflow: 'auto' }}>
					<RadioGroup value={selectedSuggestion} onChange={(e) => setSelectedSuggestion(e.target.value)}>
						<List>
							{suggestions.map((suggestion: any) => (
								<ListItem key={suggestion.place_id} component="li">
									<ListItemButton onClick={() =>
										handleSuggestionSelect(
											parseFloat(suggestion.lat),
											parseFloat(suggestion.lon),
											suggestion.display_name
										)
									}>
										<FormControlLabel
											control={<Radio />}
											label={suggestion.display_name}
											value={suggestion.display_name}
										/>
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</RadioGroup>
				</Box>
				<Box sx={{ flex: 1 }}>
					{warehouseId !== null && <MapContainer
						key={selectedPosition ? selectedPosition.toString() : 'default'}
						center={selectedPosition || [50.4501, 30.5234]}
						zoom={selectedPosition ? 18 : 12}
						maxZoom={18}
						style={{ height: '100%', width: '100%' }}
					>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						<CustomMapEvents onMapClick={handleMapClick} />
						{selectedPosition && <MapFocus position={selectedPosition} zoom={18} />}
						{selectedPosition && <Marker position={selectedPosition} icon={customIcon} />}
					</MapContainer>}
				</Box>
			</Box>
			<Button disabled={isSaveDisabled} variant="contained" color="success" onClick={handleSave}>
				Зберегти
			</Button>
		</Box>
	);
};

// Компонент для фокусування карти на мітці
const MapFocus = ({ position, zoom }: { position: [number, number], zoom: number }) => {
	const map = useMap();
	useEffect(() => {
		map.setView(position, zoom);
	}, [position, zoom, map]);
	return null;
};

// Окремий компонент для обробки подій карти
const CustomMapEvents = ({ onMapClick }: { onMapClick: (event: any) => void }) => {
	useMapEvents({
		click: onMapClick,
	});
	return null;
};

export default WarehouseAddEditFrame;
