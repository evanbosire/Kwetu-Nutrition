import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const BASE_URL = 'https://kwetu-backend.onrender.com/api/gymcoach/';

const RequestEquipment = () => {
  const navigation = useNavigation();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [releasedEquipment, setReleasedEquipment] = useState([]);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [returnQuantity, setReturnQuantity] = useState('');

  // Fetch inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/inventory-items`);
        setInventoryItems(response.data.items);
        // Set default selected item if available
        if (response.data.items.length > 0) {
          setSelectedItem(response.data.items[0]._id);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch inventory items');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Fetch released equipment
  useEffect(() => {
    const fetchReleasedEquipment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/equipment/released`);
        setReleasedEquipment(response.data.equipment);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch released equipment');
      } finally {
        setLoading(false);
      }
    };

    fetchReleasedEquipment();
  }, []);

  const handleRequest = async () => {
    if (!selectedItem || !quantity || isNaN(quantity) || parseInt(quantity) < 1) {
      Alert.alert('Invalid Input', 'Please select an item and enter a valid quantity (at least 1)');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/equipment-requests`, {
        itemId: selectedItem,
        requestedQuantity: parseInt(quantity),
      });

      Alert.alert('Success', 'Equipment request submitted successfully');
      setQuantity('');
      
      // Refresh released equipment list
      const updatedResponse = await axios.get(`${BASE_URL}/equipment/released`);
      setReleasedEquipment(updatedResponse.data.equipment);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          Alert.alert('Error', error.response.data.message);
        } else {
          Alert.alert('Error', 'Failed to submit equipment request');
        }
      } else {
        Alert.alert('Error', 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = (request) => {
    setCurrentRequest(request);
    setReturnModalVisible(true);
  };

  const submitReturn = async () => {
    if (!returnQuantity || isNaN(returnQuantity) || parseInt(returnQuantity) < 1) {
      Alert.alert('Invalid Input', 'Please enter a valid return quantity (at least 1)');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${BASE_URL}/equipment-requests/${currentRequest.requestId}/return`,
        { returnQuantity: parseInt(returnQuantity) }
      );

      Alert.alert('Success', 'Equipment returned successfully');
      setReturnModalVisible(false);
      setReturnQuantity('');
      
      // Refresh released equipment list
      const updatedResponse = await axios.get(`${BASE_URL}/equipment/released`);
      setReleasedEquipment(updatedResponse.data.equipment);
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to return equipment');
      } else {
        Alert.alert('Error', 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getUnitForSelectedItem = () => {
    if (!selectedItem) return '';
    const item = inventoryItems.find(i => i._id === selectedItem);
    return item ? item.unit : '';
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <ScrollView>
        {/* Request Equipment Section */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow">
          <Text className="text-xl font-bold mb-4 text-gray-800">Request Equipment</Text>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Select Equipment</Text>
            <View className="border border-gray-300 rounded">
              <Picker
                selectedValue={selectedItem}
                onValueChange={(itemValue) => setSelectedItem(itemValue)}
                style={{ color: '#4b5563' }}
              >
                {inventoryItems.map((item) => (
                  <Picker.Item 
                    key={item._id} 
                    label={`${item.name} (Available Qty: ${item.quantity} ${item.unit})`} 
                    value={item._id} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Quantity ({getUnitForSelectedItem()})</Text>
            <TextInput
              className="border border-gray-300 rounded p-2"
              placeholder={`Enter quantity in ${getUnitForSelectedItem()}`}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>
          
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-lg items-center"
            onPress={handleRequest}
            disabled={loading}
          >
            <Text className="text-white font-medium">{loading ? 'Submitting...' : 'Submit Request'}</Text>
          </TouchableOpacity>
        </View>

        {/* Released Equipment Section */}
        <View className="bg-white rounded-lg p-4 shadow">
          <Text className="text-xl font-bold mb-4 text-gray-800">My Equipment</Text>
          
          {releasedEquipment.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">No equipment currently released to you</Text>
          ) : (
            releasedEquipment.map((item) => (
              <View key={item.requestId} className="border-b border-gray-200 py-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="font-medium text-gray-800">{item.item.name}</Text>
                  <Text className="text-gray-600">{item.currentlyHeld} {item.item.unit}</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600 text-sm">Status:</Text>
                  <Text className={`text-sm ${
                    item.status === 'approved' ? 'text-green-600' :
                    item.status.includes('partially') ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {item.status}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600 text-sm">Released:</Text>
                  <Text className="text-gray-600 text-sm">{item.totalReleased} {item.item.unit}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600 text-sm">Returned:</Text>
                  <Text className="text-gray-600 text-sm">{item.totalReturned} {item.item.unit}</Text>
                </View>
                {item.currentlyHeld > 0 && (
                  <TouchableOpacity
                    className="bg-green-600 py-2 rounded-lg items-center mt-1"
                    onPress={() => handleReturn(item)}
                  >
                    <Text className="text-white font-medium">Return Equipment</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Return Equipment Modal */}
      <Modal
        visible={returnModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReturnModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
          <View className="bg-white rounded-lg p-4 w-full">
            <Text className="text-xl font-bold mb-4 text-gray-800">Return Equipment</Text>
            
            {currentRequest && (
              <>
                <Text className="text-gray-700 mb-2">
                  Returning: {currentRequest.item.name}
                </Text>
                <Text className="text-gray-700 mb-2">
                  Currently holding: {currentRequest.currentlyHeld} {currentRequest.item.unit}
                </Text>
                
                <TextInput
                  className="border border-gray-300 rounded p-2 mb-4"
                  placeholder={`Enter quantity to return (${currentRequest.item.unit})`}
                  keyboardType="numeric"
                  value={returnQuantity}
                  onChangeText={setReturnQuantity}
                />
                
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="bg-gray-300 py-2 px-4 rounded-lg"
                    onPress={() => setReturnModalVisible(false)}
                  >
                    <Text className="text-gray-800 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className="bg-green-600 py-2 px-4 rounded-lg"
                    onPress={submitReturn}
                    disabled={loading}
                  >
                    <Text className="text-white font-medium">
                      {loading ? 'Processing...' : 'Submit Return'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RequestEquipment;