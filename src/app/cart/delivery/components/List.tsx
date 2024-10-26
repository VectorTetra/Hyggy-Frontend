import React from "react";

const List = ({ selectedStore, setSelectedStore, stores }) => {
    const handleCheckboxChange = (store) => {
        setSelectedStore(store);
    };

    return (
        <div>
            {stores.length === 0 ? (
                <p>Не знайдено</p>
            ) : (
                stores.slice(0, 5).map((store, index) => (
                    <div key={index} className="mb-4">
                        <label className="block font-bold text-lg">
                            <input
                                type="radio"
                                className="mr-2"
                                checked={selectedStore?.name === store.name}
                                onChange={() => handleCheckboxChange(store)}
                            />
                            {store.name}
                        </label>
                        <p className="text-gray-600"></p>
                        <p className="text-gray-600">{store.address}, {store.city}, {store.postalCode}.</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default List;
