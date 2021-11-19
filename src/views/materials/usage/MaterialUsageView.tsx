import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteMaterialComponent, getMaterialComponents } from "../../../api/material-components";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function MaterialUsageView() {
    const params = useParams<{
        componentId: string;
        materialId: string
    }>();
    const componentId = parseInt(params.materialId);
    const materialId = parseInt(params.materialId);
    const [usage, refreshUsage] = useRefresh(() => getMaterialComponents({componentId, materialId}), []);
    const usageData = useMemo(() => usage?.map(u => ({ ...u, quantity: `${u.quantity + ' ' + u.unitOfMeasureKV.value}`})), [usage]);

    function handleDeleteRow(materialComponentId: number) {
        if (window.confirm('¿Está seguro que quiere remover el material del componente aquí y en su tabla de origen?')) {
            deleteMaterialComponent(materialComponentId)
            .then(() => refreshUsage());
        }
    }

    return (
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
                            Header: 'Cantidad',
                            accessor: 'quantity',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.materialComponentId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={usageData === undefined ? [] : usageData}  
                    />
                </section>
            </div>
        </div>
    );
}