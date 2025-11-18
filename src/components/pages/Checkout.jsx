import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"
import { orderService } from "@/services/api/orderService"

const Checkout = () => {
  const navigate = useNavigate()
  const { items, products, getTotal, getTotalItems, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    
    // Order Notes
    notes: ""
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate("/cart")
      return
    }
  }, [items, navigate])

  const subtotal = getTotal()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax
  const totalItems = getTotalItems()

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      // Shipping validation
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.phone) newErrors.phone = "Phone number is required"
      if (!formData.address) newErrors.address = "Address is required"
      if (!formData.city) newErrors.city = "City is required"
      if (!formData.state) newErrors.state = "State is required"
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required"
      
      // Email validation
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
      
      // Phone validation
      if (formData.phone && !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"))) {
        newErrors.phone = "Please enter a valid phone number"
      }
    }
    
    if (step === 2) {
      // Payment validation
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required"
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
      if (!formData.cvv) newErrors.cvv = "CVV is required"
      if (!formData.cardName) newErrors.cardName = "Cardholder name is required"
      
      // Card number validation (basic)
      if (formData.cardNumber && formData.cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number"
      }
      
      // CVV validation
      if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
        newErrors.cvv = "Please enter a valid CVV"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return
    
    setIsSubmitting(true)
    
    try {
      const orderData = {
        items: items,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: {
          type: "credit_card",
          last4: formData.cardNumber.slice(-4),
          cardName: formData.cardName
        },
        notes: formData.notes
      }
      
      const order = await orderService.create(orderData)
      
      // Clear cart after successful order
      clearCart()
      
      // Navigate to confirmation page
      navigate(`/order-confirmation/${order.id}`)
      
      toast.success("Order placed successfully!")
      
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
      console.error("Order submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Review", icon: "CheckCircle" }
  ]

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const formatPhone = (value) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 6) {
      return `(${v.substring(0, 3)}) ${v.substring(3, 6)}-${v.substring(6, 10)}`
    } else if (v.length >= 3) {
      return `(${v.substring(0, 3)}) ${v.substring(3, 6)}`
    }
    return v
  }

  if (items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={`progress-step ${
                    currentStep === step.number ? "active" :
                    currentStep > step.number ? "completed" : "inactive"
                  }`}>
                    {currentStep > step.number ? (
                      <ApperIcon name="Check" size={16} />
                    ) : (
                      <ApperIcon name={step.icon} size={16} />
                    )}
                  </div>
                  <span className={`font-medium ${
                    currentStep >= step.number ? "text-primary" : "text-gray-400"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px ml-4 ${
                    currentStep > step.number ? "bg-success" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-card p-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold text-primary mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      error={errors.firstName}
                      placeholder="John"
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      error={errors.lastName}
                      placeholder="Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      error={errors.email}
                      placeholder="john.doe@example.com"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                      error={errors.phone}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Input
                      label="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      error={errors.address}
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      error={errors.city}
                      placeholder="New York"
                    />
                    <Input
                      label="State"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      error={errors.state}
                      placeholder="NY"
                    />
                    <Input
                      label="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      error={errors.zipCode}
                      placeholder="10001"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold text-primary mb-6">Payment Information</h2>
                  
                  <div className="mb-4">
                    <Input
                      label="Card Number"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                      error={errors.expiryDate}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <Input
                      label="CVV"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                      error={errors.cvv}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Input
                      label="Cardholder Name"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      error={errors.cardName}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <ApperIcon name="Shield" size={16} />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold text-primary mb-6">Review Your Order</h2>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium text-primary">Items ({totalItems})</h3>
                    {items.map((item) => {
                      const product = products.find(p => p.id === item.productId)
                      if (!product) return null
                      
                      return (
                        <div key={item.productId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-primary">{product.title}</h4>
                            <p className="text-secondary text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-primary">${(product.price * item.quantity).toFixed(2)}</p>
                            <p className="text-secondary text-sm">${product.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="font-medium text-primary mb-3">Shipping Address</h3>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-primary">{formData.firstName} {formData.lastName}</p>
                      <p className="text-secondary">{formData.address}</p>
                      <p className="text-secondary">{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p className="text-secondary">{formData.country}</p>
                      <p className="text-secondary mt-2">{formData.email}</p>
                      <p className="text-secondary">{formData.phone}</p>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-medium text-primary mb-3">Payment Method</h3>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-primary">Card ending in {formData.cardNumber.slice(-4)}</p>
                      <p className="text-secondary">{formData.cardName}</p>
                    </div>
                  </div>
                  
                  {/* Order Notes */}
                  <div className="mb-6">
                    <label className="form-label">Order Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any special instructions for your order..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors duration-200 resize-none"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <div>
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handlePrevious}>
                      <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                      Previous
                    </Button>
                  )}
                </div>
                
                <div>
                  {currentStep < 3 ? (
                    <Button onClick={handleNext}>
                      Next
                      <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="CreditCard" size={16} />
                          Place Order
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-primary mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Subtotal ({totalItems} items)</span>
                  <span className="text-primary font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Shipping</span>
                  <span className="text-primary font-medium">
                    {shipping === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Tax</span>
                  <span className="text-primary font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-primary">Total</span>
                    <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-secondary">
                  <ApperIcon name="Shield" size={16} />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <ApperIcon name="Lock" size={16} />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <ApperIcon name="RotateCcw" size={16} />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout