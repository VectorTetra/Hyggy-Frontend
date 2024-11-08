import { useState } from "react";
import styles from "../page.module.css";
interface FavoriteButtonProps {
    className: string;
    productId: number;
    isFavorite: boolean;
    toggleFavorite: (productId: number) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ className, productId, isFavorite, toggleFavorite }) => (
    <button className={className} onClick={() => toggleFavorite(productId)}>
        {isFavorite ? "💖" : "🖤"}
    </button>
);

export default FavoriteButton;
