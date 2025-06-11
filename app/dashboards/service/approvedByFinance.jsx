import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";

const ServiceManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "https://kwetu-backend.onrender.com/api/services/paid-bookings";

  // Fetch paid bookings
  const fetchPaidBookings = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch paid bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching paid bookings:", error);
      Alert.alert("Error", "Failed to fetch paid bookings");
    } finally {
      setLoading(false);
    }
  };

  // Handle allocation of supervisor
  const handleAllocateSupervisor = async (bookingId) => {
    try {
      const response = await fetch(
        `https://kwetu-backend.onrender.com/api/services/allocate/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to allocate supervisor");
      }

      const updatedBooking = await response.json();
      
      // Update the bookings list with the updated booking
      setBookings(bookings.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      ));

      Alert.alert("Success", "Supervisor allocated successfully");
    } catch (error) {
      console.error("Error allocating supervisor:", error);
      Alert.alert("Error", "Failed to allocate supervisor");
    }
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPaidBookings();
    setRefreshing(false);
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render individual booking item
  const renderBookingItem = ({ item }) => {
    return (
      <View className="bg-white mx-4 mb-4 p-4 rounded-lg shadow-sm border border-gray-200">
        {/* Booking Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {item.service?.title || "Service Name"}
            </Text>
            <Text className="text-sm text-gray-500">
              Booking ID: {item._id.slice(-8).toUpperCase()}
            </Text>
          </View>
          <View className="flex items-end">
            <View className="bg-green-100 px-3 py-1 rounded-full mb-1">
              <Text className="text-green-800 text-xs font-medium">PAID</Text>
            </View>
            <Text className="text-xs text-gray-500">
              {item.assignedSupervisor ? "Allocated" : "Pending Allocation"}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="border-b border-gray-100 my-2" />

        {/* Booking Details */}
        <View className="space-y-3 mb-3">
          <View className="flex-row">
            <Text className="text-gray-600 w-28">Customer:</Text>
            <Text className="text-gray-900 flex-1 font-medium">{item.customerName}</Text>
          </View>

          <View className="flex-row">
            <Text className="text-gray-600 w-28">Booked On:</Text>
            <Text className="text-gray-900 flex-1">{formatDate(item.createdAt)}</Text>
          </View>

          {item.service?.description && (
            <View className="flex-row">
              <Text className="text-gray-600 w-28">Description:</Text>
              <Text className="text-gray-900 flex-1">{item.service.description}</Text>
            </View>
          )}
        </View>

        {/* Allocation Button */}
        {!item.assignedSupervisor && (
          <TouchableOpacity
            className="bg-emerald-600 py-3 rounded-lg mt-2 flex-row justify-center items-center"
            onPress={() => handleAllocateSupervisor(item._id)}
          >
            <Text className="text-white font-medium mr-2">Allocate Supervisor</Text>
          </TouchableOpacity>
        )}

        {/* Already Allocated Indicator */}
        {item.assignedSupervisor && (
          <View className="bg-blue-50 py-3 rounded-lg mt-2 flex-row justify-center items-center">
            <Text className="text-blue-800 font-medium">Supervisor Allocated</Text>
          </View>
        )}
      </View>
    );
  };

  // Load data on component mount
  useEffect(() => {
    fetchPaidBookings();
  }, []);

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-gray-600 mt-4">Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-5 border-b border-gray-200">
  <Text className="text-2xl font-bold text-gray-900">Service Allocation</Text>
  <Text className="text-gray-600 mt-1">
    {bookings.filter(booking => !booking.assignedSupervisor).length} booking
    {bookings.filter(booking => !booking.assignedSupervisor).length !== 1 ? "s" : ""} ready for allocation
  </Text>
</View>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
            <Text className="text-center text-gray-500 text-lg mb-2">
              No Bookings Available
            </Text>
            <Text className="text-center text-gray-400">
              Paid bookings ready for allocation will appear here
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
              colors={["#059669"]}
              tintColor="#059669"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ServiceManagerBookings;