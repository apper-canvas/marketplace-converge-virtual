import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { orderService } from "@/services/api/orderService"
import { productService } from "@/services/api/productService"
import { format } from "date-fns"

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [orderData, productsData] = await Promise.all([
        orderService.getById(parseInt(orderId)),
        productService.getAll()
      ])
      
      if (orderData) {
        setOrder(orderData)
        setProducts(productsData)
      } else {
        setError("Order not found")
      }
    } catch (err) {
      setError(err.message || "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  const getProductDetails = (productId) => {
    return products.find(p => p.id === productId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorView 
          error={error || "Order not found"} 
          onRetry={loadOrder}
          title="Order Not Found"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CheckCircle" size={40} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-primary mb-4">Order Confirmed!</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Thank you for your order! We've received your payment and will start processing your order right away.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-card p-8 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-4">Order Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Order Number:</span>
                  <span className="font-mono text-primary font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Order Date:</span>
                  <span className="text-primary">{format(new Date(order.orderDate), "MMMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Status:</span>
                  <Badge variant="success">Confirmed</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Tracking Number:</span>
                  <span className="font-mono text-accent font-medium">{order.trackingNumber}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-4">Shipping Address</h2>
              <div className="text-secondary space-y-1">
                <p className="text-primary font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-primary mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => {
                const product = getProductDetails(item.productId)
                if (!product) return null
                
                return (
                  <div key={item.productId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-primary mb-1">{product.title}</h3>
                      <p className="text-secondary text-sm">Quantity: {item.quantity}</p>
                      <p className="text-secondary text-sm">Price: ${product.price.toFixed(2)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="max-w-md ml-auto space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Subtotal:</span>
                <span className="text-primary font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Shipping:</span>
                <span className="text-primary font-medium">
                  {order.shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    `$${order.shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Tax:</span>
                <span className="text-primary font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-primary">Total:</span>
                  <span className="text-2xl font-bold text-accent">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg shadow-card p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4">Payment Method</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <ApperIcon name="CreditCard" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-primary font-medium">
                Card ending in {order.paymentMethod.last4}
              </p>
              <p className="text-secondary text-sm">{order.paymentMethod.cardName}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="success">Paid</Badge>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Info" size={20} />
            What happens next?
          </h2>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-900">1</span>
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-blue-700">We'll prepare your items for shipment within 1-2 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-900">2</span>
              </div>
              <div>
                <p className="font-medium">Shipping Notification</p>
                <p className="text-sm text-blue-700">You'll receive an email with tracking information once your order ships.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-900">3</span>
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-blue-700">Your order will arrive within 3-7 business days (free shipping orders may take longer).</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/products">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <ApperIcon name="ShoppingBag" size={16} />
              Continue Shopping
            </Button>
          </Link>
          
          <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
            <ApperIcon name="Package" size={16} />
            Track Your Order
          </Button>
          
          <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
            <ApperIcon name="Download" size={16} />
            Download Receipt
          </Button>
        </motion.div>

        {/* Customer Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 p-6 bg-white rounded-lg shadow-card"
        >
          <h3 className="text-lg font-semibold text-primary mb-2">Need Help?</h3>
          <p className="text-secondary mb-4">
            If you have any questions about your order, don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
              <ApperIcon name="Mail" size={16} />
              support@marketplace.com
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
              <ApperIcon name="Phone" size={16} />
              1-800-MARKET
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderConfirmation