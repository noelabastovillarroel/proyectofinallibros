// RegisterScreen.js – registro “lavanda” coherente con el login
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [form,  setForm]        = useState({ email: '', password: '', confirm: '' });
  const [err,   setErr]         = useState({});
  const [msg,   setMsg]         = useState('');
  const [busy,  setBusy]        = useState(false);

  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  /* ---------- validación live ---------- */
  const validate = f => {
    const e = {};
    if (!f.email.trim())            e.email    = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
                                    e.email    = 'Email inválido';
    if (!f.password)                e.password = 'Requerido';
    else if (!pwdRegex.test(f.password))
                                    e.password = '8+ caracteres, Aa1#!';
    if (!f.confirm)                 e.confirm  = 'Confirma tu contraseña';
    else if (f.password !== f.confirm)
                                    e.confirm  = 'No coinciden';
    return e;
  };

  const handleChange = (k,v)=>{
    const next = { ...form, [k]: v };
    setForm(next);
    setErr(validate(next));
    setMsg('');
  };

  /* ---------- registro ---------- */
  const handleRegister = async () => {
    const e = validate(form);
    if (Object.keys(e).length){ setErr(e); return; }

    setBusy(true);
    try{
      await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      navigation.replace('Menu');
    }catch{
      setMsg('No se pudo crear la cuenta');
    }finally{ setBusy(false); }
  };

  const ready = !busy && Object.keys(err).length === 0 &&
                form.email && form.password && form.confirm;

  /* ---------- UI ---------- */
  return(
    <View style={styles.root}>
      {/* ← volver */}
      <Button
        type="clear"
        icon={<Icon name="arrow-left" type="feather" color="#7B6EF6"/>}
        title="  Volver"
        onPress={()=>navigation.goBack()}
        titleStyle={styles.backTxt}
        containerStyle={styles.backWrap}
        buttonStyle={styles.backBtn}
      />

      <Text h2 h2Style={styles.title}>Crear cuenta</Text>

      {/* email */}
      <Input
        placeholder="Email"
        placeholderTextColor="#A0A4B8"
        value={form.email}
        onChangeText={v=>handleChange('email',v)}
        leftIcon={<Icon name="mail" type="feather" color="#7B6EF6"/>}
        inputStyle={styles.inpTxt}
        inputContainerStyle={styles.inpBox}
        errorMessage={err.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* password */}
      <Input
        placeholder="Contraseña"
        placeholderTextColor="#A0A4B8"
        value={form.password}
        onChangeText={v=>handleChange('password',v)}
        leftIcon={<Icon name="lock" type="feather" color="#F2789F"/>}
        secureTextEntry
        inputStyle={styles.inpTxt}
        inputContainerStyle={[styles.inpBox, styles.pwdBox]}
        errorMessage={err.password}
      />

      {/* confirm */}
      <Input
        placeholder="Confirmar contraseña"
        placeholderTextColor="#A0A4B8"
        value={form.confirm}
        onChangeText={v=>handleChange('confirm',v)}
        leftIcon={<Icon name="lock" type="feather" color="#F2789F"/>}
        secureTextEntry
        inputStyle={styles.inpTxt}
        inputContainerStyle={[styles.inpBox, styles.pwdBox]}
        errorMessage={err.confirm}
      />

      {msg ? <Text style={styles.errMsg}>{msg}</Text> : null}

      <Button
        title="Registrarme"
        onPress={handleRegister}
        disabled={!ready}
        loading={busy}
        buttonStyle={styles.primaryBtn}
        containerStyle={{marginTop:6}}
      />
    </View>
  );
}

/* ---------- estilos ---------- */
const LAVENDER = '#F5F4FD';

const styles = StyleSheet.create({
  root:{
    flex:1,
    backgroundColor:LAVENDER,
    paddingHorizontal:26,
    paddingTop:52
  },
  backWrap:{ alignSelf:'flex-start', marginBottom:8 },
  backBtn:{ padding:4 },
  backTxt:{ color:'#7B6EF6', fontSize:16 },

  title:{ color:'#363B4E', textAlign:'center', marginBottom:22 },

  inpBox:{
    backgroundColor:'#FFFFFF',
    borderBottomWidth:0,
    borderRadius:16,
    paddingHorizontal:14,
    borderWidth:1.7,
    borderColor:'#D7D8F8',
    shadowColor:'#000',
    shadowOpacity: Platform.OS==='ios'?0.05:0.08,
    shadowRadius:4,
    shadowOffset:{width:0,height:2}
  },
  pwdBox:{ borderColor:'#FAD4E4' },
  inpTxt:{ color:'#363B4E' },

  primaryBtn:{
    backgroundColor:'#7B6EF6',
    borderRadius:14,
    paddingVertical:12
  },

  errMsg:{ color:'#E53E3E', textAlign:'center', marginBottom:8 }
});
