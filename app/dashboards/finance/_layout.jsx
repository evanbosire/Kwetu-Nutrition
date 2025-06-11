import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            <View style={{ paddingBottom: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Finance Dashboard
              </Text>
            </View>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
      >

        <Drawer.Screen
          name="pendingBookings" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Pending Bookings',
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
          name="messages" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Supplies',
            title: 'Pay For Supplies',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="attach-money" size={size} color={color} />
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
