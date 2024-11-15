import { Box, Button, TextField, Typography, CircularProgress, Autocomplete } from '@mui/material';
import { useState, useEffect, use } from 'react';
import { useCreateBlog, useUpdateBlog, getBlogs, getJsonConstructorFile, postJsonConstructorFile, putJsonConstructorFile } from '@/pages/api/BlogApi';
import { BlogCategory2, getBlogCategories2, useBlogCategories2 } from '@/pages/api/BlogCategory2Api';
import PhotoUploader from './PhotoUploader';
import useAdminPanelStore from '@/store/adminPanel';
import useBlogInvoiceStore from '@/store/BlogInvoiceStore';
import FrameBlogInvoiceForm from './FrameBlogInvoiceForm';
import { getPhotoByUrlAndDelete, uploadPhotos } from '@/pages/api/ImageApi';
import { toast } from 'react-toastify';
import { useQueryState } from 'nuqs';

export default function FrameBlogAddEdit() {
    const { data: categories = [] } = useBlogCategories2({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
        Sorting: "BlogCategory2NameAsc"
    });
    const { rows, addTextRow, addImageRow, removeRow, updateRowContent, clearRows, setRows,
        keywords, addKeyword, removeKeyword, updateKeyword, clearKeywords, setKeywords } = useBlogInvoiceStore();
    const { mutateAsync: createBlog } = useCreateBlog();
    const { mutateAsync: updateBlog } = useUpdateBlog();
    const blogId = useAdminPanelStore((state) => state.blogId);
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
    const [blogCategory2, setBlogCategory2] = useState<BlogCategory2 | null>(null);
    const [blogTitle, setBlogTitle] = useState('');
    const [previewImageArray, setPreviewImageArray] = useState<string[]>([]);
    const [filePath, setFilePath] = useState<string | null>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        clearKeywords();
        clearRows();
    }, []);

    useEffect(() => {
        if (blogId === null) {
            setActiveTab("blog");
        }
        const fetchBlogData = async (id: number) => {
            setLoading(true);
            try {
                const blogs = await getBlogs({ SearchParameter: 'Query', Id: id });
                if (blogs && blogs.length > 0) {
                    const blog = blogs[0];
                    setBlogCategory2(categories.find((cat) => cat.id === blog.blogCategory2Id) || null);
                    setBlogTitle(blog.blogTitle);
                    setPreviewImageArray([blog.previewImagePath]);
                    setFilePath(blog.filePath);
                    setKeywords(blog.keywords.split('|'));
                    if (blog.filePath && blog.filePath.length > 0) {
                        const response = await getJsonConstructorFile(blog.filePath);
                        setRows(response);
                    }
                    else {
                        clearKeywords();
                        clearRows();
                    }
                }

            } catch (error) {
                console.error('Error fetching blog data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (blogId && blogId !== 0) {
            fetchBlogData(blogId);
        }
        if (blogId && blogId === 0) {
            clearKeywords();
            clearRows();
        }
        console.log('blogId:', blogId);
    }, [blogId, categories]);

    const handleSave = async () => {
        // Фільтруємо пусті рядки перед оновленням стану
        const filteredRows = rows.filter((row) => row.content.length > 0);
        setRows(filteredRows); // Оновлюємо стан з відфільтрованими рядками
        const filteredKeywords = keywords.filter((keyword) => keyword.length > 0);
        setKeywords(filteredKeywords); // Оновлюємо стан з відфільтрованими ключовими словами
        if (!blogTitle) {
            toast.error('Заповніть заголовок блогу! ');
            return;
        }
        if (!blogCategory2) {
            toast.error('Виберіть категорію блогу! ');
            return;
        }
        if (previewImageArray.length === 0) {
            toast.error('Додайте обкладинку блогу! ');
            return;
        }
        if (filteredRows.length === 0) {
            toast.error('Додайте контент блогу! ');
            return;
        }
        setLoading(true);
        try {
            if (blogId === 0) {
                const blogStructurePath = await postJsonConstructorFile(rows);
                await createBlog({
                    BlogCategory2Id: blogCategory2.id,
                    BlogTitle: blogTitle,
                    PreviewImagePath: previewImageArray.length > 0 ? previewImageArray[0] : '',
                    Keywords: filteredKeywords.map((keyword) => keyword).join('|'),
                    FilePath: blogStructurePath, // можна додати підтримку файлів
                });
            } else {
                const blogStructurePath = await putJsonConstructorFile(rows, filePath!);
                await updateBlog({
                    Id: blogId!,
                    BlogCategory2Id: blogCategory2.id,
                    BlogTitle: blogTitle,
                    PreviewImagePath: previewImageArray.length > 0 ? previewImageArray[0] : '',
                    Keywords: filteredKeywords.map((keyword) => keyword).join('|'),
                    FilePath: blogStructurePath!,
                });
            }
            clearRows();
            clearKeywords();
            setActiveTab("blog");
        } catch (error) {
            console.error('Error saving blog:', error);
        } finally {
            setLoading(false);
        }
    };

    // const handleSelectPreviewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files && event.target.files[0]) {
    //         const image = URL.createObjectURL(event.target.files[0]);
    //         setPreviewImageArray(image);
    //     }
    // };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Typography variant="h5" color="textPrimary">
                {blogId === 0 ? 'Додати блог' : 'Редагування блогу'}
            </Typography>

            <Autocomplete
                options={categories}
                getOptionLabel={(option: BlogCategory2) => `${option.name} (${option.blogCategory1Name})`}
                value={blogCategory2 || null}
                onChange={(event, newValue) => setBlogCategory2(newValue)}
                renderInput={(params) => <TextField {...params} label="Виберіть категорію" variant="outlined" />}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
            />
            {/* <label
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
                    onChange={handleSelectPreviewImage}
                    multiple
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '2rem', height: '2rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                Завантажити фото
            </label> */}


            <TextField
                label="Заголовок блогу"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                fullWidth
                variant="outlined"
            />
            <h4>Обкладинка блогу</h4>
            <PhotoUploader photos={previewImageArray}
                setPhotos={setPreviewImageArray}
                UploadPhoto={async (ev) => {
                    const files = ev.target.files;
                    if (files) {
                        const data = await uploadPhotos(files);
                        setPreviewImageArray(data);
                    }
                }}
                removePhoto={async (filename) => {
                    await getPhotoByUrlAndDelete(filename);
                    setPreviewImageArray([]);
                }}
                setIsPhotosDirty={null}
                maxPhotos={1}
            />
            <FrameBlogInvoiceForm></FrameBlogInvoiceForm>
            {/* <PhotoUploader
                photos={photos}
                setPhotos={setPhotos}
                onSelectPreviewImage={handleSelectPreviewImage}
                previewImage={previewImage}
            /> */}

            {loading ? (
                <CircularProgress size={24} />
            ) : (
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Зберегти
                </Button>
            )}
        </Box>
    );
}
