class CTA extends HTMLElement {
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
                h2 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                .cta p {
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
                .cta {
                    text-align: center;
                    padding: 2rem 0;
                }
            </style>
           <section class="cta">
                <h2>Únete a SimplePost hoy</h2>
                <p>Comienza a compartir y conectar con otros de manera simple y directa.</p>
                <form>
                    <input type="email" placeholder="Ingresa tu email" required>
                    <button type="submit" class="button">Registrarse</button>
                </form>
            </section>
            `
    
        }
}
}

customElements.define('cta-landing', CTA);