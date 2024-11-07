//importar el estado global, el dispatch y el subscribe
import { appState,  dispatch } from "../../store/store";
//importar la acción para cambiar de pantalla
import { navigate } from "../../store/actions";
import { logoutUser } from "../../utils/firebase";

class Navbar extends HTMLElement {
    
    // declaracion de propiedad en una clase de typescript, propiedad privada
    // Encapsulamiento de datos
    private mobileMenuOpen: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        console.log(appState);
    }

    addEventListeners() {
        const menuToggle = this.shadowRoot?.querySelector('.menu-toggle');
        menuToggle?.addEventListener('click', () => this.toggleMobileMenu());
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        this.render();
        this.addEventListeners(); 
        console.log(this.mobileMenuOpen);
    }

    render() {
        if (this.shadowRoot) {
            const isLandingScreen = appState.screen === 'landing';

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 1000;
                    }
                    .nav-container{
                        background-color: white;
                        box-shadow: ${isLandingScreen ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
                    }
                    .navbar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1rem 1rem;
                        max-width: 1200px;
                        margin: 0 auto;
                        background-color: white;
                    }
                    .logo {
                        display: flex;
                        align-items: center;
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #333;
                        text-decoration: none;
                    }
                    .logo-icon {
                        width: 24px;
                        height: 24px;
                        margin-right: 0.5rem;
                        border: 2px solid #333;
                        border-radius: 4px;
                    }
                    .nav-buttons {
                        display: flex;
                        gap: 1rem;

                    }
                    .nav-button {
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 1rem;
                        color: #333;
                        display: flex;
                        align-items: center;
                        text-decoration: none;
                    }
                    .nav-button:hover {
                        text-decoration: none;
                    }
                    .icon {
                        width: 20px;
                        height: 20px;
                        margin-right: 0.5rem;
                    }
                    .menu-toggle {
                        display: none;
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 1.5rem;
                    }
                    @media (max-width: 768px) {
                        .nav-buttons {
                            display: ${this.mobileMenuOpen ? 'flex' : 'none'};
                            flex-direction: column;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            right: 0;
                            background-color: white;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            padding: 1rem;
                        }
                        .menu-toggle {
                            display: block;
                        }
                    }
                </style>
                <div class="nav-container">
                <nav class="navbar">
                    <div class="logo">
                        <div class="logo-icon"></div>
                        SimplePost
                    </div>
                    <button class="menu-toggle">☰</button>
                    <div class="nav-buttons">
                    ${isLandingScreen 
                        ? `
                        <button class="nav-button" id="iniciar-sesion">
                            Iniciar Sesión
                        </button>
                        <button class="nav-button" id="registrarse">
                            Registrarse
                        </button>`
                        : `
                        <button class="nav-button" id="perfil">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Mi Perfil
                        </button>
                        <button class="nav-button" id="cerrar-sesion">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Cerrar Sesión
                        </button>`}
                    </div>
                </nav>
                </div>
            `;

            // Evento para cerrar sesión con Firebase
            const logoutButton = this.shadowRoot.querySelector('#cerrar-sesion');
            logoutButton?.addEventListener('click', async () => {
                await logoutUser();
            });
        

            // Evento para cambiar de pantalla
            const perfilButton = this.shadowRoot.querySelector('#perfil');
            perfilButton?.addEventListener('click', () => {
                dispatch(navigate('PROFILE'));
                console.log(appState);
            }
                
        );
        }
    }
}

customElements.define('navbar-component', Navbar);

export default Navbar;