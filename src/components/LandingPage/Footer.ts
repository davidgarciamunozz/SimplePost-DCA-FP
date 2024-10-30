class Footer extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }
    
    render () {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <style>
            footer {
                background-color: #f7f7f7;
                padding: 1rem;
                text-align: center;
                margin-top: 2rem;
                display: flex;
                justify-content: space-between;
                padding: 0 5rem;
            }
            footer p {
                font-size: 0.8rem;
            }
            </style>
            <footer>
                <p>&copy; 2023 SimplePost. Todos los derechos reservados.</p>
                <p>
                    <a href="#">Términos de Servicio</a> |
                    <a href="#">Privacidad</a>
                </p>
            </footer>
            `
    }
}
}

customElements.define('footer-landing', Footer);