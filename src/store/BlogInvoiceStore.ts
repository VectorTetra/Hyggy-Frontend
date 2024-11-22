// import { create } from 'zustand';

// // Інтерфейс для Zustand Store
// interface Row {
//     id: number;
//     contentType: 'text' | 'image'; // Тип контенту: текст або фото
//     content: string | string[];   // Контент: текст або масив URL-фото
// }
// //addPhoto(rowId, 'https://example.com/photo.jpg');
// //removePhoto(rowId, photoIndex);
// //reorderPhotos(rowId, ['url1', 'url2', 'url3']);

// interface BlogInvoiceStore {
//     rows: Row[];
//     keywords: string[];
//     addKeyword: () => void;
//     removeKeyword: (id: number) => void;
//     updateKeyword: (id: number, keyword: string) => void;
//     clearKeywords: () => void;
//     setKeywords: (keywords: string[]) => void;
//     addTextRow: () => void;
//     addImageRow: () => void;
//     removeRow: (id: number) => void;
//     updateRowContent: (id: number, content: string | string[]) => void;
//     addPhoto: (id: number, photoUrl: string) => void;
//     removePhoto: (id: number, photoIndex: number) => void;
//     reorderPhotos: (id: number, newPhotoOrder: string[]) => void;
//     clearRows: () => void;
//     setRows: (rows: Row[]) => void;
//     isPhotosDirty: boolean;
//     setIsPhotosDirty: (isDirty: boolean) => void;
// }

// const useBlogInvoiceStore = create<BlogInvoiceStore>((set) => ({
//     rows: [],
//     addTextRow: () => set((state) => ({
//         rows: [
//             ...state.rows,
//             { id: Date.now(), contentType: 'text', content: '' }
//         ]
//     })),
//     addImageRow: () => set((state) => ({
//         rows: [
//             ...state.rows,
//             { id: Date.now(), contentType: 'image', content: [] } // Масив URL для фото
//         ]
//     })),
//     removeRow: (id) => set((state) => ({
//         rows: state.rows.filter((row) => row.id !== id)
//     })),
//     updateRowContent: (id, content) => set((state) => ({
//         rows: state.rows.map((row) =>
//             row.id === id ? { ...row, content } : row
//         )
//     })),
//     addPhoto: (id, photoUrl) => set((state) => ({
//         rows: state.rows.map((row) =>
//             row.id === id && Array.isArray(row.content)
//                 ? { ...row, content: [...row.content, photoUrl] }
//                 : row
//         )
//     })),
//     removePhoto: (id, photoIndex) => set((state) => ({
//         rows: state.rows.map((row) =>
//             row.id === id && Array.isArray(row.content)
//                 ? {
//                     ...row,
//                     content: row.content.filter((_, index) => index !== photoIndex)
//                 }
//                 : row
//         )
//     })),
//     reorderPhotos: (id, newPhotoOrder) => set((state) => ({
//         rows: state.rows.map((row) =>
//             row.id === id && Array.isArray(row.content)
//                 ? { ...row, content: newPhotoOrder }
//                 : row
//         )
//     })),
//     clearRows: () => set(() => ({
//         rows: []
//     })),
//     setRows: (rows) => set(() => ({
//         rows
//     })),
//     keywords: [],
//     addKeyword: () => set((state) => ({
//         keywords: [
//             ...state.keywords,
//             ''
//         ]
//     })),
//     removeKeyword: (id) => set((state) => ({
//         keywords: state.keywords.filter((_, i) => i !== id)
//     })),
//     updateKeyword: (id, keyword) => set((state) => ({
//         keywords: state.keywords.map((k, i) => (i === id ? keyword : k))
//     })),
//     clearKeywords: () => set(() => ({
//         keywords: []
//     })),
//     setKeywords: (keywords) => set(() => ({
//         keywords
//     })),
//     isPhotosDirty: false,
//     setIsPhotosDirty: (isDirty) => set(() => ({
//         isPhotosDirty: isDirty
//     }))
// }));

// export default useBlogInvoiceStore;

import { create } from 'zustand';

// Інтерфейс для Zustand Store
interface MixedContent {
    text: string;
    photos: string[];
}
interface Row {
    id: number;
    contentType: 'text' | 'image' | 'mixed'; // Додано новий тип contentType
    content: string | string[] | MixedContent; // Контент: текст, фото або змішаний об'єкт
}

interface BlogInvoiceStore {
    rows: Row[];
    keywords: string[];
    addKeyword: () => void;
    removeKeyword: (id: number) => void;
    updateKeyword: (id: number, keyword: string) => void;
    clearKeywords: () => void;
    setKeywords: (keywords: string[]) => void;
    addTextRow: () => void;
    addImageRow: () => void;
    addMixedRow: () => void; // Додано функцію для додавання змішаного контенту
    removeRow: (id: number) => void;
    updateRowContent: (id: number, content: string | string[] | { text: string; photos: string[] }) => void;
    addPhoto: (id: number, photoUrl: string) => void;
    removePhoto: (id: number, photoIndex: number) => void;
    reorderPhotos: (id: number, newPhotoOrder: string[]) => void;
    clearRows: () => void;
    setRows: (rows: Row[]) => void;
    isPhotosDirty: boolean;
    setIsPhotosDirty: (isDirty: boolean) => void;
}

const useBlogInvoiceStore = create<BlogInvoiceStore>((set) => ({
    rows: [],
    addTextRow: () => set((state) => ({
        rows: [
            ...state.rows,
            { id: Date.now(), contentType: 'text', content: '' }
        ]
    })),
    addImageRow: () => set((state) => ({
        rows: [
            ...state.rows,
            { id: Date.now(), contentType: 'image', content: [] } // Масив URL для фото
        ]
    })),
    addMixedRow: () => set((state) => ({
        rows: [
            ...state.rows,
            {
                id: Date.now(),
                contentType: 'mixed',
                content: { text: '', photos: [] } // Змішаний контент: текст і фото
            }
        ]
    })),
    removeRow: (id) => set((state) => ({
        rows: state.rows.filter((row) => row.id !== id)
    })),
    updateRowContent: (id, content) => set((state) => ({
        rows: state.rows.map((row) =>
            row.id === id ? { ...row, content } : row
        )
    })),
    addPhoto: (id, photoUrl) => set((state) => ({
        rows: state.rows.map((row) =>
            row.id === id && (Array.isArray(row.content) || row.contentType === 'mixed')
                ? {
                    ...row,
                    content: row.contentType === 'mixed'
                        ? { ...row.content as { text: string; photos: string[] }, photos: [...((row.content as { text: string; photos: string[] }).photos), photoUrl] }
                        : [...(row.content as string[]), photoUrl]
                }
                : row
        )
    })),
    removePhoto: (id, photoIndex) => set((state) => ({
        rows: state.rows.map((row) =>
            row.id === id && (Array.isArray(row.content) || row.contentType === 'mixed')
                ? {
                    ...row,
                    content: row.contentType === 'mixed'
                        ? {
                            ...(row.content as { text: string; photos: string[] }),
                            photos: (row.content as { text: string; photos: string[] }).photos.filter((_, index) => index !== photoIndex)
                        }
                        : (row.content as string[]).filter((_, index) => index !== photoIndex)
                }
                : row
        )
    })),
    reorderPhotos: (id, newPhotoOrder) => set((state) => ({
        rows: state.rows.map((row) =>
            row.id === id && (Array.isArray(row.content) || row.contentType === 'mixed')
                ? {
                    ...row,
                    content: row.contentType === 'mixed'
                        ? { ...row.content as { text: string; photos: string[] }, photos: newPhotoOrder }
                        : newPhotoOrder
                }
                : row
        )
    })),
    clearRows: () => set(() => ({
        rows: []
    })),
    setRows: (rows) => set(() => ({
        rows
    })),
    keywords: [],
    addKeyword: () => set((state) => ({
        keywords: [
            ...state.keywords,
            ''
        ]
    })),
    removeKeyword: (id) => set((state) => ({
        keywords: state.keywords.filter((_, i) => i !== id)
    })),
    updateKeyword: (id, keyword) => set((state) => ({
        keywords: state.keywords.map((k, i) => (i === id ? keyword : k))
    })),
    clearKeywords: () => set(() => ({
        keywords: []
    })),
    setKeywords: (keywords) => set(() => ({
        keywords
    })),
    isPhotosDirty: false,
    setIsPhotosDirty: (isDirty) => set(() => ({
        isPhotosDirty: isDirty
    }))
}));

export default useBlogInvoiceStore;

