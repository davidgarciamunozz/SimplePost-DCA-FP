import { dispatch } from "../store/store";
import { navigate } from "../store/actions";
import { registerUser } from "../utils/firebase";

class RegisterPage extends HTMLElement {
    private formData: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.formData = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
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
                // console.log(`Valor capturado para ${target.name}:`, target.value);
            });
        });

        form?.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            if (this.validateForm()) {
                try {
                    console.log("Datos enviados al registrar usuario:", this.formData);
                    const success = await registerUser({
                        email: this.formData.email,
                        password: this.formData.password,
                        username: this.formData.username
                    });

                    if (success) {
                        alert('Registro exitoso!');
                        // Navegar a otra página o realizar otra acción
                        dispatch(navigate("LOGIN"));
                    } else {
                        alert('Hubo un error en el registro.');
                    }
                } catch (error) {
                    console.error("Error en el registro:", error);
                    alert("Error en el registro. Intenta nuevamente.");
                }
            }
        });
    }

    private validateForm(): boolean {
        if (this.formData.password !== this.formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return false;
        }
        return true;
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
                            <p class="subtitle">Crea una cuenta y comienza a compartir tus ideas</p>
                        </div>

                        <form>
                            <div class="form-group">
                                <label for="username">Nombre de usuario</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username" 
                                    placeholder="Tu nombre de usuario"
                                    required
                                >
                            </div>

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

                            <div class="form-group">
                                <label for="confirmPassword">Confirmar contraseña</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    required
                                >
                            </div>

                            <button type="submit">Registrarse</button>
                        </form>
                    </div>

                    <div class="footer">
                        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                    </div>
                </div>
            `;
        }
    }
}

customElements.define('register-page', RegisterPage);