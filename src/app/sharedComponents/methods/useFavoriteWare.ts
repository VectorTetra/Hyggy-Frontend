import { useEffect, useState } from 'react';
import useQueryStore from '@/store/query';
import { Customer, useCustomers, useUpdateCustomer } from '@/pages/api/CustomerApi';
import { getDecodedToken } from '@/pages/api/TokenApi';

export const useFavoriteWare = () => {
    const { data: customers = [], refetch, isSuccess: customerSuccess } = useCustomers({
        SearchParameter: "Query",
        Id: getDecodedToken()?.nameid
    });

    const { RefetchFavoriteWares, setRefetchFavoriteWares } = useQueryStore();
    const { mutateAsync: updateCustomer } = useUpdateCustomer();

    const [customer, setCustomer] = useState<Customer | null>(null);

    // Автоматичне оновлення списку клієнтів при зміні `RefetchFavoriteWares`
    useEffect(() => {
        if (RefetchFavoriteWares) {
            refetch();
            setRefetchFavoriteWares(false);
        }
    }, [RefetchFavoriteWares, refetch, setRefetchFavoriteWares]);

    // Встановлення клієнта після успішного завантаження
    useEffect(() => {
        if (customerSuccess && customers.length > 0) {
            setCustomer(customers[0]);
        }
    }, [customerSuccess, customers]);

    // Додавання чи видалення товару з обраного
    const toggleFavoriteWare = async (wareId: number) => {
        if (!customer) return;

        const updatedFavorites = customer.favoriteWareIds.includes(wareId)
            ? customer.favoriteWareIds.filter(id => id !== wareId)
            : [...customer.favoriteWareIds, wareId];

        setCustomer({
            ...customer,
            favoriteWareIds: updatedFavorites,
        });

        await updateCustomer({
            Name: customer.name,
            Surname: customer.surname,
            Email: customer.email,
            Id: getDecodedToken()?.nameid || "",
            PhoneNumber: customer.phoneNumber,
            AvatarPath: customer.avatarPath,
            FavoriteWareIds: updatedFavorites,
            OrderIds: customer.orderIds,
        });

        setRefetchFavoriteWares(true);
    };

    // Перевірка, чи є товар в обраних
    const isFavorite = (wareId: number): boolean => {
        return customer?.favoriteWareIds.includes(wareId) || false;
    };

    return { toggleFavoriteWare, isFavorite, customer, isLoading: !customerSuccess };
};
