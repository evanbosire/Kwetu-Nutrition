import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import useAuthStore from "../../store/authStore";

const Drawer = createDrawerNavigator();

const ProfileScreen = () => {
  const LoggedInEmail = useAuthStore((state) => state.email);

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <View className="items-center mb-8">
        <Image
          source={{ uri: "https://avatar.iran.liara.run/public/boy" }}
          className="w-32 h-32 rounded-full mb-4 border-4 border-white shadow-lg"
        />
        <Text className="text-gray-600">{LoggedInEmail}</Text>
      </View>

      <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Welcome to Kwetu Nutrition! 👋
        </Text>
        <Text className="text-gray-600">
          Thank you for joining our mission to eradicate undernourishment through soy by-products. 
          Together we can improve nutrition in vulnerable communities.
        </Text>
      </View>
      
      <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <Text className="text-xl font-semibold text-gray-800 mb-4">
          Account Details
        </Text>
        <View className="space-y-3">
          <View className="flex-row items-center">
            <Ionicons name="mail" size={20} color="#6b7280" />
            <Text className="text-gray-600 ml-2">{LoggedInEmail}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center bg-green-600 p-4 rounded-lg shadow-sm"
        onPress={() => console.log("Edit Profile")}
      >
        <Ionicons name="create" size={20} color="#fff" />
        <Text className="text-white font-semibold ml-2">Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// About Us Screen
const AboutUsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-green-50 p-6">
      <Text className="text-2xl font-bold text-green-900 mb-6">About Kwetu Nutrition</Text>
      
      <View className="mb-6 bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-xl font-semibold text-green-800 mb-4">
          Our Mission
        </Text>
        <Text className="text-gray-700 mb-4">
          Eradicating undernourishment through Soy by-products. Given the exceptional 
          nutritional power of soy, we make available its by-products such as soy milk, 
          soy nuggets, soy butter, and soybean oil to combat malnutrition.
        </Text>
        
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26" }}
          className="w-full h-48 rounded-lg mb-4"
        />
      </View>

      <View className="mb-6 bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-xl font-semibold text-green-800 mb-4">
          The Nutrition Challenge
        </Text>
        <Text className="text-gray-700 mb-4">
          One of the main causes of infant mortality in the KENYA is malnutrition (about 
          296,000 deaths of children under five in 2018). This stems from acute food 
          insecurity caused by different factors such as conflicts and insecurity, with 
          population displacement and loss of livelihoods.
        </Text>
        <Text className="text-gray-700 mb-4">
          The staple crops are essentially cassava, maize and beans. Dairy products, 
          meat, fish, eggs, fruits, and vegetables are consumed occasionally and are 
          expensive on the market.
        </Text>
      </View>

      <View className="bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-xl font-semibold text-green-800 mb-4">
          Why Soy?
        </Text>
        <Text className="text-gray-700 mb-4">
          Soy can validly replace several products - meat, eggs and milk - which are 
          lacking. One kilogram of soy is equivalent in protein to:
        </Text>
        <View className="pl-4 mb-4">
          <Text className="text-gray-700">• 40 kg of cassava</Text>
          <Text className="text-gray-700">• 13 litres of cow milk</Text>
          <Text className="text-gray-700">• 3 kg of beef</Text>
          <Text className="text-gray-700">• 60 chicken eggs</Text>
        </View>
        <Text className="text-gray-700">
          Soy is the cultivated plant richest in proteins, mineral elements and other 
          nutrients essential to human health (vitamin A, B, C, D, F and K). It's 
          accessible at lower cost and suitable for all segments of the population.
        </Text>
      </View>
    </ScrollView>
  );
};

// Services Screen
const ServicesScreen = () => {
  return (
    <ScrollView className="flex-1 bg-blue-50 p-6">
      <Text className="text-2xl font-bold text-blue-900 mb-6">Our Products & Services</Text>

      <View className="mb-6 bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-xl font-semibold text-blue-800 mb-4">
          Soy Milk
        </Text>
        <Text className="text-gray-700 mb-4">
          A nutritious dairy alternative packed with protein, vitamins and minerals. 
          Perfect for children and adults alike.
        </Text>
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1550583724-b2692b85b150" }}
          className="w-full h-48 rounded-lg"
        />
      </View>

      <View className="mb-6 bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-xl font-semibold text-blue-800 mb-4">
          Soy Nuggets
        </Text>
        <Text className="text-gray-700 mb-4">
          High-protein meat substitute that's versatile and easy to prepare. Contains 
          all essential amino acids.
        </Text>
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" }}
          className="w-full h-48 rounded-lg"
        />
      </View>

      

      <View className="bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-xl font-semibold text-blue-800 mb-4">
          Nutrition Education
        </Text>
        <Text className="text-gray-700">
          We provide training on proper nutrition and how to incorporate soy products 
          into daily meals for maximum health benefits.
        </Text>
      </View>
    </ScrollView>
  );
};

// Contact Us Screen
const ContactUsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-purple-50 p-6">
      <Text className="text-2xl font-bold text-purple-900 mb-6">
        Contact Kwetu Nutrition
      </Text>
      
      <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <Text className="text-xl font-semibold text-purple-800 mb-4">
          Get In Touch
        </Text>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="mail" size={24} color="#7e22ce" />
          <Text className="text-gray-700 ml-3">kwetu01@gmail.com</Text>
        </View>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="call" size={24} color="#7e22ce" />
          <Text className="text-gray-700 ml-3">+243 000 000000</Text>
        </View>
        
        <View className="flex-row items-start mb-3">
          <Ionicons name="location" size={24} color="#7e22ce" />
          <Text className="text-gray-700 ml-3 flex-1">
            South Kivu, Democratic Republic of Congo
          </Text>
        </View>
      </View>

      <View className="bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-xl font-semibold text-purple-800 mb-4">
          About SINA
        </Text>
        <Text className="text-gray-700 mb-4">
          Kwetu Nutrition is part of the Social Innovation Academy (SINA) network of 
          social enterprises creating positive change in East Africa.
        </Text>
        
        <View className="mt-4">
          <Text className="font-semibold text-purple-800">Uganda Office:</Text>
          <Text className="text-gray-700">
            Mayembe Upper, Plot 139 Mpigi Town
          </Text>
          <Text className="text-gray-700">
            P.O. Box 100411 Kampala, Uganda
          </Text>
          <Text className="text-gray-700">(+256) 758 852 735</Text>
        </View>
        
        <View className="mt-4">
          <Text className="font-semibold text-purple-800">Germany Office:</Text>
          <Text className="text-gray-700">
            Sieben-Höfe-Straße 144, 72072 Tübingen, Germany
          </Text>
          <Text className="text-gray-700">(+49) 176 44488293</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const CustomDrawerContent = ({ navigation }) => {
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const handleLogout = () => {
    // useAuthStore.getState().clearEmail();
    useAuthStore.getState().clearCredentials();
    router.replace("/auth/login");
  };

  return (
    <View className="flex-1 bg-gray-50 p-4 mt-16">
      <View className="items-center mb-6">
        <Image
          source={{ uri: "https://avatar.iran.liara.run/public/boy" }}
          className="w-20 h-20 rounded-full mb-2"
        />
        <Text className="text-lg font-semibold text-gray-800">{email}</Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center p-3 mb-2 rounded-lg bg-white"
        onPress={() => navigation.navigate("CustomerProfile")}
      >
        <Ionicons name="person" size={24} color="#16a34a" />
        <Text className="text-gray-800 ml-3">Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center p-3 mb-2 rounded-lg bg-white"
        onPress={() => navigation.navigate("AboutUs")}
      >
        <Ionicons name="information-circle" size={24} color="#16a34a" />
        <Text className="text-gray-800 ml-3">About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center p-3 mb-2 rounded-lg bg-white"
        onPress={() => navigation.navigate("Services")}
      >
        <Ionicons name="nutrition" size={24} color="#16a34a" />
        <Text className="text-gray-800 ml-3">Products & Services</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center p-3 mb-2 rounded-lg bg-white"
        onPress={() => navigation.navigate("ContactUs")}
      >
        <Ionicons name="mail" size={24} color="#16a34a" />
        <Text className="text-gray-800 ml-3">Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center p-3 mb-2 rounded-lg bg-white"
        onPress={() => router.push("/screens/customerFeedback")}
      >
        <Ionicons name="chatbox" size={24} color="#16a34a" />
        <Text className="text-gray-800 ml-3">Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center p-3 mb-2 rounded-lg bg-red-50 mt-4"
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={24} color="#ef4444" />
        <Text className="text-red-600 ml-3">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const CustomerProfileNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="CustomerProfile"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#f7f7f7",
          width: 250,
        },
        drawerActiveTintColor: "#16a34a",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name="CustomerProfile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="information-circle" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="nutrition" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="mail" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default CustomerProfileNavigator;