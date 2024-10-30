//importar el estado global y el dispatch
import { appState, dispatch } from "../store/store";
//importar accion para cambiar de pantalla
import { navigate } from "../store/actions";
//importar el componente de navegacion
import '../components/navigation/NavBar';
//importar componentes de landing
import '../components/LandingPage/Hero';
import '../components/LandingPage/Features';
import '../components/LandingPage/CTA';
import '../components/LandingPage/Footer';

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
                    
                    @media (max-width: 768px) {
                        .hero h1 {
                            font-size: 2rem;
                        }
                    }
                </style>
                <div class="container">
                    <navbar-component></navbar-component>
                    <hero-landing></hero-landing>
                    <features-landing></features-landing>
                    <cta-landing></cta-landing>
                    <footer-landing></footer-landing>
                    
                </div>
            `;
            const goToMainButton = this.shadowRoot.querySelector('#go-to-main');
            goToMainButton?.addEventListener('click', () => {
                dispatch(navigate('HOME'));
            });
        }
    }
}

customElements.define('landing-page', LandingPage);