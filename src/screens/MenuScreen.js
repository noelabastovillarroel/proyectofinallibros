// MenuScreen.tsx  – pastel aqua, nav elevado + botón “Salir”
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BookListScreen from './book/BookListScreen';

export default function MenuScreen() {
  const navigation   = useNavigation();
  const route        = useRoute();
  const [active, setActive] = useState(route.name);

  useEffect(() => setActive(route.name), [route.name]);

  /* ---------- Menú inferior ---------- */
  const menuItems = [
    { label: 'Menu',          icon: 'flower-outline',             lib: 'Ionicons',       route: 'Menu'       },
    { label: 'Mis Libros',    icon: 'auto-stories',               lib: 'MaterialIcons',  route: 'BookUser'   },
    { label: 'Comentario',    icon: 'chatbubble-ellipses-outline',lib: 'Ionicons',       route: 'BookReview' },
    { label: 'Salir',         icon: 'exit-outline',               lib: 'Ionicons',       route: 'Entrar'     },
  ];

  /* ---------- Paleta pastel uniforme ---------- */
  const BG        = '#EAF4F4';
  const BAR_BG    = '#CDEDFD';
  const TXT       = '#345B63';
  const ACTIVE    = '#50C4ED';
  const ICON_DEF  = '#7EA9BE';

  const renderIcon = (item, focused) => {
    const size  = 26;
    const color = focused ? ACTIVE : ICON_DEF;
    return item.lib === 'MaterialIcons'
      ? <MaterialIcons name={item.icon} size={size} color={color} />
      : <Ionicons       name={item.icon} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: BG }]}>
      {/* ---------- Contenido ---------- */}
      <View style={styles.catalogWrapper}>
        <BookListScreen searchPlaceholder="Buscar por nombre…" cardSize={100} />
      </View>

      {/* ---------- Barra navegación ---------- */}
      <View style={[styles.bottomNav, { backgroundColor: BAR_BG }]}>
        {menuItems.map(item => {
          const focused = active === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={styles.navBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.route)}
            >
              {renderIcon(item, focused)}
              <Text style={[styles.navLabel, { color: focused ? ACTIVE : TXT }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* ---------- Estilos ---------- */
const SAFE_GAP = Platform.OS === 'ios' ? 28 : 20;  // margen para no tapar gestos
const NAV_H    = 64;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  catalogWrapper: { flex: 1, paddingHorizontal: 10, paddingTop: 10 },
  bottomNav: {
    height: NAV_H + SAFE_GAP,
    paddingBottom: SAFE_GAP,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#B0DBF1',
  },
  navBtn: { flex: 1, alignItems: 'center' },
  navLabel: { fontSize: 12, marginTop: 2, fontWeight: '600' },
});
