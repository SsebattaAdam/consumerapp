import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { COLORS, FONTS } from "../constants/app_constants";

export default function DynamicHeader({ username = "User", leftIcon = "account", rightIcon = "bell", onRightPress, onLeftPress = undefined }) {
  return (
    <View style={styles.headersection}>
      {/* LEFT */}
      <View style={styles.leftSection}>
        <Avatar.Icon 
          size={40} 
          icon={leftIcon} 
          style={styles.circleIcon} 
          color={COLORS.offWhite}
          onTouchEnd={onLeftPress || undefined}
        />

        <View style={styles.textContainer}>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>

      {/* RIGHT */}
      <View style={styles.rightSection}>
        <Avatar.Icon 
          size={40} 
          icon={rightIcon} 
          style={styles.circleIcon} 
         color={COLORS.offWhite}
          onTouchEnd={onRightPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headersection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  textContainer: {
    marginLeft: 10,
  },

  username: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.offWhite
  },

  circleIcon: {
    backgroundColor: COLORS.gray,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
});
