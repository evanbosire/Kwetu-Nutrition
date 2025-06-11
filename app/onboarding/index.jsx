import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
const logo = require("../../assets/images/logo.png")

const OnboardingScreen = () => {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#1f2937", "#111827", "#000000"]}
      style={{ flex: 1 }} 
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Status Bar */}
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Main Content */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          {/* Company Logo */}

        <Image
          source={logo}
          style={{
            width: 120,     
            height: 120,
            resizeMode: "contain",
            marginBottom: 24,
          }}
        />
          {/* Company Name */}
          <Text
            style={{
              fontSize: 32,
              marginBottom: 32,
              fontWeight: "800",
              color: "#facc15",
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            KWETU NUTRITION.
          </Text>

          {/* New Tagline Section */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "white",
                textAlign: "center",
              }}
            >
              Train. Nourish.
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "white",
                textAlign: "center",
              }}
            >
              Thrive.
            </Text>
          </View>
        </View>

        {/* Get Started Button */}
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 16,
              color: "#d1d5db",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: 28,
            }}
          >
            Strength Through Nutrition & Fitness
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#facc15",
              paddingVertical: 16,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
            onPress={() => router.push("auth/login")}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#000",
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default OnboardingScreen