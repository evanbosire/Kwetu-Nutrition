import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
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
                Supplier Dashboard 
              </Text>
            </View>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
      >

        <Drawer.Screen
          name="requestedItems" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Requested Equipments',
            title: 'Equipments',
            drawerIcon: ({ color, size }) => (
              <Entypo name="tools" size={size} color={color} />
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
