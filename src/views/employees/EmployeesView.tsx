import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../helpers/http.helpers";
import { deleteEmployee, getEmployees } from "../../api/employees";
import { Table } from "../../controls/Table";

export function EmployeesView() {
    const history = useHistory();
    const [employees, refreshEmployees] = useRefresh(() => getEmployees({}), []);

    function handleDeleteRow (employeeId: number) {
        if (window.confirm('¿Está seguro que quiere remover el empleado?')) {
        deleteEmployee(employeeId)
            .then(() => refreshEmployees());
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Empleados'>
                        Aquí se gestionan los empleados MOD de la fábrica junto con el historial de sus salarios.
                        <br /><br />
                        - Registrar un nuevo empleado:
                        <ol>
                            <li>Hacer click en el botón <strong>Registrar Empleado</strong></li>
                            <li>Completar el formulario</li>
                        </ol>
                        - Modificar los datos de un empleado:
                        <ol>
                            <li>Hacer click en el <strong>ID</strong> correspondiente al empleado que se desea modificar.</li>
                        </ol>
                        - Remover un empleado existente:
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> de la fila correspondiente al empleado que se desea borrar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/employees/register')}>Registrar Empleado</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'employeeId',
                            Cell: ({row}) => 
                            <Link to={`/employee/${row.original.employeeId}`}>{row.original.employeeId}</Link>,
                        },
                        {
                            Header: 'Nombre',
                            accessor: 'name'
                        },
                        {
                            Header: 'Categoría',
                            accessor: 'labor.description',
                            Cell: ({row}) => 
                                <Link to={`/labor/${row.original.labor.laborId}`}>{row.original.labor.description}</Link>
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.employeeId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={employees === undefined ? [] : employees}  
                    />
                </section>
            </div>
        </div>
    )
}