import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import { Aside } from "../../controls/Aside";

export function HelpControlsView() {
    return (
        <div>
            <div>
                <Link to='/help'>Regresar</Link>
                <header>
                    <h1 id='controles-basicos'>Controles Básicos</h1>
                </header>
                <section>
                    <p>
                        En esta sección se explica en detalle los principales controles que contiene la aplicación.
                        A partir de aquí se utiliza la palabra <strong>Entidad</strong> para referirse a cualquier tipo de datos de forma general,
                        como por ejemplo: <i>Lotes de producción, Gastos, Empleados, Materiales, etc.</i>
                    </p>

                    <h3 id='panel-izquierdo'>Panel de navegación izquierdo</h3>
                    <img src='/assets/help/datos_maestros_menu.png' alt='Datos maestros' width='400px'/>
                    <p>Desde el panel izquierdo se accede a las distintas secciones del sistema.</p>
                    
                    <h3 id='tablas'>Tablas</h3>
                    <img src='/assets/help/table.png' alt='Datos maestros' width='700px'/>
                    <p>
                        En éstas tablas se puede visualizar la información que contiene el sistema.
                        En algunos casos se puede ingresar a los detalles de la entidad haciendo click en el valor de la columna <strong>ID</strong>
                        , <i>en éste ejemplo: 2</i>.
                    </p>
                    <p>
                        Es posible eliminar una entidad haciendo click en el ícono <FontAwesomeIcon icon={faTrashAlt} />. 
                        En el caso de las celdas con texto de color azúl <i>(ej: Estampado, Tornillo)</i>, al hacer click sobre ellas se puede acceder a los detalles de las mismas.
                    </p>
                    <p>
                        Por encima de las columnas se encuentran los <strong>botones de acción</strong> que permiten realizar distintas acciones no asociadas a ningúna entidad en particular, <i>ej. registrar una nueva</i>.
                    </p>
                    <h3 id='formularios'>Formularios</h3>
                    <img src='/assets/help/form.png' alt='Formularios' width='400px'/>
                    <p>
                        Sirven para cargar información en el sistema.
                    </p>
                    <h3 id='pestañas'>Pestañas</h3>
                    <img src='/assets/help/tabs.png' alt='Pestañas' width='1000px'/>
                    <p>
                        Algunas pantallas mas complejas pueden contener pestañas como en el ejemplo de arriba: <strong>Componentes, Sectores, Precios, Costos</strong> con las que se puede navegar por las distintas secciones.
                    </p>
                    <h3 id='barra-de-navegacion'>Barra de Navegación</h3>
                    <img src='/assets/help/header.png' alt='Barra de Navegación' width='400px'/>
                    <p>
                        Con la barra de navegación se puede regresar al sitio anterior mas fácilmente. 
                        En el ejemplo de arriba, en la pantalla del material <strong>#10</strong>, se puede volver al listado de materiales haciendo click en el link <strong>Materiales</strong>
                    </p>
                    <h3 id='tooltip'>Tooltip</h3>
                    <p>
                        Posicionar el mouse sobre el nombre del campo para ver información del mismo.
                    </p>
                    <img src='/assets/help/tooltip.png' alt='Tooltip' width='400px'/>
                    <h3 id='informacion'>Información</h3>
                    <p>
                        Para ver información e instrucciones de la sección deseada hacer click en el botón <FontAwesomeIcon icon={faInfoCircle} />.
                    </p>
                    <img src='/assets/help/information.png' alt='i' width='800px'/>
                    <h3 id='cerrar-sesion'>Cerrar Sesión</h3>
                    <img src='/assets/help/logout.png' alt='Cerrar Sesión' width='400px'/>
                    <p>
                        Para cerrar sesión en la aplicación hay que dirigirse a la parte superior derecha de la pantalla y posicionar el mouse encima de nuestro mail, para luego seleccionar la opción <strong>Cerrar Sesión</strong>.
                    </p>
                </section>
            </div>
            <div>
                <Aside sections={[
                    { label: 'Controles Básicos', link: '#controles-basicos' },
                    { label: 'Panel Izquierdo', link: '#panel-izquierdo' },
                    { label: 'Tablas', link: '#tablas' },
                    { label: 'Formularios', link: '#formularios' },
                    { label: 'Pestañas', link: '#pestañas' },
                    { label: 'Barra de Navegación', link: '#barra-de-navegacion' },
                    { label: 'Tooltip', link: '#tooltip' },
                    { label: 'Información', link: '#informacion' },
                    { label: 'Cerrar Sesión', link: '#cerrar-sesion' },
                ]} />
            </div>
        </div>
    );
}