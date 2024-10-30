class Features extends HTMLElement {
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
                .features {
                    text-align: center;
                    margin: 3rem 0;
                    padding: 3rem 0;
                    background-color: #f9f9f9;
                }
                .features h2 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }
                .features p {
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                }
                .feature p {
                    font-size: 1rem;
                }
                .features-grid {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;

                }
                @media (max-width: 768px) {
                .features-grid {
                    flex-direction: column;
                    align-items: center;
                }
                }
            </style>
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
            `
    
        }
}
}

customElements.define('features-landing', Features);