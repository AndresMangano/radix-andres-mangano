import { Link, useParams } from "react-router-dom";
import { useRefresh } from "../../../helpers/http.helpers";
import { getEmployees } from "../../../api/employees";
import { Table } from "../../../controls/Table";

export function LaborEmployeesView() {
    const params = useParams<{laborId: string}>();
    const laborId = parseInt(params.laborId);
    const [employees] = useRefresh(() => getEmployees({laborId}), []);

    return(
        <div>
            <div>
                <section>
                    <Table
                        columns={[
                        {
                            Header: 'ID',
                            accessor: 'employeeId',
                            Cell: ({row}) => 
                                <Link to={`/employee/${row.original.employeeId}`}>{row.original.employeeId}</Link>,
                        },
                        {
                            Header: 'Nombre',
                            accessor: 'name'
                        }
                    ]}
                        data={employees === undefined ? [] : employees}  
                    />
                </section>
            </div>
        </div>
    )
}