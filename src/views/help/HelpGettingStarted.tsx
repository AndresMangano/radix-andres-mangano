import React from "react";
import { Link } from "react-router-dom";

export function HelpGettingStartedView() {
    return (
        <div>
            <div>
                <Link to='/help'>Regresar</Link>
                <header>
                    <h1>Como poner a punto el sistema</h1>
                </header>
                <section>
                    <h3>Autenticación</h3>
                    <p>
                        El primer paso es garantizar el acceso a los usuarios autorizados a utilizar el sistema.
                    </p>

                    <h3>Datos Maestros</h3>
                    <p>
                        El segundo paso es comenzar a cargar los datos maestros necesarios para el cálculo de costos.
                        Este tipo de datos no suele variar con demasiada frecuencia y se encuentran en el menú izquierdo <strong>Datos Maestros</strong>
                    </p>
                    <p>
                        El siguiente es el orden aconsejado para comenzar a cargar los datos maestros
                    </p>
                    <ol>
                        <li>Registrar los posibles tipos de <Link to='/labors'>mano de obra</Link> directa.</li>
                        <li>Registrar los <Link to='/employees'>empleados</Link> MOD de la planta junto con el historial de sus salarios.</li>
                        <li>Registrar los <Link to='/machines'>sectores productivos</Link> que se encuentran en la planta.</li>
                        <li>Crear los <Link to='/cost-pools'>centros de costo</Link> a los que se asignaran los gastos de empresa.</li>
                        <li>Registrar las <Link to='/accounts'>cuentas</Link> de gastos que tiene la empresa.</li>
                        <li>Registrar los <Link to='/materials'>materiales</Link> que maneja la planta.</li>
                        <li>Registrar los <Link to='/customers'>clientes</Link> a los que le vende la empresa.</li>
                    </ol>

                    <h3>Transacciones</h3>
                    <p>
                        Una vez configurados los datos maestros se puede proceder a cargar los que que variaran con mas frecuencia como los
                        <Link to='/barches'> lotes de producción</Link> y los <Link to='/expenses'>gastos</Link> de la compañía.
                        La frecuencia con que se carguen estos datos dependerá del nivel de detalle que se necesite para el cálculo de costos.
                    </p>
                </section>
            </div>
        </div>
    );
}