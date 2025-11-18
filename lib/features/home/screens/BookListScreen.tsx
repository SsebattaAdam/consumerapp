import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../core/app_state/app_state';
import { addToFavorites, removeFromFavorites } from '../../../core/app_state/app_actions';
import BookCard from '../componets/BookCard';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS } from '../../../core/constants/app_constants';
import { TextInput, Avatar } from 'react-native-paper';
import OrderSummaryModal from '../../payments/components/OrderSummaryModal';

const BookListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state: RootState) => state.userData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const { title, data } = route.params as { title: string; data: any[] };
  
  const filteredData = data.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavoritePress = (book: any) => {
    const isFavorite = favorites.some((fav: any) => fav.id === book.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(book));
    } else {
      dispatch(addToFavorites(book));
    }
  };

  const handleBuyNow = (book: any) => {
    setSelectedBook(book);
    setShowOrderModal(true);
  };

  const handleConfirmOrder = () => {
    setShowOrderModal(false);
    navigation.navigate('Payment' as never, { book: selectedBook } as never);
  };

  const isFavorite = (bookId: number) => {
    return favorites.some((fav: any) => fav.id === bookId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <DynamicHeader
          username={title}
          leftIcon="arrow-left"
          rightIcon="bell"
          onLeftPress={() => navigation.goBack()}
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
      
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            isFavorite={isFavorite(item.id)}
            onFavoritePress={handleFavoritePress}
            onBuyNowPress={handleBuyNow}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        }
      />

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

export default BookListScreen;

