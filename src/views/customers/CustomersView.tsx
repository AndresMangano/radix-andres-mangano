import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../helpers/http.helpers";
import { deleteCustomer, getCustomers } from "../../api/customers";
import { Table } from "../../controls/Table";

export function CustomersView() {
    const history = useHistory();
    const [customers, refreshCustomer] = useRefresh(() => getCustomers(), []);

    function handleDeleteRow (customerId: number) {
        if (window.confirm('¿Está seguro que quiere remover el cliente?')) {
            deleteCustomer(customerId)
                .then(() => refreshCustomer());
        }
    }

    return(
        <div>
            <div>
                <header>
                <ViewHeader subtitle='Clientes'>
                    En esta pantalla se gestionan los clientes de la empresa junto con sus listas de precios.
                    <br /><br />
                    - Registrar un cliente
                    <ol>
                        <li>Hacer click en el botón <strong>Registrar Cliente</strong>.</li>
                        <li>Completar el formulario.</li>
                    </ol>
                    - Modificar los datos de un cliente
                    <ol>
                        <li>Hacer click en la celda de la columna <strong>ID</strong> correspondiente al cliente que se desea modificar.</li>
                    </ol>
                    - Eliminar un cliente
                    <ol>
                        <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> correspondiente al cliente que se desea eliminar.</li>
                        <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                    </ol>
                </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/customers/register')}>Registrar Cliente</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'customerId',
                            Cell: ({row}) => 
                            <Link to={`/customer/${row.original.customerId}`}>{row.original.customerId}</Link>,
                        },
                        {
                            Header: 'Nombre',
                            accessor: 'name'
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.customerId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={customers === undefined ? [] : customers}  
                    />
                </section>
            </div>
        </div>
    )
}