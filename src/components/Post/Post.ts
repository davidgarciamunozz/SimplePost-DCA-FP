import { addCommentToPost, getCommentsForPost, getLikesForPost, likePost, removeLike } from "../../utils/firebase";

class Post extends HTMLElement {
    private comment: string = '';
    private author: string = '';
    private likes: string[] = [];
    private comments: string[] = [];
    private postId: string = ''; // Añade un identificador para el post
    private imageURL: string = ''; // URL de la imagen

    static get observedAttributes() {
        return ['comment', 'author', 'likes', 'post', 'image-url']; // Observa también el id del post
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.render();
        await this.loadPostData(); // Cargar datos del post (likes y comentarios)
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
                    this.imageURL = newValue; // Establece la URL de la imagen
                    break;
            }
            this.render();
        }
    }

    async loadPostData() {
        if (this.postId) {
            // Cargar los comentarios del post
            const commentsData = await getCommentsForPost(this.postId);
            this.comments = commentsData.map((comment: any) => ({
                author: comment.author,
                comment: comment.comment
            }));

            // Cargar los likes del post y si no tiene, asignar un cero 
            const likesData = await getLikesForPost(this.postId);
            this.likes = likesData || [];

            this.render(); // Vuelve a renderizar con los datos cargados
        } else {
            console.error("No se ha establecido un ID de post");
        }
    }

    async addComment(comment: string) {
        if (this.postId) {
            await addCommentToPost(this.postId, comment); // Llama a la función para agregar comentario en Firestore
    
            // Después de agregar el comentario, actualiza la lista local de comentarios
            this.loadPostData(); // Recarga los comentarios y likes después de agregar uno nuevo
        } else {
            console.error("No se ha establecido un ID de post");
        }
    }

    // Función para manejar el evento de like
    private toggleLike() {
        const userCredential = localStorage.getItem('user');
        const userId = userCredential ? JSON.parse(userCredential).username : null;
        if (userId) {
            if (this.likes.includes(userId)) {
                removeLike(this.postId, userId); // Si ya le dio like, lo quita
                this.likes = this.likes.filter((like) => like !== userId);
            } else {
                likePost(this.postId, userId); // Si no, lo agrega
                this.likes.push(userId);
            }
            this.render(); // Vuelve a renderizar después de agregar/quitar like
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
                        <span class="author">${this.author}</span>
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
        }
    }
}

customElements.define('post-component', Post);

export default Post;
