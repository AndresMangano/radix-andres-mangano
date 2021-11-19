import { Link, useParams } from "react-router-dom";
import { useRefresh } from "../../../helpers/http.helpers";
import { getCostPools } from "../../../api/cost-pools";
import { Table } from "../../../controls/Table";

export function MachineCostPoolsView() {
    const params = useParams<{machineId: string}>();
    const machineId = parseInt(params.machineId);
    const [machines] = useRefresh(() => getCostPools({machineId}), []);

    return(
        <div>
            <div>
                <section>
                    <Table
                        columns={[
                        {
                            Header: 'Centro de Costo',
                            accessor: 'description',
                            Cell: ({row}) => 
                                <Link to={`/cost-pool/${row.original.costPoolId}`}>{row.original.description}</Link>,
                        },
                        {
                            Header: 'Factor',
                            accessor: 'costDriverKV.value'
                        },
                    ]}
                        data={machines === undefined ? [] : machines}  
                    />
                </section>
            </div>
        </div>
    )
}