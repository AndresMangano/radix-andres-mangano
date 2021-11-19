import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { deleteAccount, getAccounts } from "../../api/accounts";
import { useRefresh } from "../../helpers/http.helpers";
import { Table } from "../../controls/Table";

export function AccountsView() {
    const history = useHistory();
    const [accounts, refreshAccounts] = useRefresh(() => getAccounts(), []);

    function handleDeleteRow (accountId: number) {
        if (window.confirm('¿Está seguro que quiere desactivar la cuenta?')) {
        deleteAccount(accountId)
            .then(() => refreshAccounts());
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Cuentas'>
                        En esta pantalla se registran las cuentas de gastos que maneja la empresa,
                        junto con los porcentajes que serán asignados a cada centro de costos.
                        <br /><br />
                        - Registrar cuenta de gastos
                        <ol>
                            <li>Hacer click en el botón <strong>Registrar Cuenta</strong>.</li>
                            <li>Completar el formulario</li>
                        </ol>
                        - Modificar una cuenta de gastos
                        <ol>
                            <li>Hacer click en la columna <strong>ID</strong> correspondiente a la cuenta que se desea modificar.</li>
                        </ol>
                        - Desactivar cuenta de gastos
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> correspondiente a la cuenta que se desea eliminar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/accounts/register')}>Registrar Cuenta</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'accountId',
                            Cell: ({row}) => 
                                <Link to={`/account/${row.original.accountId}`}>{row.original.accountId}</Link>,
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
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.accountId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={accounts === undefined ? [] : accounts}  
                    />
                </section>
            </div>
        </div>                    
    )
}