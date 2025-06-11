import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";

export default function ServiceManagerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#ffffff", // Change this to your desired background color
            width: 240,
          },
        }}
        drawerContent={(props) => (
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.drawerContent}
          >
            <View style={{ paddingBottom: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Gym Coach
              </Text>
            </View>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen
          name="assignedTasks"
          options={{
            drawerLabel: " Tasks List",
            title: "Assigned Bookings",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="list-circle-outline" size={size} color={color} />
            ),
            headerStyle: {
              backgroundColor: "#111827", // This sets the background color of the title/header
            },
            headerTintColor: "#2b7fff", // Optional: sets the text color of the title
          }}
        />

        <Drawer.Screen
          name="requestEquipment"
          options={{
            drawerLabel: "Tools",
            title: "Request From Inventory",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="toolbox-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="messages"
          options={{
            drawerLabel: "Messages",
            title: "Chat",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="chatbox-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="logOut"
          options={{
            drawerLabel: "Log Out",
            title: "Log Out",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "#ffffff", // Same color as drawerStyle
  },
});
