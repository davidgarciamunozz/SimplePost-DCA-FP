import Post from '../components/Post/Post';
import Navbar from '../components/navigation/NavBar';
import ExternalProfileCard from './externalProfileCard';
import { dispatch } from "../store/store";
import { navigate } from '../store/actions';
import { getFirebaseInstance, getPostsByUser } from '../utils/firebase';

class ExternalProfilePage extends HTMLElement {
    posts: { post: string; comment: string, author?: string, likes?: number }[] = [];
    isEditing: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.renderLoading(); // Show "Loading..." message

        const { auth } = await getFirebaseInstance();
        if (auth) {
            auth.onAuthStateChanged(async (user: any) => {
                if (user) {
                    // console.log('Usuario autenticado');
                    await this.loadPostsFromFirestore(); // Load posts from Firestore
                    this.render(); // Render the base structure of the page
                    this.initializePageContent(); // Initialize and add components
                } else {
                    dispatch(navigate('LOGIN'));
                }
            });
        }
    }

    async loadPostsFromFirestore() {
        const userId = localStorage.getItem('external-profile');
        if (!userId) {
            console.error('No se ha especificado un usuario externo');
            return;
        }
        try {
            const fetchedPosts = await getPostsByUser(userId); // Get posts by user
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
        const userId = localStorage.getItem('external-profile');
        if (!userId) {
            console.error('No se ha especificado un usuario externo');
            return;
        }
        const container = this.shadowRoot?.querySelector('.container');

        const navbar = new Navbar();
        const profileCard = new ExternalProfileCard();

        container?.appendChild(navbar);
        container?.appendChild(profileCard);

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
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6); 
                    display: flex;
                    justify-content: center;
                    align-items: center;
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

customElements.define('external-page', ExternalProfilePage);
