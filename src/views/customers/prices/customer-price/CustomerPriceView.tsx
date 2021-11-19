import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteCustomerPrice, getCustomerPrice, updateCustomerPrice } from "../../../../api/customer-prices";
import { useQuantityUnits } from "../../../../api/static";
import { SelectPlaceholder } from "../../../../controls/SelectPlaceholder";
import { useRefresh } from "../../../../helpers/http.helpers";

export function CustomerPriceView() {
    const history = useHistory();
    const params = useParams<{customerPriceId: string; customerId: string}>();
    const customerPriceId = parseInt(params.customerPriceId);
    const customerId = parseInt(params.customerId);
    const [customerPrice] = useRefresh(() => getCustomerPrice(customerPriceId), [customerPriceId]);
    const quantityUnits = useQuantityUnits();
    const [price, setPrice] = useState<number|"">("");  
    const [salesTarget, setSalesTarget] = useState<number|"">("");  
    const [unitOfMeasure, setUnitOfMeasure] = useState<number|"">(""); 
    
    const buttonIsDisabled = useMemo(() => {
        return customerPrice?.price === price && customerPrice?.salesTarget === salesTarget && 
        customerPrice?.unitOfMeasureKV.key === unitOfMeasure 
    },[customerPrice?.price, price, customerPrice?.salesTarget, salesTarget, 
        customerPrice?.unitOfMeasureKV.key, unitOfMeasure ])

    useEffect(() => {
        if (customerPrice !== undefined) {
            setPrice(customerPrice.price);
            setSalesTarget(customerPrice.salesTarget);
            setUnitOfMeasure(customerPrice.unitOfMeasureKV.key);
        }
    }, [customerPrice]);

    function handleDeleteRow(customerPriceId: number) {
        deleteCustomerPrice(customerPriceId)
        .then(() => {
            history.push(`/customer/${customerId}/prices`)
        })
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
            if(price !== "" && salesTarget !== "" && unitOfMeasure !== "") {
                updateCustomerPrice(customerPriceId, {price, salesTarget, unitOfMeasure})
                .then(() => {
                    history.push(`/customer/${customerId}/prices`)
                });
            }
            else {
                alert("Error al enviar el formulario");
            }
        }

    return(
        <div>
            <div>
            <section>
                    <form onSubmit={handleSubmit}>
                    {
                        (customerPrice !== undefined) && 
                        <>
                            <div>
                            <label className='tooltip bottom'>
                                Código
                                <p>Código de pieza que maneja el cliente.</p>
                            </label>
                                <span>{customerPrice.code}</span>
                            </div>
                            <div>
                                <label>Material</label>
                                <span>{customerPrice.material.description}</span>
                            </div>
                            <div>
                                <label>Último Precio</label>
                                <span>{customerPrice.lastApprovedPrice}</span>
                            </div>
                            <div>
                                <label>Precio</label>
                                <input type='number' value={price} onChange={e => setPrice(parseFloat(e.currentTarget.value))} /> 
                            </div>
                            <div>
                            <label className='tooltip bottom'>
                                Objetivo de Ventas
                                <p>Ventas mensuales que se esperan vender actualmente al cliente.</p>
                            </label>
                                <input type='number' value={salesTarget} onChange={e => setSalesTarget(parseFloat(e.currentTarget.value))} /> 
                            </div>
                            <div>
                            <label className='tooltip right'>
                                Unidad de Medida
                                <p>Unidad de medida con la que se suele gestionar el objetivo de venta.</p>
                            </label>
                            <select name='unitOfMeasure' id="unitOfMeasure" value={unitOfMeasure} onChange={e => setUnitOfMeasure(parseInt(e.currentTarget.value))} required>
                                <SelectPlaceholder />
                            {   (quantityUnits) && 
                                    quantityUnits.map((q) => 
                                        <option key={q.key} value={q.key}>{q.value}</option>
                                )
                            }
                            </select>
                        </div>
                            <footer>
                                <button disabled={buttonIsDisabled}>Modificar</button>
                                <button type='button' className='button-delete' onClick={() => handleDeleteRow(customerPrice.customerPriceId)}>Remover</button>    
                            </footer>
                        </>
                    }
                    </form>
                </section>
            </div>
        </div>
    )
}