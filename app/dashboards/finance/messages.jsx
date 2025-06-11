import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";

const FinancePayments = () => {
  const [acceptedItems, setAcceptedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentCode, setPaymentCode] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const fetchAcceptedItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://kwetu-backend.onrender.com/api/inventory/accepted-items"
      );
      setAcceptedItems(response.data.acceptedItems || []);
     
    } catch (error) {
      Alert.alert("Error", "Failed to fetch accepted items");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAcceptedItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAcceptedItems();
    
  }, []);

  const handlePayItem = (item) => {
    setSelectedItem(item);
    setPaymentCode("");
    setPaymentError("");
    setModalVisible(true);
  };

  const validatePaymentCode = (code) => {
    const digitCount = (code.match(/[0-9]/g) || []).length;
    const letterCount = (code.match(/[A-Z]/g) || []).length;

    if (code.length !== 10) {
      return "Code must be exactly 10 characters";
    }
    if (digitCount !== 2) {
      return "Code must contain exactly 2 digits";
    }
    if (letterCount !== 8) {
      return "Code must contain exactly 8 uppercase letters";
    }
    return "";
  };

  const confirmPayment = async () => {
    const validationError = validatePaymentCode(paymentCode);
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    try {
      setProcessing(true);

      const response = await axios.patch(
        `https://kwetu-backend.onrender.com/api/inventory/pay/${selectedItem.requestId}/${selectedItem.itemId}`,
        { paymentCode }
      );

      // Check for success flag in response data
      if (response.data && response.data.success) {
        // Update local state
        setAcceptedItems((prevItems) =>
          prevItems.map((item) =>
            item.requestId === selectedItem.requestId &&
            item.itemId === selectedItem.itemId
              ? {
                  ...item,
                  paymentStatus: "paid",
                  paymentCode: paymentCode,
                  paymentDate: new Date().toISOString(), // Add payment date
                }
              : item
          )
        );

        setModalVisible(false);
        Alert.alert("Success", "Payment was processed successfully");
      } else {
        // Handle case where backend returns success: false
        const errorMessage =
          response.data?.message || "Payment processing failed";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      // Only show error if it's a genuine error
      if (error.response && error.response.status >= 400) {
        const errorMessage =
          error.response.data?.message ||
          error.message ||
          "Failed to process payment";
        Alert.alert("Error", errorMessage);
      } else {
        // For network errors or other issues
        Alert.alert("Network Error", "Could not connect to the server");
      }
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "supplied":
        return "bg-green-100 text-green-800";
      case "accepted":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to render payment status button
  const renderPaymentButton = (item) => {
    if (item.paymentStatus === "paid") {
      return (
        <TouchableOpacity
          className="bg-green-500 py-3 px-4 rounded-md"
          disabled={true}
        >
          <Text className="text-white text-center font-semibold">PAID</Text>
        </TouchableOpacity>
      );
    } else if (item.paymentStatus === "unpaid") {
      return (
        <TouchableOpacity
          className="bg-orange-500 py-3 px-4 rounded-md"
          onPress={() => handlePayItem(item)}
          disabled={processing}
        >
          <Text className="text-white text-center font-semibold">
            UNPAID - TAP TO PAY
          </Text>
        </TouchableOpacity>
      );
    } else {
      // Default case for items without payment status
      return (
        <TouchableOpacity
          className="bg-orange-500 py-3 px-4 rounded-md"
          onPress={() => handlePayItem(item)}
          disabled={processing}
        >
          <Text className="text-white text-center font-semibold">
            UNPAID - TAP TO PAY
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderItem = (item) => (
    <View
      key={`${item.requestId}-${item.itemId}`}
      className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Supplier: {item.supplierName}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}
        >
          <Text className="text-xs font-semibold capitalize">
            {item.inventoryStatus || item.status}
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Quantity: </Text>
            {item.quantity} {item.unit}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Price per unit: </Text>
            KES{item.pricePerUnit?.toFixed(2) || "0.00"}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Total Price: </Text>
            <Text className="font-bold text-green-600">
              KES{item.totalPrice?.toFixed(2) || "0.00"}
            </Text>
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Payment Status: </Text>
            <Text
              className={`font-semibold ${
                item.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {item.paymentStatus ? item.paymentStatus.toUpperCase() : "UNPAID"}
            </Text>
          </Text>
        </View>

        {item.paymentCode && (
          <View className="mb-2">
            <Text className="text-gray-700">
              <Text className="font-semibold">Payment Code: </Text>
              {item.paymentCode}
            </Text>
          </View>
        )}
      </View>

      <Text className="text-xs text-gray-500 mb-3">
        Requested on: {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      {/* Payment Status Button */}
      {renderPaymentButton(item)}
    </View>
  );

  const getItemCounts = () => {
    const paid = acceptedItems.filter(
      (item) => item.paymentStatus === "paid"
    ).length;
    const unpaid = acceptedItems.filter(
      (item) => item.paymentStatus === "unpaid" || !item.paymentStatus
    ).length;
    return { paid, unpaid };
  };

  const { paid, unpaid } = getItemCounts();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Finance Payments
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Manage payments for accepted items
        </Text>
      </View>

      {/* Summary Cards */}
      {!loading && (
        <View className="p-4 bg-white border-b border-gray-200">
          <View className="flex-row justify-between space-x-2">
            <View className="flex-1 bg-orange-50 p-3 rounded-lg border border-orange-200 mr-2">
              <Text className="text-orange-600 text-xs font-semibold">
                UNPAID ITEMS
              </Text>
              <Text className="text-orange-800 text-lg font-bold">
                {unpaid}
              </Text>
            </View>
            <View className="flex-1 bg-green-50 p-3 rounded-lg border border-green-200 ml-2">
              <Text className="text-green-600 text-xs font-semibold">
                PAID ITEMS
              </Text>
              <Text className="text-green-800 text-lg font-bold">{paid}</Text>
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
            <Text className="mt-4 text-gray-600">
              Loading accepted items...
            </Text>
          </View>
        ) : acceptedItems.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">
              No accepted items found
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              Pull down to refresh
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Accepted Items ({acceptedItems.length})
            </Text>
            {acceptedItems.map(renderItem)}
          </>
        )}
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg mx-4 w-80">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Process Payment
            </Text>
            <Text className="text-gray-600 mb-4">
              Item: {selectedItem?.name}
            </Text>
            <Text className="text-gray-600 mb-2">
              Amount: KES{selectedItem?.totalPrice?.toFixed(2) || "0.00"}
            </Text>

            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-1"
              placeholder="Enter payment code (2 digits + 8 letters)"
              value={paymentCode}
              onChangeText={(text) => {
                setPaymentCode(text.toUpperCase());
                setPaymentError("");
              }}
              maxLength={10}
              autoCapitalize="characters"
            />

            {paymentError ? (
              <Text className="text-red-500 text-sm mb-4">{paymentError}</Text>
            ) : (
              <Text className="text-gray-500 text-sm mb-4">
                Format: 2 digits + 8 uppercase letters (e.g., 12ABCDEFGH)
              </Text>
            )}

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-500 py-2 px-4 rounded-md flex-1 mr-2"
                onPress={() => setModalVisible(false)}
                disabled={processing}
              >
                <Text className="text-white text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-600 py-2 px-4 rounded-md flex-1 ml-2"
                onPress={confirmPayment}
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Confirm Payment
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Processing Overlay */}
      {processing && !modalVisible && (
        <View className="absolute inset-0 bg-black bg-opacity-30 justify-center items-center">
          <View className="bg-white p-6 rounded-lg">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-2 text-center">Processing...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default FinancePayments;
