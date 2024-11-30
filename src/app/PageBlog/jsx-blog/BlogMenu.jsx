"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../css/blogstyle.module.css";
import { getBlogMainCategories } from "@/pages/api/BlogMainCategory";
import { getBlogSubCatsByMainCat } from "@/pages/api/BlogSubCategory";

// export default function BlogMenu(props) {
//     const [images, setImages] = React.useState([]);
//     const [selectedCaption, setSelectedCaption] = useState(""); // Для хранения выбранного caption
//     const router = useRouter();

//     const [category, setCategory] = useState("");

//     useEffect(() => {
//         const fetchCategories = async () =>{
//             const response = await getBlogSubCatsByMainCat();       
//             console.log(response);

//      };
//      fetchCategories();
        
//         //loadImages('Для дому');
//     }, []);
    
//     const loadImages = (category) => {
//         let categoryKey = '';

//         switch (category) {
//             case 'Для дому':
//                 categoryKey = 'homemenu';
//                 break;
//             case 'Для сну':
//                 categoryKey = 'forsleepmenu';
//                 break;
//             case 'Для саду':
//                 categoryKey = 'forgardenmenu';
//                 break;
//             default:
//                 categoryKey = 'homemenu';
//         }

//         const newImages = props.blogPage.menuimage[categoryKey] || [];
//         setImages(newImages.map(item => ({
//             ...item,
//             urlImages: item.urlImagesHome || item.urlImagesSleep || item.urlImagesGarden
//         })));
//     };

//     const handleImageClick = (caption) => {
//         router.push(`/PageBlogCategory?caption=${encodeURIComponent(caption)}`);
//     };

   

//     return (
//         <div>
//             <div className={styles.menucontainer}>
//                 {props.blogPage.blogmenu.map((item, index) => (
//                     <a
//                         key={index}
//                         href="#"
//                         onClick={(e) => {
//                             e.preventDefault();
//                             loadImages(item.captionMenu);
//                             setSelectedCaption(item.captionMenu); // выбранный caption
//                         }}
//                         className={styles.menuitem}
//                     >
//                         {item.captionMenu}
//                     </a>
//                 ))}
//             </div>
//             <hr />
//             <div className={styles.imagescontainer}>
//                 {images.map((item, index) => (
//                     <div key={index} className={styles.imageitem}>
//                         <a
//                             href="#"
//                             onClick={() => handleImageClick(item.caption)} // Передаем caption при клике
//                         >
//                             <img src={item.urlImages} alt={item.caption} />
//                             <div className={styles.textmenu}>{item.caption}</div>
//                         </a>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

export default function BlogMenu({ currentCategory, setCurrentCategory }) {
        const [images, setImages] = React.useState([]);
        const [selectedCaption, setSelectedCaption] = useState(""); // Для хранения выбранного caption
        const router = useRouter();
    
        const [categories, setCategories] = useState([]);
        const [categoryId, setCategoryId] = useState();
        const [subCategories, setSubCategories] = useState([]);

        useEffect(() => {
            const fetchCategories = async () =>{
                const data = await getBlogMainCategories();
                setCategories(data);
         };
         fetchCategories();
        }, []);
        
        useEffect(() => {
            const fetchCategories = async () =>{
                const response = await getBlogSubCatsByMainCat({
                    SearchParameter: "BlogCategory1Id",
                    BlogCategory1Id: categoryId
                });       
                setSubCategories(response);
         };
         if(categoryId){
             fetchCategories();
         }
        },[categoryId]);
        
        const loadImages = (category) => {
            let categoryKey = '';
    
            switch (category) {
                case 'Для дому':
                    categoryKey = 'homemenu';
                    break;
                case 'Для сну':
                    categoryKey = 'forsleepmenu';
                    break;
                case 'Для саду':
                    categoryKey = 'forgardenmenu';
                    break;
                default:
                    categoryKey = 'homemenu';
            }
    
            const newImages = props.blogPage.menuimage[categoryKey] || [];
            setImages(newImages.map(item => ({
                ...item,
                urlImages: item.urlImagesHome || item.urlImagesSleep || item.urlImagesGarden
            })));
        };
    
        const handleImageClick = (caption) => {
            router.push(`/PageBlogCategory?caption=${encodeURIComponent(caption)}`);
        };
    
       
    
        return (
            <div>
                <div className={styles.menucontainer}>
                    {categories.slice(0,3).map((category, index) => (
                        <a
                            key={index}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentCategory(category.name);
                                setCategoryId(category.id)
                                setSelectedCaption(category.name); // выбранный caption
                            }}
                            className={styles.menuitem}
                        >
                            {category.name}
                        </a>
                    ))}
                </div>
                {subCategories.length > 0 && 
                <div>
                <hr />
                <div className={styles.imagescontainer}>
                    {subCategories.map((subCat, index) => (
                        <div key={index} className={styles.imageitem}>
                            <a
                                href="#"
                                // onClick={() => handleImageClick(item.caption)} // Передаем caption при клике
                            >
                                <img src={subCat.previewImagePath
} alt={subCat.name} />
                                <div className={styles.textmenu}>{subCat.name}</div>
                            </a>
                        </div>
                    ))}
                </div>
                </div>
}
            </div>
        );
            }
        