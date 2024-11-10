// import React from 'react';
// import { toast } from 'react-toastify';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// function PhotoUploader({ photos, setPhotos, UploadPhoto, removePhoto }) {

//     const onDragEnd = (result) => {
//         if (!result.destination) return;
//         console.log('Dragged item:', result.source.index, 'to', result.destination.index); // Лог для дебагу
//         const items = Array.from(photos);
//         const [reorderedItem] = items.splice(result.source.index, 1);
//         items.splice(result.destination.index, 0, reorderedItem);
//         setPhotos(items); // Оновлюємо порядок photos після перетягування
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//             {(!photos || photos.length === 0) && (
//                 <label
//                     style={{
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: '0.25rem',
//                         border: '1px solid #e2e8f0',
//                         backgroundColor: 'transparent',
//                         borderRadius: '1rem',
//                         fontSize: '1.25rem',
//                         color: '#718096',
//                     }}
//                 >
//                     <input
//                         type="file"
//                         style={{ display: 'none' }}
//                         onChange={(event) => {
//                             const files = event.target.files;
//                             if (files && files.length > 5) {
//                                 toast.warning("Ви можете завантажити не більше 5 фото товару.");
//                                 event.target.value = ""; // Скидаємо вибір файлів
//                             } else {
//                                 UploadPhoto(event); // Викликаємо вашу функцію, якщо умова пройдена
//                             }
//                         }}
//                         multiple
//                     />
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '2rem', height: '2rem' }}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
//                     </svg>
//                     Завантажити фото
//                 </label>
//             )}

//             {photos && photos.length > 0 && (
//                 <DragDropContext onDragEnd={onDragEnd}>
//                     <Droppable droppableId="photosUnique" direction>
//                         {(providedDrop) => (
//                             <div
//                                 {...providedDrop.droppableProps}
//                                 ref={providedDrop.innerRef}
//                                 style={{ display: 'flex', gap: "15px", flexWrap: "wrap" }}
//                             >
//                                 {photos.map((photo, index) => (
//                                     <Draggable key={photo} draggableId={`${photo}`} index={index}>
//                                         {(providedDrag) => (
//                                             <div
//                                                 ref={providedDrag.innerRef}
//                                                 {...providedDrag.draggableProps}
//                                                 {...providedDrag.dragHandleProps}
//                                                 style={{
//                                                     ...providedDrag.draggableProps.style,
//                                                     position: "relative",
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     flexBasis: "30%",
//                                                     flexDirection: "column",
//                                                     userSelect: "none",
//                                                     cursor: "move",
//                                                 }}
//                                             >
//                                                 <img
//                                                     src={photo}
//                                                     alt={`Фото ${index + 1}`}
//                                                     style={{
//                                                         borderRadius: '1rem',
//                                                         objectFit: 'contain',
//                                                         height: '20vh',
//                                                     }}
//                                                 />
//                                                 <button
//                                                     onClick={(ev) => removePhoto(ev, photo)}
//                                                     style={{
//                                                         cursor: 'pointer',
//                                                         position: 'absolute',
//                                                         bottom: '0.5rem',
//                                                         right: '0.5rem',
//                                                         color: '#fff',
//                                                         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                                                         padding: '0.5rem 0.75rem',
//                                                         borderRadius: '1rem',
//                                                     }}
//                                                 >
//                                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
//                                                         <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
//                                                     </svg>
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </Draggable>
//                                 ))}
//                                 {providedDrop.placeholder}
//                             </div>
//                         )}
//                     </Droppable>
//                 </DragDropContext>
//             )}
//         </div>
//     );
// }

// export default PhotoUploader;

// import React from 'react';
// import { toast } from 'react-toastify';
// import { useDrag, useDrop } from 'react-dnd';
// import { ItemTypes } from './ItemTypes';  // Це новий файл, де зберігаються типи елементів

// // Оновлення для PhotoUploader
// function PhotoUploader({ photos, setPhotos, UploadPhoto, removePhoto }) {
//     const movePhoto = (dragIndex, hoverIndex) => {
//         const updatedPhotos = [...photos];
//         const [movedPhoto] = updatedPhotos.splice(dragIndex, 1);
//         updatedPhotos.splice(hoverIndex, 0, movedPhoto);
//         setPhotos(updatedPhotos);
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//             {(!photos || photos.length === 0) && (
//                 <label
//                     style={{
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: '0.25rem',
//                         border: '1px solid #e2e8f0',
//                         backgroundColor: 'transparent',
//                         borderRadius: '1rem',
//                         fontSize: '1.25rem',
//                         color: '#718096',
//                     }}
//                 >
//                     <input
//                         type="file"
//                         style={{ display: 'none' }}
//                         onChange={(event) => {
//                             const files = event.target.files;
//                             if (files && files.length > 5) {
//                                 toast.warning("Ви можете завантажити не більше 5 фото товару.");
//                                 event.target.value = ""; // Скидаємо вибір файлів
//                             } else {
//                                 UploadPhoto(event); // Викликаємо вашу функцію, якщо умова пройдена
//                             }
//                         }}
//                         multiple
//                     />
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '2rem', height: '2rem' }}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
//                     </svg>
//                     Завантажити фото
//                 </label>
//             )}

//             {photos && photos.length > 0 && (
//                 <div style={{ display: 'flex', gap: "15px", flexWrap: "wrap" }}>
//                     {photos.map((photo, index) => (
//                         <DraggablePhoto key={index} index={index} photo={photo} movePhoto={movePhoto} removePhoto={removePhoto} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// // Додамо компонент для кожного фото (для перетягування)
// function DraggablePhoto({ photo, index, movePhoto, removePhoto }) {
//     const [, drag] = useDrag({
//         type: ItemTypes.PHOTO,
//         item: { index },
//     });

//     const [, drop] = useDrop({
//         accept: ItemTypes.PHOTO,
//         hover: (item) => {
//             if (item.index !== index) {
//                 movePhoto(item.index, index); // Переміщуємо фото
//                 item.index = index;  // Оновлюємо індекс, щоб уникнути повторної зміни
//             }
//         },
//     });

//     return (
//         <div ref={(node) => drag(drop(node))} style={{
//             position: "relative",
//             display: "flex",
//             alignItems: "center",
//             flexBasis: "30%",
//             flexDirection: "column",
//             userSelect: "none",
//             cursor: "move",
//         }}>
//             <img
//                 src={photo}
//                 alt={`Фото ${index + 1}`}
//                 style={{
//                     borderRadius: '1rem',
//                     objectFit: 'contain',
//                     height: '20vh',
//                 }}
//             />
//             <button
//                 onClick={(ev) => removePhoto(ev, photo)}
//                 style={{
//                     cursor: 'pointer',
//                     position: 'absolute',
//                     bottom: '0.5rem',
//                     right: '0.5rem',
//                     color: '#fff',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     padding: '0.5rem 0.75rem',
//                     borderRadius: '1rem',
//                 }}
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
//                 </svg>
//             </button>
//         </div>
//     );
// }

// export default PhotoUploader;


import React from 'react';
import { toast } from 'react-toastify';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function PhotoUploader({ photos, setPhotos, UploadPhoto, removePhoto, setIsPhotosDirty }) {

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = photos.findIndex(photo => photo === active.id);
            const newIndex = photos.findIndex(photo => photo === over.id);
            const reorderedPhotos = arrayMove(photos, oldIndex, newIndex);
            setPhotos(reorderedPhotos);
            setIsPhotosDirty(true);
            console.log('Dragged item:', oldIndex, 'to', newIndex); // Лог для дебагу
            console.log('Reordered photos:', reorderedPhotos); // Лог для дебагу
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(!photos || photos.length === 0) && (
                <label
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        border: '1px solid #e2e8f0',
                        backgroundColor: 'transparent',
                        borderRadius: '1rem',
                        fontSize: '1.25rem',
                        color: '#718096',
                    }}
                >
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(event) => {
                            const files = event.target.files;
                            if (files && files.length > 5) {
                                toast.warning("Ви можете завантажити не більше 5 фото товару.");
                                event.target.value = ""; // Скидаємо вибір файлів
                            } else {
                                UploadPhoto(event); // Викликаємо вашу функцію, якщо умова пройдена
                            }
                        }}
                        multiple
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '2rem', height: '2rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Завантажити фото
                </label>
            )}

            {photos && photos.length > 0 && (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={photos}>
                        <div style={{ display: 'flex', gap: "15px", flexWrap: "wrap" }}>
                            {photos.map((photo, index) => (
                                <SortablePhoto
                                    key={photo}
                                    id={photo}
                                    photo={photo}

                                    removePhoto={removePhoto}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}

function SortablePhoto({ id, photo, removePhoto }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        display: "flex",
        alignItems: "center",
        flexBasis: "30%",
        flexDirection: "column",
        userSelect: "none",
        cursor: "move",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img
                src={photo}
                alt={`Фото`}
                style={{
                    borderRadius: '1rem',
                    objectFit: 'contain',
                    height: '20vh',
                }}
            />
            <button
                onClick={(ev) => removePhoto(ev, photo)}
                style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '1rem',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
    );
}

export default PhotoUploader;

