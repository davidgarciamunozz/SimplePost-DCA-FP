export enum PostType {
    POST = 'post',
    COMMENT = 'comment'
}

class Post extends HTMLElement {
    private comment: string = '';
    private author: string = '';
    private likes: number = 0;
    private comments: string[] = [];

    static get observedAttributes() {
        return ['comment', 'author', 'likes'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
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
                    this.likes = parseInt(newValue, 10);
                    break;
            }
            this.render();
        }
    }

    // addComment(comment: string) {
    //     this.comments.push(comment);
    //     this.render();
    // }

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
                </style>
                <div class="post">
                    <div class="post-header">
                        <div class="avatar">${this.author[0]}</div>
                        <span class="author">${this.author}</span>
                    </div>
                    <div class="comment">${this.comment}</div>
                    <div class="actions">
                        <button class="action-button">
                            👍 ${this.likes}
                        </button>
                        <button class="action-button">
                            💬 ${this.comments.length}
                        </button>
                    </div>
                    <div class="comments">
                        ${this.comments.map(comment => `<div class="comment">${comment}</div>`).join('')}
                    </div>
                    <input type="text" class="comment-input" placeholder="Escribe un comentario...">
                </div>
            `;

            // const commentInput = this.shadowRoot.querySelector('.comment-input');
            // commentInput?.addEventListener('keypress', (event: KeyboardEvent) => {
            //     if (event.key === 'Enter') {
            //         const input = event.target as HTMLInputElement;
            //         this.addComment(input.value);
            //         input.value = '';
            //     }
            // });
        }
    }
}

customElements.define('post-component', Post);

export default Post;