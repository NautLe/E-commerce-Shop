import React, { useEffect, useState } from 'react'
import '../AdminStyles/UpdateProduct.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { removeErrors, removeSuccess, updateAdminProduct } from '../features/admin/adminSlice'
import { getProductDetails } from '../features/products/productSlice'
import { showToast } from '../utils/showToast'
const UpdateProduct = () => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [stock, setStock] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [oldImage, setOldImage] = useState([])
    const [image, setImage] = useState([])

    const [imagePreview, setImagePreview] = useState([])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setImage([])
        setImagePreview([])

        files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview((old) => [...old, reader.result])
                    setImage((old) => [...old, reader.result])

                }
            }
            reader.readAsDataURL(file)
        })
    }
    const categories = ['men', 'women', 'unisex', 'essentials']
    const subcategoriesMap = {
        men: ['Tops', 'Bottoms', 'Dresses', 'Outerwear'],
        women: ['Tops', 'Bottoms', 'Dresses', 'Outerwear'],
        unisex: ['Tops', 'Bottoms', 'Dresses', 'Outerwear'],
        essentials: ['Headwear', 'Eyewear', 'Bags', 'Accessories', 'Sport']
    }

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setCategory(val);
        setSubcategory("");
    }

    const { product } = useSelector(state => state.product)
    const { updateId } = useParams()
    const { success, error, loading } = useSelector(state => state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(getProductDetails(updateId))
    }, [dispatch, updateId])

    useEffect(() => {
        if (product) {
            setName(product.name || '')
            setPrice(product.price || '')
            setDescription(product.description || '')
            setCategory(product.category || '')
            setSubcategory(product.subcategory || '')
            setStock(product.stock || '')
            setOldImage(product.image || [])

        }
    }, [product])
    useEffect(() => {
        if (success) {
            showToast.success("Product Updated Successfully")
            dispatch(removeSuccess())
            navigate('/admin/products')
        }
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
    }, [dispatch, error, success])
    const updateProductSubmit = (e) => {
        e.preventDefault();
        if (Number(price) && stock <= 0) {
            showToast.error("Value must be greater than 0.")
            return
        }
        const myForm = new FormData()
        myForm.set('name', name)
        myForm.set('price', Number(price).toFixed(2))
        myForm.set('description', description)
        myForm.set('category', category)
        myForm.set('subcategory', subcategory)
        myForm.set('stock', stock)
        image.forEach((img) => {
            myForm.append('image', img)
        })
        dispatch(updateAdminProduct({ id: updateId, formData: myForm }))
    }
    return (
        <>
            <Navbar />
            <PageTitle title="Update Product" />
            <div className="update-product-wrapper">
                <h1 className="update-product-title">Update Product</h1>
                <form className='update-product-form' encType='multipart/form-data' onSubmit={updateProductSubmit}>
                    <label htmlFor="name">Product Name</label>
                    <input type="text" className='update-product-input' required id="name" name='name' value={name} onChange={(e) => setName(e.target.value)} />

                    <label htmlFor="price">Product Price</label>
                    <input type="number" className='update-product-input' required id="price" name='price' value={price} onChange={(e) => setPrice(e.target.value)} />

                    <label htmlFor="description">Product Description</label>
                    <textarea type="text" className='update-product-textarea' required id="description" name='description' value={description} onChange={(e) => setDescription(e.target.value)} />

                    <label htmlFor="category">Product Category</label>
                    <select required id="category" name='category' className='update-product-select' value={category} onChange={handleCategoryChange}>
                        <option value="">Choose a category</option>
                        {categories.map((item) => (<option value={item} key={item}>{item}</option>))}
                    </select>

                    <label htmlFor="subcategory">Subcategory</label>
                    <select id="subcategory" name='subcategory' className='update-product-select' value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
                        <option value="">Choose Subcategory (Optional)</option>
                        {category && subcategoriesMap[category.toLowerCase()]?.map((item) => (
                            <option value={item} key={item}>{item}</option>
                        ))}
                    </select>



                    <label htmlFor="stock">Product Stock</label>
                    <input type="number" className='update-product-input' required id="stock" name='stock' value={stock} onChange={(e) => setStock(e.target.value)} />

                    <label htmlFor="image">Product Images</label>
                    <div className="update-product-file-wrapper">
                        <input type="file"
                            accept='image/*'
                            name='image' multiple
                            className='update-product-file-input' onChange={handleImageChange} />
                    </div>
                    <div className="update-product-preview-wrapper">
                        {imagePreview.map((img, index) => (
                            <img src={img} key={index} alt="product preview" className="update-product-preview-image" />
                        ))}
                    </div>
                    <div className="update-product-old-images-wrapper">
                        {oldImage.map((img, index) => (
                            <img src={img.url} key={index} alt="Old product preview" className='update-product-old-image' />
                        ))}
                    </div>
                    <button className="update-product-submit-btn">{loading ? 'Updating...' : 'Update'}</button>
                </form>
            </div>
            <Footer />
        </>
    )
}
export default UpdateProduct