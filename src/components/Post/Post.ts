import { navigate } from "../../store/actions";
import { dispatch } from "../../store/store";
import { addCommentToPost, getCommentsForPost, getLikesForPost, getUserIdFromPost, likePost, removeLike } from "../../utils/firebase";

class Post extends HTMLElement {
    private comment: string = '';
    private author: string = '';
    private likes: string[] = [];
    private comments: string[] = [];
    private postId: string = ''; // Add an ID for the post
    private imageURL: string = ''; // URL of the image

    static get observedAttributes() {
        return ['comment', 'author', 'likes', 'post', 'image-url']; 
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.render();
        await this.loadPostData(); // load post data when the component is connected
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            switch (name) {
                case 'comment':
                    this.comment = newValue;
                    break;
                case 'author':
                    this.author = newValue;
                    break;
                case 'likes':
                    try {
                        this.likes = JSON.parse(newValue);
                    } catch (error) {
                        this.likes = [];
                    }
                    break;
                case 'post':
                    this.postId = newValue;
                    break;
                case 'image-url':
                    this.imageURL = newValue; // Set the image URL
                    break;
            }
            this.render();
        }
    }

    async loadPostData() {
        if (this.postId) {
            //load comments for the post
            const commentsData = await getCommentsForPost(this.postId);
            this.comments = commentsData.map((comment: any) => ({
                author: comment.author,
                comment: comment.comment
            }));

            // Load likes for the post and set the local likes array
            const likesData = await getLikesForPost(this.postId);
            this.likes = likesData || [];

            this.render(); // Render the post after loading the data
        } else {
            console.error("No se ha establecido un ID de post");
        }
    }

    async addComment(comment: string) {
        if (this.postId) {
            await addCommentToPost(this.postId, comment); // Calls the function to add a comment to the post
    
            // Reload the comments and likes after adding a new one
            this.loadPostData(); 
        } else {
            console.error("No se ha establecido un ID de post");
        }
    }

    // Function to add or remove a like from the post
    private toggleLike() {
        const userCredential = localStorage.getItem('user');
        const userId = userCredential ? JSON.parse(userCredential).username : null;
        if (userId) {
            if (this.likes.includes(userId)) {
                removeLike(this.postId, userId); // If the user already liked the post, remove the like
                this.likes = this.likes.filter((like) => like !== userId);
            } else {
                likePost(this.postId, userId); // If the user hasn't liked the post, add the like
                this.likes.push(userId);
            }
            this.render(); // Render the post after adding or removing the like
        } else {
            alert('Debes iniciar sesión para dar like');
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    .post {
                        font-family: Arial, sans-serif;
                        border: 1px solid #e1e1e1;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        padding: 16px;
                        max-width: 100%;
                        background-color: white;
                    }
                    .post-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                        cursor: pointer;
                    }
                    .avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background-color: black;
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        margin-right: 12px;
                    }
                    .author {
                        font-weight: bold;
                    }
                    .comment {
                        margin-bottom: 12px;
                        overflow-wrap: break-word;
                        word-wrap: break-word; 
                        hyphens: auto; 
                    }
                    .actions {
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                    }
                    .action-button {
                        background: none;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        margin-right: 16px;
                    }
                    .comments {
                        margin-top: 12px;
                    }
                    .comment {
                        margin-bottom: 8px;
                    }
                    .comment-input {
                        width: 97%;
                        padding: 8px;
                        border: 1px solid #e1e1e1;
                        border-radius: 4px;
                    }
                        .post-image {
                    max-width: 100%;
                    height: auto;
                    margin-top: 12px;
                    border-radius: 8px;
                }
                </style>
                <div class="post">
                    <div class="post-header">
                        <div class="avatar">${this.author[0]}</div>
                         <span class="author clickable">${this.author}</span>
                    </div>
                    <div class="comment">${this.comment}</div>
                       ${this.imageURL ? `<img src="${this.imageURL}" class="post-image" />` : ''}
                    <div class="actions">
                        <button class="action-button" id="like-button">
                            👍 ${this.likes.length}
                        </button>
                        <button class="action-button">
                            💬 ${this.comments.length}
                        </button>
                    </div>
                    <div class="comments">
                        ${this.comments.map((comment: any) => `
                            <div class="comment">
                                <span class="author">${comment.author}:</span> ${comment.comment}
                            </div>
                        `).join('')}
                    </div>
                    <input type="text" class="comment-input" placeholder="Escribe un comentario...">
                </div>
            `;

            const likeButton = this.shadowRoot.getElementById('like-button');
            likeButton?.addEventListener('click', this.toggleLike.bind(this));

            const commentInput = this.shadowRoot?.querySelector('.comment-input') as HTMLInputElement;

            commentInput?.addEventListener('keypress', (event) => {
                if ((event as KeyboardEvent).key === 'Enter') {
                    const input = event.target as HTMLInputElement;
                    this.addComment(input.value);
                    input.value = '';
                }
            });
            const postHeader = this.shadowRoot.querySelector('.post-header');
            postHeader?.addEventListener('click', () => {
                getUserIdFromPost(this.postId).then((userId) => {
                    // console.log(userId);
                    localStorage.setItem('external-profile', userId);
                    dispatch(navigate('EXTERNAL_PROFILE'));
                });
            });
    }
    }
}

customElements.define('post-component', Post);

export default Post;
