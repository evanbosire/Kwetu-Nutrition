// import {
//   View,
//   Text,
//   FlatList,
//   RefreshControl,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   Modal,
// } from 'react-native'
// import React, { useState, useEffect, useCallback } from 'react'

// const AllocatedBookings = () => {
//   const [tasks, setTasks] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [selectedTask, setSelectedTask] = useState(null)
//   const [modalVisible, setModalVisible] = useState(false)
  
//   // Mock data for available coaches (in a real app, this would come from an API)
//   const availableCoaches = [
//     { id: 1, name: 'James Kariuki' },
//     { id: 2, name: 'Susan Mwende' },
//     { id: 3, name: 'David Omondi' },
//   ]

//   const API_URL = 'https://kwetu-backend.onrender.com/api/bookings/supervisor/tasks'

//   // Fetch assigned tasks
//   const fetchAssignedTasks = async () => {
//     try {
//       const response = await fetch(API_URL)
//       if (!response.ok) {
//         throw new Error('Failed to fetch assigned tasks')
//       }
//       const data = await response.json()
//       setTasks(data)
     
     
//     } catch (error) {
//       console.error('Error fetching tasks:', error)
//       Alert.alert('Error', 'Failed to load assigned tasks')
//     } finally {
//       setLoading(false)
//     }
//   }


//   // Handle refresh
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true)
//     await fetchAssignedTasks()
//     setRefreshing(false)
//   }, [])

//   // Assign coach to task
//   const assignCoach = async (taskId) => {
//     try {
//       const response = await fetch(
//         `https://kwetu-backend.onrender.com/api/bookings/${taskId}/assign-coach`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )

//       if (!response.ok) {
//         throw new Error('Failed to assign coach')
//       }

//       const updatedTask = await response.json()
      
//       // Update the tasks list
//       setTasks(tasks.map(task => 
//         task._id === updatedTask._id ? updatedTask : task
//       ))

//       setModalVisible(false)
//       Alert.alert('Success', 'Coach assigned successfully')
//     } catch (error) {
//       console.error('Error assigning coach:', error)
//       Alert.alert('Error', 'Failed to assign coach')
//     }
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     })
//   }

//   // Load data on component mount
//   useEffect(() => {
//     fetchAssignedTasks()
//   }, [])

//   // Loading state
//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text className="text-gray-600 mt-4">Loading your tasks...</Text>
//       </View>
//     )
//   }

//   // Render individual task item
//   const renderTaskItem = ({ item }) => {
   
    
//     return (
//       <View className="bg-white mx-4 mb-4 p-4 rounded-xl shadow-md border border-gray-100">
//         <View className="flex-row justify-between items-start">
//           <View className="flex-1">
//             <Text className="text-lg font-bold text-gray-900">{item.service?.title || 'Service Task'}</Text>
//             <Text className="text-sm text-blue-600 mt-1">
//               Task ID: {item._id.slice(-8).toUpperCase()}
//             </Text>
//           </View>
          
//           <View className={`px-3 py-1 rounded-full ${item.assignedCoach ? 'bg-green-100' : 'bg-amber-100'}`}>
//             <Text className={`text-xs font-medium ${item.assignedCoach ? 'text-green-800' : 'text-amber-800'}`}>
//               {item.assignedCoach ? 'Coach Assigned' : 'Needs Coach'}
//             </Text>
//           </View>
//         </View>

//         <View className="mt-3 space-y-2">
//           <View className="flex-row">
//             <Text className="text-gray-500 w-28">Customer:</Text>
//             <Text className="text-gray-800 font-medium flex-1">
//               {item.customerName || 'Customer Name'}
//             </Text>
//           </View>
//            <View className="flex-row">
//             <Text className="text-gray-500 w-28">Email:</Text>
//             <Text className="text-gray-800 flex-1">
//               {item.customerEmail}
//             </Text>
//           </View>
//           <View className="flex-row">
//             <Text className="text-gray-500 w-28">Phone:</Text>
//             <Text className="text-gray-800 flex-1">
//               {item.customerPhone}
//             </Text> 
//           </View>
//           <View className="flex-row">
//             <Text className="text-gray-500 w-28">Training Hours:</Text>
//             <Text className="text-gray-800 flex-1">
//               {item.hours} Hrs
//             </Text> 
//           </View>
//           <View className="flex-row">
//             <Text className="text-gray-500 w-28">Description:</Text>
//             <Text className="text-gray-800 flex-1">{item.service.description || 'N/A'}</Text>
//           </View>

         
//         </View>

//         {!item.assignedCoach && (
//           <TouchableOpacity
//             className="bg-blue-600 py-3 rounded-lg mt-4 flex-row justify-center items-center"
//             onPress={() => {
//               setSelectedTask(item)
//               setModalVisible(true)
//             }}
//           >
//             <Text className="text-white font-medium">Assign Coach</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     )
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white px-6 py-5 border-b border-gray-200 shadow-sm">
//         <Text className="text-2xl font-bold text-gray-900">Task Allocation</Text>
//         <Text className="text-gray-600 mt-1">
//           {tasks.filter(task => !task.assignedCoach).length} task{tasks.filter(task => !task.assignedCoach).length !== 1 ? 's' : ''} need coaching
//         </Text>
//       </View>

//       {/* Tasks List */}
//       {tasks.length === 0 ? (
//         <View className="flex-1 justify-center items-center px-4">
//           <View className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-sm">
//             <Text className="text-center text-gray-500 text-lg mb-2">
//               No Tasks Assigned
//             </Text>
//             <Text className="text-center text-gray-400">
//               Tasks allocated to you will appear here
//             </Text>
//           </View>
//         </View>
//       ) : (
//         <FlatList
//           data={tasks}
//           renderItem={renderTaskItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#3b82f6']}
//               tintColor="#3b82f6"
//             />
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       )}

//       {/* Coach Assignment Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50">
//           <View className="bg-white rounded-xl p-6 w-11/12 max-w-md">
//             <Text className="text-xl font-bold text-gray-900 mb-2">Assign Coach</Text>
//             <Text className="text-gray-600 mb-4">
//               Select a coach for {selectedTask?.service?.title || 'this task'}
//             </Text>

//             <View className="space-y-3 mb-6">
//               {availableCoaches.map((coach) => (
//                 <TouchableOpacity
//                   key={coach.id}
//                   className="border border-gray-200 rounded-lg p-4"
//                   onPress={() => assignCoach(selectedTask?._id)}
//                 >
//                   <Text className="font-medium text-gray-900">{coach.name}</Text>
                  
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <TouchableOpacity
//               className="py-3 rounded-lg border border-gray-200"
//               onPress={() => setModalVisible(false)}
//             >
//               <Text className="text-center text-gray-700 font-medium">Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   )
// }

// export default AllocatedBookings

import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios' // Added axios import

const AllocatedBookings = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState(null)

  // Mock data for available coaches
  const availableCoaches = [
    { id: 1, name: 'James Kariuki' },
    { id: 2, name: 'Susan Mwende' },
    { id: 3, name: 'David Omondi' },
  ]

  const API_URL = 'https://kwetu-backend.onrender.com/api/bookings/supervisor/tasks'

  // Fetch assigned tasks using axios
  const fetchAssignedTasks = async () => {
    try {
      const response = await axios.get(API_URL)
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      Alert.alert('Error', 'Failed to load assigned tasks')
    } finally {
      setLoading(false)
    }
  }

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchAssignedTasks()
    setRefreshing(false)
  }, [])

  // Assign coach to task using axios
 const assignCoach = async (taskId) => {
  if (!selectedCoach) {
    Alert.alert('Error', 'Please select a coach first')
    return
  }

  try {
    const response = await axios.patch(
      `https://kwetu-backend.onrender.com/api/bookings/${taskId}/assign-coach`,
      {
        coachId: selectedCoach.id,
        coachName: selectedCoach.name
      }
    )

    // Merge the updated fields with the existing task data
    setTasks(tasks.map(task => {
      if (task._id === taskId) {
        return {
          ...task,          // Keep all existing task data
          ...response.data, // Override with updated fields
          service: {
            ...task.service,          // Keep the original service object
            ...(response.data.service || {}) // Merge any service updates
          }
        }
      }
      return task
    }))

    setModalVisible(false)
    setSelectedCoach(null)
    Alert.alert('Success', `Coach ${selectedCoach.name} assigned successfully`)
  } catch (error) {
    console.error('Error assigning coach:', error)
    Alert.alert('Error', 'Failed to assign coach')
  }
}

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Load data on component mount
  useEffect(() => {
    fetchAssignedTasks()
  }, [])

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading your tasks...</Text>
      </View>
    )
  }

  // Render individual task item
  const renderTaskItem = ({ item }) => {
    return (
      <View className="bg-white mx-4 mb-4 p-4 rounded-xl shadow-md border border-gray-100">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{item.serviceTitle || 'Service Task'}</Text>
            <Text className="text-sm text-blue-600 mt-1">
              Task ID: {item._id.slice(-8).toUpperCase()}
            </Text>
          </View>
          
          <View className={`px-3 py-1 rounded-full ${item.assignedCoach ? 'bg-green-100' : 'bg-amber-100'}`}>
            <Text className={`text-xs font-medium ${item.assignedCoach ? 'text-green-800' : 'text-amber-800'}`}>
              {item.assignedCoach ? `Assigned: ${item.coachName}` : 'Needs Coach'}
            </Text>
          </View>
        </View>

        <View className="mt-3 space-y-2">
          <View className="flex-row">
            <Text className="text-gray-500 w-28">Customer:</Text>
            <Text className="text-gray-800 font-medium flex-1">
              {item.customerName || 'Customer Name'}
            </Text>
          </View>

          <View className="flex-row">
            <Text className="text-gray-500 w-28">Email:</Text>
            <Text className="text-gray-800 flex-1">
              {item.customerEmail}
            </Text>
          </View>
          
          <View className="flex-row">
            <Text className="text-gray-500 w-28">Phone:</Text>
            <Text className="text-gray-800 flex-1">
              {item.customerPhone}
            </Text>
          </View>
          
          <View className="flex-row">
            <Text className="text-gray-500 w-28">Training Hours:</Text>
            <Text className="text-gray-800 flex-1">
              {item.hours} Hrs
            </Text>
          </View>
          
          <View className="flex-row">
            <Text className="text-gray-500 w-28">Description:</Text>
            <Text className="text-gray-800 flex-1">{item.service?.description || 'N/A'}</Text>
          </View>
          
          {item.assignedCoach && (
            <View className="flex-row">
              <Text className="text-gray-500 w-28">Assigned Coach:</Text>
              <Text className="text-gray-800 font-medium flex-1">
                {item.coachName}
              </Text>
            </View>
          )}
        </View>

        {!item.assignedCoach && (
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-lg mt-4 flex-row justify-center items-center"
            onPress={() => {
              setSelectedTask(item)
              setModalVisible(true)
            }}
          >
            <Text className="text-white font-medium">Assign Coach</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-5 border-b border-gray-200 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Task Allocation</Text>
        <Text className="text-gray-600 mt-1">
          {tasks.filter(task => !task.assignedCoach).length} task{tasks.filter(task => !task.assignedCoach).length !== 1 ? 's' : ''} need coaching
        </Text>
      </View>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-sm">
            <Text className="text-center text-gray-500 text-lg mb-2">
              No Tasks Assigned
            </Text>
            <Text className="text-center text-gray-400">
              Tasks allocated to you will appear here
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Coach Assignment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          setSelectedCoach(null)
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-6 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-gray-900 mb-2">Assign Coach</Text>
            <Text className="text-gray-600 mb-4">
              Select a coach for {selectedTask?.service?.title || 'this task'}
            </Text>

            <View className="space-y-3 mb-6">
              {availableCoaches.map((coach) => (
                <TouchableOpacity
                  key={coach.id}
                  className={`border rounded-lg p-4 ${
                    selectedCoach?.id === coach.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                  onPress={() => setSelectedCoach(coach)}
                >
                  <Text className="font-medium text-gray-900">{coach.name}</Text>
                  {selectedCoach?.id === coach.id && (
                    <Text className="text-blue-600 text-xs mt-1">Selected</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className={`py-3 rounded-lg mb-3 ${
                selectedCoach ? 'bg-blue-600' : 'bg-gray-400'
              }`}
              onPress={() => assignCoach(selectedTask?._id)}
              disabled={!selectedCoach}
            >
              <Text className="text-center text-white font-medium">
                Assign {selectedCoach?.name || 'Coach'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 rounded-lg border border-gray-200"
              onPress={() => {
                setModalVisible(false)
                setSelectedCoach(null)
              }}
            >
              <Text className="text-center text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default AllocatedBookings