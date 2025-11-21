import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../core/app_state/app_state';
import { addToFavorites, removeFromFavorites } from '../../../core/app_state/app_actions';
import BookCard from '../componets/BookCard';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS, FONTS } from '../../../core/constants/app_constants';
import { TextInput, Avatar } from 'react-native-paper';
import OrderSummaryModal from '../../payments/components/OrderSummaryModal';
import { userAuth } from '../../../features/auth/repositry/authContextProvider';

const BookListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state: RootState) => state.userData);
  const { user, isLoading: authLoading } = userAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const routeParams = route.params as { title: string; data: any[] } | undefined;
  const title = routeParams?.title || 'Books';
  const data = routeParams?.data || [];
  
  // Filter data: if search query is empty, show all valid books; otherwise filter by search
  const filteredData = data.filter(book => {
    if (!book || !book.id) return false;
    
    // If no search query, show all books
    if (!searchQuery.trim()) {
      return true;
    }
    
    // Otherwise, filter by title or author
    const query = searchQuery.toLowerCase();
    const bookTitle = book.title?.toLowerCase() || '';
    const bookAuthor = book.author?.toLowerCase() || '';
    
    return bookTitle.includes(query) || bookAuthor.includes(query);
  });

  const handleFavoritePress = (book: any) => {
    console.log('handleFavoritePress called with:', { book, user });
    
    if (!user || !user.id) {
      console.warn('Cannot add to favorites: User not logged in', { user });
      return;
    }
    
    if (!book || !book.id) {
      console.warn('Cannot add to favorites: Invalid book', { book });
      return;
    }
    
    try {
      const isBookFavorite = favorites.some(
        (fav: any) => fav && fav.book && fav.book.id === book.id && fav.userId === user.id
      );
      
      console.log('Is book favorite?', isBookFavorite, { bookId: book.id, userId: user.id });
      
      if (isBookFavorite) {
        console.log('Removing from favorites');
        dispatch(removeFromFavorites(book, user.id));
      } else {
        console.log('Adding to favorites');
        dispatch(addToFavorites(book, user.id));
      }
    } catch (error) {
      console.error('Error in handleFavoritePress:', error);
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
    if (!user || !user.id) return false;
    if (!favorites || favorites.length === 0) return false;
    return favorites.some(
      (fav: any) => fav && fav.book && fav.book.id === bookId && fav.userId === user.id
    );
  };

  // Debug: Log data to see what we're getting
  console.log('BookListScreen - Route params:', routeParams);
  console.log('BookListScreen - Data length:', data.length);
  console.log('BookListScreen - Filtered data length:', filteredData.length);
  console.log('BookListScreen - User:', user);
  console.log('BookListScreen - Auth loading:', authLoading);

  // Show loading state if auth is still loading
  if (authLoading) {
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
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
      
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No books available</Text>
          <Text style={styles.emptySubtext}>Please try again later</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => item?.id?.toString() || `book-${index}`}
          renderItem={({ item }) => {
            if (!item || !item.id) return null;
            try {
              return (
                <BookCard
                  book={item}
                  isFavorite={isFavorite(item.id)}
                  onFavoritePress={handleFavoritePress}
                  onBuyNowPress={handleBuyNow}
                />
              );
            } catch (error) {
              console.error('Error rendering book card:', error, item);
              return null;
            }
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No books found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search term' : 'No books available'}
              </Text>
            </View>
          }
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
    fontFamily: FONTS.bold,
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

