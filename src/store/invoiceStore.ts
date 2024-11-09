// store/invoiceStore.ts
import { create } from 'zustand';

// Оголошення інтерфейсу для рядка (row)
interface Row {
    id: number;
    propertyName: string;
    propertyValue: string;
}

// Інтерфейс для нашого Zustand store
interface InvoiceStore {
    rows: Row[];
    addRow: () => void;
    removeRow: (id: number) => void;
    updateRow: (id: number, field: keyof Row, value: string) => void;
    clearRows: () => void;
}

// Створення store з типізацією
const useInvoiceStore = create<InvoiceStore>((set) => ({
    rows: [{ id: Date.now(), propertyName: '', propertyValue: '' }],
    addRow: () => set((state) => ({
        rows: [...state.rows, { id: Date.now(), propertyName: '', propertyValue: '' }]
    })),
    removeRow: (id) => set((state) => ({
        rows: state.rows.filter((row) => row.id !== id)
    })),
    updateRow: (id, field, value) => set((state) => ({
        rows: state.rows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        )
    })),
    clearRows: () => set(() => ({
        rows: []
    })),
}));

export default useInvoiceStore;
