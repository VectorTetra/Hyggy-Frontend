// components/WareGrid.tsx
import { useState, useEffect } from "react";
import styles from "../css/WareGrid.module.css";
import Pagination from "../../sharedComponents/Pagination";
import WareCard from "./WareCard";
import { Ware } from "@/pages/api/WareApi";
import { ShopGetDTO } from "@/pages/api/ShopApi";
import { Customer, useCustomers, useUpdateCustomer } from "@/pages/api/CustomerApi";
import { getDecodedToken } from "@/pages/api/TokenApi";
import useQueryStore from "@/store/query";
import useLocalStorageStore from "@/store/localStorage";

export default function WareGrid(props: any) {
  const [currentPage, setCurrentPage] = useState(1);
  //const [selectedShop, setSelectedShop] = useState<ShopGetDTO | null>(null);
  const { selectedShop, setSelectedShop } = useLocalStorageStore();
  let [customer, setCustomer] = useState<Customer | null>(null);
  const { RefetchFavoriteWares, setRefetchFavoriteWares } = useQueryStore();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const { data: customers = [], isLoading: customerLoading, isSuccess: customerSuccess, refetch } = useCustomers({
    SearchParameter: "Query",
    Id: getDecodedToken()?.nameid
  });


  useEffect(() => {
    if (RefetchFavoriteWares) {
      refetch();  // Перезапуск запиту при зміні RefetchFavoriteWares
      setRefetchFavoriteWares(false);  // Скидаємо стан refetch після виконання запиту
    }
  }, [RefetchFavoriteWares, refetch, setRefetchFavoriteWares]);

  useEffect(() => {
    if (customerSuccess && customers.length > 0) {
      setCustomer(customers[0]);
    }
  }, [customerSuccess, customers]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }, [currentPage]);

  const toggleFavorite = async (wareId: number) => {
    if (!customer) return;

    // Оновлюємо обрані товари, не скидаючи пагінацію
    const updatedFavorites = customer.favoriteWareIds.includes(wareId)
      ? customer.favoriteWareIds.filter(id => id !== wareId)
      : [...customer.favoriteWareIds, wareId];

    setCustomer({
      ...customer,
      favoriteWareIds: updatedFavorites
    });

    // Відправка запиту на сервер
    await updateCustomer({
      Name: customer.name,
      Surname: customer.surname,
      Email: customer.email,
      Id: getDecodedToken()?.nameid || "",
      PhoneNumber: customer.phoneNumber,
      AvatarPath: customer.avatarPath,
      FavoriteWareIds: updatedFavorites,
      OrderIds: customer.orderIds
    });

    setRefetchFavoriteWares(true);
  };

  const itemsPerPage = props.itemsPerPage !== undefined ? props.itemsPerPage : 20;
  const totalItems = props.wares?.length;
  const displayedWares = props.wares?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div id={styles.wareGrid}>
        {displayedWares?.map((ware: Ware) => (
          <WareCard
            key={ware.id}
            ware={ware}
            isFavorite={customer?.favoriteWareIds.includes(ware.id) ?? false}
            toggleFavorite={toggleFavorite}
            selectedShop={selectedShop}
          />
        ))}
      </div>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
