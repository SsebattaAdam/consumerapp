import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface CustomTextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  left?: React.ReactNode;
  prefix?: string;
  fontSize?: number;
  height?: number;
  paddingHorizontal?: number;
  dense?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  left,
  prefix,
  fontSize,
  height,
  paddingHorizontal,
  dense,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Show password visibility toggle only for secure text entry fields
  const showPasswordToggle = secureTextEntry;

  return (
    <TextInput
      mode="outlined"
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry ? !isPasswordVisible : false}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      left={left}
      right={
        showPasswordToggle ? (
          <TextInput.Icon
            icon={isPasswordVisible ? "eye-off" : "eye"}
            onPress={togglePasswordVisibility}
            forceTextInputFocus={false}
          />
        ) : undefined
      }
      dense={dense}
      style={[
        styles.input,
        {
          fontSize: fontSize,
          height: height,
          paddingHorizontal: paddingHorizontal,
        }
      ]}
      outlineStyle={{ borderRadius: 12 }}
      activeOutlineColor="blue"
      outlineColor="#ccc"           
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
});

export default CustomTextField;
