import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../core/app_state/app_state';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS } from '../../../core/constants/app_constants';
import { Avatar, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookSection from '../componets/BookSection';
import booksData from '../../../core/static_data/booksData';
import { userAuth } from '../../auth/repositry/authContextProvider';


const Homepage = () => {

  const { userBooks } = useSelector((state: RootState) => state.userData);
  const { user } = userAuth();
  const dispatch = useDispatch();
  
  const displayUsername = user?.username || 'User';

  return (
    <SafeAreaView style={styles.safearea} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            <View style={styles.upperContainer}>
              <DynamicHeader 
                username={` Good Morning, ${displayUsername}`}
                leftIcon="account-circle"
                rightIcon="bell"
                onRightPress={undefined}
              />

              {/* SEARCH SECTION */}
              <View style={styles.searchContaner}>
                <Text style={styles.exploretext}>Explore The World's Books</Text>

                <View style={styles.searchRow}>

                  <TextInput
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    style={styles.searchInput}
                    placeholder="Search here"
                    placeholderTextColor="#999"
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

                <View style={styles.onbordingwithgradient}>
          <View style={styles.leftSideTextSection}>
            <Text style={styles.discountTitle}>Book Store</Text>
            <Text style={styles.discountSubtitle}>Discount.</Text>
            <Text style={styles.discountDescription}>
              Upto 40% off on selected{'\n'}favourite books.
            </Text>
            <TouchableOpacity style={styles.claimButton}>
              <Text style={styles.claimButtonText}>Claim</Text>
            </TouchableOpacity>
          </View>

      
          
          <View style={styles.rightSideImageContainer}>
            <Image 
              style={styles.imageRightSide}
              source={{ 
                uri: 'https://images.unsplash.com/photo-1597167100957-1dfa110c1c14?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJlYWRpbmclMjBib29rfGVufDB8fDB8fHww' 
              }}
              resizeMode="cover"
            />
          </View>
        </View>

         <View style={styles.bookssection}>
            <BookSection
              title="Best Selling"
              data={booksData}
            />
         </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Homepage
const styles = StyleSheet.create({

  safearea: {
    flex: 1
  },

  keyboardAvoidingView: {
    flex: 1
  },

  scrollView: {
    flex: 1
  },

  scrollViewContent: {
    flexGrow: 1
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
     marginBottom: 10
    
  },
  bookssection:{
    marginTop:10,


  },
  upperContainer:{
    height : 200,
    backgroundColor: COLORS.gray
  },

  searchContaner: {
    marginTop: 20,
    paddingHorizontal: 20
  },

  exploretext: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: COLORS.offWhite
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.offWhite,   
    borderRadius: 20,
    paddingHorizontal: 10,
  },

  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    backgroundColor: "transparent",  
    color: "#000",                    
  },

  searchIcon: {
    backgroundColor: COLORS.offWhite,  
    elevation: 0,
  },


  discountTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },

  discountSubtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },

  discountDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.white,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },

  claimButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginBottom: 20
  },

  claimButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  onbordingwithgradient: {
  marginRight:20,
  marginLeft:20,
  marginTop: 20,
  backgroundColor: COLORS.gray,
  height: 200,
  borderRadius: 20,
  flexDirection: 'row',
  overflow: 'hidden',
  padding: 20,
  position: 'relative',
},

leftSideTextSection: {
  flex: 1,
  justifyContent: 'center',
  paddingRight: 10,
  zIndex: 2,
},

rightSideImageContainer: {
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  width: '50%',
  zIndex: 1,
},

imageRightSide: {
  width: '100%',
  height: '100%',
},

})