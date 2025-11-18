import mockProducts from "@/services/mockData/products.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ProductService {
  constructor() {
    this.products = [...mockProducts]
  }

  async getAll() {
    await delay(300)
    return [...this.products]
  }

  async getById(id) {
    await delay(200)
    const product = this.products.find(p => p.id === id)
    return product ? { ...product } : null
  }

  async getByCategory(category) {
    await delay(300)
    return this.products.filter(p => p.category === category).map(p => ({ ...p }))
  }

  async searchProducts(query) {
    await delay(300)
    const searchTerm = query.toLowerCase()
    return this.products.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }))
  }

  async getFeaturedProducts(limit = 8) {
    await delay(300)
    return this.products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map(p => ({ ...p }))
  }

  async getCategories() {
    await delay(200)
    return [...new Set(this.products.map(p => p.category))]
  }
}

export const productService = new ProductService()