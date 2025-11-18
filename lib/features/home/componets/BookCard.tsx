import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';

type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  description?: string;
  category?: string;
};

type Props = {
  book: Book;
  isFavorite?: boolean;
  onFavoritePress?: (book: Book) => void;
  onBuyNowPress?: (book: Book) => void;
  onPress?: (book: Book) => void;
};

const BookCard: React.FC<Props> = ({ 
  book, 
  isFavorite = false, 
  onFavoritePress, 
  onBuyNowPress,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => onPress && onPress(book)}
    >
      <Image 
        source={{ uri: book.coverImage }} 
        style={styles.coverImage} 
        resizeMode="cover" 
      />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        
        <Text style={styles.author} numberOfLines={1}>
          By {book.author}
        </Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>${book.price.toFixed(2)}</Text>
          
          <TouchableOpacity 
            onPress={() => onFavoritePress && onFavoritePress(book)}
            style={styles.favoriteButton}
            activeOpacity={0.7}
          >
            <Avatar.Icon
              size={28}
              icon={isFavorite ? 'heart' : 'heart-outline'}
              style={[styles.favoriteIcon, { backgroundColor: 'transparent' }]}
              color="#FF69B4"
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.buyButton}
          onPress={() => onBuyNowPress && onBuyNowPress(book)}
          activeOpacity={0.8}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark2,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: COLORS.dark22,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.red,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    backgroundColor: 'transparent',
  },
  buyButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default React.memo(BookCard);

