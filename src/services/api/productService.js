import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";

class ProductService {
  // Safe JSON parsing utility to handle malformed data
  static safeJsonParse(jsonString, fallback = null) {
    if (!jsonString || typeof jsonString !== 'string') {
      return fallback;
    }
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('JSON parsing failed:', error.message, 'Data:', jsonString);
      return fallback;
    }
  }
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "images_c"}}
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      console.log('ProductService: Fetching products with params:', params)
      const response = await apperClient.fetchRecords('products_c', params)
      
      console.log('ProductService: Raw response:', response)
      console.log('ProductService: Response success:', response?.success)
      console.log('ProductService: Response data length:', response?.data?.length)
      
      if (!response.success) {
        console.error('ProductService: Fetch failed:', response.message)
        toast.error(response.message)
        return []
      }

      if (!response.data || response.data.length === 0) {
        console.log('ProductService: No products found in database')
        return []
      }

      console.log('ProductService: Raw product data:', response.data)

      const transformedProducts = response.data.map(product => {
        console.log('ProductService: Transforming product:', product)
        return {
          Id: product.Id,
          id: product.Id, // Keep for backward compatibility
          title: product.title_c || product.Name,
          description: product.description_c,
          price: product.price_c,
          originalPrice: product.original_price_c,
          category: product.category_c,
          subcategory: product.subcategory_c,
          rating: product.rating_c,
          reviewCount: product.review_count_c,
          inStock: product.in_stock_c,
          stockCount: product.stock_count_c,
          specifications: ProductService.safeJsonParse(product.specifications_c, null),
          images: ProductService.safeJsonParse(product.images_c, [])
        }
      })

      console.log('ProductService: Transformed products:', transformedProducts)
      return transformedProducts
    } catch (error) {
      console.error(`productService.getAll - Network/parsing error: ${error?.response?.data?.message || error.message || 'Unknown error'}`)
      return []
    }
  }

async getById(id) {
    try {
      // Validate SDK availability
      if (typeof window === 'undefined' || !window.ApperSDK) {
        console.error('productService.getById - ApperSDK not available on window object')
        return null
      }

      const apperClient = getApperClient()
      if (!apperClient) {
        console.error('productService.getById - ApperClient not initialized')
        return null
      }

      // Validate ID parameter
      const productId = parseInt(id)
      if (isNaN(productId) || productId <= 0) {
        console.error(`productService.getById - Invalid ID provided: ${id}`)
        return null
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "images_c"}}
        ]
      }

      console.log(`productService.getById - Fetching product ID ${productId}`)
      const response = await apperClient.getRecordById('products_c', productId, params)
      
      if (!response.success) {
        console.error(`productService.getById - API error for ID ${id}: ${response.message}`)
        return null
      }

      const product = response.data
      if (!product) {
        console.log(`productService.getById - No product found for ID ${id}`)
        return null
      }

      return {
        Id: product.Id,
        id: product.Id, // Keep for backward compatibility
        title: product.title_c || product.Name,
        description: product.description_c,
        price: product.price_c,
        originalPrice: product.original_price_c,
        category: product.category_c,
        subcategory: product.subcategory_c,
        rating: product.rating_c,
        reviewCount: product.review_count_c,
        inStock: product.in_stock_c,
        stockCount: product.stock_count_c,
        specifications: ProductService.safeJsonParse(product.specifications_c, null),
        images: ProductService.safeJsonParse(product.images_c, [])
      }
    } catch (error) {
      // Enhanced error logging with more context
      const errorMessage = error?.response?.data?.message || error.message || 'Unknown error'
      const errorType = error.name || 'Error'
      console.error(`productService.getById - ${errorType} for ID ${id}: ${errorMessage}`)
      
      // Additional debugging information
      if (error.stack) {
        console.error('Stack trace:', error.stack)
      }
      
      return null
    }
  }

  async getByCategory(category) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "images_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category],
          "Include": true
        }]
      }

      const response = await apperClient.fetchRecords('products_c', params)
      
if (!response.success) {
        console.error(`productService.getByCategory - API error for category "${category}": ${response.message}`)
        return []
      }

      return response.data.map(product => ({
        Id: product.Id,
        id: product.Id, // Keep for backward compatibility
        title: product.title_c || product.Name,
        description: product.description_c,
        price: product.price_c,
        originalPrice: product.original_price_c,
        category: product.category_c,
        subcategory: product.subcategory_c,
        rating: product.rating_c,
        reviewCount: product.review_count_c,
        inStock: product.in_stock_c,
        stockCount: product.stock_count_c,
specifications: ProductService.safeJsonParse(product.specifications_c, null),
        images: ProductService.safeJsonParse(product.images_c, [])
      }))
    } catch (error) {
console.error(`productService.getByCategory - Network/parsing error for category "${category}": ${error?.response?.data?.message || error.message || 'Unknown error'}`)
      return []
    }
  }

  async searchProducts(query) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "images_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "title_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "description_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "category_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            }
          ]
        }]
      }

      const response = await apperClient.fetchRecords('products_c', params)
      
if (!response.success) {
        console.error(`productService.search - API error for query "${query}": ${response.message}`)
        return []
      }

      return response.data.map(product => ({
        Id: product.Id,
        id: product.Id, // Keep for backward compatibility
        title: product.title_c || product.Name,
        description: product.description_c,
        price: product.price_c,
        originalPrice: product.original_price_c,
        category: product.category_c,
        subcategory: product.subcategory_c,
        rating: product.rating_c,
        reviewCount: product.review_count_c,
        inStock: product.in_stock_c,
        stockCount: product.stock_count_c,
specifications: ProductService.safeJsonParse(product.specifications_c, null),
        images: ProductService.safeJsonParse(product.images_c, [])
      }))
    } catch (error) {
console.error(`productService.search - Network/parsing error for query "${query}": ${error?.response?.data?.message || error.message || 'Unknown error'}`)
      return []
    }
  }

  async getFeaturedProducts(limit = 8) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "images_c"}}
        ]
      }

      console.log(`ProductService: Fetching product by ID ${id} with params:`, params)
      const response = await apperClient.getRecordById('products_c', id, params)
      
      console.log('ProductService: getById raw response:', response)
      console.log('ProductService: getById response success:', response?.success)
      
      if (!response.success) {
        console.error('ProductService: getById failed:', response.message)
        toast.error(response.message)
        return null
      }

      if (!response.data) {
        console.log(`ProductService: Product ${id} not found`)
        return null
      }

      console.log('ProductService: Raw product data for ID:', id, response.data)

      const transformedProduct = {
        Id: response.data.Id,
        id: response.data.Id, // Keep for backward compatibility
        title: response.data.title_c || response.data.Name,
        description: response.data.description_c,
        price: response.data.price_c,
        originalPrice: response.data.original_price_c,
        category: response.data.category_c,
        subcategory: response.data.subcategory_c,
        rating: response.data.rating_c,
        reviewCount: response.data.review_count_c,
        inStock: response.data.in_stock_c,
        stockCount: response.data.stock_count_c,
        specifications: ProductService.safeJsonParse(response.data.specifications_c, null),
        images: ProductService.safeJsonParse(response.data.images_c, [])
      }

      console.log('ProductService: Transformed product:', transformedProduct)
      return transformedProduct
    } catch (error) {
console.error(`productService.getFeatured - Network/parsing error: ${error?.response?.data?.message || error.message || 'Unknown error'}`)
      return []
    }
  }

  async getCategories() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
fields: [
          {"field": {"Name": "category_c"}}
        ],
        groupBy: ["category_c"]
      }

      console.log('ProductService: Fetching categories with params:', params)
      const response = await apperClient.fetchRecords('products_c', params)
      
      console.log('ProductService: Categories raw response:', response)

      if (!response.success) {
        console.error('ProductService: Categories fetch failed:', response.message)
        toast.error(response.message)
        return []
      }

      if (!response.data) {
        console.log('ProductService: No categories found')
        return []
      }

      const categories = [...new Set(response.data.map(product => product.category_c).filter(Boolean))]
      console.log('ProductService: Extracted categories:', categories)
      return categories
    } catch (error) {
console.error(`productService.getCategories - Network/parsing error: ${error?.response?.data?.message || error.message || 'Unknown error'}`)
      return []
    }
  }
}

export const productService = new ProductService()