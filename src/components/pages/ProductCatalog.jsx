import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import ProductGrid from "@/components/organisms/ProductGrid"
import { CategoryFilter, PriceFilter, RatingFilter, ActiveFilters } from "@/components/molecules/FilterSection"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    minRating: 0,
    inStockOnly: false,
    searchQuery: ""
  })

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    // Initialize filters from URL params
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rating = searchParams.get("rating")
    
    setFilters(prev => ({
      ...prev,
      categories: category ? [category] : [],
      searchQuery: search || "",
      priceRange: [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 1000
      ],
      minRating: rating ? parseInt(rating) : 0
    }))
  }, [searchParams])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await productService.getAll()
      setProducts(data)
} catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Failed to load products"
      console.error("ProductCatalog - Error loading products:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      )
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    )

    // Filter by rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.minRating)
    }

    // Filter by stock
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock)
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    
    // Update URL params
    const params = new URLSearchParams()
    if (newFilters.categories?.length > 0) {
      params.set("category", newFilters.categories[0])
    }
    if (newFilters.searchQuery) {
      params.set("search", newFilters.searchQuery)
    }
    if (newFilters.priceRange?.[0] > 0) {
      params.set("minPrice", newFilters.priceRange[0].toString())
    }
    if (newFilters.priceRange?.[1] < 1000) {
      params.set("maxPrice", newFilters.priceRange[1].toString())
    }
    if (newFilters.minRating > 0) {
      params.set("rating", newFilters.minRating.toString())
    }
    
    setSearchParams(params)
  }

  const removeFilter = (type, value) => {
    switch (type) {
      case "category":
        updateFilters({
          categories: filters.categories.filter(c => c !== value)
        })
        break
      case "price":
        updateFilters({ priceRange: [0, 1000] })
        break
      case "rating":
        updateFilters({ minRating: 0 })
        break
      case "stock":
        updateFilters({ inStockOnly: false })
        break
    }
  }

  const clearAllFilters = () => {
    updateFilters({
      categories: [],
      priceRange: [0, 1000],
      minRating: 0,
      inStockOnly: false,
      searchQuery: ""
    })
  }

  const categories = [...new Set(products.map(p => p.category))]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {filters.searchQuery 
              ? `Search Results for "${filters.searchQuery}"`
              : filters.categories.length > 0 
                ? filters.categories.join(", ")
                : "All Products"
            }
          </h1>
          <p className="text-secondary">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-card border border-gray-200 hover:shadow-card-hover transition-all duration-200"
            >
              <ApperIcon name="SlidersHorizontal" size={20} />
              Filters
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className={`
            lg:w-80 flex-shrink-0
            lg:block ${isSidebarOpen ? "block" : "hidden"}
            lg:relative fixed inset-0 z-50 lg:z-auto
            bg-white lg:bg-transparent
            overflow-y-auto lg:overflow-visible
          `}>
            <div className="lg:sticky lg:top-8 bg-white rounded-lg shadow-card p-6 space-y-6">
              {/* Mobile Close Button */}
              <div className="lg:hidden flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-secondary hover:text-primary transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <ActiveFilters
                filters={filters}
                onRemoveFilter={removeFilter}
                onClearAll={clearAllFilters}
              />

              <CategoryFilter
                categories={categories}
                selectedCategories={filters.categories}
                onChange={(categories) => updateFilters({ categories })}
              />

              <PriceFilter
                priceRange={filters.priceRange}
                onChange={(priceRange) => updateFilters({ priceRange })}
              />

              <RatingFilter
                minRating={filters.minRating}
                onChange={(minRating) => updateFilters({ minRating })}
              />

              <div className="space-y-3">
                <h3 className="font-medium text-primary">Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => updateFilters({ inStockOnly: e.target.checked })}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-primary">In stock only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadProducts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog