import Post from '../components/Post/Post';
import PostCreator from '../components/Post/CreatePost';
import Navbar from '../components/navigation/NavBar';
import { dispatch } from "../store/store";
import { navigate } from '../store/actions';
import { addPost, getFirebaseInstance ,getPosts, subscribeToPosts} from '../utils/firebase';

class MainPage extends HTMLElement {
    posts: { post: string; comment: string, author?: string, likes?: number, imageURL: string }[] = [];
    unsubscribe: (() => void) | null = null; // Function to unsubscribe from Firestore

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.renderLoading(); 

        const { auth } = await getFirebaseInstance();
        if (auth) {
            auth.onAuthStateChanged(async (user: any) => {
                if (user) {
                    // console.log('Usuario autenticado');
                    this.render(); 
                    this.initializePageContent(); 
                    //  Listen to changes in the posts collection
                    this.unsubscribe = await subscribeToPosts((posts: any) => {
                        this.posts = posts.map((post: any) => ({
                            post: post.id,
                            comment: post.comment,
                            author: post.author,
                            likes: post.likes || 0,
                            imageURL: post.imageURL || ''
                        }));
                        this.refreshPosts(); // Update the UI with the new posts
                    });
                } else {
                    dispatch(navigate('LOGIN'));
                }
            });
        }
    }

    refreshPosts() {
        const container = this.shadowRoot?.querySelector('.container');
        if (container) {
            // Select and remove existing posts
            const existingPosts = container.querySelectorAll('.post');
            existingPosts.forEach((post) => post.remove());
    
            // Render the updated posts
            this.posts.forEach((post) => {
                this.createPostComponent(post);
            });
        }
    }
    

    disconnectedCallback() {
        // Unsubscribe from Firestore when the component is removed
        if (this.unsubscribe) this.unsubscribe();
    }

    initializePageContent() {
        const container = this.shadowRoot?.querySelector('.container');
    
        const navbar = new Navbar();
        const postCreator = new PostCreator();
    
        container?.appendChild(navbar);
        container?.appendChild(postCreator);
    
        // Render existing posts
        this.posts.forEach((post) => {
            this.createPostComponent(post);
        });
        this.shadowRoot?.addEventListener('new-post', async (event: Event) => {
            const { comment, author, imageURL } = (event as CustomEvent).detail;
            const newPost = { post: '', comment, author, likes: 0, imageURL };
    
            try {
                // Add the new post to Firestore and get the ID
                const postId = await addPost(newPost);
                newPost.post = postId;
    
                // Add the new post to the UI after it's been added to Firestore
                this.createPostComponent(newPost, true); // Insert at the beginning
            } catch (error) {
                console.error("Error al agregar el post al DOM:", error);
            }
        });
    }
    

    createPostComponent(post: { post: string; comment: string, author?: string, likes?: number, imageURL?: string }, insertAtBeginning = false) {
        const postComponent = new Post();
        postComponent.setAttribute('post', post.post);
        postComponent.setAttribute('comment', post.comment);
        postComponent.classList.add('post'); // Add a class to style the post
    
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
        const postCreator = container?.querySelector('post-creator');
    
        if (insertAtBeginning && postCreator) {
            container?.insertBefore(postComponent, postCreator.nextSibling);
        } else {
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
