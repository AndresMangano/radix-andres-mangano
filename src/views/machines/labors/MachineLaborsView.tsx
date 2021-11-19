import { Link, useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteMachineLabor, getMachineLabors } from "../../../api/machine-labors";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function MachineLaborsView() {
    const history = useHistory();
    const params = useParams<{
        machineId: string;
    }>();
    const machineId = parseInt(params.machineId);
    const [labors, refreshLabors] = useRefresh(() => getMachineLabors({machineId}), [machineId]);
    const laborsData = useMemo(() => labors?.map(l => ({ ...l, usage: `${l.usage*100}%`}) ), [labors]);

    function handleDeleteRow(machineLaborId: number) {
        if (window.confirm('¿Está seguro que quiere remover la mano de obra del sector productivo?')) {
            deleteMachineLabor(machineLaborId)
            .then(() => refreshLabors());
        }
    }

    return (
        <div>
            <div>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push(`/machine/${machineId}/labors/register`)}>Definir Operador</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'Mano de Obra',
                            accessor: 'labor.description',
                            Cell: ({row}) => <Link to={`/labor/${row.original.labor.laborId}`}>{row.original.labor.description}</Link>
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
                        data={laborsData === undefined ? [] : laborsData}  
                    />
                </section>
            </div>
        </div>
    );
}