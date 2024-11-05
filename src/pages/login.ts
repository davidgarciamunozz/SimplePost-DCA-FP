import { navigate } from "../store/actions";
import { dispatch } from "../store/store";
import { loginUser } from "../utils/firebase";

class LoginPage extends HTMLElement {
    private formData: {
        email: string;
        password: string;
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.formData = {
            email: '',
            password: '',
        };
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        const form = this.shadowRoot?.querySelector('form');
        const inputs = this.shadowRoot?.querySelectorAll('input');

        inputs?.forEach(input => {
            input.addEventListener('input', (e: Event) => {
                const target = e.target as HTMLInputElement;
                this.formData[target.name as keyof typeof this.formData] = target.value;
            });
        });

        form?.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            console.log('Form data:', this.formData);
            try {
                await loginUser(this.formData.email, this.formData.password);
            } catch (error:any) {
                console.error(error.message);
            }
        });
    }

    private render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background-color: #f5f5f5;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                    }

                    .container {
                        max-width: 400px;
                        margin: 0 auto;
                        padding: 2rem 1rem;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    }

                    .card {
                        background: white;
                        border-radius: 8px;
                        padding: 2rem;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }

                    .header {
                        text-align: center;
                        margin-bottom: 2rem;
                    }

                    .logo-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        margin-bottom: 1rem;
                    }

                    .logo-text {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }

                    .subtitle {
                        color: #666;
                        font-size: 0.875rem;
                        margin: 0;
                    }

                    .form-group {
                        margin-bottom: 1.5rem;
                    }

                    label {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-size: 0.875rem;
                        font-weight: 500;
                    }

                    input {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 1rem;
                        box-sizing: border-box;
                    }

                    input:focus {
                        outline: none;
                        border-color: #000;
                    }

                    input::placeholder {
                        color: #999;
                    }

                    button {
                        width: 100%;
                        padding: 0.75rem;
                        background: #000;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        font-size: 0.875rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }

                    button:hover {
                        background: #333;
                    }

                    .footer {
                        text-align: center;
                        margin-top: 1rem;
                        font-size: 0.875rem;
                        color: #666;
                    }

                    .footer a {
                        color: #000;
                        text-decoration: none;
                        font-weight: 500;
                    }

                    .footer a:hover {
                        text-decoration: underline;
                    }
                    #redirect {
                    cursor: pointer;
                    color: #000;
                    }

                    @media (min-width: 768px) {
                        .container {
                            padding-top: 4rem;
                        }
                    }
                </style>

                <div class="container">
                    <div class="card">
                        <div class="header">
                            <div class="logo-container">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span class="logo-text">SimplePost</span>
                            </div>
                            <p class="subtitle">Inicia Sesión y comparte tus ideas con amigos </p>
                        </div>

                        <form>

                            <div class="form-group">
                                <label for="email">Correo electrónico</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="tu@email.com"
                                    required
                                >
                            </div>

                            <div class="form-group">
                                <label for="password">Contraseña</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password"
                                    required
                                >
                            </div>

                            <button type="submit">Iniciar Sesión</button>
                        </form>
                    </div>

                    <div class="footer">
                        Aún no tienes una cuenta? <span id='redirect'>Regístrate</span>
                    </div>
                </div>
            `;
            // Redirect to register page
            const redirect = this.shadowRoot.querySelector('#redirect');
            redirect?.addEventListener('click', () => {
                dispatch(navigate('REGISTER'));
            })
        }
    }
}

customElements.define('login-page', LoginPage);