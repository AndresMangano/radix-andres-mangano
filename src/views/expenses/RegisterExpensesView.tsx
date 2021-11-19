import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { getAccounts } from "../../api/accounts";
import { createExpense } from "../../api/expenses";
import { SelectPlaceholder } from "../../controls/SelectPlaceholder";
import { ViewHeader } from "../../controls/ViewHeader";
import { useRefresh } from "../../helpers/http.helpers";

  export function RegisterExpensesView() {

    const history = useHistory();
    const[{ accountId, description, amount, date }, dispatch] = useReducer (reducer, {
      accountId: '',
      description: '',
      amount: '',
      date: new Date()
    })
    const [accounts] = useRefresh(() => getAccounts(), []);

    function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
      switch(event.currentTarget.name) {
        case 'description': dispatch({ _type: 'CHANGE_DESCRIPTION', description: event.currentTarget.value}); break
        case 'amount': dispatch({ _type: 'CHANGE_AMOUNT', amount: event.currentTarget.valueAsNumber }); break
        case 'date': dispatch({ _type: 'CHANGE_DATE', date: event.currentTarget.valueAsDate })
      }
    }

    function handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
      switch(event.currentTarget.name) {
        case 'accountId': dispatch({ _type: 'CHANGE_ACCOUNT_ID', accountId: parseInt(event.currentTarget.value)}); break
      }
    }

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (date !== null && accountId !== '' && amount !== '') {
        createExpense({accountId, description, amount, date})
          .then (() => {
            history.push('/expenses')
          });
      }
      else {
          alert('Error al enviar el formulario')
      }
    }

    return(
      <div>
			<div>
				<header>
					<ViewHeader
						subtitle='Registrar Gasto'
						route= {[
							{
								label: 'Gastos',
								link:'/expenses',
							}
					]}>
						
					</ViewHeader>
				</header>
				<section>
						<form onSubmit={handleRegister}>
							<div>
								<label>Fecha</label>
								<input type='date' name='date' value={date?.toISOString().split('T')[0]} onChange={handleInputChange} required/>
							</div>
							<div>
								<label>Cuenta</label>
								<select name='accountId' id="accountId" value={accountId} onChange={handleSelectChange} required>
									<SelectPlaceholder />
								{   (accounts) && 
									accounts.map((a) => 
										<option key={a.accountId} value={a.accountId}>{a.description}</option>
								)}
								</select>
							</div>
							<div>
								<label>Descripción</label>
								<input type='text' name='description' id='description' value={description} onChange={handleInputChange} required/>
							</div>
							<div>
								<label>Monto (ARS)</label>
								<input type='number' name='amount' id='amount' value={amount} onChange={handleInputChange} required/>
							</div>
							<footer>
								<button type='submit'>Registrar</button>
							</footer>
						</form>
				</section>
			</div>
      </div>
    )
}

type State = {
  accountId: number|'';
  description: string;
  amount: number|'';
  date: Date|null;
}

type Action = 
| { _type: 'CHANGE_ACCOUNT_ID', accountId: number}
| { _type: 'CHANGE_DESCRIPTION', description: string}
| { _type: 'CHANGE_AMOUNT', amount: number}
| { _type: 'CHANGE_DATE', date: Date|null}

function reducer (state: State, action: Action) : State {
  switch(action._type) {
    case 'CHANGE_ACCOUNT_ID': return { ...state, accountId: action.accountId}
    case 'CHANGE_DESCRIPTION': return { ...state, description: action.description}
    case 'CHANGE_AMOUNT': return { ...state, amount: action.amount || ''}
    case 'CHANGE_DATE': return { ...state, date: action.date}
  }
}      
