import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

const LogOut = () => {
  const router = useRouter();
  // Get email from URL parameters using useLocalSearchParams
  const { email } = useLocalSearchParams();

  // Log to check if the email is being received
  useEffect(() => {
    if (!email) {
    }
  }, [email]);

  // Mock data for logged-in user
  const user = {
    avatar: "https://avatar.iran.liara.run/public/boy", // Replace with actual avatar URL
    email: email || "Click The Button Below To Log Out", // Display default message if no email is passed
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      {/* User Avatar */}
      <Image
        source={{ uri: user.avatar }}
        className="w-24 h-24 rounded-full mb-4"
      />
      {/* User Email */}
      <Text className="text-lg font-semibold text-gray-800 mb-6">
        {user.email}
      </Text>
      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => router.push("auth/login")}
        className="bg-red-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white text-lg font-medium">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogOut;
