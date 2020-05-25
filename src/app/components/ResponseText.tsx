import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "react-native";

const ResponseText = ({ label, value }) => {
  return (
    <View style={styles.labelContainer}>
      <Text style={{ paddingRight: 10, fontWeight: "bold" }}>{label}:</Text>
      <Text style={{ flexShrink: 1 }}>{value}</Text>
    </View>
  );
};

ResponseText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

ResponseText.defaultProps = {
  value: "",
};
const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    textAlign: "left",
    fontSize: 15,
    padding: 10,
  },
});

export default ResponseText;
