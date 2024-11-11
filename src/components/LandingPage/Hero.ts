//importar el estado global
import { appState, dispatch } from "../../store/store";
//importar la acción para cambiar de pantalla
import { navigate } from "../../store/actions";

class HeroLanding extends HTMLElement {
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
                .hero {
                    text-align: center;
                    padding: 5rem 0;
                    margin-top: 2rem;
                }
            </style>
            <section class="hero">
                <h1>Comparte tus pensamientos en SimplePost</h1>
                <p>Una plataforma simple para compartir ideas, reaccionar y comentar. Conéctate de manera sencilla.</p>
                <a href="#" class="button" id="register">Únete ahora</a>
                <a href="#" id="go-to-main" class="button secondary">Explora posts</a>
            </section>
            `
            const goToMainButton = this.shadowRoot.querySelector('#go-to-main');
            goToMainButton?.addEventListener('click', () => {
                dispatch(navigate('HOME'));
            });
            const registerButton = this.shadowRoot.querySelector('#register');
            registerButton?.addEventListener('click', () => {
                dispatch(navigate('REGISTER'));
            });
        }
}
}

customElements.define('hero-landing', HeroLanding);