import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const Test = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Perform any side effects or asynchronous operations here
    fetchData();
  }, []); // Empty dependency array to run the effect only once on component mount

  const fetchData = async () => {
    // Perform API call or data fetching here
    // Example:
    try {
      const response = await fetch(
        "http://localhost:3050/api/v1/machine-learning/feature-extraction"
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <View>{data ? <Text>Data: found</Text> : <Text>Loading...</Text>}</View>
  );
};

export default Test;
