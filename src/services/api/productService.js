import { getApperClient } from "@/services/apperClient"
import { toast } from 'react-toastify'

class ProductService {
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
        ]
      }

      const response = await apperClient.fetchRecords('products_c', params)
      
if (!response.success) {
        console.error(`productService.getAll - API error: ${response.message}`)
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
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : null,
        images: product.images_c ? JSON.parse(product.images_c) : []
      }))
    } catch (error) {
console.error(`productService.getAll - Network/parsing error: ${error?.response?.data?.message || error.message || 'Unknown error'}`)
      return []
    }
  }

  async getById(id) {
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

      const response = await apperClient.getRecordById('products_c', parseInt(id), params)
      
if (!response.success) {
        console.error(`productService.getById - API error for ID ${id}: ${response.message}`)
        return null
      }

      const product = response.data
      if (!product) return null

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
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : null,
        images: product.images_c ? JSON.parse(product.images_c) : []
      }
    } catch (error) {
console.error(`productService.getById - Network/parsing error for ID ${id}: ${error?.response?.data?.message || error.message || 'Unknown error'}`)
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
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : null,
        images: product.images_c ? JSON.parse(product.images_c) : []
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
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : null,
        images: product.images_c ? JSON.parse(product.images_c) : []
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
        ],
        orderBy: [{
          "fieldName": "rating_c",
          "sorttype": "DESC"
        }],
        pagingInfo: {
          "limit": limit,
          "offset": 0
        }
      }

      const response = await apperClient.fetchRecords('products_c', params)
      
      if (!response.success) {
console.error(`productService.getFeatured - API error: ${response.message}`)
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
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : null,
        images: product.images_c ? JSON.parse(product.images_c) : []
      }))
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

      const response = await apperClient.fetchRecords('products_c', params)
      
if (!response.success) {
        console.error(`productService.getCategories - API error: ${response.message}`)
        return []
      }

      return [...new Set(response.data.map(product => product.category_c).filter(Boolean))]
    } catch (error) {
console.error(`productService.getCategories - Network/parsing error: ${error?.response?.data?.message || error.message || 'Unknown error'}`)
      return []
    }
  }
}

export const productService = new ProductService()