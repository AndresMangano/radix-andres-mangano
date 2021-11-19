import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteMaterialMachine, getMaterialMachine, updateMaterialMachine } from "../../../../api/material-machines"
import { useQuantityUnits } from "../../../../api/static";
import { SelectPlaceholder } from "../../../../controls/SelectPlaceholder";
import { useRefresh } from "../../../../helpers/http.helpers";

export function MaterialMachineView() {
    const history = useHistory();
    const params = useParams<{materialMachineId: string, materialId: string}>();
    const materialMachineId = parseInt(params.materialMachineId);
    const materialId = parseInt(params.materialId);
    const [materialMachine] = useRefresh(() => getMaterialMachine(materialMachineId), [materialMachineId]);
    const quantityUnits = useQuantityUnits();
    const [hourlyRate, setHourlyRate] = useState<number|"">("");  
    const [unitOfMeasure, setUnitOfMeasure] = useState<number|"">(""); 
    
    const buttonIsDisabled = useMemo(() => {
        return materialMachine?.hourlyRate === hourlyRate && materialMachine?.unitOfMeasureKV.key === unitOfMeasure 
    },[materialMachine?.hourlyRate, hourlyRate, materialMachine?.unitOfMeasureKV.key, unitOfMeasure ])

    useEffect(() => {
        if (materialMachine !== undefined) {
            setHourlyRate(materialMachine.hourlyRate);
            setUnitOfMeasure(materialMachine.unitOfMeasureKV.key);
        }
    }, [materialMachine]);

    function handleDeleteRow(materialMachineId: number) {
        deleteMaterialMachine(materialMachineId)
        .then(() => {
            history.push(`/material/${materialId}/machines`)
        })
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
            if(hourlyRate !== "" && unitOfMeasure !== "") {
                updateMaterialMachine(materialMachineId, {hourlyRate, unitOfMeasure})
                .then(() => {
                    history.push(`/material/${materialId}/machines`)
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
                        (materialMachine !== undefined) &&
                        <>
                            <div>
                                <label>Descripción</label>
                                <span>{materialMachine.machine.description}</span>
                            </div>
                            <div>
                                <label>Cadencia(por hora)</label>
                                <input type='number' value={hourlyRate} onChange={e => setHourlyRate(parseFloat(e.currentTarget.value))} /> 
                            </div>
                            <div>
                            <label className='tooltip right'>
                                Unidad de Medida
                                <p>Unidad de medida con la que se suele gestionar el material.</p>
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
                                <button type='button' className='button-delete' onClick={() => handleDeleteRow(materialMachine.materialMachineId)}>Desactivar</button>    
                            </footer>
                        </>
                    }
                    </form>
                </section>
            </div>
        </div>
    )
}