import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://kwetu-backend.onrender.com/api/gymcoach';

const CoachRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releaseModalVisible, setReleaseModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [releaseQuantity, setReleaseQuantity] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/equipment-requests`);
      setRequests(response.data.requests);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch equipment requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      await fetchRequests();
    };

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRelease = (request) => {
    setSelectedRequest(request);
    setReleaseQuantity('');
    setReleaseModalVisible(true);
  };

  const submitRelease = async () => {
    if (!releaseQuantity || isNaN(releaseQuantity) || parseInt(releaseQuantity) < 1) {
      Alert.alert('Invalid Input', 'Please enter a valid quantity (at least 1)');
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${BASE_URL}/equipment-requests/${selectedRequest._id}/release`,
        { releaseQuantity: parseInt(releaseQuantity) }
      );

      Alert.alert('Success', 'Equipment released successfully');
      setReleaseModalVisible(false);
      fetchRequests();
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to release equipment');
      } else {
        Alert.alert('Error', 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'partially-approved':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800">Equipment Requests</Text>
        <Text className="text-gray-500 mt-1">Manage and release equipment to coaches</Text>
      </View>
      
      {loading && requests.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-500 mt-4">Loading requests...</Text>
        </View>
      ) : requests.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">No equipment requests found</Text>
          <TouchableOpacity 
            onPress={fetchRequests}
            className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          className="mb-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
        >
          {requests.map((request) => (
            <View 
              key={request._id} 
              className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="font-bold text-lg text-gray-800 flex-1 pr-2">
                  {request.itemId.name}
                </Text>
                <View className={`px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                  <Text className="text-xs font-semibold capitalize">
                    {request.status.replace('-', ' ')}
                  </Text>
                </View>
              </View>
              
              <View className="mb-4 space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Requested:</Text>
                  <Text className="text-gray-800 font-medium">
                    {request.requestedQuantity} {request.itemId.unit}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Released:</Text>
                  <Text className="text-gray-800 font-medium">
                    {request.releasedQuantity} {request.itemId.unit}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Available:</Text>
                  <Text className="text-gray-800 font-medium">
                    {request.itemId.quantity} {request.itemId.unit}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
                <Text className="text-xs text-gray-500">
                  {new Date(request.updatedAt).toLocaleString()}
                </Text>
                
                {request.status !== 'approved' && (
                  <TouchableOpacity
                    className="bg-blue-500 px-5 py-2 rounded-lg shadow-sm active:bg-blue-600"
                    onPress={() => handleRelease(request)}
                    disabled={loading}
                  >
                    <Text className="text-white font-medium">Release</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={releaseModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setReleaseModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white rounded-xl p-6 w-full max-w-md">
            <Text className="text-2xl font-bold mb-4 text-gray-800">Release Equipment</Text>
            
            {selectedRequest && (
              <View className="space-y-4">
                <View className="space-y-2">
                  <Text className="text-gray-700 font-medium">Item:</Text>
                  <Text className="text-gray-800 text-lg">{selectedRequest.itemId.name}</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <View className="space-y-1">
                    <Text className="text-gray-600">Requested:</Text>
                    <Text className="text-gray-800 font-medium">
                      {selectedRequest.requestedQuantity} {selectedRequest.itemId.unit}
                    </Text>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-gray-600">Released:</Text>
                    <Text className="text-gray-800 font-medium">
                      {selectedRequest.releasedQuantity} {selectedRequest.itemId.unit}
                    </Text>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-gray-600">Available:</Text>
                    <Text className="text-gray-800 font-medium">
                      {selectedRequest.itemId.quantity} {selectedRequest.itemId.unit}
                    </Text>
                  </View>
                </View>
                
                <View className="space-y-2">
                  <Text className="text-gray-700 font-medium">
                    Quantity to Release ({selectedRequest.itemId.unit})
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-lg"
                    placeholder={`Max ${Math.min(
                      selectedRequest.itemId.quantity,
                      selectedRequest.requestedQuantity - selectedRequest.releasedQuantity
                    )}`}
                    keyboardType="numeric"
                    value={releaseQuantity}
                    onChangeText={setReleaseQuantity}
                  />
                  <Text className="text-xs text-gray-500">
                    Maximum available: {Math.min(
                      selectedRequest.itemId.quantity,
                      selectedRequest.requestedQuantity - selectedRequest.releasedQuantity
                    )} {selectedRequest.itemId.unit}
                  </Text>
                </View>
                
                <View className="flex-row justify-end space-x-3 mt-4">
                  <TouchableOpacity
                    className="border border-gray-300 py-3 px-6 rounded-lg active:bg-gray-100"
                    onPress={() => setReleaseModalVisible(false)}
                  >
                    <Text className="text-gray-800 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className="bg-blue-500 py-3 px-6 rounded-lg shadow-sm active:bg-blue-600"
                    onPress={submitRelease}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-medium">Release</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CoachRequests;