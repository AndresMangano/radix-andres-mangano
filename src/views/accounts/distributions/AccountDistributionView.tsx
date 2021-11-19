import { Link, useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { getAccountDistributions, updateAccountDistribution } from "../../../api/account-distribution";
import { useRefresh } from "../../../helpers/http.helpers";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function AccountDistributionView() {
    const history = useHistory();
    const params = useParams<{accountId: string;}>();
    const accountId = parseInt(params.accountId);
    const [accountDistribution, refresh] = useRefresh(() => getAccountDistributions({accountId}), [accountId]);
    const accountDistributionData = useMemo(() => accountDistribution?.map(ad => ({ ...ad, percent: `${ad.percent*100}%`}) ), [accountDistribution]);

    function handleDeleteRow(accountId: number, costPoolId: number) {
        if (window.confirm('¿Está seguro que quiere remover la distribución de la cuenta?')) {
        updateAccountDistribution({accountId, costPoolId, percent: 0})
            .then(() => refresh());
        }
    }
    
    return(
        <div>
            <div>
                <section>
                    <Table
                        buttons={
                            <>
                            <button onClick={() => history.push(`/account/${accountId}/distributions/register`)}>Definir Asignación</button> 
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'accountDistributionId',
                        },
                        {
                            Header: 'Centro de Costos',
                            accessor: 'costPool.description',
                            Cell: ({row}) => 
                                <Link to={`/cost-pool/${row.original.costPool.costPoolId}`}>{row.original.costPool.description}</Link>
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
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.accountId, row.original.costPool.costPoolId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={accountDistributionData === undefined ? [] : accountDistributionData}  
                    />
                </section>
            </div>
        </div>
    );
}