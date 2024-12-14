// components/WareGrid.tsx
import { useFavoriteWare } from '@/app/sharedComponents/methods/useFavoriteWare';
import { WareGetDTO } from "@/pages/api/WareApi";
import useLocalStorageStore from "@/store/localStorage";
import { useEffect, useState } from "react";
import Pagination from "../../sharedComponents/Pagination";
import styles from "../css/WareGrid.module.css";
import WareCard from "./WareCard";


export default function WareGrid(props: any) {
  const [currentPage, setCurrentPage] = useState(1);
  //const [selectedShop, setSelectedShop] = useState<ShopGetDTO | null>(null);
  const { selectedShop } = useLocalStorageStore();
  const { isFavorite, toggleFavoriteWare } = useFavoriteWare();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }, [currentPage]);



  const itemsPerPage = props.itemsPerPage !== undefined ? props.itemsPerPage : 20;
  const totalItems = props.wares?.length;
  const displayedWares = props.wares?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div id={styles.wareGrid}>
        {displayedWares?.map((ware: WareGetDTO) => (
          <WareCard
            key={ware.id}
            ware={ware}
            isFavorite={isFavorite(ware.id)}
            toggleFavorite={() => toggleFavoriteWare(ware.id)}
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
