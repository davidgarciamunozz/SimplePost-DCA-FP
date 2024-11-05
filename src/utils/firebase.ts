import { navigate } from '../store/actions';
import { dispatch } from '../store/store';

let db: any;
let auth: any;

export const getFirebaseInstance = async () => {
    if (!db) {
        const { getFirestore } = await import('firebase/firestore');
        const { initializeApp } = await import('firebase/app');
        const { getAuth, onAuthStateChanged } = await import('firebase/auth');

        const firebaseConfig = {
            apiKey: "AIzaSyDAqngQDJTyr0H86QeoYQIWuuk9bKHbTCk",
            authDomain: "simplepost-41609.firebaseapp.com",
            projectId: "simplepost-41609",
            storageBucket: "simplepost-41609.appspot.com",
            messagingSenderId: "1001008033762",
            appId: "1:1001008033762:web:a25e55babc72f0610193bb",
            measurementId: "G-K987R7VPHC"
        };

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // Agrega un listener para escuchar cambios en el estado de autenticación
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Usuario ha iniciado sesión
                console.log("Usuario autenticado:", user);
                dispatch(navigate('HOME')); // Navega a la pantalla principal
            } else {
                // Usuario no está autenticado
                console.log("No hay usuario autenticado.");
                dispatch(navigate('LOGIN')); // Navega a la pantalla de login
            }
        });
    }
    return { db, auth };
};

export const registerUser = async (credentials: any) => {
    console.log('credentials', credentials);    
    try {
        const { auth, db } = await getFirebaseInstance();
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const { doc, setDoc } = await import('firebase/firestore');

        // Crear el usuario de autenticación
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);

        // Referencia al documento del usuario en Firestore
        const where = doc(db, 'users', userCredential.user.uid);

        // Datos adicionales para almacenar en Firestore
        const data = {
            username: credentials.username,
            email: credentials.email,
        };

        // Guardar los datos adicionales en Firestore
        await setDoc(where, data);
        // Navegar al Login
        dispatch(navigate('LOGIN'));
        return true;
    } catch (error:any) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                alert('El correo electrónico ya está en uso');
                break;
            case 'auth/weak-password':
                alert('La contraseña es muy débil');
                break;
            default:
                console.error('Error al registrar usuario:', error.message);
                break
        }
        return false;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const { auth } = await getFirebaseInstance();
        const { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } = await import('firebase/auth');

        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario autenticado con éxito");
        dispatch(navigate('HOME'));

    } catch (error:any) {
        console.error("Error en login:", error.code);
        switch (error.code) {
            case 'auth/invalid-credential':
                alert('Correo o contraseña inválidos');
                break;
            default:
                console.error('Error al iniciar sesión:', error.message);
                break;
        }
    }
};

export const logoutUser = async () => {
    try {
        const { auth } = await getFirebaseInstance();
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
        console.log("Usuario ha cerrado sesión.");
        dispatch(navigate('LOGIN'));
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};
