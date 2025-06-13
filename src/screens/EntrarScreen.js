// EntrarScreen.js – login “lavanda” : UI suave, legible y limpio
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function EntrarScreen({ navigation }) {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [fieldErr, setFieldErr]   = useState({});
  const [msg, setMsg]             = useState('');
  const [loading, setLoading]     = useState(false);

  /* ---------- validación ---------- */
  const validate = (e, p) => {
    const err = {};
    if (!e.trim())                       err.email    = 'Ingresa tu email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) err.email = 'Email inválido';
    if (!p)                              err.password = 'Ingresa tu contraseña';
    return err;
  };

  const onEmail  = v => { setEmail(v);    if (fieldErr.email)    setFieldErr(r => ({ ...r, email: undefined }));    setMsg(''); };
  const onPass   = v => { setPassword(v); if (fieldErr.password) setFieldErr(r => ({ ...r, password: undefined })); setMsg(''); };

  /* ---------- login ---------- */
  const handleLogin = async () => {
    const err = validate(email, password);
    if (Object.keys(err).length) { setFieldErr(err); return; }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('Menu');
    } catch (e) {
      const m = e.code === 'auth/user-not-found'
        ? 'Usuario no registrado'
        : e.code === 'auth/wrong-password'
        ? 'Contraseña incorrecta'
        : 'No se pudo iniciar sesión';
      setMsg(m);
    } finally { setLoading(false); }
  };

  /* ---------- UI ---------- */
  return (
    <View style={styles.root}>
      <Text h2 h2Style={styles.title}>Mi Biblioteca</Text>
      <Text style={styles.subtitle}>Accede para continuar</Text>

      {/* -------- email -------- */}
      <Input
        placeholder="Email"
        placeholderTextColor="#A0A4B8"
        value={email}
        onChangeText={onEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon={<Icon name="mail" type="feather" color="#7B6EF6" />}
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputBox}
        errorMessage={fieldErr.email}
      />

      {/* -------- password -------- */}
      <Input
        placeholder="Contraseña"
        placeholderTextColor="#A0A4B8"
        value={password}
        onChangeText={onPass}
        secureTextEntry
        leftIcon={<Icon name="lock" type="feather" color="#F2789F" />}
        inputStyle={styles.inputText}
        inputContainerStyle={[styles.inputBox, styles.pwdBox]}
        errorMessage={fieldErr.password}
      />

      {msg ? <Text style={styles.errorMsg}>{msg}</Text> : null}

      <Button
        title="Entrar"
        onPress={handleLogin}
        disabled={!(email && password) || loading}
        loading={loading}
        buttonStyle={styles.primaryBtn}
        containerStyle={{ marginTop: 6 }}
      />

      <Button
        title="Registrarse"
        type="clear"
        titleStyle={styles.regLink}
        onPress={() => navigation.navigate('Registros')}
      />
    </View>
  );
}

/* ---------- estilos ---------- */
const LAVENDER = '#F5F4FD';
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    backgroundColor: LAVENDER,
  },
  title: { color: '#363B4E', textAlign: 'center', marginBottom: 4 },
  subtitle: { color: '#6B728E', textAlign: 'center', marginBottom: 24 },

  inputBox: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1.7,
    borderColor: '#D7D8F8',
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.06 : 0.09,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pwdBox: { borderColor: '#FAD4E4' },
  inputText: { color: '#363B4E' },

  primaryBtn: {
    backgroundColor: '#7B6EF6',
    borderRadius: 14,
    paddingVertical: 12,
  },
  regLink: { color: '#7B6EF6', fontWeight: '600' },

  errorMsg: { color: '#E53E3E', textAlign: 'center', marginBottom: 6 },
});
