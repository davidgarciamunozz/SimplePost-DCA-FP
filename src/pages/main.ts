import Post, {PostType} from '../components/Post/Post';
import PostCreator from '../components/Post/CreatePost';
import Navbar from '../components/navigation/NavBar';
//importar el estado global
import { appState, dispatch } from "../store/store";

class MainPage extends HTMLElement {

    //local data for rendering default posts
    posts: { post: string; comment: string, author?: string, likes?: number }[] = [
        { post: 'Post 1', comment: 'This is the first comment', author: 'Axel', likes: 5 },
        { post: 'Post 2', comment: 'This is the second comment' , author: 'Dave' },
        { post: 'Post 3', comment: 'This is the third comment', author: 'Max Doe', likes: 3 },
        { post: 'Post 4', comment: 'This is the fourth comment', author: 'David', likes: 10 },
        { post: 'Post 5', comment: 'This is the fifth comment', author: 'Sarah', likes: 10 },
        { post: 'Post 6', comment: 'This is the sixth comment', author: 'Alexander', likes: 10 },

    ];

    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();

                //imprimir el estado global en la consola
                console.log(appState);

                // Escuchar el evento personalizado "new-post"
                this.shadowRoot?.addEventListener('new-post', (event: Event) => {
                    const { comment, author } = (event as CustomEvent).detail;
                    this.addPost(comment, author);
                });
        
                //mostrar la bara de navegacion
                const navbar = new Navbar();
                //mostrar el creador de posts
                const postCreator = new PostCreator();
                const container = this.shadowRoot?.querySelector('.container');
                container?.appendChild(postCreator);
                //mostrar los posts
                this.posts.forEach((post) => {
                    this.createPostComponent(post);
                });
    }
    // Método para añadir un nuevo post dinámicamente
    addPost(comment: string, author: string) {
        const postComponent = new Post();
        postComponent.setAttribute('comment', comment);
        postComponent.setAttribute('author', author);
        postComponent.setAttribute('likes', '0'); // Inicialmente con 0 likes

        const container = this.shadowRoot?.querySelector('.container');
        const postCreator = container?.querySelector('post-creator');

        // Insertar el nuevo post después del PostCreator
        if (postCreator && container) {
            container.insertBefore(postComponent, postCreator.nextSibling);
        } else {
            container?.appendChild(postComponent);
        }
    }

    // Método para crear un componente post existente
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


    render () {
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
                <div class="container">
                </div>
            `;
        }
}
}

customElements.define('main-page', MainPage);