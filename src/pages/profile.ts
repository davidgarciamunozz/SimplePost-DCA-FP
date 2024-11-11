import Post from '../components/Post/Post';
import Navbar from '../components/navigation/NavBar';
import ProfileCard from '../components/profile/profileCard';
import ProfileEditor from '../components/profile/editProfile';
import { dispatch } from "../store/store";
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
                imageURL: post.imageURL || ''
            }));
        } catch (error) {
            console.error("Error al cargar posts:", error);
        }
    }

    async initializePageContent() {
        const userId = await getCurrentUserId();
        const container = this.shadowRoot?.querySelector('.container');

        const navbar = new Navbar();
        const profileCard = new ProfileCard();

        container?.appendChild(navbar);
        container?.appendChild(profileCard);

        // Escuchar el evento de edición desde ProfileCard para abrir el pop-up de edición
        profileCard.addEventListener('profile-updated', (event: Event) => {
            const customEvent = event as CustomEvent;
            updateUser(userId, customEvent.detail); // Actualizar datos del perfil en Firebase
        });

        profileCard.addEventListener('edit-profile', () => {
            this.openProfileEditorPopup(); // Llama a la función para abrir el pop-up
        });

        // Verificar si el usuario tiene posts
        if (this.posts.length === 0) {
            const noPostsMessage = document.createElement('p');
            noPostsMessage.textContent = "Aún no tienes posts. ¡Crea tu primer post y comparte tus pensamientos!";
            noPostsMessage.style.textAlign = 'center';
            noPostsMessage.style.color = '#777';
            noPostsMessage.style.marginTop = '20px';
            container?.appendChild(noPostsMessage);
        } else {
            this.posts.forEach((post) => {
                this.createPostComponent(post);
            });
        }
    }

    openProfileEditorPopup() {
        const profileEditorPopup = document.createElement('div');
        profileEditorPopup.classList.add('popup-overlay');

        const profileEditorContainer = document.createElement('div');
        profileEditorContainer.classList.add('popup-container');

        const profileEditor = new ProfileEditor();
        profileEditorContainer.appendChild(profileEditor);

        // Botón de cierre
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Cerrar';
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => {
            this.shadowRoot?.removeChild(profileEditorPopup);
            // Actualizar la página para reflejar los cambios
            window.location.reload();
        });

        profileEditorContainer.appendChild(closeButton);
        profileEditorPopup.appendChild(profileEditorContainer);

        // Añadir el pop-up al shadow DOM
        this.shadowRoot?.appendChild(profileEditorPopup);
    }

    createPostComponent(post: { post: string; comment: string, author?: string, likes?: number, imageURL?: string }) {
        const postComponent = new Post();
        postComponent.setAttribute('post', post.post);
        postComponent.setAttribute('comment', post.comment);
        if (post.author) postComponent.setAttribute('author', post.author);
        if (post.likes) postComponent.setAttribute('likes', post.likes.toString());
        if (post.imageURL) postComponent.setAttribute('image-url', post.imageURL);

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
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .popup-container {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    width: 90%;
                    max-width: 500px;
                }
                .close-button {
                    margin-top: 10px;
                    background: #ff5f5f;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
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
