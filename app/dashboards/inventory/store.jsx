import { View, Text, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Store = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStoreItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://kwetu-backend.onrender.com/api/inventory/store-items')
      
      if (response.data.success) {
        setItems(response.data.items)
      } else {
        Alert.alert('Error', 'Failed to fetch store items')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch store items')
      console.error('Error fetching store items:', error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchStoreItems()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchStoreItems()
  }, [])

  const getStockLevelColor = (quantity) => {
    if (quantity === 0) return 'text-red-600'
    if (quantity <= 5) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStockLevelBg = (quantity) => {
    if (quantity === 0) return 'bg-red-50 border-red-200'
    if (quantity <= 5) return 'bg-yellow-50 border-yellow-200'
    return 'bg-green-50 border-green-200'
  }

  const renderItem = (item) => (
    <View key={item._id} className={`mb-4 p-4 rounded-lg border-2 ${getStockLevelBg(item.quantity)}`}>
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
          {item.description && (
            <Text className="text-sm text-gray-600 mt-1">{item.description}</Text>
          )}
        </View>
        <View className={`px-3 py-1 rounded-full ${getStockLevelBg(item.quantity)}`}>
          <Text className={`text-xs font-semibold ${getStockLevelColor(item.quantity)}`}>
            {item.quantity === 0 ? 'OUT OF STOCK' : item.quantity <= 5 ? 'LOW STOCK' : 'IN STOCK'}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-700">
          <Text className="font-semibold">Quantity: </Text>
          <Text className={`font-bold ${getStockLevelColor(item.quantity)}`}>
            {item.quantity}
          </Text>
          {item.unit && <Text className="text-gray-600"> {item.unit}</Text>}
        </Text>
      </View>

      {item.category && (
        <View className="mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Category: </Text>
            {item.category}
          </Text>
        </View>
      )}

      {item.supplier && (
        <View className="mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Supplier: </Text>
            {item.supplier}
          </Text>
        </View>
      )}

      {item.pricePerUnit && (
        <View className="mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Price per unit: </Text>
            ${item.pricePerUnit}
          </Text>
        </View>
      )}

      {item.location && (
        <View className="mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Location: </Text>
            {item.location}
          </Text>
        </View>
      )}

      {item.lastUpdated && (
        <View className="mt-2 pt-2 border-t border-gray-200">
          <Text className="text-xs text-gray-500">
            Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  )

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getOutOfStockCount = () => {
    return items.filter(item => item.quantity === 0).length
  }

  const getLowStockCount = () => {
    return items.filter(item => item.quantity > 0 && item.quantity <= 5).length
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Store Inventory</Text>
        <Text className="text-sm text-gray-600 mt-1">Manage your equipment inventory</Text>
      </View>

      {/* Summary Cards */}
      {!loading && (
        <View className="p-4 bg-white border-b border-gray-200">
          <View className="flex-row justify-between">
            <View className="flex-1 bg-blue-50 p-3 rounded-lg mr-2 border border-blue-200">
              <Text className="text-blue-600 text-xs font-semibold">TOTAL ITEMS</Text>
              <Text className="text-blue-800 text-lg font-bold">{getTotalItems()}</Text>
            </View>
            <View className="flex-1 bg-red-50 p-3 rounded-lg mx-1 border border-red-200">
              <Text className="text-red-600 text-xs font-semibold">OUT OF STOCK</Text>
              <Text className="text-red-800 text-lg font-bold">{getOutOfStockCount()}</Text>
            </View>
            <View className="flex-1 bg-yellow-50 p-3 rounded-lg ml-2 border border-yellow-200">
              <Text className="text-yellow-600 text-xs font-semibold">LOW STOCK</Text>
              <Text className="text-yellow-800 text-lg font-bold">{getLowStockCount()}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Items List */}
      <ScrollView 
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-4 text-gray-600">Loading inventory...</Text>
          </View>
        ) : items.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No items in store</Text>
            <Text className="text-gray-400 text-sm mt-2">Pull down to refresh</Text>
          </View>
        ) : (
          <>
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              All Items ({items.length})
            </Text>
            {items.map(renderItem)}
          </>
        )}
      </ScrollView>
    </View>
  )
}

export default Store