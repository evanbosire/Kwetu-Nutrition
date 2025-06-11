import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

export default function ServiceManagerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            <View style={{ paddingBottom: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Service Manager 
              </Text>
            </View>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
      >

        <Drawer.Screen
          name="approvedByFinance" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Approved By Finance ',
            title: 'Bookings',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="approvedBookings" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Approved Bookings',
            title: 'Bookings',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="checkmark-done-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="completion" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Approve Task Completion',
            title: 'Confirmed Bookings ',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bookmark-check-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="messages" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Feedbacks',
            title: 'Chat',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="chatbox-outline" size={size} color={color} />
            ),
          }}
        />
         <Drawer.Screen
          name="logOut" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Log Out',
            title: 'Log Out',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
      
    </GestureHandlerRootView>
  );
}
