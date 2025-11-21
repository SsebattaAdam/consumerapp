import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../../../core/constants/app_constants';
import { useNavigation } from '@react-navigation/native';

type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  coverImage: string;
};

type Props = {
  title: string;
  data: Book[];
  onViewAll?: () => void;
};

const BookSection: React.FC<Props> = ({ title, data, onViewAll }) => {
  const navigation = useNavigation();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // Ensure data is valid before navigating
      const validData = (data || []).filter(book => book && book.id);
      navigation.navigate('BookList' as never, { title, data: validData } as never);
    }
  };

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.coverImage }} style={styles.cover} resizeMode="cover" />
      <Text style={styles.bookTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>
        {item.author}
      </Text>
      <Text style={styles.bookPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data || []}
        horizontal
        keyExtractor={(item, index) => item?.id?.toString() || `book-${index}`}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    
   
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.secondary,
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  card: {
    width: 140,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cover: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
  },
  bookAuthor: {
    fontSize: 12,
    color: COLORS.dark22,
    marginTop: 4,
  },
  bookPrice: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.red,
  },
});

export default React.memo(BookSection);

