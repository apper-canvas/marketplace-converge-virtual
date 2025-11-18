import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* 404 Illustration */}
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-accent to-red-600 rounded-full flex items-center justify-center">
                <ApperIcon name="ShoppingBag" size={40} className="text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">Page Not Found</h1>
            <p className="text-secondary text-lg">
              Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full flex items-center justify-center gap-2">
                <ApperIcon name="Home" size={16} />
                Go Home
              </Button>
            </Link>
            
            <Link to="/products" className="block">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <ApperIcon name="ShoppingBag" size={16} />
                Browse Products
              </Button>
            </Link>
          </div>

          {/* Help Links */}
          <div className="pt-8 space-y-2">
            <p className="text-sm text-secondary">Need help finding something?</p>
            <div className="flex flex-col space-y-2">
              <Link to="/products" className="text-accent hover:text-red-600 transition-colors duration-200 text-sm">
                View All Products
              </Link>
              <Link to="/" className="text-accent hover:text-red-600 transition-colors duration-200 text-sm">
                Browse Categories
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound