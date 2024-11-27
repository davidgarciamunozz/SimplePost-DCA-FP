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
                // console.log("Usuario autenticado:", user);
                // dispatch(navigate('HOME')); // Navega a la pantalla principal

                // Obtener datos adicionales del usuario desde Firestore
                const { doc, getDoc } = await import('firebase/firestore');
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    localStorage.setItem('user', JSON.stringify(userData));
                    // console.log("Nombre de usuario:", userData.username);
                    // dispatch(navigate('HOME')); // Navega a la pantalla principal
                }
            } else {
                // Usuario no está autenticado
                // console.log("No hay usuario autenticado.");
                localStorage.removeItem('user');
                dispatch(navigate('LOGIN')); // Navega a la pantalla de login
            }
        });
    }
    return { db, auth };
};

export const registerUser = async (credentials: any) => {
    // console.log('credentials', credentials);    
    try {
        const { auth, db } = await getFirebaseInstance();
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const { doc, setDoc } = await import('firebase/firestore');

        //Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);

        // Referencia al documento del usuario en Firestore
        const where = doc(db, 'users', userCredential.user.uid);

        // Aditional data to store in Firestore
        const data = {
            username: credentials.username,
            email: credentials.email,
        };

        // Set the data in Firestore
        await setDoc(where, data);
        // redirect to login
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
            // console.log("Nombre de usuario:", userData.username);
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

        // Clear user data from localStorage
        localStorage.removeItem('user');
        // console.log("Usuario ha cerrado sesión.");
        dispatch(navigate('LANDING'));
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

// Function to get the current user's username
export const getCurrentUserName = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.username || null;
};
// Function to get the current user's email
export const getCurrentUserId = async () => {
    const { auth } = await getFirebaseInstance();
    return auth.currentUser?.uid;
}

// Function to get the current user's email and aditional data
export const getCurrentUserCredentials = async () => {
    const { auth } = await getFirebaseInstance();
    return auth.currentUser;
};
// Function to get the current user's bio
export const getCurrentUserBio = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.bio || null;
};
// Function to get the current user's location
export const getCurrentUserLocation = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.location || null;
};

//  Function to add a post to Firestore
export const addPost = async (post: any) => {
    try {
        const { db, auth } = await getFirebaseInstance();
        const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');

        const userId = auth.currentUser?.uid;

        if (!userId) {
            throw new Error("Usuario no autenticado");
        }

        const postWithUser = {
            ...post,
            userId,
            createdAt: serverTimestamp(),
        };

        const postsRef = collection(db, 'posts');
        const docRef = await addDoc(postsRef, postWithUser); // Obtén la referencia del documento
        // console.log("Post agregado con ID de usuario:", userId);

        return docRef.id; // Retorna el ID del documento

    } catch (error) {
        console.error("Error al agregar post:", error);
        throw error;
    }
};

// Function to add a comment to a post in Firestore
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

        // console.log("Comentario agregado al post:", postId , 'autor:', author);

    } catch (error) {
        console.error("Error al agregar comentario:", error);
    }
};

// Function to get comments for a post
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

// Function to like a post
export const likePost = async (postId: string, userId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');

        const postRef = doc(db, 'posts', postId);
        
        // Añadimos el userId al array de 'likedBy' para evitar que se agregue múltiples veces el like por el mismo usuario
        await updateDoc(postRef, {
            likes: arrayUnion(userId) // Usamos arrayUnion para asegurar que el like de cada usuario sea único
        });

        // console.log(`Post ${postId} liked by user ${userId}`);
    } catch (error) {
        console.error("Error al dar like al post:", error);
    }
};

// Function to remove a like from a post
export const removeLike = async (postId: string, userId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayRemove } = await import('firebase/firestore');

        const postRef = doc(db, 'posts', postId);

        // Eliminamos el userId del array de 'likedBy' para quitar su like
        await updateDoc(postRef, {
            likes: arrayRemove(userId) // Usamos arrayRemove para quitar un like del usuario
        });

        // console.log(`Like removed from post ${postId} by user ${userId}`);
    } catch (error) {
        console.error("Error al quitar el like al post:", error);
    }
};
//function to obtain the likes of a post
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

// Function to get all posts from Firestore
export const getPosts = async () => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, getDocs, query, orderBy } = await import('firebase/firestore');

        // Referencia a la colección "posts"
        const postsRef = collection(db, 'posts');

        // Crear la consulta para ordenar por "createdAt" en orden descendente
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc')); // Cambia a 'asc' para orden ascendente

        // Obtener los documentos según la consulta
        const snapshot = await getDocs(postsQuery);

        // Mapear los documentos a un array
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener posts:", error);
        return [];
    }
};

// Function to subscribe to changes in posts collection
export const subscribeToPosts = async (callback: (posts: any) => void) => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, query, orderBy, onSnapshot } = await import('firebase/firestore');

        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));

        return onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            callback(posts);
        });
    } catch (error) {
        console.error("Error al suscribirse a cambios en posts:", error);
        return null;
    }
}

// Function to get posts by user ID
export const getPostsByUser = async (userId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, query, where, getDocs } = await import('firebase/firestore');

        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener posts por usuario:", error);
        return [];
    }
};

// Function to update data of a user in Firestore
export const updateUser = async (userId: string, data: any) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc } = await import('firebase/firestore');

        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, data);

        // console.log("Usuario actualizado:", data);
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
    }
}

// Function to set the image of a user in Firestore
export const setUserImage = async (userId: string, imageUrl: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc } = await import('firebase/firestore');

        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { imageUrl });

        // console.log("Imagen de usuario actualizada:", imageUrl);
    } catch (error) {
        console.error("Error al actualizar imagen de usuario:", error);
    }
};
// Function to obtain the image of a user from Firestore
export const getImage = async (userId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, getDoc } = await import('firebase/firestore');

        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.imageUrl || null;
        }

        return null;
    } catch (error) {
        console.error("Error al obtener imagen de usuario:", error);
        return null;
    }
};
// Function to upload an image to Cloudinary
export const uploadPostImage = async (postId: string, imageUrl: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc } = await import('firebase/firestore');

        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { imageUrl });

        // console.log("Imagen de post actualizada:", imageUrl);
    } catch (error) {
        console.error("Error al actualizar imagen de post:", error);
    }
};

// Function to get the id of the user who created a post
export const getUserIdFromPost = async (postId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, getDoc } = await import('firebase/firestore');

        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            const postData = postDoc.data();
            return postData.userId || null;
        }

        return null;
    } catch (error) {
        console.error("Error al obtener el id del usuario:", error);
        return null;
    }
};

// Function to get the data of a user by ID
export const getUserDataById = async (userId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, getDoc } = await import('firebase/firestore');

        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data();
        }

        return null;
    } catch (error) {
        console.error("Error al obtener datos de usuario:", error);
        return null;
    }
};