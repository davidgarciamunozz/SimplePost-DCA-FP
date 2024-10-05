//importar screens
import './pages/main';
import './pages/landing';
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
            case 'home':
                const mainPage = document.createElement('main-page');
                this.shadowRoot?.appendChild(mainPage);
                break;
            case 'landing':
                const LandingPage = document.createElement('landing-page');
                this.shadowRoot?.appendChild(LandingPage);
                break;
            default:
                break;
        }
}
}

customElements.define('app-container', AppContainer);
