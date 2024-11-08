import { getCurrentUserId, setUserImage } from "../../utils/firebase";
import { uploadprofileImage } from "../../utils/storageImages";

class ProfileEditor extends HTMLElement {
    private form: HTMLFormElement | null = null;
    private imageInput: HTMLInputElement | null = null;
    private avatarPreview: HTMLDivElement | null = null;

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
                    .editor-container {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 24px;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    h1 {
                        font-size: 24px;
                        margin: 0 0 24px 0;
                        color: #000;
                    }

                    .avatar-section {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-bottom: 32px;
                    }

                    .avatar-preview {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        background-color: #e1e1e1;
                        margin-bottom: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .change-photo-btn {
                        background: none;
                        border: 1px solid #ccc;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #333;
                    }

                    .form-group {
                        margin-bottom: 24px;
                    }

                    label {
                        display: block;
                        margin-bottom: 8px;
                        color: #333;
                        font-weight: 500;
                    }

                    input, textarea {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-size: 16px;
                        box-sizing: border-box;
                    }

                    textarea {
                        min-height: 100px;
                        resize: vertical;
                    }

                    .save-button {
                        background-color: #1a1a1a;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        font-size: 16px;
                        cursor: pointer;
                        float: right;
                    }

                    .save-button:hover {
                        background-color: #333;
                    }

                    #imageInput {
                        display: none;
                    }
                </style>

                <div class="editor-container">
                    <h1>Editar Perfil</h1>
                    
                    <form id="profileForm">
                        <div class="avatar-section">
                            <div class="avatar-preview">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="#666">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </div>
                            <input type="file" id="imageInput" accept="image/*">
                            <button type="button" class="change-photo-btn">
                                📷 Cambiar foto
                            </button>
                        </div>

                        <div class="form-group">
                            <label for="name">Nombre</label>
                            <input type="text" id="name" value="Juan Pérez" required>
                        </div>

                        <div class="form-group">
                            <label for="email">Correo electrónico</label>
                            <input type="email" id="email" value="juan.perez@email.com" required>
                        </div>

                        <div class="form-group">
                            <label for="bio">Biografía</label>
                            <textarea id="bio" required>Entusiasta de la tecnologia y amante de los gatos</textarea>
                        </div>

                        <div class="form-group">
                            <label for="location">Ubicación</label>
                            <input type="text" id="location" value="Madrid, España" required>
                        </div>

                        <button type="submit" class="save-button">Guardar cambios</button>
                    </form>
                </div>
            `;

            this.form = this.shadowRoot.querySelector('#profileForm');
            this.imageInput = this.shadowRoot.querySelector('#imageInput');
            this.avatarPreview = this.shadowRoot.querySelector('.avatar-preview');
        }
    }

    setupEventListeners() {
        this.form?.addEventListener('submit', this.handleSubmit.bind(this));
        
        const changePhotoBtn = this.shadowRoot?.querySelector('.change-photo-btn');
        changePhotoBtn?.addEventListener('click', () => {
            this.imageInput?.click();
        });

        this.imageInput?.addEventListener('change', this.handleImageChange.bind(this));
    }

    async handleImageChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
    
            try {
                // Usa el userId o cualquier otro identificador único del usuario
                const userId = await getCurrentUserId();
                const data = await uploadprofileImage(file, userId);
    
                // Actualiza la vista previa de la imagen con la URL de Cloudinary, evitando la caché
                if (this.avatarPreview) {
                    // Combina la versión y la marca de tiempo para forzar la recarga
                    const imageUrlWithCacheBuster = `${data.secure_url}?v=${data.version}&timestamp=${new Date().getTime()}`;
                    this.avatarPreview.innerHTML = `<img src="${imageUrlWithCacheBuster}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                }
                
                console.log('Imagen subida exitosamente:', data.secure_url);
                setUserImage(userId, data.secure_url);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            }
        }
    }

    async handleSubmit(event: Event) {
        event.preventDefault();
        
        const formData = new FormData(event.target as HTMLFormElement);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            bio: formData.get('bio'),
            location: formData.get('location')
        };

        try {
            // Aquí iría la lógica para guardar los datos
            console.log('Datos a guardar:', userData);
            
            // Emitir evento de actualización
            const updateEvent = new CustomEvent('profile-updated', {
                detail: userData,
                bubbles: true
            });
            this.dispatchEvent(updateEvent);
            
            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            alert('Error al guardar los cambios. Por favor, intenta de nuevo.');
        }
    }
}

customElements.define('profile-editor', ProfileEditor);

export default ProfileEditor;