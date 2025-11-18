import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Home from "@/components/pages/Home";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { addItem, isInCart } = useCart()

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await productService.getById(parseInt(id))
      if (data) {
        setProduct(data)
        setSelectedImage(0)
        setIsImageLoaded(false)
      } else {
        setError("Product not found")
      }
    } catch (err) {
      setError(err.message || "Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
if (!product || (!product.inStock && product.stockCount === 0)) return
    addItem(product, quantity)
    toast.success(`Added ${quantity} ${product.title}${quantity > 1 ? 's' : ''} to cart!`)
  }

  const handleBuyNow = () => {
if (!product || (!product.inStock && product.stockCount === 0)) return
    addItem(product, quantity)
    navigate("/checkout")
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        size={16}
        className={index < Math.floor(rating) ? "star-filled" : "star-empty"}
        fill={index < Math.floor(rating) ? "currentColor" : "none"}
      />
    ))
  }

  if (loading) {
    return <Loading variant="product-detail" />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorView 
          error={error} 
          onRetry={loadProduct}
          title={error === "Product not found" ? "Product Not Found" : "Error Loading Product"}
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorView 
          error="Product not found" 
          onRetry={() => navigate("/products")}
          title="Product Not Found"
        />
      </div>
    )
  }

  const hasDiscount = product.originalPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const savings = hasDiscount ? product.originalPrice - product.price : 0

  return (
    <div className="min-h-screen bg-background py-8">
    <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-secondary mb-8">
            <button
                onClick={() => navigate("/")}
                className="hover:text-accent transition-colors duration-200">Home
                          </button>
            <ApperIcon name="ChevronRight" size={16} />
            <button
                onClick={() => navigate("/products")}
                className="hover:text-accent transition-colors duration-200">Products
                          </button>
            <ApperIcon name="ChevronRight" size={16} />
            <button
                onClick={() => navigate(`/products?category=${product.category}`)}
                className="hover:text-accent transition-colors duration-200">
                {product.category}
            </button>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-primary">{product.title}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    className="aspect-square bg-white rounded-lg shadow-card overflow-hidden relative">
                    {!isImageLoaded && <div className="absolute inset-0 skeleton" />}
                    <img
                        src={product.images[selectedImage]}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setIsImageLoaded(true)} />
                    {hasDiscount && <Badge
                        variant="accent"
                        className="absolute top-4 left-4 savings-badge text-base px-3 py-1">-{discountPercentage}% OFF
                                        </Badge>}
                    {/* Stock Status Overlay */}
                    {!product.inStock ? <div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="error" className="text-lg px-4 py-2">Out of Stock</Badge>
                    </div> : product.stockCount <= 10 && product.stockCount > 0 ? <div className="absolute top-4 left-4">
                        <Badge className="bg-warning text-white text-sm px-3 py-1">Low Stock - Only {product.stockCount}left!
                                              </Badge>
                    </div> : null}
                </motion.div>
                {/* Image Thumbnails */}
                {product.images.length > 1 && <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => <button
                        key={index}
                        onClick={() => {
                            setSelectedImage(index);
                            setIsImageLoaded(false);
                        }}
                        className={`aspect-square bg-white rounded-lg shadow-card overflow-hidden border-2 transition-all duration-200 ${selectedImage === index ? "border-accent shadow-card-hover" : "border-transparent hover:border-gray-300"}`}>
                        <img
                            src={image}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover" />
                    </button>)}
                </div>}
            </div>
            {/* Product Info */}
            <div className="space-y-6">
                <div>
                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                        {product.title}
                    </motion.h1>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {renderStars(product.rating)}
                            </div>
                            <span className="text-primary font-medium">{product.rating.toFixed(1)}</span>
                            <span className="text-secondary">({product.reviewCount}reviews)</span>
                        </div>
                        <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        {hasDiscount && <span className="price-original text-xl">${product.originalPrice.toFixed(2)}</span>}
                        <span
                            className={`text-3xl font-bold ${hasDiscount ? "price-sale" : "text-primary"}`}>${product.price.toFixed(2)}
                        </span>
                        {hasDiscount && <Badge variant="success" className="text-sm">Save ${savings.toFixed(2)}
                        </Badge>}
                    </div>
                    <p className="text-secondary text-lg leading-relaxed mb-6">
                        {product.description}
                    </p>
                </div>
                {/* Specifications */}
                {product.specifications && <div className="bg-white rounded-lg shadow-card p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(product.specifications).map(([key, value]) => <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-secondary capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span className="text-primary font-medium">{value}</span>
                        </div>)}
                    </div>
                </div>}
                {/* Stock and Quantity */}
                <div className="bg-white rounded-lg shadow-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-secondary">Availability:</span>
                        <div className="flex items-center gap-2">
                            {!product.inStock ? <Badge variant="error" className="px-2 py-1 text-xs">Out of Stock</Badge> : product.stockCount <= 10 ? <Badge className="bg-warning text-white px-2 py-1 text-xs">Low Stock</Badge> : <Badge className="bg-success text-white px-2 py-1 text-xs">In Stock</Badge>}
                            <span
                                className={`font-medium ${!product.inStock ? "text-error" : product.stockCount <= 10 ? "text-warning" : "text-success"}`}>
                                {!product.inStock ? "Currently unavailable" : `${product.stockCount} available`}
                            </span>
                        </div>
                    </div>
                </div>
                {product.inStock && <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="text-secondary">Quantity:</label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="quantity-button rounded-l">
                                <ApperIcon name="Minus" size={16} />
                            </button>
                            <span
                                className="px-4 py-2 border-t border-b border-gray-300 min-w-16 text-center font-medium">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                                className={cn(
                                    "quantity-button rounded-r",
                                    quantity >= product.stockCount && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={quantity >= product.stockCount || !product.inStock}
                                title={quantity >= product.stockCount ? "Maximum stock reached" : ""}>
                                <ApperIcon name="Plus" size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={handleAddToCart}
                            variant="outline"
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2",
                                !product.inStock && "opacity-50 cursor-not-allowed",
                                product.stockCount <= 10 && product.inStock && "border-warning hover:bg-warning hover:text-white"
                            )}
                            disabled={isInCart(product.id) || !product.inStock}
                            title={!product.inStock ? "Out of stock" : product.stockCount <= 10 ? "Low stock item" : ""}>
                            <ApperIcon name={isInCart(product.id) ? "Check" : "ShoppingCart"} size={20} />
                            {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                        </Button>
                        <Button
                            onClick={handleBuyNow}
                            className="flex-1 flex items-center justify-center gap-2">
                            <ApperIcon name="CreditCard" size={20} />Buy Now
                                                </Button>
                    </div>
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-secondary text-sm">Total: <span className="font-bold text-primary text-lg">${(product.price * quantity).toFixed(2)}
                            </span>
                            {quantity > 1 && <span className="text-secondary ml-2">(${product.price.toFixed(2)}each)
                                                        </span>}
                        </p>
                    </div>
                </div>}
            </div>
        </div>
    </div>
</div>
  )
}

export default ProductDetail