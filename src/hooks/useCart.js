import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { productService } from "@/services/api/productService"

export const useCart = () => {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("marketplace-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse saved cart:", error)
        localStorage.removeItem("marketplace-cart")
      }
    }
  }, [])

  // Load products data
  useEffect(() => {
    loadProducts()
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("marketplace-cart", JSON.stringify(items))
  }, [items])

  const loadProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error("Failed to load products:", error)
    }
  }

  const addItem = (product, quantity = 1) => {
    if (!product || !product.inStock) {
      toast.error("This product is not available")
      return false
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stockCount) {
          toast.error(`Only ${product.stockCount} items available in stock`)
          return prevItems
        }
        
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      } else {
        if (quantity > product.stockCount) {
          toast.error(`Only ${product.stockCount} items available in stock`)
          return prevItems
        }
        
        return [...prevItems, { productId: product.id, quantity }]
      }
    })

    return true
  }

  const removeItem = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId))
    toast.success("Item removed from cart")
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }

    const product = products.find(p => p.id === productId)
    if (product && quantity > product.stockCount) {
      toast.error(`Only ${product.stockCount} items available in stock`)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (productId) => {
    return items.some(item => item.productId === productId)
  }

  const getItemQuantity = (productId) => {
    const item = items.find(item => item.productId === productId)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)
      return product ? total + (product.price * item.quantity) : total
    }, 0)
  }

  const getCartItemsWithProducts = () => {
    return items.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        ...item,
        product
      }
    }).filter(item => item.product) // Filter out items where product wasn't found
  }

  return {
    items,
    products,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    getTotalItems,
    getTotal,
    getCartItemsWithProducts
  }
}