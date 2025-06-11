import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'; // Import axios

const RequestEquipment = () => {
  const equipmentList = [
    { name: 'Dumbbells', unit: 'kg' },
    { name: 'Barbells', unit: 'pieces' },
    { name: 'Weight plates', unit: 'kg' },
    { name: 'Kettlebells', unit: 'kg' },
    { name: 'Resistance bands', unit: 'pieces' },
    { name: 'Medicine balls', unit: 'kg' },
    { name: 'Power racks', unit: 'pieces' },
    { name: 'Benches', unit: 'pieces' },
    { name: 'Treadmills', unit: 'pieces' },
    { name: 'Stationary bikes', unit: 'pieces' },
    { name: 'Rowing machines', unit: 'pieces' },
    { name: 'Jump ropes', unit: 'pieces' },
    { name: 'Plyometric boxes', unit: 'pieces' },
    { name: 'Suspension trainers', unit: 'pieces' },
    { name: 'Yoga mats', unit: 'pieces' },
    { name: 'Foam rollers', unit: 'pieces' },
    { name: 'First aid kits', unit: 'pieces' },
    { name: 'Towels', unit: 'pieces' },
    { name: 'Timers', unit: 'pieces' },
    { name: 'Tablets', unit: 'pieces' }
  ];

  const suppliers = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Michael Brown' }
  ];

  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: '', unit: '', feedback: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: '', unit: '', feedback: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-fill unit when equipment is selected
    if (field === 'name') {
      const selectedEquipment = equipmentList.find(e => e.name === value);
      if (selectedEquipment) {
        newItems[index].unit = selectedEquipment.unit;
      }
    }
    
    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (!selectedSupplier) {
      Alert.alert('Error', 'Please select a supplier');
      return;
    }

    for (const item of items) {
      if (!item.name || !item.quantity) {
        Alert.alert('Error', 'Please fill all required fields for all items');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'https://kwetu-backend.onrender.com/api/inventory/request-equipment',
        {
          supplierName: selectedSupplier,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            feedback: item.feedback || ''
          }))
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Equipment request submitted successfully');
        // Reset form
        setSelectedSupplier('');
        setItems([{ name: '', quantity: '', unit: '', feedback: '' }]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to submit request');
      }
    } catch (error) {
      // Axios wraps the error response in error.response
      const errorMessage = error.response?.data?.message || 'An error occurred while submitting the request';
      Alert.alert('Error', errorMessage);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="p-4 bg-gray-50 flex-1">
      <Text className="text-2xl font-bold mb-6 text-center">Request Equipment</Text>
      
      {/* Supplier Selection */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Select Supplier*</Text>
        <View className="border border-gray-300 rounded-md">
          <Picker
            selectedValue={selectedSupplier}
            onValueChange={(itemValue) => setSelectedSupplier(itemValue)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select a supplier..." value="" />
            {suppliers.map(supplier => (
              <Picker.Item key={supplier.id} label={supplier.name} value={supplier.name} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Equipment Items */}
      <Text className="text-lg font-semibold mb-2">Equipment Items*</Text>
      {items.map((item, index) => (
        <View key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Equipment*</Text>
            <View className="border border-gray-300 rounded-md">
              <Picker
                selectedValue={item.name}
                onValueChange={(value) => handleItemChange(index, 'name', value)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Select equipment..." value="" />
                {equipmentList.map(equip => (
                  <Picker.Item key={equip.name} label={equip.name} value={equip.name} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Quantity*</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3"
              placeholder="Enter quantity"
              keyboardType="numeric"
              value={item.quantity}
              onChangeText={(text) => handleItemChange(index, 'quantity', text)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Unit</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3 bg-gray-100"
              placeholder="Unit"
              value={item.unit}
              editable={false}
            />
          </View>

          <View className="mb-2">
            <Text className="text-gray-700 mb-1">Feedback (Optional)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3"
              placeholder="Any additional feedback"
              value={item.feedback}
              onChangeText={(text) => handleItemChange(index, 'feedback', text)}
              multiline
            />
          </View>

          {items.length > 1 && (
            <TouchableOpacity
              className="mt-2 bg-red-500 py-2 px-4 rounded-md self-end"
              onPress={() => handleRemoveItem(index)}
            >
              <Text className="text-white">Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-md mb-6"
        onPress={handleAddItem}
      >
        <Text className="text-white text-center">Add Another Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-green-600 py-3 px-6 rounded-md mb-10"
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text className="text-white text-center">
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default RequestEquipment