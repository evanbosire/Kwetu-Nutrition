// import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useNavigation } from '@react-navigation/native'

// const SuppliedEquipments = () => {
//   const [activeTab, setActiveTab] = useState('supplied')
//   const [items, setItems] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [processing, setProcessing] = useState(false)
//   const navigation = useNavigation()

//   const fetchItems = async () => {
//     try {
//       setLoading(true)
//       const endpoint = activeTab === 'supplied'
//         ? '/requests/items/supplied'
//         : '/requests/items/supply-rejected'

//       const response = await axios.get(`https://kwetu-backend.onrender.com/api/inventory${endpoint}`)
//       setItems(response.data)
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch items')
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchItems()
//   }, [activeTab])

//   const handleProcessItem = async (requestId, itemId, action) => {
//     try {
//       setProcessing(true)
//       const response = await axios.post(
//         `https://kwetu-backend.onrender.com/api/inventory/process-supply/${requestId}/${itemId}`,
//         { action }
//       )

//       if (response.status === 200) {
//         Alert.alert('Success', `Item ${action}ed successfully`)
//         fetchItems()
//       }
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to process item')
//       console.error(error)
//     } finally {
//       setProcessing(false)
//     }
//   }

//   const renderItem = (item) => (
//     <View key={`${item.requestId}-${item.itemId}`} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
//       <View className="flex-row justify-between mb-2">
//         <Text className="text-lg font-semibold">{item.name}</Text>
//         <Text className={`px-2 py-1 rounded ${
//           item.status === 'supplied' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
//         }`}>
//           {item.status}
//         </Text>
//       </View>

//       <View className="mb-2">
//         <Text className="text-gray-600">Supplier: {item.supplierName}</Text>
//       </View>

//       <View className="flex-row justify-between mb-2">
//         <Text>Quantity: {item.quantity} {item.unit}</Text>
//         {item.pricePerUnit && <Text>Price: ${item.pricePerUnit}/unit</Text>}
//       </View>

//       {item.totalPrice && (
//         <View className="mb-2">
//           <Text className="font-semibold">Total Price: ${item.totalPrice}</Text>
//         </View>
//       )}

//       {item.feedback && (
//         <View className="mb-3">
//           <Text className="text-gray-600">Feedback: {item.feedback}</Text>
//         </View>
//       )}

//       <Text className="text-gray-500 text-xs mb-3">
//         Requested on: {new Date(item.createdAt).toLocaleDateString()}
//       </Text>

//       {activeTab === 'supplied' && (
//         <View className="flex-row justify-between">
//           <TouchableOpacity
//             className="bg-green-600 py-2 px-4 rounded-md flex-1 mr-2"
//             onPress={() => handleProcessItem(item.requestId, item.itemId, 'accept')}
//             disabled={processing}
//           >
//             <Text className="text-white text-center">Accept</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="bg-red-600 py-2 px-4 rounded-md flex-1 ml-2"
//             onPress={() => handleProcessItem(item.requestId, item.itemId, 'reject')}
//             disabled={processing}
//           >
//             <Text className="text-white text-center">Reject</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   )

//   return (
//     <View className="flex-1 bg-gray-50">

//       <View className="p-4 bg-white border-b border-gray-200">
//         <Text className="text-2xl font-bold">Equipment Supply</Text>
//       </View>

//       <View className="flex-row border-b border-gray-200">
//         <TouchableOpacity
//           className={`flex-1 py-3 ${activeTab === 'supplied' ? 'border-b-2 border-blue-500' : ''}`}
//           onPress={() => setActiveTab('supplied')}
//         >
//           <Text className={`text-center font-medium ${activeTab === 'supplied' ? 'text-blue-500' : 'text-gray-500'}`}>
//             Supplied
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`flex-1 py-3 ${activeTab === 'rejected' ? 'border-b-2 border-red-500' : ''}`}
//           onPress={() => setActiveTab('rejected')}
//         >
//           <Text className={`text-center font-medium ${activeTab === 'rejected' ? 'text-red-500' : 'text-gray-500'}`}>
//             Rejected
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView className="p-4">
//         {loading ? (
//           <View className="py-8">
//             <ActivityIndicator size="large" color="#3b82f6" />
//           </View>
//         ) : items.length === 0 ? (
//           <View className="py-8 items-center">
//             <Text className="text-gray-500">No {activeTab === 'supplied' ? 'supplied' : 'rejected'} items found</Text>
//           </View>
//         ) : (
//           items.map(renderItem)
//         )}

//         {processing && (
//           <View className="absolute inset-0 bg-black bg-opacity-30 justify-center items-center">
//             <View className="bg-white p-6 rounded-lg">
//               <ActivityIndicator size="large" color="#3b82f6" />
//               <Text className="mt-2">Processing...</Text>
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   )
// }

// export default SuppliedEquipments
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const SuppliedEquipments = () => {
  const [activeTab, setActiveTab] = useState("supplied");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigation = useNavigation();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "supplied"
          ? "/requests/items/supplied"
          : "/requests/items/supply-rejected";

      const response = await axios.get(
        `https://kwetu-backend.onrender.com/api/inventory${endpoint}`
      );
      setItems(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleProcessItem = async (requestId, itemId, action) => {
    try {
      setProcessing(true);
      const response = await axios.post(
        `https://kwetu-backend.onrender.com/api/inventory/process-supply/${requestId}/${itemId}`,
        { action }
      );

      if (response.status === 200) {
        Alert.alert("Success", `Item ${action}ed successfully`);
        fetchItems();
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to process item"
      );
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const renderItem = (item) => (
    <View
      key={`${item.requestId}-${item.itemId}`}
      className="mb-4 p-4 border border-gray-200 rounded-lg bg-white"
    >
      <View className="flex-row justify-between mb-2">
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Text
          className={`px-2 py-1 rounded ${
            item.status === "supplied"
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status}
        </Text>
      </View>

      <View className="mb-2">
        <Text className="text-gray-600">Supplier: {item.supplierName}</Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text>
          Quantity: {item.quantity} {item.unit}
        </Text>
        {item.pricePerUnit && <Text>Price: KES{item.pricePerUnit}/unit</Text>}
      </View>

      {item.totalPrice && (
        <View className="mb-2">
          <Text className="font-semibold">Total Price: KES{item.totalPrice}</Text>
        </View>
      )}

      {item.feedback && (
        <View className="mb-3">
          <Text className="text-gray-600">Feedback: {item.feedback}</Text>
        </View>
      )}

      <Text className="text-gray-500 text-xs mb-3">
        Requested on: {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      {activeTab === "supplied" && (
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-green-600 py-2 px-4 rounded-md flex-1 mr-2"
            onPress={() =>
              handleProcessItem(item.requestId, item.itemId, "accept")
            }
            disabled={processing}
          >
            <Text className="text-white text-center">Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-600 py-2 px-4 rounded-md flex-1 ml-2"
            onPress={() =>
              handleProcessItem(item.requestId, item.itemId, "reject")
            }
            disabled={processing}
          >
            <Text className="text-white text-center">Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold">Equipment Supply</Text>
      </View>

      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 ${
            activeTab === "supplied" ? "border-b-2 border-blue-500" : ""
          }`}
          onPress={() => setActiveTab("supplied")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "supplied" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Supplied
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${
            activeTab === "rejected" ? "border-b-2 border-red-500" : ""
          }`}
          onPress={() => setActiveTab("rejected")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "rejected" ? "text-red-500" : "text-gray-500"
            }`}
          >
            Rejected
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4">
        {loading ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : items.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-gray-500">
              {activeTab === "supplied"
                ? "No supplied items found"
                : "No rejected items found"}
            </Text>
          </View>
        ) : (
          items.map(renderItem)
        )}

        {processing && (
          <View className="absolute inset-0 bg-black bg-opacity-30 justify-center items-center">
            <View className="bg-white p-6 rounded-lg">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="mt-2">Processing...</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SuppliedEquipments;
