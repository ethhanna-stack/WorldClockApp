import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

export default function ProfileScreen() {
  const { userProfile, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
            router.replace('/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleCopyShareCode = async () => {
    if (userProfile?.shareCode) {
      await Clipboard.setStringAsync(userProfile.shareCode);
      Alert.alert('Copied', 'Share code copied to clipboard');
    }
  };

  const handleShareCode = async () => {
    if (userProfile?.shareCode) {
      try {
        await Share.share({
          message: `Add me on World Clock! My share code is: ${userProfile.shareCode}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (!userProfile) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userProfile.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Timezone</Text>
          <Text style={styles.value}>{userProfile.timezone.replace(/_/g, ' ')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Share Code</Text>
        <Text style={styles.sectionDescription}>
          Share this code with others so they can add you
        </Text>

        <View style={styles.shareCodeCard}>
          <Text style={styles.shareCode}>{userProfile.shareCode}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCopyShareCode}
          >
            <Text style={styles.secondaryButtonText}>Copy Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleShareCode}
          >
            <Text style={styles.primaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.logoutButtonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>World Clock v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: '#333',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  shareCodeCard: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  shareCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    padding: 20,
  },
});

