import Post from '../components/Post/Post';
import Navbar from '../components/navigation/NavBar';
import ProfileCard from '../components/profile/profileCard';
import ProfileEditor from '../components/profile/editProfile';
import {dispatch } from "../store/store";
import { navigate } from '../store/actions';
import { getCurrentUserId, getFirebaseInstance, getPostsByUser, updateUser } from '../utils/firebase';

class ProfilePage extends HTMLElement {
    posts: { post: string; comment: string, author?: string, likes?: number }[] = [];
    isEditing: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.renderLoading(); // Muestra el mensaje de "Cargando..."
        

        const { auth } = await getFirebaseInstance();
        if (auth) {
            auth.onAuthStateChanged(async (user: any) => {
                if (user) {
                    console.log('Usuario autenticado');
                    await this.loadPostsFromFirestore(); // Cargar los posts desde Firestore
                    this.render(); // Renderizar la estructura base de la página
                    this.initializePageContent(); // Inicializar y agregar los componentes a la página
                } else {
                    dispatch(navigate('LOGIN'));
                }
            });
        }
    }

    async loadPostsFromFirestore() {
        const userId = await getCurrentUserId();
        try {
            const fetchedPosts = await getPostsByUser(userId); // Obtener los posts de Firestore
            this.posts = fetchedPosts.map(post => ({
                post: post.id,
                comment: post.comment,
                author: post.author,
                likes: post.likes || 0,
            }));
            console.log('Posts cargados:', this.posts);
        } catch (error) {
            console.error("Error al cargar posts:", error);
        }
    }

    async initializePageContent() {
        const userId = await getCurrentUserId();
        
        const container = this.shadowRoot?.querySelector('.container');

        const navbar = new Navbar();
        const profileCard = new ProfileCard();
        const profileEditor = new ProfileEditor();
    
        container?.appendChild(navbar);
        container?.appendChild(profileCard);

        // Escuchar el evento de edición desde ProfileCard
        profileCard.addEventListener('profile-updated', (event: Event) => {
            const customEvent = event as CustomEvent;
            // Actualizar datos del perfil en firebase

            updateUser(userId, customEvent.detail);
        });
        profileCard.addEventListener('edit-profile', () => {
            container?.appendChild(profileEditor); // Mostrar el editor de perfil
        });
    
        // Verificar si el usuario tiene posts
        if (this.posts.length === 0) {
            // Renderizar un mensaje invitando a crear el primer post
            const noPostsMessage = document.createElement('p');
            noPostsMessage.textContent = "Aún no tienes posts. ¡Crea tu primer post y comparte tus pensamientos!";
            noPostsMessage.style.textAlign = 'center';
            noPostsMessage.style.color = '#777';
            noPostsMessage.style.marginTop = '20px';
            container?.appendChild(noPostsMessage);
        } else {
            // Renderizar los posts si existen
            this.posts.forEach((post) => {
                this.createPostComponent(post);
            });
        }
    }

    createPostComponent(post: { post: string; comment: string, author?: string, likes?: number }, insertAtBeginning = false) {
        const postComponent = new Post();
        postComponent.setAttribute('post', post.post);
        postComponent.setAttribute('comment', post.comment);
        if (post.author) {
            postComponent.setAttribute('author', post.author);
        }
        if (post.likes) {
            postComponent.setAttribute('likes', post.likes.toString());
        }
    
        const container = this.shadowRoot?.querySelector('.container');
        container?.appendChild(postComponent);
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = ` 
            <style>
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 10px;
                    margin-top: 4rem;
                }
            </style>
            <navbar-component></navbar-component>
            <div class="container"></div>
            `;
        }
    }

    renderLoading() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <style>
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-size: 1.5rem;
                }
            </style>
            <div class="loading">Cargando...</div>
            `;
        }
    }
}

customElements.define('profile-page', ProfilePage);
