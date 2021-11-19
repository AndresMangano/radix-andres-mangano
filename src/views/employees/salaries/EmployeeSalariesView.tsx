import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useRefresh } from "../../../helpers/http.helpers";
import { deleteEmployeeSalary, getEmployeeSalaries } from "../../../api/employee-salaries";
import { Table } from "../../../controls/Table";
import { useMemo } from "react";

export function EmployeeSalariesView(){
    const history = useHistory();
    const params = useParams<{employeeId: string;}>();
    const employeeId = parseInt(params.employeeId);
    const [salaries, refreshSalaries] = useRefresh(() => getEmployeeSalaries({employeeId}), [employeeId]);
    const salariesData = useMemo(() => salaries?.map(s => ({ ...s, validFrom: `${moment(s.validFrom).format('DD/MM/yyyy')}`}) ), [salaries]);


    function handleDeleteRow(employeeSalaryId: number) {
        if (window.confirm('¿Está seguro que quiere remover el salario del empleado?')) {
            deleteEmployeeSalary(employeeSalaryId)
                .then(() => refreshSalaries());
        }
    }

    return (
        <div>
            <div>
                <section>
                    <Table
                        buttons={
                            <>
                                <button onClick={() => history.push(`/employee/${employeeId}/salaries/register`)}>Registrar Salario</button>
                            </>
                        }
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'employeeSalaryId',
                        },
                        {
                            Header: 'Válido Desde',
                            accessor: 'validFrom',
                        },
                        {
                            Header: 'Salario(por hora)',
                            accessor: 'hourlyRate',
                        },
                        {
                            Header: '',
                            accessor: 'delete',
                            disableSortBy: true,
                            Cell: ({row}) => 
                                    <button className='danger' onClick={() => handleDeleteRow(row.original.employeeSalaryId)}>
                                        <FontAwesomeIcon className='delete-icon' icon={faTrashAlt} />
                                    </button>,
                        }
                    ]}
                        data={salariesData === undefined ? [] : salariesData}  
                    />
                </section>
            </div>
        </div>
    );
}