import Post from '../components/Post/Post';
import PostCreator from '../components/Post/CreatePost';
import Navbar from '../components/navigation/NavBar';
import { appState, dispatch } from "../store/store";
import { navigate } from '../store/actions';
import { getFirebaseInstance, getPosts } from '../utils/firebase';

class MainPage extends HTMLElement {
    posts: { post: string; comment: string, author?: string, likes?: number }[] = [];

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
        try {
            const fetchedPosts = await getPosts(); // Obtener los posts de Firestore
            this.posts = fetchedPosts.map(post => ({
                post: post.id,
                comment: post.comment,
                author: post.author,
                likes: post.likes || 0,
            }));
        } catch (error) {
            console.error("Error al cargar posts:", error);
        }
    }

    initializePageContent() {
        const container = this.shadowRoot?.querySelector('.container');

        // Crear y añadir el navbar y el creador de posts
        const navbar = new Navbar();
        const postCreator = new PostCreator();

        container?.appendChild(navbar);
        container?.appendChild(postCreator);

        // Verifica si los posts están cargados y renderízalos
        this.posts.forEach((post) => {
            this.createPostComponent(post);
        });



        // Listener para eventos de nuevo post
        this.shadowRoot?.addEventListener('new-post', (event: Event) => {
            const { comment, author } = (event as CustomEvent).detail;
            this.addPost(comment, author);
        });
    }

    addPost(comment: string, author: string) {
        const postComponent = new Post();
        postComponent.setAttribute('comment', comment);
        postComponent.setAttribute('author', author);
        postComponent.setAttribute('likes', '0');

        const container = this.shadowRoot?.querySelector('.container');
        const postCreator = container?.querySelector('post-creator');

        if (postCreator && container) {
            container.insertBefore(postComponent, postCreator.nextSibling);
        } else {
            container?.appendChild(postComponent);
        }
    }

    createPostComponent(post: { post: string; comment: string, author?: string, likes?: number }) {
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

customElements.define('main-page', MainPage);
