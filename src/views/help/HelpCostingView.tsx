import React from "react";
import { Link } from "react-router-dom";

export function HelpCostingView() {
    return (
        <div>
            <div>
                <Link to='/help'>Regresar</Link>
                <header>
                    <h1>Cálculo de Costos</h1>
                </header>
            </div>
        </div>
    );
}