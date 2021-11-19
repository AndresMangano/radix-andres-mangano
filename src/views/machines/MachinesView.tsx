import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../helpers/http.helpers";
import { deleteMachine, getMachines } from "../../api/machines";
import { Table } from "../../controls/Table";

export function MachinesView() {
    const history = useHistory();
    const [machines, refreshMachines] = useRefresh(() => getMachines(), []);


    function handleDeleteRow (machineId: number) {
        if (window.confirm('¿Está seguro que quiere desactivar el sector?')) {
            deleteMachine(machineId)
            .then(() => refreshMachines());
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Sectores'>
                        En está pantalla se registran los sectores productivos de la planta.
                        En caso de que exista un grupo de máquinas muy similares abocadas al mismo proceso pueda que sea conveniente declararas en el sistema como un solo sector.
                        <i> Ej. Estampado, Roscado, etc.</i>
                        <br /><br />
                        - Registrar un sector
                        <ol>
                            <li>Hacer click en el botón <strong>Registrar Sector</strong></li>
                            <li>Completar el formulario</li>
                        </ol>
                        - Modificar los datos de un sector
                        <ol>
                            <li>Hacer click en la columna <strong>ID</strong> correspondiente al sector que se desea modificar.</li>
                        </ol>
                        - Eliminar un sector
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> en la fila correspondiente al sector que desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/machines/register')}>Registrar Sector</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'machineId',
                            Cell: ({row}) => 
                                <Link to={`/machine/${row.original.machineId}`}>{row.original.machineId}</Link>,
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
                                <button className='danger' onClick={() => handleDeleteRow(row.original.machineId)}>
                                    <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                </button>,
                        }
                    ]}
                        data={machines === undefined ? [] : machines}  
                    />
                </section>
            </div>
        </div>
    )
}