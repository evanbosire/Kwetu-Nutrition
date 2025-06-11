import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'

const PendingBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [approvingIds, setApprovingIds] = useState(new Set())

  const API_BASE_URL = 'https://kwetu-backend.onrender.com/api/bookings'

  // Fetch pending bookings
  const fetchPendingBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pending-payments`)
      if (!response.ok) {
        throw new Error('Failed to fetch pending bookings')
      }
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      Alert.alert('Error', 'Failed to load pending bookings. Please try again.')
      console.error('Error fetching pending bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Approve payment for a booking
  const approvePayment = async (bookingId) => {
    setApprovingIds(prev => new Set([...prev, bookingId]))
    
    try {
      const response = await fetch(`${API_BASE_URL}/${bookingId}/approve-payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to approve payment')
      }

      const updatedBooking = await response.json()
      
      // Remove the approved booking from the list
      setBookings(prev => prev.filter(booking => booking._id !== bookingId))
      
      Alert.alert('Success', 'Payment has been approved successfully!')
    } catch (error) {
      Alert.alert('Error', 'Failed to approve payment. Please try again.')
      console.error('Error approving payment:', error)
    } finally {
      setApprovingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookingId)
        return newSet
      })
    }
  }

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchPendingBookings()
    setRefreshing(false)
  }, [])

  // Confirm approval dialog
  const confirmApproval = (booking) => {
    Alert.alert(
      'Confirm Payment Approval',
      `Are you sure you want to approve payment for ${booking.service?.name || 'this service'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => approvePayment(booking._id),
        },
      ]
    )
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Render individual booking item
  const renderBookingItem = ({ item }) => {
    const isApproving = approvingIds.has(item._id)
    
    return (
      <View className="bg-white mx-4 mb-4 p-4 rounded-lg shadow-sm border border-gray-200">
        {/* Booking Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              <Text className="text-base text-gray-600 mt-1">
              SERVICE:
            </Text>
              {item.serviceTitle || 'Service Name'}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Booking ID: {item._id.slice(-8).toUpperCase()}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Payment Code: {item.paymentCode}
            </Text>
          </View>
          <View className="bg-yellow-100 px-3 py-1 rounded-full">
            <Text className="text-yellow-800 text-xs font-medium">
              PENDING
            </Text>
          </View>
        </View>

        {/* Booking Details */}
        <View className="space-y-2 mb-4">
          {item.customerName && (
            <View className="flex-col">
              <Text className="text-gray-600 w-20">Name:</Text>
              <Text className="text-gray-900 flex-1">{item.customerName}</Text>
              <Text className="text-gray-600 w-20">Email:</Text>
              <Text className="text-gray-900 flex-1">{item.customerEmail}</Text>
              <Text className="text-gray-600 w-20">Phone:</Text>
              <Text className="text-gray-900 flex-1">{item.customerPhone}</Text>
            </View>
          )}
          
          {item.createdAt && (
            <View className="flex-row">
              <Text className="text-gray-600 w-20">Date:</Text>
              <Text className="text-gray-900 flex-1">{formatDate(item.createdAt)}</Text>
            </View>
          )}
          {item.service?.pricePerHour && (
            <View className="flex-row">
              <Text className="text-gray-600 w-20">Price Per Hour:</Text>
              <Text className="text-gray-900  font-semibold">
                KSH {item.service?.pricePerHour.toFixed(2)}
              </Text>
            </View>
          )}
          {item.hours && (
            <View className="flex-row">
              <Text className="text-gray-600 w-20">Hours:</Text>
              <Text className="text-gray-900  font-semibold">
                Hrs {item.hours.toFixed(2)}
              </Text>
            </View>
          )}
          {item.totalPrice && (
            <View className="flex-row">
              <Text className="text-gray-600 w-20">Amount:</Text>
              <Text className="text-gray-900 flex-1 font-semibold">
                KSH {item.totalPrice.toFixed(2)}
              </Text>
            </View>
          )}
          
          {item.service?.description && (
            <View className="flex-row">
              <Text className="text-gray-600 w-20">Description:</Text>
              <Text className="text-gray-900 flex-1">{item.service.description}</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className={`py-3 px-4 rounded-lg ${
            isApproving 
              ? 'bg-gray-300' 
              : 'bg-green-600 active:bg-green-700'
          }`}
          onPress={() => confirmApproval(item)}
          disabled={isApproving}
        >
          <View className="flex-row justify-center items-center">
            {isApproving ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
                <Text className="text-white font-medium">Approving...</Text>
              </>
            ) : (
              <Text className="text-white font-medium text-center">
                Approve Payment
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  // Load data on component mount
  useEffect(() => {
    fetchPendingBookings()
  }, [])

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-gray-600 mt-4">Loading pending bookings...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Pending Payments</Text>
        <Text className="text-gray-600 mt-1">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} awaiting approval
        </Text>
      </View>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
            <Text className="text-center text-gray-500 text-lg mb-2">
              No Pending Payments
            </Text>
            <Text className="text-center text-gray-400">
              All payments have been processed
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#059669']}
              tintColor="#059669"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

export default PendingBookings