// import {
//   View,
//   Text,
//   FlatList,
//   RefreshControl,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// const AssignedTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const BASE_URL = 'https://kwetu-backend.onrender.com/api/bookings';

//   // Fetch assigned tasks
//   const fetchAssignedTasks = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/coach/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       Alert.alert('Error', 'Failed to load assigned tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle refresh
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchAssignedTasks();
//     setRefreshing(false);
//   }, []);

//   // Mark task as rendered
//   const markAsRendered = async (taskId) => {
//     try {
//       const response = await axios.patch(
//         `${BASE_URL}/${taskId}/mark-rendered`
//       );
      
//       // Update the task in state
//       setTasks(tasks.map(task => 
//         task._id === taskId ? { ...task, serviceRendered: true } : task
//       ));
      
//       Alert.alert('Success', 'Service marked as rendered successfully');
//     } catch (error) {
//       console.error('Error marking as rendered:', error);
//       Alert.alert('Error', 'Failed to mark service as rendered');
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   // Load data on component mount
//   useEffect(() => {
//     fetchAssignedTasks();
//   }, []);

//   // Render individual task item
//   const renderTaskItem = ({ item }) => {
//     return (
//       <View className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm border border-gray-200">
//         <View className="flex-row justify-between items-start mb-2">
//           <Text className="text-lg font-bold text-gray-900">
//             {item.service?.title || 'Training Session'}
//           </Text>
//           <View className={`px-2 py-1 rounded-full ${item.serviceRendered ? 'bg-green-100' : 'bg-amber-100'}`}>
//             <Text className={`text-xs font-medium ${item.serviceRendered ? 'text-green-800' : 'text-amber-800'}`}>
//               {item.serviceRendered ? 'Completed' : 'Pending'}
//             </Text>
//           </View>
//         </View>

//         <View className="space-y-2 mt-2">
//           <View className="flex-row">
//             <Text className="text-gray-500 w-24">Customer:</Text>
//             <Text className="text-gray-800 flex-1">
//               {item.customerId?.name || 'Customer Name'}
//             </Text>
//           </View>

//           <View className="flex-row">
//             <Text className="text-gray-500 w-24">Date:</Text>
//             <Text className="text-gray-800 flex-1">
//               {formatDate(item.createdAt)}
//             </Text>
//           </View>

//           <View className="flex-row">
//             <Text className="text-gray-500 w-24">Duration:</Text>
//             <Text className="text-gray-800 flex-1">
//               {item.hours} hour(s)
//             </Text>
//           </View>

//           <View className="flex-row">
//             <Text className="text-gray-500 w-24">Description:</Text>
//             <Text className="text-gray-800 flex-1">
//               {item.service?.description || 'No description provided'}
//             </Text>
//           </View>
//         </View>

//         {!item.serviceRendered && (
//           <TouchableOpacity
//             className="bg-blue-600 py-2 rounded-lg mt-4 flex-row justify-center items-center"
//             onPress={() => markAsRendered(item._id)}
//           >
//             <Text className="text-white font-medium">Mark as Completed</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text className="text-gray-600 mt-4">Loading your tasks...</Text>
//       </View>
//     );
//   }

//   // Empty state
//   if (tasks.length === 0) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 px-4">
//         <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full max-w-sm">
//           <Text className="text-center text-gray-500 text-lg mb-2">
//             No Tasks Assigned
//           </Text>
//           <Text className="text-center text-gray-400">
//             Your assigned training sessions will appear here
//           </Text>
          
//           <TouchableOpacity
//             className="mt-4 bg-blue-600 py-2 rounded-lg"
//             onPress={fetchAssignedTasks}
//           >
//             <Text className="text-white text-center">Refresh</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
//         <Text className="text-2xl font-bold text-gray-900">My Training Sessions</Text>
//         <Text className="text-gray-600 mt-1">
//           {tasks.filter(t => !t.serviceRendered).length} pending session{tasks.filter(t => !t.serviceRendered).length !== 1 ? 's' : ''}
//         </Text>
//       </View>

//       {/* Tasks List */}
//       <FlatList
//         data={tasks}
//         renderItem={renderTaskItem}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={{ paddingVertical: 12 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#3b82f6']}
//             tintColor="#3b82f6"
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default AssignedTasks;

// import {
//   View,
//   Text,
//   FlatList,
//   RefreshControl,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   Animated,
// } from 'react-native';
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';

// // Create a separate component for the task item
// const TaskItem = ({ item, index, markAsRendered }) => {
//   const itemFadeAnim = useRef(new Animated.Value(0)).current;
//   const itemSlideAnim = useRef(new Animated.Value(30)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(itemFadeAnim, {
//         toValue: 1,
//         duration: 600,
//         delay: index * 150,
//         useNativeDriver: true,
//       }),
//       Animated.timing(itemSlideAnim, {
//         toValue: 0,
//         duration: 600,
//         delay: index * 150,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <Animated.View
//       style={{
//         opacity: itemFadeAnim,
//         transform: [{ translateY: itemSlideAnim }],
//       }}
//       className="mx-4 my-3"
//     >
//       {/* Futuristic card with gradient border */}
//       <View className="relative">
//         {/* Gradient border effect */}
//         <View className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl opacity-75 blur-sm" />
        
//         {/* Main card */}
//         <View className="relative bg-gray-900 m-0.5 p-6 rounded-2xl border border-gray-700 shadow-2xl">
//           {/* Holographic overlay */}
//           <View className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-2xl" />
          
//           {/* Header section */}
//           <View className="relative flex-row justify-between items-start mb-4">
//             <View className="flex-1 mr-4">
//               <Text className="text-xl font-bold text-white mb-1 tracking-wide">
//                 {item.service?.title || 'Training Session'}
//               </Text>
//               <View className="h-px bg-gradient-to-r from-cyan-400 to-transparent w-3/4" />
//             </View>
            
//             <View className={`px-4 py-2 rounded-full border ${
//               item.serviceRendered 
//                 ? 'bg-emerald-500/20 border-emerald-400 shadow-emerald-400/50' 
//                 : 'bg-amber-500/20 border-amber-400 shadow-amber-400/50'
//             } shadow-lg`}>
//               <Text className={`text-sm font-bold tracking-widest ${
//                 item.serviceRendered ? 'text-emerald-300' : 'text-amber-300'
//               }`}>
//                 {item.serviceRendered ? '✓ COMPLETED' : '⏳ PENDING'}
//               </Text>
//             </View>
//           </View>

//           {/* Info grid */}
//           <View className="space-y-4 mt-4">
//             {/* Customer info */}
//             <View className="flex-row items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
//               <View className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mr-3 flex items-center justify-center">
//                 <Text className="text-white text-xs font-bold">👤</Text>
//               </View>
//               <View className="flex-1">
//                 <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Customer</Text>
//                 <Text className="text-white font-semibold">
//                   {item.customerName || 'Customer Nameee'}
//                 </Text>
//               </View>
//             </View>

//             {/* Date info */}
//             <View className="flex-row items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
//               <View className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mr-3 flex items-center justify-center">
//                 <Text className="text-white text-xs font-bold">📅</Text>
//               </View>
//               <View className="flex-1">
//                 <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Scheduled</Text>
//                 <Text className="text-white font-semibold">
//                   {formatDate(item.createdAt)}
//                 </Text>
//               </View>
//             </View>

//             {/* Duration info */}
//             <View className="flex-row items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
//               <View className="w-8 h-8 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full mr-3 flex items-center justify-center">
//                 <Text className="text-white text-xs font-bold">⏱</Text>
//               </View>
//               <View className="flex-1">
//                 <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Duration</Text>
//                 <Text className="text-white font-semibold">
//                   {item.hours} hour{item.hours !== 1 ? 's' : ''}
//                 </Text>
//               </View>
//             </View>

//             {/* Description */}
//             <View className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
//               <Text className="text-gray-400 text-xs uppercase tracking-wider mb-2">Mission Brief</Text>
//               <Text className="text-gray-300 leading-relaxed">
//                 {item.service?.description || 'No description provided'}
//               </Text>
//             </View>
//           </View>

//           {/* Action button */}
//           {!item.serviceRendered && (
//             <TouchableOpacity
//               className="mt-6 relative overflow-hidden rounded-xl"
//               onPress={() => markAsRendered(item._id)}
//             >
//               {/* Gradient background */}
//               <View className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 p-4 flex-row justify-center items-center">
//                 {/* Holographic shimmer effect */}
//                 <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                
//                 <Text className="text-white font-bold text-lg tracking-wide uppercase">
//                   ⚡ Complete Mission
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// const AssignedTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const BASE_URL = 'https://kwetu-backend.onrender.com/api/bookings';
  
//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;

//   // Fetch assigned tasks
//   const fetchAssignedTasks = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/coach/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       Alert.alert('Error', 'Failed to load assigned tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle refresh
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchAssignedTasks();
//     setRefreshing(false);
//   }, []);

//   // Mark task as rendered
//   const markAsRendered = async (taskId) => {
//     try {
//       const response = await axios.patch(
//         `${BASE_URL}/${taskId}/mark-rendered`
//       );
      
//       // Update the task in state
//       setTasks(tasks.map(task => 
//         task._id === taskId ? { ...task, serviceRendered: true } : task
//       ));
      
//       Alert.alert('Success', 'Service marked as rendered successfully');
//     } catch (error) {
//       console.error('Error marking as rendered:', error);
//       Alert.alert('Error', 'Failed to mark service as rendered');
//     }
//   };

//   // Load data on component mount
//   useEffect(() => {
//     fetchAssignedTasks();
    
//     // Start entrance animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   // Loading state
//   if (loading) {
//     return (
//       <View className="flex-1 bg-gray-900 justify-center items-center">
//         {/* Animated background */}
//         <View className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20" />
        
//         {/* Loading content */}
//         <View className="relative items-center">
//           {/* Futuristic loading spinner */}
//           <View className="relative mb-8">
//             <View className="w-20 h-20 border-4 border-gray-700 rounded-full" />
//             <View className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 border-r-purple-500 rounded-full animate-spin" />
//             <ActivityIndicator size="large" color="#00bcd4" className="absolute inset-4" />
//           </View>
          
//           <Text className="text-cyan-300 text-xl font-bold tracking-wider mb-2">
//             INITIALIZING NEURAL LINK
//           </Text>
//           <Text className="text-gray-400 text-center px-8">
//             Synchronizing with quantum database...
//           </Text>
          
//           {/* Loading bars animation effect */}
//           <View className="flex-row mt-6 space-x-1">
//             {[...Array(5)].map((_, i) => (
//               <View
//                 key={i}
//                 className={`w-2 h-8 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full opacity-30 animate-pulse`}
//                 style={{ animationDelay: `${i * 200}ms` }}
//               />
//             ))}
//           </View>
//         </View>
//       </View>
//     );
//   }

//   // Empty state
//   if (tasks.length === 0) {
//     return (
//       <View className="flex-1 bg-gray-900 justify-center items-center px-4">
//         {/* Animated background */}
//         <View className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20" />
        
//         <Animated.View
//           style={{
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           }}
//           className="relative w-full max-w-sm"
//         >
//           {/* Holographic container */}
//           <View className="relative">
//             {/* Gradient border */}
//             <View className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl opacity-50 blur-sm" />
            
//             {/* Main container */}
//             <View className="relative bg-gray-900 m-0.5 p-8 rounded-2xl border border-gray-700">
//               {/* Holographic overlay */}
//               <View className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-2xl" />
              
//               <View className="relative items-center">
//                 {/* Empty state icon */}
//                 <View className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full mb-6 flex items-center justify-center border border-gray-600">
//                   <Text className="text-4xl">🎯</Text>
//                 </View>
                
//                 <Text className="text-center text-cyan-300 text-2xl font-bold mb-3 tracking-wide">
//                   MISSION QUEUE EMPTY
//                 </Text>
//                 <Text className="text-center text-gray-400 mb-6 leading-relaxed">
//                   Your neural interface is ready for new training protocols
//                 </Text>
                
//                 <TouchableOpacity
//                   className="w-full relative overflow-hidden rounded-xl"
//                   onPress={fetchAssignedTasks}
//                 >
//                   <View className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4">
//                     <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
//                     <Text className="text-white text-center font-bold tracking-wider uppercase">
//                       🔄 Refresh Quantum Link
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Animated.View>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-900">
//       {/* Animated background */}
//       <View className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/10 to-cyan-900/10" />
      
//       {/* Futuristic Header */}
//       <Animated.View
//         style={{
//           opacity: fadeAnim,
//           transform: [{ translateY: slideAnim }],
//         }}
//         className="relative"
//       >
//         {/* Header gradient background */}
//         <View className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-8 border-b border-gray-700 shadow-2xl">
//           {/* Holographic overlay */}
//           <View className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
          
//           <View className="relative">
//             {/* Main title */}
//             <Text className="text-3xl font-bold text-white mb-2 tracking-wider">
//             TRAINING SESSIONS
//             </Text>
            
//             {/* Subtitle with stats */}
//             <View className="flex-row items-center">
//               <View className="flex-row items-center">
//                 <View className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
//                 <Text className="text-cyan-300 font-semibold tracking-wide">
//                   {tasks.filter(t => !t.serviceRendered).length} ACTIVE MISSION{tasks.filter(t => !t.serviceRendered).length !== 1 ? 'S' : ''}
//                 </Text>
//               </View>
              
//               {tasks.filter(t => t.serviceRendered).length > 0 && (
//                 <View className="flex-row items-center ml-6">
//                   <View className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
//                   <Text className="text-emerald-300 font-semibold tracking-wide">
//                     {tasks.filter(t => t.serviceRendered).length} COMPLETED
//                   </Text>
//                 </View>
//               )}
//             </View>
            
//             {/* Decorative line */}
//             <View className="h-px bg-gradient-to-r from-cyan-400 via-purple-500 to-transparent mt-4" />
//           </View>
//         </View>
//       </Animated.View>

//       {/* Tasks List */}
//       <FlatList
//         data={tasks}
//         renderItem={({ item, index }) => (
//           <TaskItem item={item} index={index} markAsRendered={markAsRendered} />
//         )}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={{ paddingVertical: 16 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#00bcd4', '#9c27b0', '#e91e63']}
//             tintColor="#00bcd4"
//             progressBackgroundColor="#1f2937"
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default AssignedTasks;

import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

// Create a separate component for the task item
const TaskItem = ({ item, index, markAsRendered }) => {
  const itemFadeAnim = useRef(new Animated.Value(0)).current;
  const itemSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(itemFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(itemSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Animated.View
      style={{
        opacity: itemFadeAnim,
        transform: [{ translateY: itemSlideAnim }],
      }}
      className="mx-4 my-3"
    >
      {/* Futuristic card with gradient border */}
      <View className="relative">
        {/* Gradient border effect */}
        <View className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl opacity-75 blur-sm" />
        
        {/* Main card */}
        <View className="relative bg-gray-900 m-0.5 p-6 rounded-2xl border border-gray-700 shadow-2xl">
          {/* Holographic overlay */}
          <View className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-2xl" />
          
          {/* Header section */}
          <View className="relative flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-xl font-bold text-white mb-1 tracking-wide">
                {item.service?.title || 'Training Session'}
              </Text>
              <View className="h-px bg-gradient-to-r from-cyan-400 to-transparent w-3/4" />
            </View>
            
            <View className={`px-4 py-2 rounded-full border ${
              item.serviceRendered 
                ? 'bg-emerald-500/20 border-emerald-400 shadow-emerald-400/50' 
                : 'bg-amber-500/20 border-amber-400 shadow-amber-400/50'
            } shadow-lg`}>
              <Text className={`text-sm font-bold tracking-widest ${
                item.serviceRendered ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {item.serviceRendered ? '✓ COMPLETED' : '⏳ PENDING'}
              </Text>
            </View>
          </View>

          {/* Info grid */}
          <View className="space-y-4 mt-4">
            {/* Customer info */}
            <View className="flex-row items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
              <View className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mr-3 flex items-center justify-center">
                <Text className="text-white text-xs font-bold">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Customer</Text>
                <Text className="text-white font-semibold">
                  {item.customerName || 'Customer Nameee'}
                </Text>
              </View>
            </View>

            {/* Date info */}
            <View className="flex-row items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
              <View className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mr-3 flex items-center justify-center">
                <Text className="text-white text-xs font-bold">📅</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Scheduled</Text>
                <Text className="text-white font-semibold">
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </View>

            {/* Duration info */}
            <View className="flex-row items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
              <View className="w-8 h-8 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full mr-3 flex items-center justify-center">
                <Text className="text-white text-xs font-bold">⏱</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Duration</Text>
                <Text className="text-white font-semibold">
                  {item.hours} hour{item.hours !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
              <Text className="text-gray-400 text-xs uppercase tracking-wider mb-2">Mission Brief</Text>
              <Text className="text-gray-300 leading-relaxed">
                {item.service?.description || 'No description provided'}
              </Text>
            </View>
          </View>

          {/* Action button */}
          {!item.serviceRendered && (
            <TouchableOpacity
              className="mt-6 relative overflow-hidden rounded-xl"
              onPress={() => markAsRendered(item._id)}
            >
              {/* Gradient background */}
              <View className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 p-4 flex-row justify-center items-center">
                {/* Holographic shimmer effect */}
                <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                
                <Text className="text-white font-bold text-lg tracking-wide uppercase">
                  ⚡ Complete Mission
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const BASE_URL = 'https://kwetu-backend.onrender.com/api/bookings';
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Fetch assigned tasks
  const fetchAssignedTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/coach/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to load assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAssignedTasks();
    setRefreshing(false);
  }, []);

  // Mark task as rendered
  const markAsRendered = async (taskId) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/${taskId}/mark-rendered`
      );
      
      // Update the task in state
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, serviceRendered: true } : task
      ));
      
      Alert.alert('Success', 'Service marked as rendered successfully');
    } catch (error) {
      console.error('Error marking as rendered:', error);
      Alert.alert('Error', 'Failed to mark service as rendered');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAssignedTasks();
    
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar 
          backgroundColor="#111827"
          barStyle="light-content"
        />
        {/* Animated background */}
        <View className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20" />
        
        {/* Loading content */}
        <View className="relative items-center">
          {/* Futuristic loading spinner */}
          <View className="relative mb-8">
            <View className="w-20 h-20 border-4 border-gray-700 rounded-full" />
            <View className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 border-r-purple-500 rounded-full animate-spin" />
            <ActivityIndicator size="large" color="#00bcd4" className="absolute inset-4" />
          </View>
          
          <Text className="text-cyan-300 text-xl font-bold tracking-wider mb-2">
            INITIALIZING NEURAL LINK
          </Text>
          <Text className="text-gray-400 text-center px-8">
            Synchronizing with quantum database...
          </Text>
          
          {/* Loading bars animation effect */}
          <View className="flex-row mt-6 space-x-1">
            {[...Array(5)].map((_, i) => (
              <View
                key={i}
                className={`w-2 h-8 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full opacity-30 animate-pulse`}
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center px-4">
        <StatusBar 
          backgroundColor="#111827"
          barStyle="light-content"
        />
        {/* Animated background */}
        <View className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20" />
        
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="relative w-full max-w-sm"
        >
          {/* Holographic container */}
          <View className="relative">
            {/* Gradient border */}
            <View className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl opacity-50 blur-sm" />
            
            {/* Main container */}
            <View className="relative bg-gray-900 m-0.5 p-8 rounded-2xl border border-gray-700">
              {/* Holographic overlay */}
              <View className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-2xl" />
              
              <View className="relative items-center">
                {/* Empty state icon */}
                <View className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full mb-6 flex items-center justify-center border border-gray-600">
                  <Text className="text-4xl">🎯</Text>
                </View>
                
                <Text className="text-center text-cyan-300 text-2xl font-bold mb-3 tracking-wide">
                  MISSION QUEUE EMPTY
                </Text>
                <Text className="text-center text-gray-400 mb-6 leading-relaxed">
                  Your neural interface is ready for new training protocols
                </Text>
                
                <TouchableOpacity
                  className="w-full relative overflow-hidden rounded-xl"
                  onPress={fetchAssignedTasks}
                >
                  <View className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4">
                    <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                    <Text className="text-white text-center font-bold tracking-wider uppercase">
                      🔄 Refresh Quantum Link
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar 
        backgroundColor="#111827"
        barStyle="light-content"
      />
      {/* Animated background */}
      <View className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/10 to-cyan-900/10" />
      
      {/* Futuristic Header */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="relative"
      >
        {/* Header gradient background */}
        <View className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-8 border-b border-gray-700 shadow-2xl">
          {/* Holographic overlay */}
          <View className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
          
          <View className="relative">
            {/* Main title */}
            <Text className="text-3xl font-bold text-white mb-2 tracking-wider">
              TRAINING SESSIONS
            </Text>
            
            {/* Subtitle with stats */}
            <View className="flex-row items-center">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
                <Text className="text-cyan-300 font-semibold tracking-wide">
                  {tasks.filter(t => !t.serviceRendered).length} ACTIVE MISSION{tasks.filter(t => !t.serviceRendered).length !== 1 ? 'S' : ''}
                </Text>
              </View>
              
              {tasks.filter(t => t.serviceRendered).length > 0 && (
                <View className="flex-row items-center ml-6">
                  <View className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
                  <Text className="text-emerald-300 font-semibold tracking-wide">
                    {tasks.filter(t => t.serviceRendered).length} COMPLETED
                  </Text>
                </View>
              )}
            </View>
            
            {/* Decorative line */}
            <View className="h-px bg-gradient-to-r from-cyan-400 via-purple-500 to-transparent mt-4" />
          </View>
        </View>
      </Animated.View>

      {/* Tasks List */}
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <TaskItem item={item} index={index} markAsRendered={markAsRendered} />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00bcd4', '#9c27b0', '#e91e63']}
            tintColor="#00bcd4"
            progressBackgroundColor="#1f2937"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AssignedTasks;