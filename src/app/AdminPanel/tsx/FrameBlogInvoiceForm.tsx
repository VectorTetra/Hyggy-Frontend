import React from 'react';
import useBlogInvoiceStore from '@/store/BlogInvoiceStore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import PhotoUploader from './PhotoUploader';
import { getPhotoByUrlAndDelete, uploadPhotos } from '@/pages/api/ImageApi';

const FrameBlogInvoiceForm = () => {
    const {
        rows,
        keywords,
        addTextRow,
        addImageRow,
        removeRow,
        updateRowContent,
        clearRows,
        addKeyword,
        removeKeyword,
        updateKeyword,
        clearKeywords,
        setIsPhotosDirty,
    } = useBlogInvoiceStore();

    // const handleAddPhoto = (id: number, photoUrl: string) => {
    //     if (photoUrl) {
    //         addPhoto(id, photoUrl);
    //     }
    // };

    // const handleReorderPhotos = (id: number, newOrder: string[]) => {
    //     reorderPhotos(id, newOrder);
    // };

    // async function UploadPhoto(ev,id, content) {
    //     setIsPhotosDirty(true);
    //     const files = ev.target.files;
    //     if (files) {
    //         const data = await uploadPhotos(files);
    //         updateRowContent(id,[...content, ...data]);
    //     }
    // }

    // async function removePhoto(filename) {
    //     setIsPhotosDirty(true);
    //     updateRowContent(photos.filter(photo => photo !== filename));
    //     await getPhotoByUrlAndDelete(filename);
    // }

    return (
        <div>
            {/* Рядки контенту */}
            <div style={{ marginBottom: '2rem' }}>
                <h4>Вміст блогу</h4>
                {rows.map((row) => (
                    <div key={row.id} style={{ marginBottom: '50px', display: 'flex' }}>
                        {row.contentType === 'text' ? (
                            <ReactQuill
                                value={typeof row.content === 'string' ? row.content : ''}
                                onChange={(content) => updateRowContent(row.id, content)}
                                placeholder="Введіть текст абзацу блогу"
                                style={{
                                    flex: 1,
                                    borderRadius: '8px',
                                }}
                            />
                        ) : (
                            <div style={{
                                flex: 1,
                                borderRadius: '8px',
                            }}>
                                <PhotoUploader photos={row.content}
                                    setPhotos={(content) => updateRowContent(row.id, content)}
                                    UploadPhoto={async (ev) => {
                                        setIsPhotosDirty(true);
                                        const files = ev.target.files;
                                        if (files) {
                                            const data = await uploadPhotos(files);
                                            updateRowContent(row.id, Array.isArray(row.content) ? [...row.content, ...data] : [...data]);
                                        }
                                    }}
                                    removePhoto={async (filename) => {
                                        setIsPhotosDirty(true);
                                        updateRowContent(row.id, Array.isArray(row.content) ? row.content.filter(photo => photo !== filename) : []);
                                        await getPhotoByUrlAndDelete(filename);
                                    }}
                                    setIsPhotosDirty={setIsPhotosDirty}
                                    maxPhotos={2}
                                    isStarPhotoAssigned={false}
                                />
                            </div>
                        )}
                        <IconButton
                            onClick={() => removeRow(row.id)}
                            color="error"
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={addTextRow}>
                        Додати текстове поле
                    </Button>
                    <Button variant="contained" color="primary" onClick={addImageRow}>
                        Додати галерею
                    </Button>
                    <Button variant="contained" color="secondary" onClick={clearRows}>
                        Очистити вміст блогу
                    </Button>
                </Box>
            </div>

            {/* Ключові слова */}
            <div style={{ marginBottom: '2rem' }}>
                <h4>Ключові слова</h4>
                {keywords.map((keyword, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <TextField
                            variant="outlined"
                            placeholder="Введіть ключове слово"
                            value={keyword}
                            onChange={(e) => updateKeyword(index, e.target.value)}
                            style={{ flex: 1, marginRight: '10px' }}
                        />
                        <IconButton onClick={() => removeKeyword(index)} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={addKeyword}>
                        Додати ключове слово
                    </Button>
                    <Button variant="contained" color="secondary" onClick={clearKeywords}>
                        Прибрати всі ключові слова
                    </Button>
                </Box>
            </div>

            {/* Додаткові кнопки */}
            {/* <div>
                <Button
                    variant="contained"
                    onClick={() => {
                        console.log('Rows:', rows);
                        console.log('Keywords:', keywords);
                    }}
                >
                    Log Current State
                </Button>
            </div> */}
        </div>
    );
};

export default FrameBlogInvoiceForm;
