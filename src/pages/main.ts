import Post from '../components/Post/Post';
import PostCreator from '../components/Post/CreatePost';
import Navbar from '../components/navigation/NavBar';
import { dispatch } from "../store/store";
import { navigate } from '../store/actions';
import { addPost, getFirebaseInstance, getPosts } from '../utils/firebase';

class MainPage extends HTMLElement {
    posts: { post: string; comment: string, author?: string, likes?: number, imageURL : string }[] = [];

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
                imageURL: post.imageURL || ''
            }));
            console.log('Posts cargados:', this.posts);
        } catch (error) {
            console.error("Error al cargar posts:", error);
        }
    }

    initializePageContent() {
        const container = this.shadowRoot?.querySelector('.container');

        const navbar = new Navbar();
        const postCreator = new PostCreator();
    
        container?.appendChild(navbar);
        container?.appendChild(postCreator);
    
        this.posts.forEach((post) => {
            this.createPostComponent(post);
        });
    
        this.shadowRoot?.addEventListener('new-post', async (event: Event) => {
            const { comment, author, imageURL} = (event as CustomEvent).detail;
            const newPost = { post: '', comment, author, likes: 0, imageURL };
    
            try {
                // Añade el post a Firebase y obtén el ID del documento
                const postId = await addPost(newPost);
                newPost.post = postId; // Establece el ID en el objeto `newPost`
    
                // Ahora añade el post al DOM con el ID
                this.createPostComponent(newPost, true); // Inserta el nuevo post al inicio
            } catch (error) {
                console.error("Error al agregar el post al DOM:", error);
            }
        });
    }

    createPostComponent(post: { post: string; comment: string, author?: string, likes?: number, imageURL?: string }, insertAtBeginning = false) {
        const postComponent = new Post();
        postComponent.setAttribute('post', post.post);
        postComponent.setAttribute('comment', post.comment);
        if (post.author) {
            postComponent.setAttribute('author', post.author);
        }
        if (post.likes) {
            postComponent.setAttribute('likes', post.likes.toString());
        }
        if (post.imageURL) {
            postComponent.setAttribute('image-url', post.imageURL);
        }
    
        const container = this.shadowRoot?.querySelector('.container');
        const postCreator = container?.querySelector('post-creator'); // Selecciona el `PostCreator`
    
        if (insertAtBeginning && postCreator) {
            // Inserta el nuevo post justo después del `PostCreator`
            container?.insertBefore(postComponent, postCreator.nextSibling);
        } else {
            // Inserta al final si no se especifica lo contrario
            container?.appendChild(postComponent);
        }
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
