import mockOrders from "@/services/mockData/orders.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class OrderService {
  constructor() {
    this.orders = [...mockOrders]
  }

  async getAll() {
    await delay(300)
    return [...this.orders]
  }

  async getById(id) {
    await delay(200)
    const order = this.orders.find(o => o.id === id)
    return order ? { ...order } : null
  }

  async create(orderData) {
    await delay(500) // Simulate processing time
    
    const newId = Math.max(...this.orders.map(o => o.id), 0) + 1
    const newOrder = {
      id: newId,
      ...orderData,
      orderDate: new Date().toISOString(),
      trackingNumber: `MP${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    }
    
    this.orders.push(newOrder)
    return { ...newOrder }
  }

  async updateStatus(id, status) {
    await delay(300)
    const orderIndex = this.orders.findIndex(o => o.id === id)
    if (orderIndex !== -1) {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        status
      }
      return { ...this.orders[orderIndex] }
    }
    return null
  }

  async delete(id) {
    await delay(300)
    const orderIndex = this.orders.findIndex(o => o.id === id)
    if (orderIndex !== -1) {
      const deletedOrder = this.orders.splice(orderIndex, 1)[0]
      return { ...deletedOrder }
    }
    return null
  }
}

export const orderService = new OrderService()