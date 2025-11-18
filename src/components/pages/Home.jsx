import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ProductCard from "@/components/molecules/ProductCard"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"
import { useCart } from "@/hooks/useCart"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addItem, isInCart } = useCart()

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [products] = await Promise.all([
        productService.getAll()
      ])
      
      // Get featured products (highest rated or newest)
      const featured = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
      
      // Get unique categories
      const uniqueCategories = [...new Set(products.map(p => p.category))]
      setCategories(uniqueCategories)
      
      setFeaturedProducts(featured)
    } catch (err) {
      setError(err.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const categoryImages = {
    "Electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    "Clothing": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    "Books": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    "Sports": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    "Home": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="skeleton h-12 w-96 mx-auto mb-4 bg-white bg-opacity-20" />
            <div className="skeleton h-6 w-64 mx-auto bg-white bg-opacity-20" />
          </div>
        </div>
        
        {/* Featured Products Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Loading variant="products" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorView error={error} onRetry={loadHomeData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Discover Amazing Products
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                At Great Prices
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto">
              Shop from thousands of products across multiple categories. Fast shipping, easy returns, and unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-red-600 transition-all duration-200 w-full sm:w-auto"
                >
                  Shop Now
                </motion.button>
              </Link>
              <Link to="/products?category=Electronics">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto"
                >
                  Browse Categories
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse" />
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-accent bg-opacity-30 rounded-full animate-pulse" />
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.slice(0, 5).map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group-hover:scale-105">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={categoryImages[category] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"}
                        alt={category}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg">{category}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Handpicked products that our customers love most. High quality, great value.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={addItem}
                  isInCart={isInCart(product.id)}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-2"
              >
                View All Products
                <ApperIcon name="ArrowRight" size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "Truck",
                title: "Free Shipping",
                description: "Free shipping on orders over $50"
              },
              {
                icon: "Shield",
                title: "Secure Payment",
                description: "Your payment information is safe and secure"
              },
              {
                icon: "RotateCcw",
                title: "Easy Returns",
                description: "30-day hassle-free return policy"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name={feature.icon} size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home