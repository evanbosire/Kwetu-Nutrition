import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Modal, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useBookings } from '../../context/BookingsContext';
import useAuthStore from '../../store/authStore';
import axios from 'axios';

const Bookings = () => {
  const { bookings, removeFromBookings, clearAllBookings } = useBookings();
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceHours, setServiceHours] = useState({});
  const [paymentCode, setPaymentCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { token } = useAuthStore();
  // Initialize auth state when component mounts
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);


  const handleCheckout = async () => {
    if (!token) {
      Alert.alert('Authentication Required', 'Please login to complete your booking');
      return;
    }
  
    if (selectedServices.length === 0) return;
  
    // Validate payment code
    const validCode = /^(?=(.*[A-Z]){8})(?=(.*\d){2})[A-Z0-9]{10}$/;
    if (!validCode.test(paymentCode)) {
      Alert.alert(
        'Invalid Payment Code',
        'Payment code must contain exactly 10 characters (8 uppercase letters and 2 numbers)'
      );
      return;
    }
  
    // Validate all hours inputs
    for (const service of selectedServices) {
      const hours = serviceHours[service.id] || '1';
      if (!hours || isNaN(hours) || parseInt(hours) < 1) {
        Alert.alert(
          'Invalid Hours',
          `Please enter valid hours for ${service.title} (minimum 1)`
        );
        return;
      }
    }
  
    setIsProcessing(true);
  
    try {
      // Process all bookings
      const bookingPromises = selectedServices.map(service => {
        const mongoServiceId = service.id.split('-')[0];
        const hours = parseInt(serviceHours[service.id] || '');
  
        return axios.post(
          'https://kwetu-backend.onrender.com/api/bookings',
          {
            serviceId: mongoServiceId,
            serviceTitle: service.title,
            hours: hours,
            paymentCode
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });
  
      // Wait for all bookings to complete
      await Promise.all(bookingPromises);
  
      Alert.alert(
        'Booking Successful',
        `Your ${selectedServices.length} bookings have been confirmed!`,
        [
          {
            text: 'OK',
            onPress: () => {
              clearAllBookings();
              setCheckoutModalVisible(false);
              setPaymentCode('');
              setSelectedServices([]);
              setServiceHours({});
            }
          }
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      let errorMessage = 'An error occurred during booking';
  
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Session expired. Please login again';
          useAuthStore.getState().clearCredentials();
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
  
      Alert.alert('Booking Failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  const renderBookingItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mx-4 my-2 flex-row items-center shadow-sm">
      <Image
        source={{ uri: item.image }}
        className="w-16 h-16 rounded-lg mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-slate-800">{item.title}</Text>
        <Text className="text-base text-indigo-600 mt-1">
          Ksh {item.price?.toFixed(2) || "0.00"} / hour
        </Text>
        <Text className="text-sm text-slate-500 mt-1">
          Booked on: {new Date(item.bookingDate).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        className="bg-red-500 p-2 rounded-lg ml-2"
        onPress={() => removeFromBookings(item.id)}
      >
        <Feather name="trash-2" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
  return (
    <View className="flex-1 bg-slate-50">
      {bookings.length === 0 ? (
        <View className="flex-1 justify-center items-center p-5">
          <Feather name="calendar" size={48} color="#6366f1" />
          <Text className="text-xl font-bold text-slate-800 mt-4">
            No bookings yet
          </Text>
          <Text className="text-base text-slate-500 mt-2">
            Book services from the home screen
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={bookings}
            renderItem={renderBookingItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
          />

          <TouchableOpacity
            className="bg-indigo-600 p-4 mx-4 mb-4 rounded-lg shadow-sm"
            onPress={() => {
              setSelectedServices([...bookings]);
              // Initialize hours for each service
              const initialHours = {};
              bookings.forEach(service => {
                initialHours[service.id] = ' ';
              });
              setServiceHours(initialHours);
              setCheckoutModalVisible(true);
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              Proceed to Checkout ({bookings.length})
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Checkout Modal */}
      <Modal
        visible={checkoutModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white rounded-xl p-6 w-full max-w-md">
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Complete Your Booking ({selectedServices.length})
            </Text>

            <ScrollView className="max-h-64 mb-4">
              {selectedServices.map((service) => (
                <View key={service.id} className="mb-4 pb-4 border-b border-slate-100">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-semibold text-slate-700">
                      {service.title}
                    </Text>
                    <Text className="text-indigo-600">
                      Ksh {service.price?.toFixed(2)} / hour
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="text-sm font-medium text-slate-700 mr-2">
                      Hours:
                    </Text>
                    <TextInput
                      className="border border-slate-300 rounded-lg p-2 flex-1"
                      keyboardType="numeric"
                      value={serviceHours[service.id] || '1'}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, '');
                        if (numericValue === '' || parseInt(numericValue) > 0) {
                          setServiceHours(prev => ({
                            ...prev,
                            [service.id]: numericValue
                          }));
                        }
                      }}
                      placeholder="Hours"
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Payment Code Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-slate-700 mb-1">
                Payment Code
              </Text>
              <TextInput
                className="border border-slate-300 rounded-lg p-3"
                value={paymentCode}
                onChangeText={(text) => {
                  const filteredText = text.replace(/[^A-Z0-9]/g, '');
                  if (filteredText.length <= 10) {
                    setPaymentCode(filteredText);
                  }
                }}
                placeholder="Enter payment code"
                autoCapitalize="characters"
                maxLength={10}
                keyboardType="default"
              />
              <Text className="text-xs text-slate-500 mt-1">
                Must be exactly 10 characters (8 uppercase letters and 2 numbers)
              </Text>
            </View>

            {/* Total Amount Calculation */}
            <View className="mb-6 bg-slate-100 p-3 rounded-lg">
              <Text className="font-semibold text-slate-800">
                Total Amount: Ksh {selectedServices.reduce((sum, service) => {
                  const hours = parseInt(serviceHours[service.id] || '1');
                  return sum + (service.price * hours);
                }, 0).toFixed(2)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-slate-200 py-3 px-6 rounded-lg"
                onPress={() => setCheckoutModalVisible(false)}
                disabled={isProcessing}
              >
                <Text className="text-slate-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-indigo-600 py-3 px-6 rounded-lg"
                onPress={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Text className="text-white font-medium">Processing...</Text>
                ) : (
                  <Text className="text-white font-medium">Confirm Booking</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Bookings;