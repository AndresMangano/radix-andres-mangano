import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { getAccountDistributions, updateAccountDistribution } from "../../../api/account-distribution";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function CostPoolsAccountsView() {
    const params = useParams<{costPoolId: string; accountId: string}>();
    const costPoolId = parseInt(params.costPoolId);
    const accountId = parseInt(params.costPoolId);
    const [accounts, refreshAccounts] = useRefresh(() => getAccountDistributions({costPoolId, accountId}), []);
    const accountsData = useMemo(() => accounts?.map(a => ({ ...a, percent: `${a.percent*100}%`}) ), [accounts]);

    function handleDeleteRow(accountId: number, costPoolId: number) {
        if (window.confirm('¿Está seguro que quiere remover la cuenta del centro de costo aquí y en su tabla de origen?')) {
        updateAccountDistribution({accountId, costPoolId, percent: 0})
            .then(() => refreshAccounts());
        }
    }

    return(
        <div>
            <div>
                <section>
                    <Table
                        columns={[
                        {
                            Header: 'Cuenta',
                            accessor: 'account.description',
                            Cell: ({row}) => 
                                <Link to={`/account/${row.original.account.accountId}`}>{row.original.account.description}</Link>,
                        },
                        {
                            Header: 'Porcentaje',
                            accessor: 'percent',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.account.accountId, row.original.costPool.costPoolId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={accountsData === undefined ? [] : accountsData}  
                    />
                </section>
        </div>   
    </div>            
    )
}