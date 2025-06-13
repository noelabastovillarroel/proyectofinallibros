import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntrarScreen from '../screens/EntrarScreen';
import RegistroScreen from '../screens/RegistroScreen';
import MenuScreen from '../screens/MenuScreen';
import BookDetailScreen from '../screens/book/BookDetailScreen';


import BookUserScreen from '../screens/book/BookUserScreen';

import BookReviewScreen from '../screens/book/BookReviewScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Entrar"

                screenOptions={{
                    headerStyle: { backgroundColor: '#0f172a' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: '600' }
                }}
            >

                <Stack.Screen
                    name="Entrar"
                    component={EntrarScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Registros"
                    component={RegistroScreen}
                    options={{ headerShown: false }}
                />


                <Stack.Screen
                    name="Menu"
                    component={MenuScreen}
                    options={{ title: 'Lista de Libros' }}
                />


                <Stack.Screen
                    name="BookDetail"
                    component={BookDetailScreen}
                    options={{ title: 'Detalle de un Libro' }}
                />


                <Stack.Screen
                    name="BookUser"
                    component={BookUserScreen}
                    options={{ title: 'Libros Favoritos' }}
                />

                <Stack.Screen
                    name="BookReview"
                    component={BookReviewScreen}
                    options={{ title: 'Comentarios de Libro' }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
