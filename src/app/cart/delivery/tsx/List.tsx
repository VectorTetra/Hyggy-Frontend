import React, { useRef, useEffect } from "react";

const List = ({ selectedStore, setSelectedStore, stores, selectedDeliveryType }) => {
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    const handleCheckboxChange = (store) => {
        setSelectedStore(store);
    };

    useEffect(() => {
        if (selectedStore) {
            const index = stores.findIndex(store => store.name === selectedStore.name);
            if (index !== -1 && refs.current[index]) {
                refs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }
    }, [selectedStore, stores]);

    return (
        <div>
            {stores.length === 0 ? (
                <p>Не знайдено</p>
            ) : (
                <div className={`overflow-y-auto ${stores.length > 5 ? 'h-[540px]' : ''}`}>
                    {stores.map((store, index) => (
                        <div
                            key={index}
                            className="mb-4"
                            ref={el => { refs.current[index] = el; }}
                        >
                            <label className="block font-bold text-lg">
                                <input
                                    type="radio"
                                    className="mr-2"
                                    checked={selectedStore?.name === store.name}
                                    onChange={() => handleCheckboxChange(store)}
                                />
                                {store.name}
                            </label>
                            <p className="text-gray-600">
                                {selectedDeliveryType.id === 1 && `${store.street}, ${store.houseNumber}, ${store.city}, ${store.postalCode}`}
                                {selectedDeliveryType.id === 3 && `${store.address}, ${store.postalCode}`}
                                {selectedDeliveryType.id === 4 && `${store.address}, ${store.city}, ${store.postalCode}`}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default List;
