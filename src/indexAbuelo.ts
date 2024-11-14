//importar screens
import './pages/main';
import './pages/landing';
import './pages/register';
import './pages/login';
import './pages/profile';
import './Server/externalProfile';
//importar el estado global
import { appState, dispatch } from "./store/store";
//importar observador
import {subscribe} from "./store/store";

class AppContainer extends HTMLElement {


    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        subscribe(this);
    }

    connectedCallback() {
        this.render();
        console.log(appState);
    }

    render () {
        if (this.shadowRoot) this.shadowRoot.innerHTML = '';
        console.log(appState);
        // conditional rendering depending on the global state
        switch (appState.screen) {
            case 'HOME':
                const mainPage = document.createElement('main-page');
                this.shadowRoot?.appendChild(mainPage);
                break;
            case 'LANDING':
                const LandingPage = document.createElement('landing-page');
                this.shadowRoot?.appendChild(LandingPage);
                break;
            case 'REGISTER':
                const RegisterPage = document.createElement('register-page');
                this.shadowRoot?.appendChild(RegisterPage);
                break;
            case 'LOGIN':
                const LoginPage = document.createElement('login-page');
                this.shadowRoot?.appendChild(LoginPage);
                break;
            case 'PROFILE':
                const ProfilePage = document.createElement('profile-page');
                this.shadowRoot?.appendChild(ProfilePage);
                break;
            case 'EXTERNAL_PROFILE':
                const ExternalProfilePage = document.createElement('external-page');
                this.shadowRoot?.appendChild(ExternalProfilePage);
                break;
            default:
                break;
        }
}
}

customElements.define('app-container', AppContainer);
