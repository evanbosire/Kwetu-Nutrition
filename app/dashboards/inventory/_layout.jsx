import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
                Inventory Dashboard 
              </Text>
            </View>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
      >

        <Drawer.Screen
          name="requestEquipment" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Request Equipment',
            title: 'Order Equipments',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="suppliedEquipments" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Supplied Equipments',
            title: 'Equipments',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="truck-remove-outline" size={size} color={color} />
            ),
          }}
        />
        
        <Drawer.Screen
          name="store" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Equipments Store',
            title: 'Store',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="warehouse" size={size} color={color} />
            ),
          }}
        />
                <Drawer.Screen
          name="coachRequests" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Coach Requests',
            title: 'Tools Request',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="tooltip-outline" size={size} color={color} />
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
