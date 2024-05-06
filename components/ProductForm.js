import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import React from 'react';

export default function ProductForm({
    _id,
    title: extTitle, 
    desc: extDesc, 
    price: extPrice,
    image: extImage,
    category: extCategory,
    properties: extProperties,
}) {
    const [title, setTitle] = useState(extTitle || '');
    const [desc, setDesc] = useState(extDesc || '');
    const [price, setPrice] = useState(extPrice || '');
    const [image, setImage] = useState(extImage || []);
    const [category, setCategory] = useState(extCategory || '');
    const [productProperties, setProductProperties] = useState(extProperties || {});
    const [loading, setLoading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    const [propertiesToFill, setPropertiesToFill] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    useEffect(() => {
        setCategoriesLoading(true);
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setCategoriesLoading(false);
        })
    }, []);

    useEffect(() => {
        if (categories.length > 0 && category) {
            let catInfo = categories.find(({_id}) => _id === category);
            const props = [];
            props.push(...catInfo.properties);
            while (catInfo?.parent?._id) {
                const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
                props.push(...parentCat.properties);
                catInfo = parentCat;
            }
            setPropertiesToFill(props);
        }
    }, [category, categories]);

    async function saveProduct(e) {
        e.preventDefault();
        // Set default values for properties if they are not modified
        const updatedProperties = {...productProperties};
        propertiesToFill.forEach(p => {
            if (!(p.name in updatedProperties)) {
                updatedProperties[p.name] = p.values[0];
            }
        });
        const data = { 
            title, 
            desc, 
            price, 
            image, 
            category, 
            properties: updatedProperties,
        };
        if (_id) {
            // update
            await axios.put('/api/products', {...data, _id});
        } else {
            // create
            try {
                const response = await axios.post('/api/products', data);
            } catch (error) {
                console.error('Error creating product:', error);
            }
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImage(e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            setLoading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImage(oldImage => {
                return [...oldImage, ...res.data.links];
            });
            setLoading(false);
        }
    }

    function updateImageOrder(image) {
        try {
            setImage(image);
        } catch (err) {
            console.log(err);
        }
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    const handleCategoryChange = (categoryId) => {
        setCategory(categoryId);
        setProductProperties({});
        setPropertiesToFill([]);
    };
    
    return (
            <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input type="text" 
            placeholder="Please enter product name" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            />
            <label>Category</label>
            <select 
            value={category} 
            onChange={e => handleCategoryChange(e.target.value)}>
                <option value=''>Uncategoriezed</option>
                {categories.length && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>
            {categoriesLoading && (
                        <tr>
                            <td >
                            <div className="py-4">
                                <Spinner fullWidth={true}/>
                                </div>
                            </td>
                        </tr>
                    )}
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="">
                    <label className="capitalize">{p.name}</label>
                    <div>                    
                        <select 
                        value={productProperties[p.name]}
                        onChange={e => 
                        setProductProp(p.name, e.target.value)
                        }
                        >
                        {p.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                        </select>
                    </div>

                    </div>
            )
            )}
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable 
                list={image}
                className="flex flex-wrap gap-2"
                setList={updateImageOrder}
                >
                {!!image?.length && image.map(link => (
                    <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                        <img src={link} alt="" className="rounded-md"/>
                    </div>
                ))}
                </ReactSortable>
                {loading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-600 rounded-sm bg-white shadow-sm border border-gray-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                    </svg>
                    <div>Upload</div>
                    <input type="file" onChange={uploadImage} className="hidden"/>
                </label>
            </div>
            <label>Product Description</label>
            <textarea 
            placeholder="Please enter description" 
            value={desc}
            onChange={e => setDesc(e.target.value)}
            />
            <label>Product Price (in CAD)</label>
            <input 
            type="number" 
            placeholder="Please enter price" 
            value={price}
            onChange={e => setPrice(e.target.value)}
            />
            <button 
            type="submit"
            className="btn-primary mr-2"
            >
                Submit
                </button>
                <button
                    type="button"
                    className="bg-white text-gray-800 rounded-sm px-4 py-1 shadow-sm border border-gray-200"
                    onClick={() => setGoToProducts(true)}
                >
                    Cancel
                </button>
            </form>
    )
}