import { getApperClient } from "@/services/apperClient"
import { toast } from 'react-toastify'

class OrderService {
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
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "items_c"}}
        ]
      }

      const response = await apperClient.fetchRecords('orders_c', params)
      
      if (!response.success) {
        console.error("Error fetching orders:", response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(order => ({
        Id: order.Id,
        id: order.Id, // Keep for backward compatibility
        orderDate: order.order_date_c,
        status: order.status_c,
        trackingNumber: order.tracking_number_c,
        subtotal: order.subtotal_c,
        shipping: order.shipping_c,
        tax: order.tax_c,
        total: order.total_c,
        notes: order.notes_c,
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : null,
        paymentMethod: order.payment_method_c ? JSON.parse(order.payment_method_c) : null,
        items: order.items_c ? JSON.parse(order.items_c) : []
      }))
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error.message)
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
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "items_c"}}
        ]
      }

      const response = await apperClient.getRecordById('orders_c', parseInt(id), params)
      
      if (!response.success) {
        console.error("Error fetching order:", response.message)
        return null
      }

      const order = response.data
      if (!order) return null

      return {
        Id: order.Id,
        id: order.Id, // Keep for backward compatibility
        orderDate: order.order_date_c,
        status: order.status_c,
        trackingNumber: order.tracking_number_c,
        subtotal: order.subtotal_c,
        shipping: order.shipping_c,
        tax: order.tax_c,
        total: order.total_c,
        notes: order.notes_c,
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : null,
        paymentMethod: order.payment_method_c ? JSON.parse(order.payment_method_c) : null,
        items: order.items_c ? JSON.parse(order.items_c) : []
      }
    } catch (error) {
      console.error("Error fetching order:", error?.response?.data?.message || error.message)
      return null
    }
  }

  async create(orderData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      // Generate tracking number
      const trackingNumber = `MP${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const params = {
        records: [{
          Name: `Order-${Date.now()}`,
          order_date_c: new Date().toISOString(),
          status_c: "Processing",
          tracking_number_c: trackingNumber,
          subtotal_c: orderData.subtotal,
          shipping_c: orderData.shipping,
          tax_c: orderData.tax,
          total_c: orderData.total,
          notes_c: orderData.notes || "",
          shipping_address_c: JSON.stringify(orderData.shippingAddress),
          payment_method_c: JSON.stringify(orderData.paymentMethod),
          items_c: JSON.stringify(orderData.items)
        }]
      }

      const response = await apperClient.createRecord('orders_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const order = successful[0].data
          toast.success("Order created successfully!")
          return {
            Id: order.Id,
            id: order.Id, // Keep for backward compatibility
            orderDate: order.order_date_c,
            status: order.status_c,
            trackingNumber: order.tracking_number_c,
            subtotal: order.subtotal_c,
            shipping: order.shipping_c,
            tax: order.tax_c,
            total: order.total_c,
            notes: order.notes_c,
            shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : null,
            paymentMethod: order.payment_method_c ? JSON.parse(order.payment_method_c) : null,
            items: order.items_c ? JSON.parse(order.items_c) : []
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error.message)
      toast.error("Failed to create order")
      return null
    }
  }

  async updateStatus(id, status) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      }

      const response = await apperClient.updateRecord('orders_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const order = successful[0].data
          toast.success("Order status updated successfully!")
          return {
            Id: order.Id,
            id: order.Id, // Keep for backward compatibility
            orderDate: order.order_date_c,
            status: order.status_c,
            trackingNumber: order.tracking_number_c,
            subtotal: order.subtotal_c,
            shipping: order.shipping_c,
            tax: order.tax_c,
            total: order.total_c,
            notes: order.notes_c,
            shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : null,
            paymentMethod: order.payment_method_c ? JSON.parse(order.payment_method_c) : null,
            items: order.items_c ? JSON.parse(order.items_c) : []
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error updating order status:", error?.response?.data?.message || error.message)
      toast.error("Failed to update order status")
      return null
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('orders_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          toast.success("Order deleted successfully!")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting order:", error?.response?.data?.message || error.message)
      toast.error("Failed to delete order")
      return false
    }
  }
}

export const orderService = new OrderService()