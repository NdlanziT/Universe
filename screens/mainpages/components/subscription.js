import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Image, SafeAreaView, ScrollView } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { getAuth } from 'firebase/auth';

const SubscriptionScreen = () => {
  const [cardDetails, setCardDetails] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  const onCardChange = (form) => {
    setCardDetails(form);
    setIsValid(form.valid);
  };

  const animateSuccess = () => {
    setSubscriptionStatus('Processing...');
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.5,
        friction: 2,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSubscriptionStatus('Subscription Successful!');
      sendConfirmationEmail();
    });
  };

  // Simulated Firebase email confirmation
  const sendConfirmationEmail = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await user.sendEmailVerification();
      setSubscriptionStatus('Subscription Successful! Please check your email for confirmation.');
    } else {
      setSubscriptionStatus('Subscription Successful! Please login to verify your email.');
    }
  };

  const handleSubscription = () => {
    if (isValid && selectedPackage) {
      animateSuccess();
    } else {
      setSubscriptionStatus('Please select a package and ensure card details are valid.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: 'https://example.com/subscription-header.png' }} style={styles.headerImage} />
        <View style={styles.container}>
          <Text style={styles.header}>Subscribe Now</Text>
          <Text style={styles.subHeader}>Choose a package and enter your card details to continue</Text>

          {/* Subscription Packages */}
          <View style={styles.packageContainer}>
  <TouchableOpacity
    style={[styles.package, selectedPackage === 'basic' && styles.packageSelected]}
    onPress={() => setSelectedPackage('basic')}
  >
    <Text style={styles.packageTitle}>Basic</Text>
    <Text style={styles.packagePrice}>R50/month</Text>
    <Text style={styles.packageDescription}>Access to essential features for a low cost</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.package, selectedPackage === 'standard' && styles.packageSelected]}
    onPress={() => setSelectedPackage('standard')}
  >
    <Text style={styles.packageTitle}>Standard</Text>
    <Text style={styles.packagePrice}>R90/month</Text>
    <Text style={styles.packageDescription}>Access to standard features and added resources</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.package, selectedPackage === 'premium' && styles.packageSelected]}
    onPress={() => setSelectedPackage('premium')}
  >
    <Text style={styles.packageTitle}>Premium</Text>
    <Text style={styles.packagePrice}>R150/month</Text>
    <Text style={styles.packageDescription}>Access to all premium resources and 24/7 support</Text>
  </TouchableOpacity>
</View>


          <CreditCardInput
            requiresName
            requiresCVC
            requiresPostalCode
            labelStyle={styles.label}
            inputStyle={styles.input}
            validColor="white"
            invalidColor="red"
            placeholderColor="gray"
            onChange={onCardChange}
          />

          <TouchableOpacity
            style={[styles.subscribeButton, isValid && selectedPackage ? styles.buttonActive : styles.buttonInactive]}
            onPress={handleSubscription}
            disabled={!isValid || !selectedPackage}
          >
            <Text style={styles.buttonText}>Subscribe to {selectedPackage ? selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1) : ''}</Text>
          </TouchableOpacity>

          <Animated.Text style={[styles.statusMessage, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            {subscriptionStatus}
          </Animated.Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    color: '#1E90FF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  packageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  package: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  packageSelected: {
    borderColor: '#1E90FF',
    borderWidth: 2,
  },
  packageTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  packagePrice: {
    fontSize: 16,
    color: '#1E90FF',
    marginBottom: 5,
  },
  packageDescription: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'center',
  },
  label: {
    color: '#1E90FF',
    fontSize: 14,
  },
  input: {
    color: 'white',
    fontSize: 16,
  },
  subscribeButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonActive: {
    opacity: 1,
  },
  buttonInactive: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusMessage: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SubscriptionScreen;
