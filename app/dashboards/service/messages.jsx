import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const { token } = useAuthStore();

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        'https://kwetu-backend.onrender.com/api/feedback', 
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Format conversations with proper customer name mapping
      const formattedConversations = response.data.map(conv => ({
        ...conv,
        customerName: conv.customerName || conv.customer?.customerName || 'Customer',
        serviceTitle: conv.booking?.serviceTitle || 'Service',
        lastMessage: conv.messages?.[conv.messages.length - 1]
      }));
      
      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to load conversations'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchConversationDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://kwetu-backend.onrender.com/api/feedback/${id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Ensure consistent data structure
      const conversation = {
        ...response.data,
        customerName: response.data.customerName || 
                     response.data.customer?.customerName || 
                     'Customer'
      };
      
      setSelectedConversation(conversation);
    } catch (error) {
      console.error('Error fetching conversation details:', {
        error: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to load conversation'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      Alert.alert('Error', 'Please enter your reply');
      return;
    }

    setIsReplying(true);

    try {
      await axios.post(
        `https://kwetu-backend.onrender.com/api/feedback/${selectedConversation._id}/reply`,
        { message: replyMessage },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setReplyMessage('');
      // Refresh both conversation details and list
      await Promise.all([
        fetchConversationDetails(selectedConversation._id),
        fetchConversations()
      ]);
    } catch (error) {
      console.error('Error sending reply:', {
        error: error.response?.data,
        status: error.response?.status
      });
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to send reply'
      );
    } finally {
      setIsReplying(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-[#6366f1] shadow-sm">
        <Text className="text-2xl font-bold text-white">Customer Messages</Text>
      </View>

      {selectedConversation ? (
        <View className="flex-1">
          <TouchableOpacity 
            className="p-4 flex-row items-center border-b border-gray-200 bg-white"
            onPress={() => setSelectedConversation(null)}
          >
            <Feather name="arrow-left" size={20} color="#6366f1" />
            <Text className="ml-2 text-[#6366f1]">Back to conversations</Text>
          </TouchableOpacity>

          {/* Conversation Header */}
          <View className="p-4 bg-white border-b border-gray-200">
            <Text className="font-semibold text-lg">
              {selectedConversation.customerName}
            </Text>
            <Text className="text-gray-600">
              {selectedConversation.booking?.serviceTitle || 'Service'}
            </Text>
          </View>

          <FlatList
            data={selectedConversation.messages}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            className="flex-1 p-4"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchConversationDetails(selectedConversation._id)}
              />
            }
            renderItem={({ item }) => (
              <View className={`mb-4 p-3 rounded-lg max-w-[80%] ${item.sender === 'customer' ? 'bg-blue-100 self-start' : 'bg-purple-100 self-end'}`}>
                <Text className="text-gray-800">{item.message}</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {new Date(item.timestamp || item.createdAt).toLocaleString()}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500">No messages in this conversation</Text>
              </View>
            }
          />

          {/* Reply Section */}
          <View className="p-4 border-t border-gray-200 bg-white">
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-2"
              multiline
              placeholder="Type your reply..."
              value={replyMessage}
              onChangeText={setReplyMessage}
            />
            <TouchableOpacity
              className="bg-[#6366f1] py-3 rounded-lg items-center"
              onPress={handleReply}
              disabled={isReplying}
            >
              {isReplying ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">Send Reply</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item._id}
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="p-4 border-b border-gray-200 bg-white"
              onPress={() => fetchConversationDetails(item._id)}
            >
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="font-semibold">{item.customerName}</Text>
                  <Text className="text-gray-600">{item.serviceTitle}</Text>
                </View>
                {item.lastMessage?.sender === 'service_manager' && (
                  <View className="bg-purple-100 px-2 py-1 rounded-full">
                    <Text className="text-purple-800 text-xs">Replied</Text>
                  </View>
                )}
              </View>
              {item.lastMessage && (
                <View className="mt-2">
                  <Text numberOfLines={1} className="text-sm text-gray-500">
                    {item.lastMessage.message}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    {new Date(item.lastMessage.timestamp || item.lastMessage.createdAt).toLocaleString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-10">
              <Feather name="message-square" size={48} color="#6B7280" />
              <Text className="text-xl font-medium text-gray-700 mt-4">No messages yet</Text>
              <TouchableOpacity 
                className="mt-4 bg-[#6366f1] py-2 px-4 rounded-lg"
                onPress={fetchConversations}
              >
                <Text className="text-white">Refresh</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Messages;