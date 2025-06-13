/*  book/BookListScreen.tsx  – mini-cards + misma paleta aqua  */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import debounce              from 'lodash.debounce';
import { getBooks, searchBooks } from '../../service/bookService';

const CARD   = 94;                               // ⬅︎ ancho/alto aprox. de cada tarjeta
const GAP    = 12;
const SCREEN = Dimensions.get('window').width;
const NUM    = Math.floor((SCREEN - GAP) / (CARD + GAP)) || 2;   // nº de columnas

export default function BookListScreen() {
  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [query,   setQuery]   = useState('');
  const navigation            = useNavigation();

  /* ───────── catálogo inicial ───────── */
  useEffect(() => {
    (async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (e) {
        console.warn(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ───────── búsqueda debounced ───────── */
  const handleSearch = useCallback(
    debounce(async (text) => {
      if (text.length < 3) return;
      setLoading(true);
      try {
        const results = await searchBooks(text);
        setBooks(results);
      } catch (e) {
        console.warn(e.message);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const onChangeQuery = (text) => {
    setQuery(text);
    if (text.length >= 3)  handleSearch(text);
    if (text.length === 0) getBooks().then(setBooks);
  };

  /* ───────── render de cada libro ───────── */
  const renderItem = ({ item }) => {
    const author = item.authors?.[0]   || 'Autor desconocido';
    const year   = item.publishedDate  || '';
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
      >
        <Image
          source={{ uri: item.imageLinks?.thumbnail || 'https://via.placeholder.com/100x140.png?text=Libro' }}
          style={styles.thumbnail}
        />
        <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{author}</Text>
        <Text style={styles.meta}>{year}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#50C4ED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar por nombre…"
        placeholderTextColor="#7EA9BE"
        value={query}
        onChangeText={onChangeQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={NUM}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ───────── estilos pastel aqua ───────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF4F4',
    paddingHorizontal: GAP,
    paddingTop: GAP,
  },
  searchBar: {
    backgroundColor: '#CDEDFD',
    color:           '#345B63',
    borderRadius:    12,
    paddingHorizontal: 14,
    paddingVertical:   8,
    marginBottom:    GAP,
    fontSize:        14,
  },
  card: {
    width:        CARD,
    borderRadius: 12,
    backgroundColor: '#CDEDFD',
    padding:      6,
    marginBottom: GAP,
    elevation:    2,
    alignItems:   'center',
  },
  thumbnail: {
    width:        '100%',
    aspectRatio:  0.66,           // un poco más esbelta
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#FFF',
  },
  title: {
    color:      '#345B63',
    fontSize:   12,
    fontWeight: '600',
    textAlign:  'center',
  },
  meta: {
    color:     '#7EA9BE',
    fontSize:  10,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems:     'center',
    backgroundColor: '#EAF4F4',
  },
  listContent: {
    paddingBottom: 20,
  },
});
