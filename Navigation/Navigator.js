import * as React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import VidScreen from "./../Screens/Video";
import CamScreen from "./../Screens/Camera";
function VideoScreen(props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Video Screen</Text>
      <Button
        title="Go to Camera"
        onPress={() => props.navigation.navigate("Camera")}
      />
      <VidScreen {...props} />
    </View>
  );
}

// function CameraScreen(props) {
//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Text>Camera</Text>
//       <Button
//         title="Go to Video"
//         onPress={() => props.navigation.navigate("Video")}
//       />
//       <CamScreen {...props} style={{}} />
//     </View>
//   );
// }
const Stack = createStackNavigator();
export default function StackNavigation() {
  return(
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Video" component={VideoScreen} />
      <Stack.Screen name="Camera" component={CamScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}
