import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";


const base_url = "https://kwetu-backend.onrender.com"

const Signup = () => {
  const [customerName, setCustomerName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  // List of all 47 counties in Kenya
  const counties = [
    "Mombasa",
    "Kwale",
    "Kilifi",
    "Tana River",
    "Lamu",
    "Taita Taveta",
    "Garissa",
    "Wajir",
    "Mandera",
    "Marsabit",
    "Isiolo",
    "Meru",
    "Tharaka Nithi",
    "Embu",
    "Kitui",
    "Machakos",
    "Makueni",
    "Nyandarua",
    "Nyeri",
    "Kirinyaga",
    "Murang'a",
    "Kiambu",
    "Turkana",
    "West Pokot",
    "Samburu",
    "Trans Nzoia",
    "Uasin Gishu",
    "Elgeyo Marakwet",
    "Nandi",
    "Baringo",
    "Laikipia",
    "Nakuru",
    "Narok",
    "Kajiado",
    "Kericho",
    "Bomet",
    "Kakamega",
    "Vihiga",
    "Bungoma",
    "Busia",
    "Siaya",
    "Kisumu",
    "Homa Bay",
    "Migori",
    "Kisii",
    "Nyamira",
    "Nairobi",
  ];

  const handleSignUp = async () => {
    // Full Name Validation (only letters and spaces)
    if (!/^[A-Za-z\s]+$/.test(customerName.trim())) {
      Toast.show({
        type: "error",
        text1: "Invalid Full Name",
        text2: "Full name should contain only letters and spaces.",
      });
      return;
    }

    if (gender === "") {
      Toast.show({
        type: "error",
        text1: "Gender Required",
        text2: "Please select your gender.",
      });
      return;
    }

    // Phone Validation (exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
        text2: "Phone number must be exactly 10 digits.",
      });
      return;
    }

    if (location.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Location Required",
        text2: "Please select your location.",
      });
      return;
    }

    // Email Validation
    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
      });
      return;
    }

    if (password.length < 4) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 4 characters long.",
      });
      return;
    }

    try {
      const response = await axios(
        `${base_url}/api/customers/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName,
            gender,
            phone,
            email,
            password,
            location,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Sign Up Successful",
          text2: "You have successfully created an account!",
        });

        setCustomerName("");
        setGender("");
        setPhone("");
        setEmail("");
        setPassword("");
        setLocation("");

        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: data.message || "Please try again later.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please check your internet connection.",
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="flex-1 p-5 justify-center bg-gray-900">
          <Text className="text-white text-2xl mb-5 mt-5">Create Account</Text>

          <TextInput
            className="border border-gray-500 p-3 rounded-md mb-4 text-white bg-gray-800"
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={customerName}
            onChangeText={setCustomerName}
          />

          {/* Gender Picker */}
          <Picker
            selectedValue={gender}
            className="border border-gray-500 p-3 rounded-md mb-4 text-white bg-gray-800"
            onValueChange={(itemValue) => setGender(itemValue)}
            style={{ color: "#FFFFFF" }} // Ensure selected text is white
          >
            <Picker.Item
              label="Select Gender"
              value=""
              style={{ color: "#44403C" }} // Make "Select Gender" text white
            />
            <Picker.Item
              label="Male"
              value="male"
              style={{ color: "#44403C" }}
            />
            <Picker.Item
              label="Female"
              value="female"
              style={{ color: "#44403C" }}
            />
          </Picker>

          <TextInput
            className="border border-gray-500 p-3 rounded-md mb-4 mt-6 text-white bg-gray-800"
            placeholder="Phone"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10} // Ensure only 10 digits can be entered
          />

          {/* Location Picker */}
          <Picker
            selectedValue={location}
            className="border border-gray-500 p-3 rounded-md mb-4 text-white bg-gray-800"
            onValueChange={(itemValue) => setLocation(itemValue)}
            style={{ color: "#FFFFFF" }} // Ensure selected text is white
          >
            <Picker.Item
              label="Select Location"
              value=""
              style={{ color: "#FFFFFF" }} // Make "Select Location" text white
            />
            {counties.map((county, index) => (
              <Picker.Item
                key={index}
                label={county}
                value={county}
                style={{ color: "#44403C" }} // Ensure all options are white
              />
            ))}
          </Picker>

          <TextInput
            className="border border-gray-500 p-3 rounded-md mb-4 text-white bg-gray-800"
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            className="border border-gray-500 p-3 rounded-md mb-4 text-white bg-gray-800"
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className="bg-yellow-400 p-4 rounded-md items-center mb-5"
            onPress={handleSignUp}
          >
            <Text className="text-white text-lg">Sign Up</Text>
          </TouchableOpacity>

          <Text className="text-center text-gray-400 mb-5">or</Text>
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-400">Already have an account? </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#94A3B8", // Slate color
                padding: 4,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16 }}>Login</Text>
            </TouchableOpacity>
          </View>

          <Toast />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  picker: {
    borderWidth: 1,
    borderColor: "#6B7280", // Equivalent to "border-gray-500"
    borderRadius: 14,
    marginBottom: 16,
    padding: 12, // Adjust padding as needed
    backgroundColor: "#1F2937", // Equivalent to "bg-gray-800"
    color: "#FFFFFF", // Text color
  },
});
