import { getCurrentUserName } from "../../utils/firebase";

class ProfileCard extends HTMLElement {
    private userData: {
        name: string;
        bio: string;
        email: string;
        location: string;
    } | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // Simular obtención de datos del usuario
        this.userData = {
            name: await getCurrentUserName(),
            bio: "Entusiasta de la tecnologia y amante de los gatos",
            email: "juan.perez@email.com",
            location: "Madrid, España"
        };
        this.render();
        this.setupEventListeners();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    .profile-card {
                        font-family: Arial, sans-serif;
                        border-radius: 12px;
                        background-color: white;
                        padding: 24px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        margin-bottom: 20px;
                    }
                    .profile-header {
                        display: flex;
                        gap: 24px;
                        align-items: flex-start;
                        margin-bottom: 20px;
                    }
                    .avatar {
                        width: 80px;
                        height: 80px;
                        background-color: #e1e1e1;
                        border-radius: 50%;
                    }
                    .profile-info {
                        flex-grow: 1;
                    }
                    .profile-name {
                        font-size: 32px;
                        font-weight: bold;
                        margin: 0 0 8px 0;
                        color: #000;
                    }
                    .profile-bio {
                        font-size: 18px;
                        color: #666;
                        margin: 0 0 16px 0;
                    }
                    .profile-details {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        margin-bottom: 20px;
                    }
                    .detail-item {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 16px;
                        color: #333;
                    }
                    .edit-button {
                        background-color: #1a1a1a;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 12px 24px;
                        font-size: 16px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .edit-button:hover {
                        background-color: #333;
                    }
                    .icon {
                        width: 20px;
                        height: 20px;
                    }
                </style>
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="avatar"></div>
                        <div class="profile-info">
                            <h1 class="profile-name">${this.userData?.name || 'Cargando...'}</h1>
                            <p class="profile-bio">${this.userData?.bio || ''}</p>
                            <div class="profile-details">
                                <div class="detail-item">
                                    <span class="icon">✉️</span>
                                    ${this.userData?.email || ''}
                                </div>
                                <div class="detail-item">
                                    <span class="icon">📍</span>
                                    ${this.userData?.location || ''}
                                </div>
                            </div>
                            <button class="edit-button">
                                <span class="icon">⚙️</span>
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        const editButton = this.shadowRoot?.querySelector('.edit-button');
        editButton?.addEventListener('click', () => {
            // Implementar lógica de edición aquí
            console.log('Editar perfil clicked');
        });
    }
}

customElements.define('profile-card', ProfileCard);

export default ProfileCard;