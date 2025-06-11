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
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";

const RequestedItems = () => {
  const [items, setItems] = useState([]);
  const [storedItems, setStoredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pricePerUnit, setPricePerUnit] = useState("");

  const fetchRequestedItems = async () => {
    try {
      setLoading(true);
      const [requestedResponse, storedResponse] = await Promise.all([
        axios.get("https://kwetu-backend.onrender.com/api/inventory/requests/requested-items"),
        axios.get("https://kwetu-backend.onrender.com/api/inventory/stored-items")
      ]);
      
      setItems(requestedResponse.data);
      setStoredItems(storedResponse.data.storedItems || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch items");
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequestedItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRequestedItems();
  }, []);

  const handleApproveSupply = (item) => {
    setSelectedItem(item);
    setPricePerUnit("");
    setModalVisible(true);
  };

  const confirmSupply = async () => {
    if (!pricePerUnit || isNaN(pricePerUnit) || parseFloat(pricePerUnit) <= 0) {
      Alert.alert("Error", "Please enter a valid price per unit");
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.patch(
        `https://kwetu-backend.onrender.com/api/inventory/requests/${selectedItem.requestId}/items/${selectedItem.itemId}/supply`,
        { pricePerUnit: parseFloat(pricePerUnit) }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Item marked as supplied successfully");
        setModalVisible(false);
        fetchRequestedItems();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to approve supply";
      Alert.alert("Error", errorMessage);
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = async (item) => {
    try {
      setProcessing(true);
      const response = await axios.get(
        `https://kwetu-backend.onrender.com/api/inventory/${item.requestId}/${item.itemId}/generate-receipt`
      );

      if (response.status === 200 && response.data.receiptUrl) {
        const receiptUrl = `https://kwetu-backend.onrender.com${response.data.receiptUrl}`;

        // Update the local state to mark receipt as downloaded
        setStoredItems(prevItems => 
          prevItems.map(i => 
            i.itemId === item.itemId && i.requestId === item.requestId
              ? { ...i, receiptDownloaded: true }
              : i
          )
        );

        Alert.alert(
          "Receipt Generated",
          "Receipt has been generated successfully. Do you want to open it?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Receipt",
              onPress: () => {
                Linking.openURL(receiptUrl).catch(() => {
                  Alert.alert(
                    "Error",
                    "Could not open receipt. Please try again."
                  );
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to generate receipt";
      Alert.alert("Error", errorMessage);
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "requested":
        return "bg-blue-100 text-blue-800";
      case "supplied":
        return "bg-green-100 text-green-800";
      case "supply_rejected":
        return "bg-red-100 text-red-800";
      case "stored":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStoredItem = (item) => (
    <View
      key={`${item.requestId}-${item.itemId}`}
      className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            {item.name || 'Unnamed Item'}
          </Text>
          {item.supplier?.name && (
            <Text className="text-sm text-gray-600 mt-1">
              Supplier: {item.supplier.name}
            </Text>
          )}
        </View>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}
        >
          <Text className="text-xs font-semibold capitalize">
            {item.status ? item.status.replace("_", " ") : 'unknown'}
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

        {item.pricePerUnit !== undefined && item.pricePerUnit !== null && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-700">
              <Text className="font-semibold">Price per unit: </Text>
              <Text>KES{item.pricePerUnit.toFixed(2)}</Text>
            </Text>
          </View>
        )}

        {item.totalPrice !== undefined && item.totalPrice !== null && (
          <Text className="text-gray-700">
            <Text className="font-semibold">Total Price: </Text>
            <Text className="font-bold text-green-600">
              KES{item.totalPrice.toFixed(2)}
            </Text>
          </Text>
        )}

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Payment Status: </Text>
            <Text
              className={`font-semibold ${
                item.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {item.paymentStatus || 'unpaid'}
            </Text>
          </Text>
        </View>

        {item.paymentStatus === "paid" && (
          <View className="mt-3">
            {item.receiptDownloaded ? (
              <TouchableOpacity
                className="bg-gray-500 py-2 px-4 rounded-md"
                disabled={true}
              >
                <Text className="text-white text-center font-semibold">
                  Receipt Downloaded
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-blue-600 py-2 px-4 rounded-md"
                onPress={() => handleDownloadReceipt(item)}
                disabled={processing}
              >
                <Text className="text-white text-center font-semibold">
                  Download Receipt
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {item.createdAt && (
        <Text className="text-xs text-gray-500 mb-3">
          Stored on:{" "}
          <Text>{new Date(item.storedDate || item.createdAt).toLocaleDateString()}</Text>
        </Text>
      )}
    </View>
  );

  const renderRequestedItem = (item) => (
    <View
      key={`${item.requestId}-${item.itemId}`}
      className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            {item.name || 'Unnamed Item'}
          </Text>
          {item.supplierName && (
            <Text className="text-sm text-gray-600 mt-1">
              Supplier: {item.supplierName}
            </Text>
          )}
        </View>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}
        >
          <Text className="text-xs font-semibold capitalize">
            {item.status ? item.status.replace("_", " ") : 'unknown'}
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

        {item.feedback && (
          <View className="mb-2">
            <Text className="text-gray-700">
              <Text className="font-semibold">Feedback: </Text>
              <Text>{item.feedback}</Text>
            </Text>
          </View>
        )}
      </View>

      {item.createdAt && (
        <Text className="text-xs text-gray-500 mb-3">
          Requested on:{" "}
          <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </Text>
      )}

      {item.status === "requested" && (
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-green-600 py-2 px-4 rounded-md flex-1 mr-2"
            onPress={() => handleApproveSupply(item)}
            disabled={processing}
          >
            <Text className="text-white text-center font-semibold">
              Approve Supply
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getItemCounts = () => {
    const requested = items.filter(
      (item) => item.status === "requested"
    ).length;
    const supplied = storedItems.length;
    return { requested, supplied };
  };

  const { requested, supplied } = getItemCounts();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Equipment Requests
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Manage supply requests
        </Text>
      </View>

      {!loading && (
        <View className="p-4 bg-white border-b border-gray-200">
          <View className="flex-row justify-between">
            <View className="flex-1 bg-blue-50 p-3 rounded-lg mr-2 border border-blue-200">
              <Text className="text-blue-600 text-xs font-semibold">
                REQUESTED
              </Text>
              <Text className="text-blue-800 text-lg font-bold">
                {requested}
              </Text>
            </View>
            <View className="flex-1 bg-green-50 p-3 rounded-lg ml-2 border border-green-200">
              <Text className="text-green-600 text-xs font-semibold">
                SUPPLIED
              </Text>
              <Text className="text-green-800 text-lg font-bold">
                {supplied}
              </Text>
            </View>
          </View>
        </View>
      )}

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-4 text-gray-600">Loading items...</Text>
          </View>
        ) : (
          <>
            {requested > 0 && (
              <>
                <Text className="text-lg font-semibold text-gray-800 mb-4">
                  Requested Items ({requested})
                </Text>
                {items.filter(item => item.status === "requested").map(renderRequestedItem)}
              </>
            )}

            {supplied > 0 && (
              <>
                <Text className="text-lg font-semibold text-gray-800 mb-4 mt-6">
                  Supplied Items ({supplied})
                </Text>
                {storedItems.map(renderStoredItem)}
              </>
            )}

            {requested === 0 && supplied === 0 && (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 text-lg">
                  No equipment items found
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  Pull down to refresh
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg mx-4 w-80">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Set Price Per Unit
            </Text>
            <Text className="text-gray-600 mb-4">
              Item: {selectedItem?.name || 'Selected Item'}
            </Text>
            <Text className="text-gray-600 mb-2">
              Quantity: <Text>{selectedItem?.quantity || 0}</Text>
              <Text> {selectedItem?.unit || ''}</Text>
            </Text>

            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-4"
              placeholder="Enter price per unit"
              value={pricePerUnit}
              onChangeText={setPricePerUnit}
              keyboardType="numeric"
            />

            {pricePerUnit &&
              !isNaN(pricePerUnit) &&
              parseFloat(pricePerUnit) > 0 && (
                <Text className="text-gray-600 mb-4">
                  Total Price: KES
                  {(
                    parseFloat(pricePerUnit) * (selectedItem?.quantity || 0)
                  ).toFixed(2)}
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
                className="bg-green-600 py-2 px-4 rounded-md flex-1 ml-2"
                onPress={confirmSupply}
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Confirm
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

export default RequestedItems;