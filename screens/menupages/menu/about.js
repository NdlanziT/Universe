import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

const AboutUs = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Hero Section */}
            <Animatable.View animation="fadeInDown" style={styles.heroSection}>
                <Image source={require('../../../assets/logo.jpg')} style={styles.logo} />
                <Text style={styles.appName}>UniVerse: Your Campus Hub</Text>
                <Text style={styles.tagline}>
                    Empowering students with resources, connections, and support to thrive in academic and campus life.
                </Text>
            </Animatable.View>

            {/* Why UniVerse */}
            <Animatable.View animation="fadeInUp" delay={100} style={styles.section}>
                <Text style={styles.sectionTitle}>Why Choose UniVerse?</Text>
                <Text style={styles.sectionText}>
                    - *Save Money and Time*: Affordable textbooks, peer-to-peer tutoring, and access to essential resources.
                    - *Personalized Support*: Tailored tutoring and mental health resources.
                    - *Stay Connected*: Find study groups, friends, and stay informed on campus events.
                    - *Balance and Wellness*: Comprehensive support for academic and mental well-being.
                </Text>
            </Animatable.View>

            {/* Feature Spotlights */}
            <Animatable.View animation="fadeInUp" delay={150} style={styles.section}>
                <Text style={styles.sectionTitle}>Feature Spotlights</Text>
                <View style={styles.spotlightItem}>
                    <Icon name="book-outline" size={28} color="#4CAF50" />
                    <Text style={styles.spotlightText}>**Marketplace**: Find or offer affordable learning resources. Easily search for textbooks and notes you need.</Text>
                </View>
                <View style={styles.spotlightItem}>
                    <Icon name="people-outline" size={28} color="#2196F3" />
                    <Text style={styles.spotlightText}>**Peer Tutoring**: Get help from experienced peers, perfect for exam season.</Text>
                </View>
                <View style={styles.spotlightItem}>
                    <Icon name="calendar-outline" size={28} color="#FF5722" />
                    <Text style={styles.spotlightText}>**Campus Events**: Never miss a campus event with our event alerts and calendar sync.</Text>
                </View>
                <View style={styles.spotlightItem}>
                    <Icon name="heart-outline" size={28} color="#9C27B0" />
                    <Text style={styles.spotlightText}>**Mental Health Support**: Get 24/7 access to mental wellness resources and a supportive community.</Text>
                </View>
            </Animatable.View>

            {/* Value to Users */}
            <Animatable.View animation="fadeInUp" delay={200} style={styles.section}>
                <Text style={styles.sectionTitle}>Value to Users</Text>
                <Text style={styles.sectionText}>
                    UniVerse enhances your campus life with cost savings, improved academic performance, strong social connections, and access to mental wellness support. Save money on materials, stay on top of academics, and connect with like-minded peers—all in one app.
                </Text>
            </Animatable.View>

            {/* Solving Student Problems */}
            <Animatable.View animation="fadeInUp" delay={250} style={styles.section}>
                <Text style={styles.sectionTitle}>Solving Student Problems</Text>
                <Text style={styles.sectionText}>
                    Financial constraints, academic struggles, social isolation, and mental health challenges are common issues among students. UniVerse provides affordable resources, personalized tutoring, networking, and wellness support to ease these burdens.
                </Text>
            </Animatable.View>

            {/* Testimonials */}
            <Animatable.View animation="fadeInUp" delay={300} style={styles.section}>
                <Text style={styles.sectionTitle}>Testimonials</Text>
                <Text style={styles.testimonialText}>"UniVerse helped me save so much on textbooks and even introduced me to new friends in my classes!" - *Student, University of Johannesburg*</Text>
                <Text style={styles.testimonialText}>"The peer tutoring feature is a lifesaver during exams. Highly recommended!" - *Student, UCT*</Text>
            </Animatable.View>

            {/* Core Functionalities */}
            <Animatable.View animation="fadeInUp" delay={350} style={styles.section}>
                <Text style={styles.sectionTitle}>Core Functionalities</Text>
                <View style={styles.functionalityItem}>
                    <Icon name="book-outline" size={28} color="#4CAF50" />
                    <Text style={styles.functionalityText}>Marketplace: Buy, sell, and rent textbooks and materials.</Text>
                </View>
                <View style={styles.functionalityItem}>
                    <Icon name="people-outline" size={28} color="#2196F3" />
                    <Text style={styles.functionalityText}>Peer Tutoring: Personalized academic support from other students.</Text>
                </View>
                <View style={styles.functionalityItem}>
                    <Icon name="chatbubbles-outline" size={28} color="#FF9800" />
                    <Text style={styles.functionalityText}>Networking Zone: Connect with classmates and study groups.</Text>
                </View>
                <View style={styles.functionalityItem}>
                    <Icon name="calendar-outline" size={28} color="#FF5722" />
                    <Text style={styles.functionalityText}>Campus Events: Discover and join events on campus.</Text>
                </View>
                <View style={styles.functionalityItem}>
                    <Icon name="heart-outline" size={28} color="#9C27B0" />
                    <Text style={styles.functionalityText}>Mental Health Support: Access resources and a supportive community.</Text>
                </View>
            </Animatable.View>

            {/* Monetization Strategy */}
            <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
                <Text style={styles.sectionTitle}>Monetization Strategy</Text>
                <Text style={styles.sectionText}>
                    Revenue channels include commission on marketplace transactions, premium features, brand partnerships, and targeted in-app advertising.
                </Text>
            </Animatable.View>

            {/* Potential API Integrations */}
            <Animatable.View animation="fadeInUp" delay={450} style={styles.section}>
                <Text style={styles.sectionTitle}>Potential API Integrations</Text>
                <Text style={styles.sectionText}>
                    Google Maps API, Payment Gateways, Social Media APIs, Calendar API, and Mental Health Resources API to enhance user experience.
                </Text>
            </Animatable.View>

            {/* Contact & Social Links */}
            <Animatable.View animation="fadeInUp" delay={500} style={styles.contactSection}>
                <Text style={styles.sectionTitle}>Stay Connected</Text>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:support@universeapp.com')} style={styles.contactItem}>
                    <Icon name="mail-outline" size={24} color="#fff" />
                    <Text style={styles.contactText}>Contact Support</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.twitter.com/universeapp')} style={styles.contactItem}>
                    <Icon name="logo-twitter" size={24} color="#1DA1F2" />
                    <Text style={styles.contactText}>Follow us on Twitter</Text>
                </TouchableOpacity>
            </Animatable.View>

            {/* Version Info */}
            <Animatable.View animation="fadeInUp" delay={550} style={styles.versionSection}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
                <Text style={styles.acknowledgments}>UniVerse Team - Building a community for success.</Text>
            </Animatable.View>
        </ScrollView>
    );
};

export default AboutUs;

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#121212', padding: 20 },
    heroSection: { alignItems: 'center', marginBottom: 20 },
    logo: { width: 80, height: 80, marginBottom: 10 },
    appName: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
    tagline: { fontSize: 16, color: '#bbbbbb', textAlign: 'center', marginBottom: 20 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '600', color: '#ffffff', marginBottom: 8 },
    sectionText: { fontSize: 14, color: '#bbbbbb', lineHeight: 22 },
    spotlightItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    spotlightText: { fontSize: 14, color: '#bbbbbb', marginLeft: 8 },
    testimonialText: { fontStyle: 'italic', color: '#bbbbbb', marginBottom: 10 },
    functionalityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    functionalityText: { fontSize: 14, color: '#bbbbbb', marginLeft: 8 },
    contactSection: { marginTop: 20, marginBottom: 10, alignItems: 'center' },
    contactItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    contactText: { fontSize: 14, color: '#ffffff', marginLeft: 8 },
    versionSection: { alignItems: 'center', marginTop: 20 },
    versionText: { fontSize: 14, color: '#888888' },
    acknowledgments: { fontSize: 12, color: '#777777', marginTop: 5 }
});
