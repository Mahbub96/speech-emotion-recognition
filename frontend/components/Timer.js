import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

const Timer = ({ startTimer }) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    let timer = null;

    if (startTimer) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      setSeconds(0);
      setMinutes(0);
      setHours(0);
    }

    return () => {
      clearInterval(timer);
    };
  }, [startTimer]);

  useEffect(() => {
    if (seconds === 60) {
      setSeconds(0);
      setMinutes((prevMinutes) => prevMinutes + 1);
    }
  }, [seconds]);

  useEffect(() => {
    if (minutes === 60) {
      setMinutes(0);
      setHours((prevHours) => prevHours + 1);
    }
  }, [minutes]);

  return (
    <Text style={styles.times}>
      Elapsed Time: {hours.toString().padStart(2, "0")}:
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </Text>
  );
};

export default Timer;
const styles = StyleSheet.create({
  times: {
    fontSize: 20,
    top: -40,
    alignItems: "center",
    justifyContent: "center",
  },
});
