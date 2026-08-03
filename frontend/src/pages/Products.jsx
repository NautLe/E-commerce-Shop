import React, { useEffect, useState, useMemo } from 'react';
import '../pageStyles/Products.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NoProduct from '../components/NoProduct';
import { showToast } from '../utils/showToast';
import Pagination from '../components/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { Clear } from '@mui/icons-material';
const Products = ({ categoryProp }) => {
  const { loading, error, products, resultsPerPage, productCount, filteredProductsCount } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const searchParams = new URLSearchParams(location.search);

  const urlKeyword = searchParams.get("keyword") || '';
  const activeCategory = categoryProp || params.categoryName || searchParams.get("category") || '';
  const page = parseInt(searchParams.get("page"), 10) || 1;

  const [currentPage, setCurrentPage] = useState(page);
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState('default');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [searchInput, setSearchInput] = useState(urlKeyword);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const subcategoryList = useMemo(() => {
    if (!activeCategory || activeCategory.toLowerCase() === 'all') {
      return ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Headwear", "Eyewear", "Bags", "Accessories", "Sport"];
    }
    if (activeCategory.toLowerCase() === 'essentials') {
      return ["All", "Headwear", "Eyewear", "Bags", "Accessories", "Sport"];
    }
    return ["All", "Tops", "Bottoms", "Dresses", "Outerwear"];
  }, [activeCategory]);

  useEffect(() => {
    setSearchInput(urlKeyword);
  }, [urlKeyword]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    const isSubcatValid = subcategoryList.some(
      (sub) => sub.toLowerCase() === selectedSubcategory.toLowerCase()
    );
    if (!isSubcatValid) {
      setSelectedSubcategory('All');
      setCurrentPage(1);
    }
  }, [activeCategory, subcategoryList, selectedSubcategory]);

  useEffect(() => {
    const isSubcatValid = subcategoryList.some(
      (sub) => sub.toLowerCase() === selectedSubcategory.toLowerCase()
    );
    const validSubcategory = isSubcatValid ? selectedSubcategory : 'All';

    dispatch(
      getProduct({
        keyword: searchInput,
        page: currentPage,
        category: activeCategory,
        subcategory: validSubcategory !== 'All' ? validSubcategory : undefined,
        sort: sortBy,
        minPrice,
        maxPrice,
        inStock: inStockOnly
      })
    );
  }, [dispatch, searchInput, currentPage, activeCategory, selectedSubcategory, sortBy, minPrice, maxPrice, inStockOnly, subcategoryList]);

  useEffect(() => {
    if (error) {
      showToast.error(typeof error === 'string' ? error : error.response?.data?.message || error.message);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      const newSearchParams = new URLSearchParams(location.search);
      if (newPage === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', newPage);
      }
      navigate(`/products?${newSearchParams.toString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setCurrentPage(1);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('keyword');
    newSearchParams.delete('page');
    navigate(`/products?${newSearchParams.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSubcategory('All');
    setSortBy('default');
    setInStockOnly(false);
    setCurrentPage(1);
    navigate('/products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubcategoryClick = (subCat) => {
    setCurrentPage(1);
    setSelectedSubcategory(subCat);
  };

  const displayTitle = activeCategory
    ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection`
    : 'All Products';

  return (
    <>
      <PageTitle title={`${displayTitle} | MOCHA`} />
      <Navbar />

      <div className='products-layout'>


        {/* MAIN PRODUCTS SECTION */}
        <div className='products-section'>
          <div className="category-header-banner">
            <h2>{displayTitle}</h2>
            <p>Explore our curated selection of high-quality {activeCategory ? activeCategory.toLowerCase() : 'everyday'} wear.</p>
          </div>

          {/* SUBCATEGORY HORIZONTAL TABS BAR */}
          <div className="subcategory-tabs-container">
            <div className="subcategory-tabs-bar">
              {subcategoryList.map((subCat) => {
                const isSelected = selectedSubcategory.toLowerCase() === subCat.toLowerCase();
                return (
                  <button
                    key={subCat}
                    className={`subcategory-tab-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSubcategoryClick(subCat)}
                  >
                    {subCat.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ADVANCED SEARCH & TOOLBAR */}
          <div className='advanced-search-bar-container'>
            <div className='search-input-wrapper'>
              <SearchIcon className='search-icon' />
              <input
                type="text"
                className='advanced-search-input'
                placeholder="Search products by name, category, or description..."
                value={searchInput}
                onChange={handleSearchChange}
              />
              {searchInput && (
                <button type="button" className='clear-search-icon-btn' onClick={handleClearSearch}>
                  <Clear/>
                </button>
              )}
            </div>
          </div>

          <div className="products-toolbar">
            <div className="products-count">
              Showing <strong>{products?.length || 0}</strong> {filteredProductsCount !== undefined ? `of ${filteredProductsCount}` : ''} products
            </div>

            <div className="sort-by-container">
              <label htmlFor="sort-select">Sort By:</label>
              <select
                id="sort-select"
                className="sort-by-select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              >
                <option value="default">Featured / Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="ratings">Top Rated</option>
                <option value="newest">Latest Arrivals</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="products-loader-wrapper">
              <Loader />
            </div>
          ) : products && products.length > 0 ? (
            <div className={`products-product-container ${products.length <= 3 ? 'few-products' : ''}`}>
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <NoProduct keyword={searchInput || activeCategory} />
          )}

          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Products;