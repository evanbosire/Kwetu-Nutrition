import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  Alert, 
  TouchableOpacity, 
  Linking,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import useAuthStore from '../../store/authStore';

const Track = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [downloadedIds, setDownloadedIds] = useState(new Set());
  const { token, email } = useAuthStore(); // Changed from userId to email

  // Feedback modal state
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  // Feedback thread modal state
  const [isFeedbackThreadModalVisible, setIsFeedbackThreadModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackThreads, setFeedbackThreads] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://kwetu-backend.onrender.com/api/bookings/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBookings(response.data);
     
    } catch (error) {
     
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFeedbackThreads = async () => {
    try {
      const response = await axios.get('https://kwetu-backend.onrender.com/api/feedback', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Filter feedbacks for current user using email
      const userFeedbacks = response.data.filter(feedback => {
        const feedbackEmail = feedback.customer?.email || feedback.customerEmail;
        return feedbackEmail === email;
      });
      
      setFeedbackThreads(userFeedbacks);
    } catch (error) {
    
      Alert.alert('Error fetching feedback threads:', error);
    }
  };

  const downloadReceipt = async (bookingId) => {
    setDownloadingIds(prev => new Set([...prev, bookingId]));
    
    try {
      const response = await axios.get(
        `https://kwetu-backend.onrender.com/api/bookings/${bookingId}/generate-receipt`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.receiptUrl) {
        const receiptUrl = `https://kwetu-backend.onrender.com${response.data.receiptUrl}`;
        const supported = await Linking.canOpenURL(receiptUrl);
        
        if (supported) {
          await Linking.openURL(receiptUrl);
          setDownloadedIds(prev => new Set([...prev, bookingId]));
        } else {
          Alert.alert('Success', 'Receipt generated successfully!');
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        Alert.alert('Error', 'Payment not yet approved for this booking');
      } else {
        Alert.alert('Error', 'Failed to download receipt. Please try again.');
      }
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const handleOpenFeedback = (booking) => {
    setSelectedBooking(booking);
    setFeedbackMessage('');
    setIsFeedbackModalVisible(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'User email not found');
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const response = await axios.post(
        'https://kwetu-backend.onrender.com/api/feedback/post-feedback',
        {
          customerEmail: email,
          bookingId: selectedBooking._id,
          message: feedbackMessage
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      Alert.alert('Success', 'Feedback submitted successfully!');
      setIsFeedbackModalVisible(false);
      fetchFeedbackThreads();
    } catch (error) {
      
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleViewFeedback = async (booking) => {
    setLoadingThread(true);
    setIsFeedbackThreadModalVisible(true);
    
    try {
      const existingFeedback = feedbackThreads.find(feedback => {
        const feedbackBookingId = feedback.booking?._id || feedback.booking;
        return feedbackBookingId === booking._id;
      });
      
      if (existingFeedback) {
        const response = await axios.get(
          `https://kwetu-backend.onrender.com/api/feedback/${existingFeedback._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSelectedFeedback(response.data);
      } else {
        setSelectedFeedback(null);
      }
    } catch (error) {
     
      Alert.alert('Error', 'Failed to load feedback thread');
    } finally {
      setLoadingThread(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyMessage.trim()) {
      Alert.alert('Error', 'Please enter your reply');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'User email not found');
      return;
    }

    setIsSubmittingReply(true);

    try {
      const response = await axios.post(
        `https://kwetu-backend.onrender.com/api/feedback/${selectedFeedback._id}/customer-response`,
        {
          customerEmail: email,
          message: replyMessage
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSelectedFeedback(response.data);
      setReplyMessage('');
      fetchFeedbackThreads();
      Alert.alert('Success', 'Reply sent successfully!');
    } catch (error) {

      Alert.alert('Error', 'Failed to send reply. Please try again.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchFeedbackThreads();
    
    const refreshInterval = setInterval(() => {
      fetchBookings();
      fetchFeedbackThreads();
    }, 60000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
    fetchFeedbackThreads();
  };

  const getStatusColor = (status, paymentApproved, serviceRendered) => {
    if (serviceRendered) {
      return 'bg-purple-100 text-purple-800';
    }
    if (paymentApproved) {
      return 'bg-green-100 text-green-800';
    }
    
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-blue-700 text-white';
      case 'pending':
        return 'bg-gray-200 text-gray-800';
      case 'cancelled':
        return 'bg-black text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status, paymentApproved, serviceRendered) => {
    if (serviceRendered) {
      return 'Rendered';
    }
    if (paymentApproved) {
      return 'Payment Approved';
    }
    return status || 'pending';
  };

  const hasFeedbackForBooking = (bookingId) => {
    return feedbackThreads.some(feedback => {
      // Handle both populated and non-populated booking field
      const feedbackBookingId = feedback.booking?._id || feedback.booking;
      return feedbackBookingId === bookingId;
    });
  };

 const renderBookingItem = ({ item }) => {
  const isDownloading = downloadingIds.has(item._id);
  const isDownloaded = downloadedIds.has(item._id);
  const hasExistingFeedback = hasFeedbackForBooking(item._id);
  
  return (
    <View className="bg-white rounded-lg p-4 mx-4 my-2 shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-900">{item.serviceTitle}</Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(item.status, item.paymentApproved, item.serviceRendered)}`}>
          <Text className="text-xs font-medium capitalize">
            {getStatusText(item.status, item.paymentApproved, item.serviceRendered)}
          </Text>
        </View>
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
      
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">Duration:</Text>
        <Text className="text-blue-900">{item.hours} hour{item.hours > 1 ? 's' : ''}</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-gray-600">Charge/Hr:</Text>
        <Text className="text-blue-900 font-semibold">
          Ksh {item.service?.pricePerHour}
        </Text>
      </View>
      
      <View className="flex-row justify-between">
        <Text className="text-gray-600">Total Charge:</Text>
        <Text className="text-blue-900 font-semibold">
          Ksh {(item.totalPrice || item.service?.pricePerHour * item.hours)?.toFixed(2)}
        </Text>
      </View>
      
      {item.paymentApproved && (
        <TouchableOpacity
          className={`mt-3 py-3 px-4 rounded-lg flex-row items-center justify-center ${
            isDownloading 
              ? 'bg-gray-300' 
              : isDownloaded
                ? 'bg-gray-400'
                : 'bg-green-600 active:bg-green-700'
          }`}
          onPress={() => !isDownloaded && downloadReceipt(item._id)}
          disabled={isDownloading || isDownloaded}
        >
          {isDownloading ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
              <Text className="text-white font-medium">Generating...</Text>
            </>
          ) : isDownloaded ? (
            <>
              <Feather name="check" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Receipt Downloaded</Text>
            </>
          ) : (
            <>
              <Feather name="download" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Download Receipt</Text>
            </>
          )}
        </TouchableOpacity>
      )}
      
      {/* Conditionally render feedback buttons - Only when managerApproved is true */}
      {item.managerApproved && (
        <View className="flex-row space-x-2">
          {!hasExistingFeedback ? (
            <TouchableOpacity
              className="flex-1 mt-3 py-3 px-4 rounded-lg flex-row items-center justify-center bg-blue-600 active:bg-blue-700"
              onPress={() => handleOpenFeedback(item)}
            >
              <Feather name="message-square" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Give Feedback</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="flex-1 mt-3 py-3 px-4 rounded-lg flex-row items-center justify-center bg-purple-600 active:bg-purple-700"
              onPress={() => handleViewFeedback(item)}
            >
              <Feather name="eye" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">View Feedback</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {item.coachNotes && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-sm font-medium text-gray-600">Coach Notes:</Text>
          <Text className="text-sm text-gray-800 mt-1">{item.coachNotes}</Text>
        </View>
      )}
    </View>
  );
};

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 mt-8">
      <View className="p-4 bg-[#6366f1] shadow-sm">
        <Text className="text-2xl font-bold text-white">Your Bookings</Text>
        <Text className="text-blue-100">Track your upcoming and past sessions</Text>
      </View>
      
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
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
            <Text className="text-xl font-medium text-gray-700 mt-4">No bookings found</Text>
            <Text className="text-gray-500 mt-2">Book a session to see it here</Text>
          </View>
        }
      />

      {/* Submit Feedback Modal */}
      <Modal
        visible={isFeedbackModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFeedbackModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
            <View className="bg-white rounded-lg p-6 w-full max-w-md">
              <Text className="text-xl font-bold mb-4">Submit Feedback</Text>
              
              <Text className="text-gray-700 mb-1">Your Feedback:</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4 h-32 text-gray-800"
                multiline
                placeholder="Write your feedback here..."
                value={feedbackMessage}
                onChangeText={setFeedbackMessage}
              />
              
              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg border border-gray-300"
                  onPress={() => setIsFeedbackModalVisible(false)}
                >
                  <Text className="text-gray-700">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg bg-blue-600"
                  onPress={handleSubmitFeedback}
                  disabled={isSubmittingFeedback}
                >
                  {isSubmittingFeedback ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="text-white">Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Feedback Thread Modal */}
      <Modal
        visible={isFeedbackThreadModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFeedbackThreadModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50">
          <View className="flex-1 bg-white mt-20 rounded-t-3xl">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold">Feedback Thread</Text>
                <TouchableOpacity onPress={() => setIsFeedbackThreadModalVisible(false)}>
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
            
            {loadingThread ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#1E40AF" />
              </View>
            ) : selectedFeedback ? (
              <View className="flex-1">
                <ScrollView className="flex-1 p-4">
                  {selectedFeedback.messages?.map((message, index) => (
                    <View 
                      key={index}
                      className={`mb-4 p-3 rounded-lg max-w-4/5 ${
                        message.sender === 'customer' 
                          ? 'bg-blue-100 self-end' 
                          : 'bg-gray-100 self-start'
                      }`}
                    >
                      <Text className="text-xs text-gray-500 mb-1">
                        {message.sender === 'customer' ? 'You' : 'Service Manager'}
                      </Text>
                      <Text className="text-gray-800">{message.message}</Text>
                      <Text className="text-xs text-gray-400 mt-1">
                        {new Date(message.timestamp).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View className="p-4 border-t border-gray-200">
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 mb-3 h-20 text-gray-800"
                      multiline
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChangeText={setReplyMessage}
                    />
                    
                    <TouchableOpacity
                      className="py-3 px-4 rounded-lg bg-blue-600 flex-row items-center justify-center"
                      onPress={handleSubmitReply}
                      disabled={isSubmittingReply}
                    >
                      {isSubmittingReply ? (
                        <>
                          <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
                          <Text className="text-white font-medium">Sending...</Text>
                        </>
                      ) : (
                        <>
                          <Feather name="send" size={16} color="white" className="mr-2" />
                          <Text className="text-white font-medium">Send Reply</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : (
              <View className="flex-1 justify-center items-center p-4">
                <Feather name="message-circle" size={48} color="#6B7280" />
                <Text className="text-lg font-medium text-gray-700 mt-4">No feedback thread found</Text>
                <Text className="text-gray-500 mt-2 text-center">
                  This booking doesn't have any feedback yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Track;