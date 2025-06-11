import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  Modal,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useBookings } from '../../context/BookingsContext';

const { width } = Dimensions.get("window");

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("gym");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded image URLs for specific services
  const serviceImages = {
    "Personal Training": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg8LpTXEqEoabG9JHDG4nH7rEUlgLf0pRPQg&s",
    "Strength & Conditioning": "https://smartgyms.co.ke/wp-content/uploads/2020/01/Shelton-500x500.jpg",
    "Weight Loss Program": "https://www.businessdailyafrica.com/resource/image/4514086/portrait_ratio1x1/1600/1600/23d0864b64c8cd70b7bfe0bf7a3a2e4f/Zh/disease-control.jpg",
    "Bodybuilding Coaching": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS9db2DVXW-0z1xBNNjPRBmEpRklWyJoa4MbbxkHelDO44XH-ut",
    "Beginner Fitness Coaching": "https://www.businessdailyafrica.com/resource/image/4320972/landscape_ratio3x2/1200/800/bd198b8a497203d171c5bcd86888e66d/Sp/hijabigym4.jpg",
    "HIIT (High-Intensity Interval Training)": "https://cdn.shopify.com/s/files/1/0591/3156/0089/files/Circuit_Training_480x480.jpg?v=1676617109",
    "Group Training Session": "https://pictures-kenya.jijistatic.com/28293898_NjIwLTQ2NS1iYjBjNGYxOTgy.webp",
    "Flexibility & Mobility Coaching": "https://calisthensfitness.com/wp-content/uploads/2022/07/workout-oloo-1.webp",
    "Athlete Performance Coaching": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7l0a0bHMd3jD5-8RhmaKW7zGNs4hv2vK5qQ&s",
    "Post-Injury Rehab Training": "https://training-conditioning.com/wp-content/uploads/2019/09/Total%20Gym%20Study.jpg"
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://kwetu-backend.onrender.com/api/services');
        // Map the API data to our format and add images from our hardcoded URLs
        const formattedServices = response.data.map(service => ({
          id: service._id,
          title: service.title,
          price: service.pricePerHour,
          image: serviceImages[service.title] || "https://via.placeholder.com/150",
          description: service.description,
          category: "gym", // Assuming all are gym services for now
          outcomes: "Improved fitness and health" // Default outcome
        }));
        setServices(formattedServices);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gymServices = filteredServices.filter(service => service.category === "gym");
  const nutritionServices = [
    {
      id: "n1",
      title: "Basic Nutrition Plan",
      price: 500,
      image: "https://via.placeholder.com/150",
      description: "Customized nutrition plans tailored to your goals.",
      category: "nutrition",
      outcomes: "Improved eating habits and better understanding of nutrition."
    },
    {
      id: "n2",
      title: "Weight Loss Nutrition",
      price: 700,
      image: "https://via.placeholder.com/150",
      description: "Meal plans focused on healthy weight loss.",
      category: "nutrition",
      outcomes: "Sustainable weight loss through proper nutrition."
    }
  ];

  const { addToBookings } = useBookings();

  const handleAddToBookings = (service) => {
    addToBookings(service);
    Alert.alert("Success", `${service.title} added to bookings!`);
  };



  const Rating = ({ rating = 4.5 }) => {
    const getStarColor = (starNumber) => {
      if (rating >= starNumber) {
        switch (starNumber) {
          case 1:
            return "#FF4444";
          case 2:
            return "#FFA500";
          case 3:
            return "#FFD700";
          case 4:
            return "#90EE90";
          case 5:
            return "#32CD32";
          default:
            return "#E5E7EB";
        }
      }
      return "#E5E7EB";
    };

    return (
      <View className="flex-row items-center">
        <Text className="text-gray-600 mr-2 text-sm">Ratings:</Text>
        <View className="flex-row gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Feather
              key={star}
              name="star"
              size={16}
              color={getStarColor(star)}
            />
          ))}
        </View>
        <Text className="text-gray-600 ml-2 text-sm">
          ({rating.toFixed(1)})
        </Text>
      </View>
    );
  };

  const ServiceCard = ({ item, index, category }) => {
    const scaleAnim = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        className="w-[45%] mb-4"
        style={{
          transform: [{ scale: scaleAnim }],
          marginLeft: index % 2 === 0 ? 16 : 8,
          marginRight: index % 2 === 0 ? 8 : 16,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          className="bg-white rounded-2xl overflow-hidden shadow-sm h-[280px]"
          onPress={() => {
            setSelectedService(item);
            setModalVisible(true);
          }}
        >
          <Image
            source={{ uri: item.image }}
            className="w-full h-32"
            resizeMode="cover"
          />
          <View className="p-3 flex-1 justify-between">
            <View>
              <Text
                className="text-lg font-semibold text-gray-800"
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text className="text-lg font-bold text-indigo-600 mt-1">
                Ksh {item.price?.toFixed(2) || "0.00"} / hour
              </Text>
              <Rating rating={4.5} />
            </View>
            <TouchableOpacity
              className="flex-row items-center justify-center bg-indigo-600 py-2 rounded-lg"
              onPress={() => handleAddToBookings(item)}
            >
              <Feather name="calendar" size={18} color="white" />
              <Text className="text-white text-sm font-semibold ml-2">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ServiceSection = ({ services }) => {
    return (
      <FlatList
        data={services}
        renderItem={({ item, index }) => (
          <ServiceCard item={item} index={index} category={item.category} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text className="text-center mt-6 text-gray-600 text-base">
            No services found
          </Text>
        }
      />
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Error: {error}</Text>
        <Text className="text-gray-600 mt-2">Could not load services</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView>
        <View className="mt-10 flex-row items-center bg-white mx-4 my-3 px-4 rounded-lg shadow-sm h-12">
          <Feather name="search" size={20} color="#9CA3AF" className="mr-2" />
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 mx-4 mb-2">
          Our Services
        </Text>
        
        <View className="flex-row justify-between mx-4 mb-4">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${activeTab === "gym" ? "bg-indigo-600" : "bg-gray-200"}`}
            onPress={() => setActiveTab("gym")}
          >
            <Text className={`font-semibold ${activeTab === "gym" ? "text-white" : "text-gray-800"}`}>
              Gym Coaching
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${activeTab === "nutrition" ? "bg-indigo-600" : "bg-gray-200"}`}
            onPress={() => setActiveTab("nutrition")}
          >
            <Text className={`font-semibold ${activeTab === "nutrition" ? "text-white" : "text-gray-800"}`}>
             
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === "gym" ? (
          <ServiceSection services={gymServices} />
        ) : (
          <ServiceSection services={nutritionServices} />
        )}

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView className="flex-1 bg-white">
            {selectedService && (
              <View className="flex-1 p-6">
                <TouchableOpacity
                  className="absolute top-4 right-4 z-10"
                  onPress={() => setModalVisible(false)}
                >
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
                <Image
                  source={{ uri: selectedService.image }}
                  className="w-full h-64 rounded-lg"
                  resizeMode="cover"
                />
                <Text className="text-2xl font-bold text-gray-800 mt-4">
                  {selectedService.title}
                </Text>
                <Text className="text-xl font-bold text-indigo-600 mt-3">
                  Ksh {selectedService.price?.toFixed(2) || "0.00"} / hour
                </Text>
                <Rating rating={4.5} />
                <Text className="text-base font-semibold text-gray-800 mt-3">
                  What's Included:
                </Text>
                <Text className="text-base text-gray-600 mt-1 leading-6">
                  {selectedService.description}
                </Text>
                <Text className="text-base font-semibold text-gray-800 mt-3">
                  Expected Outcomes:
                </Text>
                <Text className="text-base text-gray-600 mt-1 leading-6">
                  {selectedService.outcomes}
                </Text>
                <View className="flex-row justify-between mt-auto">
                  <TouchableOpacity
                    className="bg-gray-200 py-4 rounded-lg flex-1 mr-2"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-gray-800 text-center font-semibold text-lg">
                      Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-indigo-600 py-4 rounded-lg flex-1 ml-2"
                    onPress={() => handleAddToBookings(selectedService)}
                  >
                    <Text className="text-white text-center font-semibold text-lg">
                      Add To Bookings
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;