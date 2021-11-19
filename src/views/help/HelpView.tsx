import { Link } from "react-router-dom";

export function HelpView() {
    return (
        <div>
            <div>
                <header>
                    <h1>Bienvenido a radiX</h1>
                </header>
                <section>
                    <p>
                        El propósito principal del sistema <strong>radiX</strong> es costear los distintos productos que fabrica la empresa, <br />
                        tanto para realizar un análisis interno como para enviar una apertura de costos a sus clientes.
                    </p>
                    <p>A continuación se encuentran varios tutoriales de utilidad para comenzar a usar el sistema.</p>
                    <h3>
                        <Link to='/help/controls'>1. Controles básicos</Link>
                    </h3>
                    <h3>
                        <Link to='/help/getting-started'>2. Puesta a punto del sistema</Link>
                    </h3>
                    <h3>
                        <Link to='/help/costing'>3. Cálculo de costos</Link>
                    </h3>
                </section>
            </div>
        </div>
    );
}