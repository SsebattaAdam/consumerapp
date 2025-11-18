import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../core/app_state/app_state';
import { removeFromFavorites } from '../../../core/app_state/app_actions';
import BookCard from '../componets/BookCard';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS } from '../../../core/constants/app_constants';
import { TextInput, Avatar } from 'react-native-paper';
import OrderSummaryModal from '../../payments/components/OrderSummaryModal';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state: RootState) => state.userData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const filteredFavorites = favorites.filter((book: any) => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavoritePress = (book: any) => {
    dispatch(removeFromFavorites(book));
  };

  const handleBuyNow = (book: any) => {
    setSelectedBook(book);
    setShowOrderModal(true);
  };

  const handleConfirmOrder = () => {
    setShowOrderModal(false);
    navigation.navigate('Payment' as never, { book: selectedBook } as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <DynamicHeader
          username="My Favorites"
          leftIcon="heart"
          rightIcon="bell"
          onRightPress={undefined}
        />
        
        {/* SEARCH SECTION */}
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              style={styles.searchInput}
              placeholder="Search here"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              theme={{ 
                colors: { 
                  primary: "transparent",
                  background: "transparent"
                }
              }}
            />
            <Avatar.Icon 
              size={35}
              icon="magnify"
              style={styles.searchIcon}
              color="black"
            />
          </View>
        </View>
      </View>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Add books to your favorites to see them here</Text>
        </View>
      ) : filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No books found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              isFavorite={true}
              onFavoritePress={handleFavoritePress}
              onBuyNowPress={handleBuyNow}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <OrderSummaryModal
        visible={showOrderModal}
        book={selectedBook}
        onClose={() => setShowOrderModal(false)}
        onConfirm={handleConfirmOrder}
      />
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
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#000',
  },
  searchIcon: {
    backgroundColor: COLORS.offWhite,
    elevation: 0,
  },
  listContent: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark2,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.dark22,
    textAlign: 'center',
  },
});

export default FavoritesScreen;

