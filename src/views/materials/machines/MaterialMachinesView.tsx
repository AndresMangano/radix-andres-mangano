import { Link, useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteMaterialMachine, getMaterialMachines } from "../../../api/material-machines";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function MaterialMachinesView() {
    const history = useHistory();
    const params = useParams<{
        materialId: string;
    }>();
    const materialId = parseInt(params.materialId);
    const [machines, refreshMachines] = useRefresh(() => getMaterialMachines({materialId}), [materialId]);
    const machinesData = useMemo(() => machines?.map(m => ({ ...m, hourlyRate: `${m.hourlyRate + ' ' + m.unitOfMeasureKV.value}`})), [machines])


    function handleDeleteRow(materialMachineId: number) {
        if (window.confirm('¿Está seguro que quiere remover el proceso?')) {
        deleteMaterialMachine(materialMachineId)
            .then(() => refreshMachines());
        }
    }

    return (
        <div>
            <div>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push(`/material/${materialId}/machines/register`)}>Registrar Proceso</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'Version Fab.',
                            accessor: 'materialMachineId',
                            Cell: ({row}) => 
                                <Link to={`/material/${materialId}/machines/${row.original.materialMachineId}`}>{row.original.materialMachineId}</Link>,
                        },
                        {
                            Header: 'Sector',
                            accessor: 'machine.description',
                            Cell: ({row}) => 
                            <Link to={`/machine/${row.original.machine.machineId}`}>{row.original.machine.description}</Link>,
                        },
                        {
                            Header: 'Cadencia(por hora)',
                            accessor: 'hourlyRate',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.materialMachineId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={machinesData === undefined ? [] : machinesData}  
                    />
                </section>
            </div>
        </div>
    );
}