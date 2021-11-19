import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteMaterialMachine, getMaterialMachines } from "../../../api/material-machines";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function MachineMaterialsView() {
    const params = useParams<{machineId: string, materialId: string}>();
    const machineId = parseInt(params.machineId);
    const materialId = parseInt(params.machineId);
    const [machines, refreshMachines] = useRefresh(() => getMaterialMachines({machineId, materialId}), []);
    const machinesData = useMemo(() => machines?.map(m => ({ ...m, hourlyRate: `${m.hourlyRate + ' ' + m.unitOfMeasureKV.value}`})), [machines]);

    function handleDeleteRow (materialMachineId: number) {
        if (window.confirm('¿Está seguro que quiere remover el material del sector?')) {
            deleteMaterialMachine(materialMachineId)
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
                            Header: 'Material',
                            accessor: 'material.description',
                            Cell: ({row}) => 
                                <Link to={`/material/${row.original.material.materialId}`}>{row.original.material.description}</Link>,
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
    )
}