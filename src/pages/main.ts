import Post, { PostType } from '../components/Post/Post';
import PostCreator from '../components/Post/CreatePost';
import Navbar from '../components/navigation/NavBar';
import { appState, dispatch } from "../store/store";
import { navigate } from '../store/actions';
import { getFirebaseInstance } from '../utils/firebase';

class MainPage extends HTMLElement {
    posts: { post: string; comment: string, author?: string, likes?: number }[] = [
        { post: 'Post 1', comment: 'This is the first comment', author: 'Axel', likes: 5 },
        { post: 'Post 2', comment: 'This is the second comment', author: 'Dave' },
        { post: 'Post 3', comment: 'This is the third comment', author: 'Max Doe', likes: 3 },
        { post: 'Post 4', comment: 'This is the fourth comment', author: 'David', likes: 10 },
        { post: 'Post 5', comment: 'This is the fifth comment', author: 'Sarah', likes: 10 },
        { post: 'Post 6', comment: 'This is the sixth comment', author: 'Alexander', likes: 10 },
    ];

    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const { auth } = await getFirebaseInstance();

        auth && auth.onAuthStateChanged((user:any) => {
            if (user) {
                this.render();
                this.initializePageContent();
                console.log('Usuario autenticado');
            } else {
                dispatch(navigate('LOGIN'));
            }
        });
    }

    initializePageContent() {
        console.log(appState);

        this.shadowRoot?.addEventListener('new-post', (event: Event) => {
            const { comment, author } = (event as CustomEvent).detail;
            this.addPost(comment, author);
        });

        const navbar = new Navbar();
        const postCreator = new PostCreator();
        const container = this.shadowRoot?.querySelector('.container');
        container?.appendChild(postCreator);

        this.posts.forEach((post) => {
            this.createPostComponent(post);
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
            <div class="container">
            </div>
            `;
        }
    }
}

customElements.define('main-page', MainPage);
