/* screens/book/BookReviewScreen.js – versión pastel */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../config/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { getBookById } from '../../service/bookService';

/* ---------- paleta pastel ---------- */
const PASTEL = {
  bg:        '#FFF7ED',
  card:      '#FFF0F3',
  cardDark:  '#FBE7EF',
  border:    '#F8C8DC',
  text:      '#374151',
  textSoft:  '#64748B',
  accent:    '#F6A5C0',
};

/**
 * BookReviewScreen – lista de reseñas agrupadas por libro.
 */
export default function BookReviewScreen() {
  const navigation = useNavigation();

  const [sections, setSections] = useState([]);
  const [loading,  setLoading]  = useState(true);

  /* obtener reseñas + info de libros */
  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      /* 1️⃣  obtener reseñas ordenadas */
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const reviews = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (reviews.length === 0) { setSections([]); return; }

      /* 2️⃣  descargar detalles de cada libro */
      const ids   = [...new Set(reviews.map(r => r.bookId))];
      const books = await Promise.all(ids.map(id => getBookById(id).catch(() => null)));
      const map   = Object.fromEntries(books.filter(Boolean).map(b => [b.id, b]));

      /* 3️⃣  agrupar */
      const grouped = ids.map(id => ({
        book: map[id],
        data: reviews.filter(r => r.bookId === id),
      }));
      setSections(grouped);
    } catch (e) {
      console.warn('Error al cargar reseñas:', e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  /* header de sección (libro) */
  const renderSectionHeader = ({ section: { book } }) => {
    if (!book) return null;
    return (
      <TouchableOpacity
        style={styles.headerCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}
      >
        <Image
          source={{ uri: book.imageLinks?.thumbnail || 'https://via.placeholder.com/50x75.png?text=Libro' }}
          style={styles.cover}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          {book.authors && (
            <Text style={styles.bookAuthors}>{book.authors.join(', ')}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  /* fila reseña */
  const renderItem = ({ item }) => {
    const date = item.createdAt?.toDate ? item.createdAt.toDate() : null;
    const formatted = date ? date.toLocaleDateString() : '—';

    return (
      <View style={styles.reviewCard}>
        <Text style={styles.reviewText}>{item.review}</Text>
        <Text style={styles.reviewDate}>{formatted}</Text>
      </View>
    );
  };

  /* ---------- estados vacíos ---------- */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={PASTEL.accent} />
      </View>
    );
  }
  if (sections.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.empty}>Aún no hay reseñas</Text>
      </View>
    );
  }

  /* ---------- lista principal ---------- */
  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        SectionSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ paddingVertical: 14 }}
      />
    </View>
  );
}

/* ---------- estilos ---------- */
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

  /* header libro */
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PASTEL.card,
    borderRadius: 14,
    padding: 12,
    elevation: 1,
  },
  cover: {
    width: 45,
    height: 67,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  headerInfo: { flex: 1, marginHorizontal: 12 },
  bookTitle:  { color: PASTEL.text, fontWeight: '700' },
  bookAuthors:{ color: PASTEL.textSoft, marginTop: 2, fontSize: 12 },

  /* reseña */
  reviewCard: {
    backgroundColor: PASTEL.cardDark,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  reviewText: { color: PASTEL.text, fontSize: 14, lineHeight: 18 },
  reviewDate: { color: PASTEL.textSoft, fontSize: 11, marginTop: 4, textAlign: 'right' },
});
