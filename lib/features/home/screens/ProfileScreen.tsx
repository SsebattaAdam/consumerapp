import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/app_state/app_state';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';
import { userAuth } from '../../../features/auth/repositry/authContextProvider';

const ProfileScreen = () => {
  const { favorites } = useSelector((state: RootState) => state.userData);
  const { user, onLogout } = userAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Filter favorites by current user ID
  const userFavorites = user 
    ? favorites.filter((fav: any) => fav.userId === user.id)
    : [];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            if (onLogout) {
              setIsLoggingOut(true);
              try {
                await onLogout();
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              } finally {
                setIsLoggingOut(false);
              }
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <DynamicHeader
          username="Profile"
          leftIcon="account-circle"
          rightIcon="bell"
          onRightPress={undefined}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Avatar.Icon 
            size={100} 
            icon="account-circle" 
            style={styles.profileAvatar}
            color={COLORS.offWhite}
          />
          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userFavorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>My Orders</Text>
            <Avatar.Icon 
              size={24} 
              icon="chevron-right" 
              style={styles.menuIcon}
              color={COLORS.dark22}
            />
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Payment Methods</Text>
            <Avatar.Icon 
              size={24} 
              icon="chevron-right" 
              style={styles.menuIcon}
              color={COLORS.dark22}
            />
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
            <Avatar.Icon 
              size={24} 
              icon="chevron-right" 
              style={styles.menuIcon}
              color={COLORS.dark22}
            />
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Help & Support</Text>
            <Avatar.Icon 
              size={24} 
              icon="chevron-right" 
              style={styles.menuIcon}
              color={COLORS.dark22}
            />
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.7}
          >
            {isLoggingOut ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <>
                <Avatar.Icon 
                  size={20} 
                  icon="logout" 
                  style={styles.logoutIcon}
                  color={COLORS.white}
                />
                <Text style={styles.logoutText}>Logout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  headerContainer: {
    backgroundColor: COLORS.gray,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.white,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
  },
  profileAvatar: {
    backgroundColor: COLORS.gray,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark2,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.dark22,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.dark22,
  },
  menuSection: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offWhite,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark2,
  },
  menuIcon: {
    backgroundColor: 'transparent',
  },
  logoutSection: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutIcon: {
    backgroundColor: 'transparent',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ProfileScreen;



