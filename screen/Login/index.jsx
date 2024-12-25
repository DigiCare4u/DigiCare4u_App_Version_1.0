import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {devURL} from '../../constants/endpoints';
import {useAuth} from '../../context/auth';
import Logo from '../../components/Assets/logo.jpeg';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [authData, setAuthData] = useState({});
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const {IsAuthenticaticated} = useAuth();

  const isButtonDisabled = !email || !password;

  const getRole = async () => {
    try {
      const data = await IsAuthenticaticated(navigation);
      setAuthData(data);
    } catch (error) {
      console.error('Error retrieving authentication data:', error);
    }
  };

  const handleLogin = async () => {
    if (isButtonDisabled) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${devURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const role = data?.type;
        const jwtToken = data?.token;

        console.log('=====tokrn hasi=====');
        console.log(jwtToken);

        if (jwtToken) {
          await AsyncStorage.setItem('token', jwtToken);
        }

        Alert.alert('Login Success', `Welcome ${role}!`);

        if (role === 'user') {
          navigation.navigate('Home/user');
        } else if (role === 'member') {
          navigation.navigate('Home/member');
        }
      } else {
        console.log(response)
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid email or password.',
        );
      }
    } catch (error) {
      console.log(error.response.message);
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.image} />
      <Text style={styles.logo}>Login Here !</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputField}>
          <Icon name="mail" size={24} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            onChangeText={text => setEmail(text)}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {email.length > 0 && ( 
            <TouchableOpacity
              style={styles.clearIcon}
              onPress={() => setEmail('')}
            >
              <AntDesignIcon name="closecircle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputField}>
          <Icon name="lock" size={24} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!isPasswordVisible}
            onChangeText={text => setPassword(text)}
            value={password}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        disabled={isButtonDisabled || loading}
        style={[
          styles.loginButton,
          (isButtonDisabled || loading) && styles.buttonDisabled,
        ]}
        onPress={handleLogin}>
        <Text style={styles.loginButtonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signUpText}>
          Don’t have an account? <Text style={styles.signUp}>Sign Up</Text> here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007ACC',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 180,
    marginBottom: 10,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#342671',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#333',
    textAlign: 'center',
    fontSize: 16,
  },
  signUpText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  signUp: {
    color: '#34B8C5',
    fontWeight: 'bold',
    color: '#007ACC',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
  },
  clearIcon: {
    position: 'absolute',
    right: 10, // Adjust to place it properly inside the input
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
