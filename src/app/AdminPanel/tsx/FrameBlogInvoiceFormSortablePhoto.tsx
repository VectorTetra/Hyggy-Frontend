import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const FrameBlogInvoiceFormSortablePhoto = ({ id, photo, removePhoto }: { id: string, photo: string, removePhoto: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        position: 'relative',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img
                src={photo}
                alt="Фото"
                style={{ width: 100, height: 100, borderRadius: '8px', objectFit: 'cover', marginRight: '8px' }}
                onDoubleClick={() => removePhoto(id)}
            />
        </div>
    );
};

export default FrameBlogInvoiceFormSortablePhoto;