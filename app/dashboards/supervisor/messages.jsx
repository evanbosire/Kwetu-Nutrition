import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

const RenderedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRenderedTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://kwetu-backend.onrender.com/api/bookings/tasks/service-rendered');
      // Initialize all tasks with rejected: false if not set
      setTasks(response.data.map(task => ({
        ...task,
        rejected: task.rejected || false
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to fetch rendered tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleConfirmService = async (taskId) => {
  try {
    setActionLoading(true);
    
    // Call your existing API endpoint to confirm the service
    await axios.patch(`https://kwetu-backend.onrender.com/api/bookings/${taskId}/confirm-service`);
    
    // Update frontend state after successful API call
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === taskId 
          ? { ...task, supervisorConfirmed: true, rejected: false } 
          : task
      )
    );
    
    // Update selected task if it's the one being confirmed
    if (selectedTask?._id === taskId) {
      setSelectedTask(prev => ({ ...prev, supervisorConfirmed: true, rejected: false }));
    }
    
    Alert.alert('Success', 'Service confirmed successfully');
    setIsModalVisible(false);
  } catch (error) {
    console.error('Error confirming service:', error);
    Alert.alert('Error', error.response?.data?.message || 'Failed to confirm service');
  } finally {
    setActionLoading(false);
  }
};

const handleRejectService = async (taskId) => {
  try {
    setActionLoading(true);
    
    // First check if you have a reject endpoint - if not, you'll need to create one
    await axios.patch(`https://kwetu-backend.onrender.com/api/bookings/${taskId}/reject-service`, {
      rejected: true,
      supervisorConfirmed: false
    });
    
    // Update frontend state after successful API call
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === taskId 
          ? { ...task, supervisorConfirmed: false, rejected: true } 
          : task
      )
    );
    
    // Update selected task if it's the one being rejected
    if (selectedTask?._id === taskId) {
      setSelectedTask(prev => ({ ...prev, supervisorConfirmed: false, rejected: true }));
    }
    
    Alert.alert('Success', 'Service rejected successfully');
    setIsModalVisible(false);
  } catch (error) {
    console.error('Error rejecting service:', error);
    Alert.alert('Error', error.response?.data?.message || 'Failed to reject service');
  } finally {
    setActionLoading(false);
  }
};

  // const handleRejectService = async (taskId) => {
  //   try {
  //     setActionLoading(true);
  //     // Frontend-only rejection
  //     setTasks(prevTasks => 
  //       prevTasks.map(task => 
  //         task._id === taskId 
  //           ? { ...task, supervisorConfirmed: false, rejected: true } 
  //           : task
  //       )
  //     );
      
  //     // Update selected task if it's the one being rejected
  //     if (selectedTask?._id === taskId) {
  //       setSelectedTask(prev => ({ ...prev, supervisorConfirmed: false, rejected: true }));
  //     }
      
  //     Alert.alert('Success', 'Service marked as rejected');
  //     setIsModalVisible(false);
  //   } catch (error) {
  //     console.error('Error rejecting service:', error);
  //     Alert.alert('Error', 'Failed to reject service');
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRenderedTasks();
  };

  useEffect(() => {
    fetchRenderedTasks();
  }, []);

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mx-4 my-2 shadow-sm border border-gray-200"
      onPress={() => {
        setSelectedTask(item);
        setIsModalVisible(true);
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-900 flex-1 pr-2" numberOfLines={2}>
          {item.service?.title || 'Gym Coaching'}
        </Text>
        <View className={`px-2 py-1 rounded-full ${
          item.supervisorConfirmed 
            ? 'bg-green-100' 
            : item.rejected 
              ? 'bg-red-100' 
              : 'bg-yellow-100'
        }`}>
          <Text className={`text-xs font-medium ${
            item.supervisorConfirmed 
              ? 'text-green-800' 
              : item.rejected 
                ? 'text-red-800' 
                : 'text-yellow-800'
          }`}>
            {item.supervisorConfirmed ? 'Confirmed' : item.rejected ? 'Rejected' : 'Pending'}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">Customer:</Text>
        <Text className="text-blue-900">
          {item.customerName || 'Unknown Customer'}
        </Text>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">Date:</Text>
        <Text className="text-blue-900">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">Time:</Text>
        <Text className="text-blue-900">
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-gray-600">Duration:</Text>
        <Text className="text-blue-900 font-semibold">
          {item.hours} hour{item.hours > 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-[#6366f1] shadow-sm">
        <Text className="text-2xl font-bold text-white">Rendered Services</Text>
        <Text className="text-blue-100">Confirm completed coaching sessions</Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1E40AF']}
            tintColor="#1E40AF"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-10">
            <Feather name="calendar" size={48} color="#6B7280" />
            <Text className="text-xl font-medium text-gray-700 mt-4">No rendered services</Text>
            <Text className="text-gray-500 mt-2">All completed services will appear here</Text>
          </View>
        }
      />

      {/* Task Detail Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-white p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Service Details</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {selectedTask && (
            <ScrollView>
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-2" numberOfLines={2}>
                  {selectedTask.service?.title || 'Gym Coaching'}
                </Text>
                
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Customer:</Text>
                  <Text className="text-blue-900">
                    {selectedTask.customerId?.name || 'Unknown Customer'}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Date:</Text>
                  <Text className="text-blue-900">
                    {new Date(selectedTask.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Time:</Text>
                  <Text className="text-blue-900">
                    {new Date(selectedTask.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Duration:</Text>
                  <Text className="text-blue-900">
                    {selectedTask.hours} hour{selectedTask.hours > 1 ? 's' : ''}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Status:</Text>
                  <Text className={`font-medium ${
                    selectedTask.supervisorConfirmed 
                      ? 'text-green-600' 
                      : selectedTask.rejected 
                        ? 'text-red-600' 
                        : 'text-yellow-600'
                  }`}>
                    {selectedTask.supervisorConfirmed 
                      ? 'Confirmed' 
                      : selectedTask.rejected 
                        ? 'Rejected' 
                        : 'Pending Confirmation'}
                  </Text>
                </View>

                {selectedTask.coachNotes && (
                  <View className="mt-4">
                    <Text className="text-gray-600 font-medium mb-1">Coach Notes:</Text>
                    <Text className="text-gray-800">{selectedTask.coachNotes}</Text>
                  </View>
                )}
              </View>

              {!selectedTask.supervisorConfirmed && !selectedTask.rejected && (
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    className="flex-1 py-3 px-4 rounded-lg bg-red-600 items-center justify-center"
                    onPress={() => handleRejectService(selectedTask._id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="text-white font-medium">Reject</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-3 px-4 rounded-lg bg-green-600 items-center justify-center"
                    onPress={() => handleConfirmService(selectedTask._id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="text-white font-medium">Confirm</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {selectedTask.rejected && (
                <TouchableOpacity
                  className="py-3 px-4 rounded-lg bg-green-600 items-center justify-center"
                  onPress={() => handleConfirmService(selectedTask._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="text-white font-medium">Undo Rejection</Text>
                  )}
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default RenderedTasks;