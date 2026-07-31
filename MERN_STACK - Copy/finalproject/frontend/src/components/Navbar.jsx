import React, { useState, useEffect, useMemo } from 'react'
import '../componentStyles/Navbar.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useSelector } from 'react-redux'
import UserDashBoard from '../UserAuthentication/UserDashBoard'
import axios from '../utils/axiosInstance'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All')
    const [selectedPriceFilter, setSelectedPriceFilter] = useState('All')
    const [liveProducts, setLiveProducts] = useState([])

    const { isAuthenticated, user } = useSelector(state => state.user)
    const { cartItems } = useSelector(state => state.cart)

    const location = useLocation()
    const navigate = useNavigate()

    const searchParams = new URLSearchParams(location.search)
    const activeCategory = searchParams.get('category')?.toLowerCase() || ''

    const categories = ["All", "Women", "Men", "Unisex", "Essentials"]
    const priceRanges = [
        { label: "All Prices", value: "All" },
        { label: "Under $30", value: "under30" },
        { label: "$30 - $60", value: "30to60" },
        { label: "Over $60", value: "over60" }
    ]

    useEffect(() => {
        if (!isSearchOpen) return

        let link = '/api/v1/products?limit=50'
        if (searchQuery.trim()) link += `&keyword=${encodeURIComponent(searchQuery.trim())}`
        if (selectedCategoryFilter !== 'All') link += `&category=${encodeURIComponent(selectedCategoryFilter.toLowerCase())}`
        if (selectedPriceFilter === 'under30') link += `&maxPrice=30`
        else if (selectedPriceFilter === '30to60') link += `&minPrice=30&maxPrice=60`
        else if (selectedPriceFilter === 'over60') link += `&minPrice=60`

        const timer = setTimeout(() => {
            axios.get(link).then(res => {
                if (res.data?.products) {
                    setLiveProducts(res.data.products)
                }
            }).catch(() => {})
        }, 150)

        return () => clearTimeout(timer)
    }, [isSearchOpen, searchQuery, selectedCategoryFilter, selectedPriceFilter])

    const filteredLiveProducts = useMemo(() => {
        return liveProducts.slice(0, 6)
    }, [liveProducts])

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault()
        const params = new URLSearchParams()
        if (searchQuery.trim()) params.set('keyword', searchQuery.trim())
        if (selectedCategoryFilter !== 'All') params.set('category', selectedCategoryFilter.toLowerCase())

        if (selectedPriceFilter === 'under30') {
            params.set('maxPrice', '30')
        } else if (selectedPriceFilter === '30to60') {
            params.set('minPrice', '30')
            params.set('maxPrice', '60')
        } else if (selectedPriceFilter === 'over60') {
            params.set('minPrice', '60')
        }

        const queryString = params.toString()
        navigate(queryString ? `/products?${queryString}` : '/products')
        setIsSearchOpen(false)
    }

    const resetFilters = () => {
        setSearchQuery('')
        setSelectedCategoryFilter('All')
        setSelectedPriceFilter('All')
    }

    return (
        <header className="mocha-header navbar-fixed">
            <Link to="/" className="mocha-logo" onClick={() => setIsMenuOpen(false)}>
                MOCHA
            </Link>
            <nav className={`mocha-nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link
                    to="/products?category=women"
                    className={activeCategory === 'women' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Women
                </Link>
                <Link
                    to="/products?category=men"
                    className={activeCategory === 'men' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Men
                </Link>
                <Link
                    to="/products?category=unisex"
                    className={activeCategory === 'unisex' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Unisex
                </Link>
                <Link
                    to="/products?category=essentials"
                    className={activeCategory === 'essentials' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Essentials
                </Link>
            </nav>

            <div className="mocha-actions">
                <div className="search-container">
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search">
                        {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
                    </button>
                </div>

                <Link to="/cart" className="mocha-cart-btn" aria-label="Cart">
                    <ShoppingCartOutlinedIcon />
                    {cartItems && cartItems.length > 0 && (
                        <span className="mocha-cart-badge">{cartItems.length}</span>
                    )}
                </Link>

                {isAuthenticated && user ? (
                    <UserDashBoard user={user} />
                ) : (
                    <Link to="/login" aria-label="Log in">
                        <AccountCircleOutlinedIcon />
                    </Link>
                )}

                <button className="mocha-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                    {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* EXPANDABLE ADVANCED SEARCH & FILTER OVERLAY */}
            {isSearchOpen && (
                <div className="search-filter-overlay">
                    <form className="search-overlay-form" onSubmit={handleSearchSubmit}>
                        <div className="search-overlay-input-group">
                            <SearchIcon className="search-overlay-icon" />
                            <input
                                type="text"
                                className="search-overlay-input"
                                placeholder="Search products by name, category, or description..."
                                value={searchQuery}
                                autoFocus
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button type="button" className="search-overlay-clear" onClick={() => setSearchQuery('')}>
                                    ✕
                                </button>
                            )}
                            <button type="submit" className="search-overlay-submit-btn">
                                Search
                            </button>
                        </div>

                        {/* FILTERS SECTION IN OVERLAY */}
                        <div className="search-overlay-filters">
                            <div className="filter-group">
                                <span className="filter-group-title">Category:</span>
                                <div className="filter-chips">
                                    {categories.map((cat) => (
                                        <button
                                            type="button"
                                            key={cat}
                                            className={`filter-chip ${selectedCategoryFilter === cat ? 'active' : ''}`}
                                            onClick={() => setSelectedCategoryFilter(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <span className="filter-group-title">Price Range:</span>
                                <div className="filter-chips">
                                    {priceRanges.map((pr) => (
                                        <button
                                            type="button"
                                            key={pr.value}
                                            className={`filter-chip ${selectedPriceFilter === pr.value ? 'active' : ''}`}
                                            onClick={() => setSelectedPriceFilter(pr.value)}
                                        >
                                            {pr.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {(searchQuery || selectedCategoryFilter !== 'All' || selectedPriceFilter !== 'All') && (
                                <button type="button" className="reset-overlay-filters-btn" onClick={resetFilters}>
                                    Reset Filters
                                </button>
                            )}
                        </div>

                        {/* LIVE MATCHING PRODUCT PREVIEW */}
                        {filteredLiveProducts.length > 0 && (
                            <div className="search-live-results">
                                <div className="search-live-header">
                                    <span>Matching Products ({filteredLiveProducts.length})</span>
                                    <button type="submit" className="view-all-link-btn">
                                        View All ({filteredLiveProducts.length}) →
                                    </button>
                                </div>
                                <div className="search-live-grid">
                                    {filteredLiveProducts.map((p) => (
                                        <Link
                                            to={`/product/${p._id}`}
                                            key={p._id}
                                            className="search-live-item"
                                            onClick={() => setIsSearchOpen(false)}
                                        >
                                            <img src={p.image?.[0]?.url || '/images/tshirt-white.jpg'} alt={p.name} />
                                            <div className="search-live-info">
                                                <h4>{p.name}</h4>
                                                <p>${Number(p.price).toFixed(2)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </header>
    )
}

export default Navbar