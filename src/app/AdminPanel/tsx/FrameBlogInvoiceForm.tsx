import { getPhotoByUrlAndDelete, uploadPhotos } from '@/pages/api/ImageApi';
import useBlogInvoiceStore from '@/store/BlogInvoiceStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, TextField } from '@mui/material';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PhotoUploader from './PhotoUploader';
//import styles from '../css/FrameBlogInvoiceForm.module.css';
//import ImageResize from '@ammarkhalidfarooq/quill-image-resize-module-react-fix-for-mobile';
//import Table from "quill-table"; // Основний модуль для роботи з таблицями
// import { Resize, BaseModule } from 'quill-image-resize-module';
// import Editor from './Editor';

//Quill.register('modules/imageResize', ImageResize);

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

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6] }],
            [{ size: [] }],
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
        // imageResize: {
        //     modules: ['Resize', 'DisplaySize', 'Toolbar'],
        // },

    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'script', 'indent', 'align',
        'color', 'background', 'link', 'image',
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h4>Вміст блогу</h4>
                {rows.map((row) => (
                    <div key={row.id} style={{ marginBottom: '50px', display: 'flex' }}>
                        {row.contentType === 'text' ? (
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
                            // <Editor value={typeof row.content === 'string' ? row.content : ''}
                            //     handlechange={(content) => updateRowContent(row.id, content)}
                            //     placeholder="Введіть текст абзацу блогу" />
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
        </div>
    );
};

export default FrameBlogInvoiceForm;

// import React, { useState } from 'react';
// import { getPhotoByUrlAndDelete, uploadPhotos } from '@/pages/api/ImageApi';
// import { EditorContent, useEditor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image';
// import Table from '@tiptap/extension-table';
// import TableRow from '@tiptap/extension-table-row';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';
// import TextAlign from '@tiptap/extension-text-align';
// import Underline from '@tiptap/extension-underline';
// import useBlogInvoiceStore from '@/store/BlogInvoiceStore';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { Box, Button, IconButton, MenuItem, TextField, Menu } from '@mui/material';
// import PhotoUploader from './PhotoUploader';

// // Компонент для ряду з контентом
// const ContentRow = ({ row, updateRowContent, removeRow, setIsPhotosDirty }) => {
//     const [anchorEl, setAnchorEl] = useState(null);
//     const [imageFile, setImageFile] = useState(null); // Стан для зображення

//     const editor = useEditor({
//         content: row.content,
//         extensions: [
//             StarterKit,
//             Image,
//         ],
//         onUpdate: ({ editor }) => {
//             updateRowContent(row.id, editor.getHTML());
//         },
//     });

//     const handleRightClick = (event) => {
//         event.preventDefault();
//         setAnchorEl(event.currentTarget); // Встановлюємо точку прив'язки меню
//     };

//     const handleClose = () => {
//         setAnchorEl(null); // Закриваємо меню
//     };

//     // Функція для вибору файлу
//     const handleFileSelect = (event) => {
//         const file = event.target.files[0]; // Отримуємо вибраний файл
//         if (file && editor) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const imageUrl = reader.result as string;
//                 if (imageUrl) {
//                     editor.chain().focus().setImage({ src: imageUrl }).run(); // Вставка зображення в редактор
//                 }
//             };
//             reader.readAsDataURL(file); // Читання файлу як URL
//         }
//     };

//     // Функція для відкриття діалогу вибору файлу
//     const openFileDialog = () => {
//         const input = document.createElement('input');
//         input.type = 'file';
//         input.accept = 'image/*'; // Тільки зображення
//         input.onchange = handleFileSelect;
//         input.click(); // Імітуємо клік по інпуту
//     };

//     return (
//         <div
//             key={row.id}
//             onContextMenu={handleRightClick} // Обробка контекстного меню
//         >
//             <div
//                 style={{
//                     flex: 1,
//                     borderRadius: '8px',
//                     border: '1px solid #ccc',
//                     padding: '8px',
//                 }}
//             >
//                 <EditorContent editor={editor} />
//             </div>

//             {/* Контекстне меню */}
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//                 PaperProps={{
//                     style: {
//                         maxHeight: 200,
//                         width: '200px',
//                     },
//                 }}
//             >
//                 <MenuItem onClick={() => editor && editor.chain().focus().toggleBold().run()}>Жирний</MenuItem>
//                 <MenuItem onClick={() => editor && editor.chain().focus().toggleItalic().run()}>Курсив</MenuItem>
//                 <MenuItem onClick={() => editor && editor.chain().focus().toggleUnderline().run()}>Підкреслений</MenuItem>
//                 <MenuItem onClick={openFileDialog}>Вставити зображення</MenuItem> {/* Вставка зображення */}
//                 <MenuItem onClick={() => editor && editor.chain().focus().insertTable().run()}>Вставити таблицю</MenuItem>
//             </Menu>
//         </div>
//     );
// };

// const FrameBlogInvoiceForm = () => {
//     const {
//         rows,
//         keywords,
//         addTextRow,
//         addImageRow,
//         removeRow,
//         updateRowContent,
//         clearRows,
//         addKeyword,
//         removeKeyword,
//         updateKeyword,
//         clearKeywords,
//         setIsPhotosDirty,
//     } = useBlogInvoiceStore();

//     return (
//         <div>
//             {/* Рядки контенту */}
//             <div style={{ marginBottom: '2rem' }}>
//                 <h4>Вміст блогу</h4>
//                 {rows.map((row) => (
//                     <ContentRow
//                         key={row.id}
//                         row={row}
//                         updateRowContent={updateRowContent}
//                         removeRow={removeRow}
//                         setIsPhotosDirty={setIsPhotosDirty}
//                     />
//                 ))}
//                 <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
//                     <Button variant="contained" color="primary" onClick={addTextRow}>
//                         Додати текстове поле
//                     </Button>
//                     <Button variant="contained" color="primary" onClick={addImageRow}>
//                         Додати галерею
//                     </Button>
//                     <Button variant="contained" color="secondary" onClick={clearRows}>
//                         Очистити вміст блогу
//                     </Button>
//                 </Box>
//             </div>

//             {/* Ключові слова */}
//             <div style={{ marginBottom: '2rem' }}>
//                 <h4>Ключові слова</h4>
//                 {keywords.map((keyword, index) => (
//                     <div
//                         key={index}
//                         style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             marginBottom: '0.5rem',
//                         }}
//                     >
//                         <TextField
//                             variant="outlined"
//                             placeholder="Введіть ключове слово"
//                             value={keyword}
//                             onChange={(e) => updateKeyword(index, e.target.value)}
//                             style={{ flex: 1, marginRight: '10px' }}
//                         />
//                         <IconButton onClick={() => removeKeyword(index)} color="error">
//                             <DeleteIcon />
//                         </IconButton>
//                     </div>
//                 ))}
//                 <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
//                     <Button variant="contained" color="primary" onClick={addKeyword}>
//                         Додати ключове слово
//                     </Button>
//                     <Button variant="contained" color="secondary" onClick={clearKeywords}>
//                         Прибрати всі ключові слова
//                     </Button>
//                 </Box>
//             </div>
//         </div>
//     );
// };

// export default FrameBlogInvoiceForm;

