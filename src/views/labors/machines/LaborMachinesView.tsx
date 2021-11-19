import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteMachineLabor, getMachineLabors } from "../../../api/machine-labors";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function LaborMachinesView() {
    const params = useParams<{machineId: string; laborId: string}>();
    const machineId = parseInt(params.laborId);
    const laborId = parseInt(params.laborId);
    const [machines, refreshMachines] = useRefresh(() => getMachineLabors({machineId, laborId}), []);
    const machinesData = useMemo(() => machines?.map(m => ({ ...m, usage: `${m.usage * 100}%`})), [machines]);

    function handleDeleteRow (machineLaborId: number) {
        if (window.confirm('¿Está seguro que quiere remover el sector asociado a la mano de obra?')) {
            deleteMachineLabor(machineLaborId)
            .then(() => refreshMachines());
        }
    }

    return(
        <div>
            <div>
                <section>
                    <Table
                        columns={[
                        {
                            Header: 'Descripción',
                            accessor: 'machine.description',
                            Cell: ({row}) => 
                                <Link to={`/machine/${row.original.machine.machineId}`}>{row.original.machine.description}</Link>,
                        },
                        {
                            Header: 'Utilización',
                            accessor: 'usage',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.machineLaborId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={machinesData === undefined ? [] : machinesData}  
                    />
                </section>
            </div>
        </div>
    )
}