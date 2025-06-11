import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import useAuthStore from "../store/authStore";

const base_url = "https://kwetu-backend.onrender.com"

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const roles = [
    { label: "Inventory Manager", value: "Inventory manager" }, 
    { label: "Finance Manager", value: "Finance manager" }, 
    { label: "Service Manager", value: "Service manager" }, 
    { label: "Supervisor", value: "Supervisor" }, 
    { label: "Supplier", value: "Supplier" }, 
    { label: "Gym Coach", value: "Gym Coach" },
  ];

  const roleDashboardPaths = {
    "customer" : "/dashboards/customer",
    "Inventory manager": "dashboards/inventory",
    "Finance manager": "dashboards/finance",
    "Service manager": "dashboards/service",
    "Supervisor": "dashboards/supervisor",
    "Supplier": "dashboards/supplier",
    "Gym Coach": "dashboards/gymcoach",
    "Nutritionist": "dashboards/nutritionist",
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
const handleLogin = async () => {
  if (!validateEmail(email)) {
    Toast.show({
      type: "error",
      text1: "Invalid Email",
      text2: "Please enter a valid email address",
    });
    return;
  }

  if (password.length <= 3) {
    Toast.show({
      type: "error",
      text1: "Weak Password",
      text2: "Passwords cannot be less than 3 characters",
    });
    return;
  }

  try {
    let response;

    if (role === "customer") {
      response = await axios.post(
        `${base_url}/api/customers/login`,
        { email, password }
      );

      if (response.status === 200) {
        // useAuthStore.getState().setEmail(email); 
        // Save both email and token
    useAuthStore.getState().setCredentials(email, response.data.token);
        router.replace(roleDashboardPaths[role]);

        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Your account is pending approval. Please contact support.",
        });
      }
    } else {
      // Handle employee login
      response = await axios.post(
        `${base_url}/api/employees/login`,
        { email, password, role }
      );

      if (response.status === 200) {
        useAuthStore.getState().setEmail(email); // Store logged-in email

        router.replace({
          pathname: roleDashboardPaths[role],
          params: { email },
        });

        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Invalid login credentials. Please try again.",
        });
      }
    }
  } catch (error) {
  if (error.response) {
    console.log("Error response data:", error.response.data); // Debug

    Toast.show({
      type: "error",
      text1: "Login Failed",
      text2: error.response.data.message || "An error occurred during login",
    });
  } else {
    console.log("Error:", error.message); // Debug
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "An unexpected error occurred. Please try again.",
    });
  }
}}

  return (
    <View className="flex-1 bg-gray-900 justify-center px-6">
      <Text className="text-white text-3xl mb-6">Welcome Back</Text>
      <TextInput
        className="border border-gray-600 bg-gray-800 text-white rounded-lg p-3 mb-4"
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-600 bg-gray-800 text-white rounded-lg p-3 mb-4"
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        className="border border-gray-600 bg-gray-800 text-white rounded-lg p-3 mb-4"
        dropdownIconColor="white"
        style={{ color: "white" }}
      >
        <Picker.Item label="Log in as Customer" value="customer" />
        {roles.map((role) => (
          <Picker.Item key={role.value} label={role.label} value={role.value} />
        ))}
      </Picker>
      <TouchableOpacity
        className="bg-yellow-400 rounded-lg py-3 mb-4 items-center"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg">Log In</Text>
      </TouchableOpacity>
      <Text className="text-center text-gray-400 mb-4">Forgot Password?</Text>
      <View className="flex-row justify-center items-center">
        <Text className="text-gray-400">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text className="text-yellow-400">Sign up</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

export default Login;