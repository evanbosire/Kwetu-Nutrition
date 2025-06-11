import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
                Supervisor Dashboard 
              </Text>
            </View>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
      >

        <Drawer.Screen
          name="allocatedBookings" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: ' Tasks List',
            title: 'Allocated Bookings',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="list-circle-outline" size={size} color={color} />
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
            drawerLabel: 'Confirm Rendered',
            title: 'Rendered Tasks',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="bookmark-outline" size={size} color={color} />
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
