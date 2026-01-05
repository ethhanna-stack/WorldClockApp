import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getContacts } from '../../utils/helpers';
import { Contact } from '../../types';
import { formatTime, formatDate } from '../../utils/helpers';

interface ClockItem {
  id: string;
  name: string;
  email: string;
  timezone: string;
  isCurrentUser?: boolean;
}

export default function HomeScreen() {
  const { userProfile } = useAuth();
  const [clocks, setClocks] = useState<ClockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadClocks();
  }, [userProfile]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadClocks = async () => {
    if (!userProfile) return;

    try {
      const contacts = await getContacts(userProfile.id);
      
      const clockItems: ClockItem[] = [
        {
          id: userProfile.id,
          name: 'You',
          email: userProfile.email,
          timezone: userProfile.timezone,
          isCurrentUser: true,
        },
        ...contacts.map((contact) => ({
          id: contact.id,
          name: contact.contactDisplayName || contact.contactEmail,
          email: contact.contactEmail,
          timezone: contact.contactTimezone,
        })),
      ];

      setClocks(clockItems);
    } catch (error) {
      console.error('Error loading clocks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadClocks();
  };

  const renderClock = ({ item }: { item: ClockItem }) => {
    const time = formatTime(currentTime, item.timezone);
    const date = formatDate(currentTime, item.timezone);

    return (
      <View style={[styles.clockCard, item.isCurrentUser && styles.currentUserCard]}>
        <View style={styles.clockHeader}>
          <Text style={styles.clockName}>{item.name}</Text>
          {item.isCurrentUser && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>YOU</Text>
            </View>
          )}
        </View>
        <Text style={styles.clockTimezone}>{item.timezone.replace(/_/g, ' ')}</Text>
        <Text style={styles.clockTime}>{time}</Text>
        <Text style={styles.clockDate}>{date}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>World Clocks</Text>
      <FlatList
        data={clocks}
        renderItem={renderClock}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No contacts yet</Text>
            <Text style={styles.emptySubtext}>
              Add contacts to see their timezones
            </Text>
          </View>
        }
      />
    </View>
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
  listContent: {
    padding: 15,
  },
  clockCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserCard: {
    backgroundColor: '#E6F4FE',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  clockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  clockName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  clockTimezone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  clockTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  clockDate: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

