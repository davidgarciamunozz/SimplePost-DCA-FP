class PostCreator extends HTMLElement {
    private textArea: HTMLTextAreaElement | null = null;
    private submitButton: HTMLButtonElement | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    .post-creator {
                        font-family: Arial, sans-serif;
                        border: 1px solid #e1e1e1;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        padding: 16px;
                        background-color: white;
                    }
                    .post-creator-header {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 12px;
                    }
                    .author-input {
                        width: 100%;
                        padding: 8px;
                        margin-bottom: 12px;
                        border: 1px solid #e1e1e1;
                        border-radius: 4px;
                        font-size: 14px;
                    }
                    .post-textarea {
                        width: 97%;
                        height: 100px;
                        padding: 8px;
                        margin-bottom: 12px;
                        border: 1px solid #e1e1e1;
                        border-radius: 4px;
                        resize: vertical;
                        font-size: 14px;
                        font-family: Arial, sans-serif;
                    }
                    .submit-button {
                        background-color: black;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 8px 16px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    .submit-button:hover {
                        background-color: #1565c0;
                    }
                    @media (max-width: 600px) {
                        .post-creator {
                            padding: 12px;
                        }
                        .post-creator-header {
                            font-size: 16px;
                        }
                        .author-input,
                        .post-textarea {
                            font-size: 12px;
                        }
                        .submit-button {
                            width: 100%;
                        }
                    }
                </style>
                <div class="post-creator">
                    <div class="post-creator-header">Crear nuevo post</div>
                    <textarea class="post-textarea" placeholder="¿Qué estas pensando?"></textarea>
                    <button class="submit-button">Publicar</button>
                </div>
            `;

            this.textArea = this.shadowRoot.querySelector('.post-textarea');
            // this.authorInput = this.shadowRoot.querySelector('.author-input');
            this.submitButton = this.shadowRoot.querySelector('.submit-button');
        }
    }

    setupEventListeners() {
        this.submitButton?.addEventListener('click', this.handleSubmit.bind(this));
    }

    handleSubmit() {
        const comment = this.textArea?.value;
        const author = 'test user'; // Autor predeterminado por ahora

        if ( comment) {
              // Emitir evento personalizado con los datos del nuevo post
              const newPostEvent = new CustomEvent('new-post', {
                detail: { comment, author },
                bubbles: true, // Permitir que el evento se propague al shadow DOM
            });

            this.dispatchEvent(newPostEvent);

            // Limpiar textarea después de publicar
            if (this.textArea) this.textArea.value = '';
        } else {
            alert('Por favor, escribe algo antes de publicar');
        }
    }
}

customElements.define('post-creator', PostCreator);

export default PostCreator;