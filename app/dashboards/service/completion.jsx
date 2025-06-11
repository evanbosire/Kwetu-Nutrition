// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   ActivityIndicator, 
//   RefreshControl, 
//   Alert,
//   TouchableOpacity,
//   Modal,
//   ScrollView
// } from 'react-native';
// import axios from 'axios';
// import { Feather } from '@expo/vector-icons';

// const ApproveTaskCompletion = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   const fetchConfirmedTasks = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('https://kwetu-backend.onrender.com/api/bookings/supervisor/confirmed-tasks');
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       Alert.alert('Error', 'Failed to fetch confirmed tasks');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleApproveService = async (taskId) => {
//     try {
//       setActionLoading(true);
//       await axios.patch(`https://kwetu-backend.onrender.com/api/bookings/${taskId}/approve-service`);
//       Alert.alert('Success', 'Service approved successfully');
//       fetchConfirmedTasks(); // Refresh the list
//       setIsModalVisible(false);
//     } catch (error) {
//       console.error('Error approving service:', error);
//       Alert.alert('Error', 'Failed to approve service');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchConfirmedTasks();
//   };

//   useEffect(() => {
//     fetchConfirmedTasks();
//   }, []);

//   const renderTaskItem = ({ item }) => (
//     <TouchableOpacity 
//       className="bg-white rounded-lg p-4 mx-4 my-2 shadow-sm border border-gray-200"
//       onPress={() => {
//         setSelectedTask(item);
//         setIsModalVisible(true);
//       }}
//     >
//       <View className="flex-row justify-between items-start mb-2">
//         <Text className="text-lg font-semibold text-gray-900 flex-1 pr-2" numberOfLines={2}>
//           {item.service?.title || 'Gym Coaching'}
//         </Text>
//         <View className={`px-2 py-1 rounded-full ${
//           item.managerApproved ? 'bg-green-100' : 'bg-blue-100'
//         }`}>
//           <Text className={`text-xs font-medium ${
//             item.managerApproved ? 'text-green-800' : 'text-blue-800'
//           }`}>
//             {item.managerApproved ? 'Approved' : 'Pending Approval'}
//           </Text>
//         </View>
//       </View>

//       <View className="flex-row justify-between mb-1">
//         <Text className="text-gray-600">Customer:</Text>
//         <Text className="text-blue-900">
//           {item.customerId?.name || 'Unknown Customer'}
//         </Text>
//       </View>

//       <View className="flex-row justify-between mb-1">
//         <Text className="text-gray-600">Date:</Text>
//         <Text className="text-blue-900">
//           {new Date(item.createdAt).toLocaleDateString()}
//         </Text>
//       </View>

//       <View className="flex-row justify-between mb-1">
//         <Text className="text-gray-600">Supervisor:</Text>
//         <Text className="text-blue-900">
//           {item.supervisorId?.name || 'Not specified'}
//         </Text>
//       </View>

//       <View className="flex-row justify-between">
//         <Text className="text-gray-600">Duration:</Text>
//         <Text className="text-blue-900 font-semibold">
//           {item.hours} hour{item.hours > 1 ? 's' : ''}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#1E40AF" />
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       <View className="p-4 bg-[#6366f1] shadow-sm">
//         <Text className="text-2xl font-bold text-white">Confirmed Services</Text>
//         <Text className="text-blue-100">Approve completed services</Text>
//       </View>

//       <FlatList
//         data={tasks}
//         renderItem={renderTaskItem}
//         keyExtractor={item => item._id}
//         contentContainerStyle={{ paddingVertical: 20 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#1E40AF']}
//             tintColor="#1E40AF"
//           />
//         }
//         ListEmptyComponent={
//           <View className="flex-1 justify-center items-center mt-10">
//             <Feather name="calendar" size={48} color="#6B7280" />
//             <Text className="text-xl font-medium text-gray-700 mt-4">No confirmed services</Text>
//             <Text className="text-gray-500 mt-2">Services confirmed by supervisors will appear here</Text>
//           </View>
//         }
//       />

//       {/* Task Detail Modal */}
//       <Modal
//         visible={isModalVisible}
//         animationType="slide"
//         transparent={false}
//         onRequestClose={() => setIsModalVisible(false)}
//       >
//         <View className="flex-1 bg-white p-4">
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-xl font-bold">Service Details</Text>
//             <TouchableOpacity onPress={() => setIsModalVisible(false)}>
//               <Feather name="x" size={24} color="#6B7280" />
//             </TouchableOpacity>
//           </View>

//           {selectedTask && (
//             <ScrollView>
//               <View className="mb-6">
//                 <Text className="text-lg font-semibold text-gray-900 mb-2">
//                   {selectedTask.service?.title || 'Gym Coaching'}
//                 </Text>
                
//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Customer:</Text>
//                   <Text className="text-blue-900">
//                     {selectedTask.customerId?.name || 'Unknown Customer'}
//                   </Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Supervisor:</Text>
//                   <Text className="text-blue-900">
//                     {selectedTask.supervisorId?.name || 'Not specified'}
//                   </Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Date:</Text>
//                   <Text className="text-blue-900">
//                     {new Date(selectedTask.createdAt).toLocaleDateString()}
//                   </Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Time:</Text>
//                   <Text className="text-blue-900">
//                     {new Date(selectedTask.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Duration:</Text>
//                   <Text className="text-blue-900">
//                     {selectedTask.hours} hour{selectedTask.hours > 1 ? 's' : ''}
//                   </Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Status:</Text>
//                   <Text className={`font-medium ${
//                     selectedTask.managerApproved ? 'text-green-600' : 'text-blue-600'
//                   }`}>
//                     {selectedTask.managerApproved ? 'Approved' : 'Pending Manager Approval'}
//                   </Text>
//                 </View>

//                 {selectedTask.coachNotes && (
//                   <View className="mt-4">
//                     <Text className="text-gray-600 font-medium mb-1">Coach Notes:</Text>
//                     <Text className="text-gray-800">{selectedTask.coachNotes}</Text>
//                   </View>
//                 )}

//                 {selectedTask.supervisorNotes && (
//                   <View className="mt-4">
//                     <Text className="text-gray-600 font-medium mb-1">Supervisor Notes:</Text>
//                     <Text className="text-gray-800">{selectedTask.supervisorNotes}</Text>
//                   </View>
//                 )}
//               </View>

//               {!selectedTask.managerApproved && (
//                 <TouchableOpacity
//                   className="py-3 px-4 rounded-lg bg-green-600 items-center justify-center"
//                   onPress={() => handleApproveService(selectedTask._id)}
//                   disabled={actionLoading}
//                 >
//                   {actionLoading ? (
//                     <ActivityIndicator size="small" color="#ffffff" />
//                   ) : (
//                     <Text className="text-white font-medium">Approve Completion</Text>
//                   )}
//                 </TouchableOpacity>
//               )}
//             </ScrollView>
//           )}
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default ApproveTaskCompletion;

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
  ScrollView,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Color palette
const COLORS = {
  primary: '#4F46E5',       // Vibrant indigo
  secondary: '#10B981',     // Emerald green
  accent: '#F59E0B',        // Amber
  backgroundDark: '#111827', // Dark slate
  backgroundLight: '#1F2937', // Lighter slate
  textPrimary: '#F3F4F6',   // Light gray
  textSecondary: '#9CA3AF', // Medium gray
  success: '#10B981',       // Green
  warning: '#F59E0B',       // Amber
  error: '#EF4444',         // Red
  highlight: '#818CF8',     // Light indigo
  cardBg: '#1E293B',        // Card background
};

const ApproveTaskCompletion = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const fetchConfirmedTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://kwetu-backend.onrender.com/api/bookings/supervisor/confirmed-tasks');
      setTasks(response.data);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to fetch confirmed tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApproveService = async (taskId) => {
    try {
      setActionLoading(true);
      await axios.patch(`https://kwetu-backend.onrender.com/api/bookings/${taskId}/approve-service`);
      Alert.alert('Success', 'Service approved successfully');
      fetchConfirmedTasks();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error approving service:', error);
      Alert.alert('Error', 'Failed to approve service');
    } finally {
      setActionLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConfirmedTasks();
  };

  useEffect(() => {
    fetchConfirmedTasks();
  }, []);

  const PulsingDot = ({ color, size = 8 }) => {
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }, []);

    return (
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale: pulseAnim }],
        }}
      />
    );
  };

  const renderTaskItem = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity 
        onPress={() => {
          setSelectedTask(item);
          setIsModalVisible(true);
        }}
        style={{
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 16,
          backgroundColor: COLORS.cardBg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <View style={{ padding: 20 }}>
          {/* Header with status */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: COLORS.textPrimary,
              flex: 1,
            }} numberOfLines={2}>
              {item.service?.title || 'Gym Coaching'}
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: item.managerApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: item.managerApproved ? COLORS.success : COLORS.warning,
            }}>
              <PulsingDot color={item.managerApproved ? COLORS.success : COLORS.warning} size={6} />
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: item.managerApproved ? COLORS.success : COLORS.warning,
                marginLeft: 6,
                textTransform: 'uppercase',
              }}>
                {item.managerApproved ? 'Approved' : 'Pending'}
              </Text>
            </View>
          </View>

          {/* Details grid */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' }}>Customer:</Text>
              <Text style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' }}>
                {item.customerName || 'Unknown Customer'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' }}>Date:</Text>
              <Text style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>

            

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' }}>Duration:</Text>
              <View style={{
                backgroundColor: COLORS.primary,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '700' }}>
                  {item.hours} hr{item.hours > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.backgroundDark, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ 
          marginTop: 16, 
          color: COLORS.textPrimary, 
          fontSize: 16,
          fontWeight: '600'
        }}>
          Loading Services...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.backgroundDark }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.highlight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text style={{
          fontSize: 24,
          fontWeight: '800',
          color: '#fff',
          marginBottom: 4,
        }}>
          Confirmed Services
        </Text>
        <Text style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.9)',
          fontWeight: '500'
        }}>
          Approve completed services
        </Text>
      </LinearGradient>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressBackgroundColor={COLORS.backgroundLight}
          />
        }
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
            <View style={{
              backgroundColor: COLORS.cardBg,
              padding: 30,
              borderRadius: 20,
              alignItems: 'center',
              width: '80%',
            }}>
              <View style={{
                backgroundColor: COLORS.primary,
                padding: 20,
                borderRadius: 50,
                marginBottom: 20,
              }}>
                <Feather name="calendar" size={36} color="#fff" />
              </View>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: COLORS.textPrimary,
                marginBottom: 8,
                textAlign: 'center',
              }}>
                No Confirmed Services
              </Text>
              <Text style={{
                fontSize: 16,
                color: COLORS.textSecondary,
                textAlign: 'center',
                lineHeight: 24,
              }}>
                Services confirmed by supervisors will appear here
              </Text>
            </View>
          </View>
        }
      />

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: COLORS.backgroundDark }}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
          
          {/* Modal Header */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.highlight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingTop: 50,
              paddingBottom: 20,
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: '#fff',
            }}>
              Service Details
            </Text>
            <TouchableOpacity 
              onPress={() => setIsModalVisible(false)}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          {selectedTask && (
            <ScrollView style={{ padding: 20 }}>
              <View style={{
                backgroundColor: COLORS.cardBg,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}>
                {/* Service Title */}
                <Text style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: COLORS.textPrimary,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                  {selectedTask.service?.title || 'Gym Coaching'}
                </Text>

                {/* Details Grid */}
                <View style={{ gap: 16 }}>
                  {[
                    { icon: 'user', label: 'Customer', value: selectedTask.customerName || 'Unknown Customer' },
                    
                    { icon: 'calendar', label: 'Date', value: new Date(selectedTask.createdAt).toLocaleDateString() },
                    { icon: 'clock', label: 'Time', value: new Date(selectedTask.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                    { icon: 'zap', label: 'Duration', value: `${selectedTask.hours} hour${selectedTask.hours > 1 ? 's' : ''}` },
                  ].map((item, index) => (
                    <View key={index} style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: COLORS.backgroundLight,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                          backgroundColor: COLORS.primary,
                          padding: 8,
                          borderRadius: 10,
                          marginRight: 12,
                        }}>
                          <Feather name={item.icon} size={16} color="#fff" />
                        </View>
                        <Text style={{
                          fontSize: 16,
                          color: COLORS.textSecondary,
                          fontWeight: '600',
                        }}>
                          {item.label}
                        </Text>
                      </View>
                      <Text style={{
                        fontSize: 16,
                        color: COLORS.textPrimary,
                        fontWeight: '700',
                      }}>
                        {item.value}
                      </Text>
                    </View>
                  ))}

                  {/* Status */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: COLORS.backgroundLight,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        backgroundColor: COLORS.primary,
                        padding: 8,
                        borderRadius: 10,
                        marginRight: 12,
                      }}>
                        <Feather name="activity" size={16} color="#fff" />
                      </View>
                      <Text style={{
                        fontSize: 16,
                        color: COLORS.textSecondary,
                        fontWeight: '600',
                      }}>
                        Status
                      </Text>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: selectedTask.managerApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: selectedTask.managerApproved ? COLORS.success : COLORS.warning,
                    }}>
                      <PulsingDot color={selectedTask.managerApproved ? COLORS.success : COLORS.warning} size={8} />
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: selectedTask.managerApproved ? COLORS.success : COLORS.warning,
                        marginLeft: 8,
                        textTransform: 'uppercase',
                      }}>
                        {selectedTask.managerApproved ? 'APPROVED' : 'PENDING APPROVAL'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Notes */}
                {selectedTask.coachNotes && (
                  <View style={{
                    marginTop: 20,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: COLORS.backgroundLight,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: COLORS.textSecondary,
                      fontWeight: '600',
                      marginBottom: 8,
                    }}>
                      Coach Notes:
                    </Text>
                    <Text style={{
                      fontSize: 16,
                      color: COLORS.textPrimary,
                      lineHeight: 24,
                    }}>
                      {selectedTask.coachNotes}
                    </Text>
                  </View>
                )}

                {selectedTask.supervisorNotes && (
                  <View style={{
                    marginTop: 16,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: COLORS.backgroundLight,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: COLORS.textSecondary,
                      fontWeight: '600',
                      marginBottom: 8,
                    }}>
                      Supervisor Notes:
                    </Text>
                    <Text style={{
                      fontSize: 16,
                      color: COLORS.textPrimary,
                      lineHeight: 24,
                    }}>
                      {selectedTask.supervisorNotes}
                    </Text>
                  </View>
                )}

                {/* Approve Button */}
                {!selectedTask.managerApproved && (
                  <TouchableOpacity
                    onPress={() => handleApproveService(selectedTask._id)}
                    disabled={actionLoading}
                    style={{
                      marginTop: 30,
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <LinearGradient
                      colors={[COLORS.success, '#059669']}
                      style={{
                        paddingVertical: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {actionLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Feather name="check-circle" size={20} color="#fff" />
                          <Text style={{
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: '700',
                            marginLeft: 8,
                          }}>
                            APPROVE COMPLETION
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ApproveTaskCompletion;