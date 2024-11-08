import { addPost, getCurrentUserName } from "../../utils/firebase";
import { uploadImage } from "../../utils/storageImages";

class PostCreator extends HTMLElement {
    private textArea: HTMLTextAreaElement | null = null;
    private submitButton: HTMLButtonElement | null = null;
    private fileInput: HTMLInputElement | null = null;
    private addPhotoButton: HTMLButtonElement | null = null;
    private selectedFile: File | null = null;

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
                    .add-photo-button {
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .file-input {
                        display: none;
                    }
                    .actions {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    @media (max-width: 600px) {
                        .post-creator {
                            padding: 12px;
                        }
                        .post-creator-header {
                            font-size: 16px;
                        }
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
                    <div class="actions">
                        <button class="add-photo-button" title="Añadir foto">📷</button>
                        <button class="submit-button">Publicar</button>
                    </div>
                    <input type="file" class="file-input" accept="image/*">
                </div>
            `;

            this.textArea = this.shadowRoot.querySelector('.post-textarea');
            this.submitButton = this.shadowRoot.querySelector('.submit-button');
            this.fileInput = this.shadowRoot.querySelector('.file-input');
            this.addPhotoButton = this.shadowRoot.querySelector('.add-photo-button');
        }
    }

    setupEventListeners() {
        this.submitButton?.addEventListener('click', this.handleSubmit.bind(this));
        this.addPhotoButton?.addEventListener('click', this.handleAddPhotoClick.bind(this));
        this.fileInput?.addEventListener('change', this.handleFileSelect.bind(this));
    }

    handleAddPhotoClick() {
        this.fileInput?.click();
    }

    handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            this.selectedFile = target.files[0];
            this.addPhotoButton!.textContent = '📷✓'; // Cambiar el icono para indicar que se ha seleccionado una imagen
        }
    }

    async handleSubmit() {
        const comment = this.textArea?.value;
        const author = getCurrentUserName();
        let imageURL = '';
    
        if (comment) {
            try {
                // Si hay un archivo seleccionado, súbelo a Firebase y obtén la URL
                if (this.selectedFile) {
                    const imageData = await uploadImage(this.selectedFile); // Añade esta función en Firebase
                    imageURL = imageData.secure_url;
                }
    
                // Emitir evento personalizado con los datos completos del post
                const newPostEvent = new CustomEvent('new-post', {
                    detail: { comment, author, likes: 0, imageURL },
                    bubbles: true,
                });
                this.dispatchEvent(newPostEvent);
    
                // Limpiar el textarea y resetear la selección de archivo después de publicar
                if (this.textArea) this.textArea.value = '';
                this.selectedFile = null;
                if (this.addPhotoButton) this.addPhotoButton.textContent = '📷';
                if (this.fileInput) this.fileInput.value = '';
            } catch (error) {
                console.error("Error al publicar el post:", error);
                alert("Hubo un error al publicar tu post. Por favor, intenta de nuevo.");
            }
        } else {
            alert('Por favor, escribe algo antes de publicar');
        }
    }
    
}

customElements.define('post-creator', PostCreator);

export default PostCreator;