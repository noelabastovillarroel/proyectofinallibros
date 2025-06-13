/*  book/BookDetailScreen.tsx  – pastel + layout centrado  */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text, Input, Button, Icon } from 'react-native-elements';
import Ionicons   from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../../config/firebase';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { getBookById } from '../../service/bookService';

/* ---------- paleta pastel uniforme ---------- */
const BG         = '#EAF4F4';
const CARD_BG    = '#CDEDFD';
const TXT_DARK   = '#345B63';
const TXT_SOFT   = '#7EA9BE';
const ACCENT     = '#50C4ED';

export default function BookDetailScreen() {
  const navigation       = useNavigation();
  const route            = useRoute();
  const { bookId }       = route.params;

  const [book, setBook]  = useState(null);
  const [loading, setLoading]           = useState(true);
  const [reviewText, setReviewText]     = useState('');
  const [savingReview, setSavingReview] = useState(false);
  const [addingBook,  setAddingBook]    = useState(false);

  /* ---------- fetch del libro ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const b = await getBookById(bookId);
        if (mounted) setBook(b);
      } catch {
        Alert.alert('Error', 'No se pudo cargar la información del libro');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [bookId]);

  /* ---------- guardar coemntario ---------- */
  const handleSaveReview = useCallback(async () => {
    if (!reviewText.trim()) {
      return Alert.alert('Validación', 'Escribe algo antes de guardar tu comentario');
    }
    setSavingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        userId:  auth.currentUser?.uid,
        bookId,
        review:  reviewText.trim(),
        createdAt: serverTimestamp(),
      });
      setReviewText('');
      Alert.alert('Bien!', 'comentario enviado');
    } catch {
      Alert.alert('Error', 'No se pudo guardar la comentario');
    } finally {
      setSavingReview(false);
    }
  }, [reviewText, bookId]);

  /* ---------- añadir a biblioteca ---------- */
  const handleAddToLibrary = useCallback(async () => {
    if (addingBook) return;
    setAddingBook(true);
    try {
      await setDoc(
        doc(db, 'user_books', `${auth.currentUser.uid}_${bookId}`),
        {
          userId:  auth.currentUser.uid,
          bookId,
          addedAt: serverTimestamp(),
        },
        { merge: true }
      );
      Alert.alert('Agregado', 'El libro añadido');
    } catch {
      Alert.alert('Error', 'No se pudo añadir el libro');
    } finally {
      setAddingBook(false);
    }
  }, [bookId, addingBook]);

  /* ---------- UI states ---------- */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: TXT_DARK }}>Libro no encontrado</Text>
      </View>
    );
  }

  /* ---------- desestructuración ---------- */
  const {
    imageLinks,
    title,
    subtitle,
    authors,
    publisher,
    publishedDate,
    pageCount,
    averageRating,
    description,
  } = book;

  /* ---------- render ---------- */
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 22 }}>
      {/* imagen + botón añadir */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageLinks?.thumbnail || 'https://via.placeholder.com/140x210.png?text=Libro' }}
          style={styles.bookImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.8}
          onPress={handleAddToLibrary}
          disabled={addingBook}
        >
          <Ionicons name="bookmark" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* info básica */}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {authors && (
        <Text style={styles.field}><Text style={styles.label}>Autor(es): </Text>{authors.join(', ')}</Text>
      )}
      {publisher && (
        <Text style={styles.field}><Text style={styles.label}>Editorial: </Text>{publisher}</Text>
      )}
      {publishedDate && (
        <Text style={styles.field}><Text style={styles.label}>Año: </Text>{publishedDate}</Text>
      )}
      {pageCount && (
        <Text style={styles.field}><Text style={styles.label}>Páginas: </Text>{pageCount}</Text>
      )}
      {averageRating && (
        <Text style={styles.field}><Text style={styles.label}>Rating: </Text>{averageRating} / 5</Text>
      )}

      {/* descripción completa */}
      {description ? (
        <Text style={[styles.description, { marginTop: 14 }]}>{description}</Text>
      ) : null}

      {/* caja de comentario */}
      <View style={styles.reviewBox}>
        <Text style={styles.reviewTitle}>Escribe tu comentario</Text>
        <Input
          placeholder="Tu opinión sobre el libro…"
          placeholderTextColor={TXT_SOFT}
          value={reviewText}
          onChangeText={setReviewText}
          multiline
          numberOfLines={4}
          inputStyle={styles.reviewInputText}
          inputContainerStyle={styles.reviewInputContainer}
        />
        <Button
          title="Guardar comentario"
          onPress={handleSaveReview}
          loading={savingReview}
          disabled={savingReview}
          buttonStyle={styles.primaryBtn}
          icon={<Icon name="save" color="#fff" style={{ marginRight: 8 }} />}
        />
      </View>
    </ScrollView>
  );
}

/* ---------- estilos pastel ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  loader:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG },

  /* imagen + botón */
  imageWrapper: { alignItems: 'center', marginBottom: 18 },
  bookImage:    {
    width: 160,
    height: 240,
    borderRadius: 10,
    backgroundColor: CARD_BG,
  },
  addBtn: {
    position: 'absolute',
    bottom: -12,
    right: 36,
    backgroundColor: ACCENT,
    padding: 10,
    borderRadius: 28,
    elevation: 3,
  },

  /* texto principal */
  title:    { color: TXT_DARK, fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 18 },
  subtitle: { color: TXT_SOFT, fontStyle: 'italic', textAlign: 'center', marginTop: 4 },

  label: { color: ACCENT, fontWeight: '600' },
  field: { color: TXT_DARK, marginTop: 6, fontSize: 14 },

  description: { color: TXT_SOFT, lineHeight: 20, fontSize: 14 },

  /* botones / inputs */
  primaryBtn: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 10,
  },

  /* comentarios */
  reviewBox: { marginTop: 28 },
  reviewTitle: { color: TXT_DARK, fontSize: 18, fontWeight: '600', marginBottom: 10 },
  reviewInputContainer: {
    backgroundColor: CARD_BG,
    borderBottomWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  reviewInputText: { color: TXT_DARK, minHeight: 100, textAlignVertical: 'top' },
});
