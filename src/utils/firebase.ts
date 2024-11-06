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
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Usuario ha iniciado sesión
                console.log("Usuario autenticado:", user);
                dispatch(navigate('HOME')); // Navega a la pantalla principal

                // Obtener datos adicionales del usuario desde Firestore
                const { doc, getDoc } = await import('firebase/firestore');
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log("Nombre de usuario:", userData.username);
                    dispatch(navigate('HOME')); // Navega a la pantalla principal
                }
            } else {
                // Usuario no está autenticado
                console.log("No hay usuario autenticado.");
                localStorage.removeItem('user');
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

        // Obtener y almacenar el nombre de usuario
        const { doc, getDoc } = await import('firebase/firestore');
        const userRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            localStorage.setItem('user', JSON.stringify(userData));
            console.log("Nombre de usuario:", userData.username);
        }
        
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

        // Limpiar información del usuario al cerrar sesión
        localStorage.removeItem('user');
        console.log("Usuario ha cerrado sesión.");
        dispatch(navigate('LOGIN'));
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

// Función para obtener el nombre del usuario actualmente autenticado
export const getCurrentUserName = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.username || null;
};


// Función para agregar un post a Firestore
export const addPost = async (post: any) => {
    try {
        const { db, auth } = await getFirebaseInstance();
        const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');

        // Obtén el ID del usuario autenticado
        const userId = auth.currentUser?.uid;

        if (!userId) {
            throw new Error("Usuario no autenticado");
        }

        // Añade el ID del usuario y la marca de tiempo al post
        const postWithUser = {
            ...post,
            userId,
            createdAt: serverTimestamp() // Timestamp opcional para saber cuándo fue creado
        };

        const postsRef = collection(db, 'posts');
        await addDoc(postsRef, postWithUser);

        console.log("Post agregado con ID de usuario:", userId);

    } catch (error) {
        console.error("Error al agregar post:", error);
    }
};

// Función para agregar un comentario a un post en Firestore
export const addCommentToPost = async (postId: string, comment: string) => {
    try {
        const { db, auth } = await getFirebaseInstance();
        const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');

        // Obtén el ID del usuario autenticado
        const userId = auth.currentUser?.uid;

        //Obtener el nombre del usuario
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const author = user?.username || null;

        if (!userId) {
            throw new Error("Usuario no autenticado");
        }

        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            comments: arrayUnion({ userId,author, comment })
        });

        console.log("Comentario agregado al post:", postId , 'autor:', author);

    } catch (error) {
        console.error("Error al agregar comentario:", error);
    }
};

// Función para obtener comentarios de un post en Firestore
export const getCommentsForPost = async (postId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, getDoc } = await import('firebase/firestore');

        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            const postData = postDoc.data();
            return postData.comments || [];
        }

        return {};
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return {};
    }
};

//función para aunmentar likes de un post
export const likePost = async (postId: string, userId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');

        const postRef = doc(db, 'posts', postId);
        
        // Añadimos el userId al array de 'likedBy' para evitar que se agregue múltiples veces el like por el mismo usuario
        await updateDoc(postRef, {
            likes: arrayUnion(userId) // Usamos arrayUnion para asegurar que el like de cada usuario sea único
        });

        console.log(`Post ${postId} liked by user ${userId}`);
    } catch (error) {
        console.error("Error al dar like al post:", error);
    }
};

// Función para disminuir el like de un post
export const removeLike = async (postId: string, userId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayRemove } = await import('firebase/firestore');

        const postRef = doc(db, 'posts', postId);

        // Eliminamos el userId del array de 'likedBy' para quitar su like
        await updateDoc(postRef, {
            likes: arrayRemove(userId) // Usamos arrayRemove para quitar un like del usuario
        });

        console.log(`Like removed from post ${postId} by user ${userId}`);
    } catch (error) {
        console.error("Error al quitar el like al post:", error);
    }
};
//función para obtener los likes de un post
export const getLikesForPost = async (postId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, getDoc } = await import('firebase/firestore');

        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            const postData = postDoc.data();
            return postData.likes || [];
        }

        return {};
    } catch (error) {
        console.error("Error al obtener likes:", error);
        return {};
    }
};

// Función para obtener todos los posts de Firestore
export const getPosts = async () => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, getDocs } = await import('firebase/firestore');

        const postsRef = collection(db, 'posts');
        const snapshot = await getDocs(postsRef);

        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener posts:", error);
        return [];
    }
};