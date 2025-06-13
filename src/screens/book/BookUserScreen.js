/* screens/book/BookUserScreen.js – botones de estante renovados */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getBookById, updateBookShelf } from '../../service/bookService';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/* ---------- paleta pastel ---------- */
const PASTEL = {
  bg:        '#FFF7ED',
  card:      '#CDEDFD',
  text:      '#34495E',
  textSoft:  '#6B8BA4',
  accent:    '#50C4ED',
  border:    '#A9DEF9',
};

/* ---------- estantes + icono ---------- */
const SHELVES = [
  { key: 'currentlyReading', label: 'Leyendo',     icon: 'book-open-variant' },
  { key: 'wantToRead',       label: 'Quiero leer', icon: 'bookmark-plus-outline' },
  { key: 'read',             label: 'Leído',       icon: 'check-circle-outline' },
];

export default function BookUserScreen() {
  const navigation = useNavigation();

  const [books, setBooks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [updatingShelfId, setUId] = useState(null);

  /* cargar libros del usuario */
  const loadUserBooks = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'user_books'), where('userId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      const ids  = snap.docs.map(d => d.data().bookId);
      if (ids.length === 0) { setBooks([]); return; }

      const all = await Promise.all(ids.map(id => getBookById(id).catch(() => null)));
      setBooks(all.filter(Boolean));
    } catch (e) {
      console.warn('Error al cargar biblioteca:', e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUserBooks(); }, [loadUserBooks]);

  /* cambiar estante */
  const changeShelf = async (bookId, newShelf) => {
    try {
      setUId(bookId);
      await updateBookShelf(bookId, newShelf);
      setBooks(prev => prev.map(b => (b.id === bookId ? { ...b, shelf: newShelf } : b)));
    } catch (e) {
      console.warn('Error al actualizar estante:', e.message);
    } finally { setUId(null); }
  };

  /* tarjeta libro */
  const renderItem = ({ item }) => {
    const { id, title, authors, imageLinks, shelf } = item;
    return (
      <View style={styles.card}>
        {/* portada + info */}
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('BookDetail', { bookId: id })}
        >
          <Image
            source={{ uri: imageLinks?.thumbnail || 'https://via.placeholder.com/120x160.png?text=Libro' }}
            style={styles.cover}
          />
          <View style={styles.infoBox}>
            <Text numberOfLines={2} style={styles.title}>{title}</Text>
            {authors && <Text style={styles.authors}>{authors.join(', ')}</Text>}
          </View>
        </TouchableOpacity>

        {/* botones de estante */}
        <View style={styles.shelfRow}>
          {SHELVES.map(s => {
            const selected = shelf === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[
                  styles.shelfBtn,
                  selected && styles.shelfBtnActive,
                ]}
                onPress={() => changeShelf(id, s.key)}
                disabled={updatingShelfId === id}
              >
                {updatingShelfId === id && selected ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons
                      name={s.icon}
                      size={15}
                      color={selected ? '#fff' : PASTEL.border}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[
                      styles.shelfText,
                      selected && { color: '#fff' },
                    ]}>
                      {s.label}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  /* estados vacíos / carga */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={PASTEL.accent} />
      </View>
    );
  }
  if (books.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.empty}>Tu biblioteca está vacía</Text>
      </View>
    );
  }

  /* lista */
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        contentContainerStyle={{ paddingVertical: 14 }}
      />
    </View>
  );
}

/* ---------- estilos ---------- */
const COVER_W = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PASTEL.bg,
    paddingHorizontal: 14,
  },
  loader: {
    flex: 1,
    backgroundColor: PASTEL.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: { color: PASTEL.textSoft, fontSize: 16 },

  /* tarjeta */
  card: {
    width: '100%',
    backgroundColor: PASTEL.card,
    borderRadius: 14,
    padding: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  cover: {
    width: COVER_W,
    height: COVER_W * 1.5,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  infoBox: { flex: 1, marginLeft: 14 },
  title: {
    color: PASTEL.text,
    fontSize: 15,
    fontWeight: '700',
  },
  authors: {
    color: PASTEL.textSoft,
    fontSize: 12,
    marginTop: 2,
  },

  /* shelf buttons */
  shelfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  shelfBtn: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: PASTEL.border,
    borderRadius: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shelfBtnActive: {
    backgroundColor: PASTEL.accent,
    borderColor: PASTEL.accent,
  },
  shelfText: {
    color: PASTEL.border,
    fontSize: 11,
  },
});
