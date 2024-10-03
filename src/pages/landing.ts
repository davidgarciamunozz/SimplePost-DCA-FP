class LandingPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        font-family: Arial, sans-serif;
                        color: #000;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 20px;
                    }
                    header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1rem;
                    }
                    .logo {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }
                    nav ul {
                        display: flex;
                        list-style: none;
                        padding: 0;
                    }
                    nav ul li {
                        margin-left: 1rem;
                    }
                    a {
                        text-decoration: none;
                        color: #000;
                    }
                    .hero {
                        text-align: center;
                        padding: 3rem 0;
                    }
                    h1 {
                        font-size: 2.5rem;
                        margin-bottom: 1rem;
                    }
                    .hero p {
                        font-size: 1.2rem;
                        margin-bottom: 2rem;
                    }
                    .button {
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        background-color: #000;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 0 0.5rem;
                    }
                    .button.secondary {
                        background-color: #fff;
                        color: #000;
                        border: 1px solid #000;
                    }
                    .features {
                        background-color: #f4f4f4;
                        padding: 3rem 0;
                        text-align: center;
                    }
                    .features-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 2rem;
                        margin-top: 2rem;
                    }
                    .feature-icon {
                        font-size: 2rem;
                        margin-bottom: 1rem;
                    }
                    .cta {
                        text-align: center;
                        padding: 3rem 0;
                    }
                    input[type="email"] {
                        padding: 0.5rem;
                        width: 100%;
                        max-width: 300px;
                        margin-bottom: 1rem;
                    }
                    footer {
                        background-color: #f4f4f4;
                        text-align: center;
                        padding: 1rem 0;
                        margin-top: 2rem;
                    }
                    @media (max-width: 768px) {
                        .hero h1 {
                            font-size: 2rem;
                        }
                        .features-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
                <div class="container">
                    <header>
                        <div class="logo">SimplePost</div>
                        <nav>
                            <ul>
                                <li><a href="#">Acerca de</a></li>
                                <li><a href="#">Contacto</a></li>
                            </ul>
                        </nav>
                    </header>
                    <main>
                        <section class="hero">
                            <h1>Comparte tus pensamientos en SimplePost</h1>
                            <p>Una plataforma simple para compartir ideas, reaccionar y comentar. Conéctate de manera sencilla.</p>
                            <a href="#" class="button">Únete ahora</a>
                            <a href="#" class="button secondary">Explora posts</a>
                        </section>
                        <section class="features">
                            <h2>Características simples, gran impacto</h2>
                            <p>Descubre cómo SimplePost te ayuda a conectar de manera efectiva</p>
                            <div class="features-grid">
                                <div class="feature">
                                    <div class="feature-icon">✉️</div>
                                    <h3>Publica posts</h3>
                                    <p>Comparte tus ideas y pensamientos con la comunidad.</p>
                                </div>
                                <div class="feature">
                                    <div class="feature-icon">👍</div>
                                    <h3>Reacciona</h3>
                                    <p>Muestra tu aprecio por los posts que te gustan.</p>
                                </div>
                                <div class="feature">
                                    <div class="feature-icon">💬</div>
                                    <h3>Comenta</h3>
                                    <p>Participa en conversaciones y comparte tu opinión.</p>
                                </div>
                            </div>
                        </section>
                        <section class="cta">
                            <h2>Únete a SimplePost hoy</h2>
                            <p>Comienza a compartir y conectar con otros de manera simple y directa.</p>
                            <form>
                                <input type="email" placeholder="Ingresa tu email" required>
                                <button type="submit" class="button">Registrarse</button>
                            </form>
                        </section>
                    </main>
                    <footer>
                        <p>&copy; 2023 SimplePost. Todos los derechos reservados.</p>
                        <p>
                            <a href="#">Términos de Servicio</a> |
                            <a href="#">Privacidad</a>
                        </p>
                    </footer>
                </div>
            `;
        }
    }
}

customElements.define('landing-page', LandingPage);

export default LandingPage;