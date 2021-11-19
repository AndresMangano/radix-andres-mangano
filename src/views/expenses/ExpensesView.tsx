import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { ViewHeader } from "../../controls/ViewHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../helpers/http.helpers";
import { deleteExpense, getExpenses } from "../../api/expenses";
import { Table } from "../../controls/Table";
import { useMemo } from "react";

const DEFAULT_CURRENCY: string = process.env.REACT_APP_DEFAULT_CURRENCY || '';

export function ExpensesView() {
    const history = useHistory();
    const [expenses, refreshExpenses] = useRefresh(() => getExpenses(), []);
    const expensesData = useMemo(() => expenses?.map(e => ({ ...e, date: `${moment(e.date).format('DD/MM/yyyy')}`})), [expenses]);

    function handleDeleteRow (expenseId: number) {
        if (window.confirm('¿Está seguro que quiere remover el gasto?')) {
            deleteExpense(expenseId)
                .then(() => refreshExpenses());
        }
    }

    return(
        <div>
            <div>
                <header>
                    <ViewHeader subtitle='Gastos'>
                        En esta sección se cargan los gastos en los que incurre la empresa.
						Se recomienda cargarlos de forma mensual dependiendo el nivel de detalle que se necesite en el cálculo de costos.
                        <br /><br />
						- Registrar gasto
                        <ol>
                            <li>Hacer click en el botón <strong>Registrar Gasto</strong>.</li>
                            <li>Completar el formulario.</li>
                        </ol>
                        - Eliminar gasto
                        <ol>
                            <li>Hacer click en el botón <FontAwesomeIcon icon={faTrashAlt} /> correspondiente al gasto que se desea eliminar.</li>
                            <li>Hacer click en <strong>OK</strong>, o apretar enter, para confirmar la acción</li>
                        </ol>
                    </ViewHeader>
                </header>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push('/expenses/register')}>Registrar Gasto</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'expenseId',
                        },
                        {
                            Header: 'Cuenta',
                            accessor: 'account.description',
                            Cell: ({row}) => 
                            <Link to={`/account/${row.original.account.accountId}`}>{row.original.account.description}</Link>,
                        },
                        {
                            Header: 'Fecha',
                            accessor: 'date',
                        },
                        {
                            Header: 'Descripción',
                            accessor: 'description'
                        },
                        {
                            Header: 'Cantidad',
                            accessor: 'amount',
                            Cell: ({row}) => 
                                <>{row.original.amount.toLocaleString('en-US', { style:'currency', currency: DEFAULT_CURRENCY })}</>
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.expenseId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={expensesData === undefined ? [] : expensesData}  
                    />
                </section>
            </div>
        </div>  
    )
}