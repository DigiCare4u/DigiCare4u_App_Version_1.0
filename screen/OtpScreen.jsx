import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import Otp from '../components/Assets/otp.png';
import Goback from '../components/GoBack';

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleVerifyOtp = () => {
    if (otp.join('').length === 4) {
      Alert.alert('Success', `OTP Verified: ${otp.join('')}`);
    } else {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
    }
  };

  const handleResendOtp = () => {
    setIsResendDisabled(true);
    Alert.alert(
      'OTP Resent',
      'A new OTP has been sent to your registered number.',
    );
    setTimeout(() => setIsResendDisabled(false), 30000);
  };

  return (
    <SafeAreaView style={styles.MainContainer}>
      <View>
        <Goback />
      </View>
      <View style={styles.container}>
        <Image source={Otp} style={styles.image} />
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.description}>
          Enter the 4-digit OTP sent to your registered mobile number.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.resendButton,
            isResendDisabled && styles.disabledButton,
          ]}
          onPress={handleResendOtp}
          disabled={isResendDisabled}>
          <Text style={styles.resendButtonText}>
            {isResendDisabled ? 'Resend OTP in 30s' : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    padding: 15,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 2,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 10,
  },
  resendButtonText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    color: '#ccc',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    alignSelf: 'center',
    // backgroundColor:"red"
  },
});
