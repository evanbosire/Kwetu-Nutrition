import { Stack } from "expo-router"

const OnboardingScreenLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
    </Stack>
  )
}

export default OnboardingScreenLayout