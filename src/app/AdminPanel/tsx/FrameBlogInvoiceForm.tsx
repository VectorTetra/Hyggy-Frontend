import { getPhotoByUrlAndDelete, uploadPhotos } from '@/pages/api/ImageApi';
import useBlogInvoiceStore from '@/store/BlogInvoiceStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/FrameBlogInvoiceForm.css';
import FrameBlogInvoiceFormKeywordForm from './FrameBlogInvoiceFormKeywordForm';
import PhotoUploader from './PhotoUploader';

const FrameBlogInvoiceForm = () => {
    const {
        rows,
        addTextRow,
        addImageRow,
        addMixedRow,
        removeRow,
        updateRowContent,
        clearRows,
        setIsPhotosDirty,
    } = useBlogInvoiceStore();

    const modules = {
        toolbar: [
            [{ header: [false, 1, 2, 3, 4, 5, 6] }],
            [{ size: ["small", false, "large", "huge"] }], // Додавання вибору розміру шрифту
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["code-block"],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ align: [] }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }, "clean"],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false
        },

    };

    const formats = [
        'header', 'size', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'script', 'indent', 'align',
        'color', 'background', 'link', 'image',
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h4>Вміст блогу</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "50px", justifyContent: "space-between" }}>
                    {rows.map((row) => (
                        <div key={row.id} style={{ gap: '50px', display: 'flex' }}>
                            {row.contentType === 'text' && (
                                <ReactQuill
                                    value={typeof row.content === 'string' ? row.content : ''}
                                    onChange={(content) => updateRowContent(row.id, content)}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Введіть текст абзацу блогу"
                                    style={{
                                        flex: 1,
                                        borderRadius: '8px',
                                    }}
                                />
                            )}
                            {row.contentType === 'image' && (
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
                            {row.contentType === 'mixed' && (
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "start" }}>
                                    <Box key={row.id} sx={{ display: 'flex', gap: '16px', alignItems: 'stretch', mb: "50px", maxWidth: "75vw" }}>
                                        {/* Використовуємо ReactQuill для редагування назви характеристики */}
                                        <ReactQuill
                                            value={
                                                typeof row.content === 'object' && 'text' in row.content
                                                    ? row.content.text
                                                    : ''
                                            }
                                            onChange={(textContent) =>
                                                updateRowContent(row.id, {
                                                    ...(typeof row.content === 'object' ? row.content : {}),
                                                    text: textContent,
                                                } as { text: string; photos: string[] })
                                            }
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Введіть текст абзацу блогу"
                                            style={{
                                                flex: 1,
                                                borderRadius: '8px',
                                                height: "26vh%",
                                                maxWidth: "50vw",
                                            }}
                                        />
                                        <div style={{ display: "flex", flex: 0.33 }}>
                                            <PhotoUploader
                                                photos={
                                                    typeof row.content === 'object' && 'photos' in row.content
                                                        ? row.content.photos
                                                        : []
                                                }
                                                setPhotos={(newPhotos) =>
                                                    updateRowContent(row.id, {
                                                        ...(typeof row.content === 'object' ? row.content : {}),
                                                        photos: newPhotos,
                                                    } as { text: string; photos: string[] })
                                                }
                                                UploadPhoto={async (ev) => {
                                                    setIsPhotosDirty(true);
                                                    const files = ev.target.files;
                                                    if (files) {
                                                        const data = await uploadPhotos(files);
                                                        if (row.contentType === 'mixed' && typeof row.content === 'object' && 'text' in row.content && 'photos' in row.content) {
                                                            updateRowContent(row.id, {
                                                                ...row.content,
                                                                photos: [
                                                                    ...(row.content as { text: string; photos: string[] })
                                                                        .photos,
                                                                    ...data,
                                                                ],
                                                            });
                                                        }
                                                    }
                                                }}
                                                removePhoto={async (filename) => {
                                                    setIsPhotosDirty(true);
                                                    if (row.contentType === 'mixed' && typeof row.content === 'object' && 'text' in row.content && 'photos' in row.content) {
                                                        updateRowContent(row.id, {
                                                            ...row.content,
                                                            photos: (row.content as { text: string; photos: string[] })
                                                                .photos.filter((photo) => photo !== filename),
                                                        });
                                                    }
                                                    await getPhotoByUrlAndDelete(filename);
                                                }}
                                                maxPhotos={1}
                                                isStarPhotoAssigned={false}
                                                setIsPhotosDirty={setIsPhotosDirty}
                                            />
                                        </div>
                                    </Box>
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
                        <Button variant="contained" sx={{ backgroundColor: "#00AAAD" }} onClick={addTextRow}>
                            Додати текстове поле
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: "#00AAAD" }} onClick={addImageRow}>
                            Додати галерею
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: "#00AAAD" }} onClick={addMixedRow}>
                            Додати текстове поле з фото
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: "#be0f0f" }} onClick={clearRows}>
                            Очистити вміст блогу
                        </Button>
                    </Box>
                </div>

            </div>
            <FrameBlogInvoiceFormKeywordForm />
        </div>
    );
};

export default FrameBlogInvoiceForm;

