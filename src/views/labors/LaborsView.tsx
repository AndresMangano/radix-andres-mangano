import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../helpers/http.helpers";
import { deleteLabor, getLabors } from "../../api/labors";
import { Table } from "../../controls/Table";

export function LaborsView() {
    const history = useHistory();
    const [labors, refreshLabors] = useRefresh(() => getLabors(), []);
    

    function handleDeleteRow (laborId: number) {
        if (window.confirm('¿Está seguro que quiere remover la mano de obra?')) {
            deleteLabor(laborId)
            .then(() => refreshLabors());
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Mano de Obra'>
                        En esta sección se detallan las posibles categorías de MOD, tanto para asociarlas a los empleados como a los procesos de fabricación.
                        Algunos ejemplos podrían ser: <i>Operario, Operario Calificado, etc</i>.
                        <br /><br />
                        - Registrar una nueva categoría:
                        <ol>
                            <li>Hacer click en el botón <strong>Registrar Tipo de MOD</strong>.</li>
                            <li>Completar el formulario.</li>
                        </ol>
                        - Desactivar una categoría:
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> de la tabla correspondiente a la categoría que se desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/labors/register')}>Registrar Tipo de MOD</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'laborId',
                            Cell: ({row}) => 
                                <Link to={`/labor/${row.original.laborId}`}>{row.original.laborId}</Link>,
                        },
                        {
                            Header: 'Descripción',
                            accessor: 'description'
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.laborId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={labors === undefined ? [] : labors}  
                    />
                </section>
            </div>
        </div>
    )
}