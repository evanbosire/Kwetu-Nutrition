import { Tabs } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, Text } from 'react-native';
import { useBookings } from '../../context/BookingsContext';

const CustomerTabsLayout = () => {
  const { bookings } = useBookings();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: 65,
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarActiveTintColor: "#4F46E5",
      tabBarInactiveTintColor: "#94A3B8",
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "500",
      },
    }}>
      <Tabs.Screen 
        name="Home" 
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-circle-outline" size={size} color={color} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="Bookings" 
        options={{
          title: "Bookings",
          tabBarIcon: ({ size, color }) => (
            <View className="relative">
              <FontAwesome6 name="airbnb" size={size} color={color} />
              {bookings.length > 0 && (
                <View className="absolute -top-1 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs">
                    {bookings.length}
                  </Text>
                </View>
              )}
            </View>
          )
        }} 
      />

      <Tabs.Screen 
        name="Track" 
        options={{
          title: "Track",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="progress-check" size={size} color={color} />
          )
        }} 
      />
      
      <Tabs.Screen 
        name="Account" 
        options={{
          title: "Account",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
          )
        }} 
      />
    </Tabs>
  );
};

export default CustomerTabsLayout;