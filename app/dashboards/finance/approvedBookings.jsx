import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";

const ApprovedBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL =
    "https://kwetu-backend.onrender.com/api/bookings/approved-payments";

  // Fetch approved bookings
  const fetchApprovedBookings = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch approved bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching approved bookings:", error);
      // You could add Alert here if needed
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchApprovedBookings();
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

  // Calculate total revenue
  const totalRevenue = bookings.reduce((sum, booking) => {
    return sum + (booking.totalPrice || 0);
  }, 0);

  // Render individual booking item
  const renderBookingItem = ({ item }) => {
    return (
      <View className="bg-white mx-4 mb-4 p-4 rounded-lg shadow-sm border border-gray-200">
        {/* Booking Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-base text-gray-600 mt-1">SERVICE:</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {item.serviceTitle || "Service Name"}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Booking ID: {item._id.slice(-8).toUpperCase()}
            </Text>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-800 text-xs font-medium">PAID</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View className="space-y-2 mb-4">
          {item.customerName && (
            <View className="flex-row">
              <Text className="text-gray-600 w-24">Customer:</Text>
              <Text className="text-gray-900 flex-1">{item.customerName}</Text>
            </View>
          )}

          {item.createdAt && (
            <View className="flex-row">
              <Text className="text-gray-600 w-24">Booked On:</Text>
              <Text className="text-gray-900 flex-1">
                {formatDate(item.createdAt)}
              </Text>
            </View>
          )}

          {item.updatedAt && (
            <View className="flex-row">
              <Text className="text-gray-600 w-24">Approved On:</Text>
              <Text className="text-gray-900 flex-1">
                {formatDate(item.updatedAt)}
              </Text>
            </View>
          )}

          {item.totalPrice && (
            <View className="flex-row">
              <Text className="text-gray-600 w-24">Amount:</Text>
              <Text className="text-gray-900 flex-1 font-semibold">
                KSH {item.totalPrice.toFixed(2)}
              </Text>
            </View>
          )}

          {item.service?.description && (
            <View className="flex-row">
              <Text className="text-gray-600 w-24">Desctiption:</Text>
              <Text className="text-gray-900 flex-1">
                {item.service.description}
              </Text>
            </View>
          )}
        </View>

        {/* Receipt Info */}
        {item.receiptUrl && (
          <View className="bg-gray-50 p-3 rounded-lg">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
              <Text className="text-gray-700 text-sm">Receipt generated</Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">
              {item.receiptUrl}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Load data on component mount
  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-gray-600 mt-4">Loading approved bookings...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Statistics */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Approved Payments
        </Text>
        <View className="flex-row justify-between items-center mt-3">
          <View>
            <Text className="text-gray-600">
              {bookings.length} approved booking
              {bookings.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <View className="bg-green-50 px-4 py-2 rounded-lg">
            <Text className="text-green-800 font-semibold">
              Total: KSH {totalRevenue.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
            <Text className="text-center text-gray-500 text-lg mb-2">
              No Approved Payments
            </Text>
            <Text className="text-center text-gray-400">
              Approved bookings will appear here
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

export default ApprovedBookings;
