import React, { useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteCustomerPrice, getCustomerPrices } from "../../../api/customer-prices";
import { Table } from "../../../controls/Table";


export function CustomerPricesView() {
    const history = useHistory();
    const params = useParams<{customerId: string}>();
    const customerId = parseInt(params.customerId);
    const [prices, refreshPrices] = useRefresh(() => getCustomerPrices({customerId}), [customerId]);
    const pricesData = useMemo(() => prices?.map(p => ({ ...p, salesTarget: `${p.salesTarget + ' ' + p.unitOfMeasureKV.value}`})), [prices])

    function handleDeleteRow(customerPriceId: number) {
        if (window.confirm('¿Está seguro que quiere remover el precio?')) {
        deleteCustomerPrice(customerPriceId)
            .then(() => refreshPrices());
        }
    }
    
    return (
        <div>
            <div>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push(`/customer/${customerId}/prices/register`)}>Agregar Producto</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'customerPriceId',
                            Cell: ({row}) => 
                            <Link to={`/customer/${customerId}/prices/${row.original.customerPriceId}`}>{row.original.customerPriceId}</Link>,
                        },
                        {
                            Header: 'Código',
                            accessor: 'code'
                        },
                        {
                            Header: 'Material',
                            accessor: 'material.description',
                            Cell: ({row}) => 
                            <Link to={`/material/${row.original.material.materialId}`}>{row.original.material.description}</Link>,
                        },
                        {
                            Header: 'Último Precio',
                            accessor: 'lastApprovedPrice',
                            Cell: ({row}) => 
                                <>{row.original.lastApprovedPrice?.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code'})}</>
                        },
                        {
                            Header: 'Precio',
                            accessor: 'price',
                            Cell: ({row}) => 
                                    <>{row.original.price.toLocaleString('en-US', { style: 'currency', currency: 'ARS', currencyDisplay: 'code'})}</>
                        },
                        {
                            Header: 'Objetivo de Ventas',
                            accessor: 'salesTarget',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.customerPriceId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={pricesData === undefined ? [] : pricesData}  
                    />
                </section>
            </div>
        </div>
    );
}