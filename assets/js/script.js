import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

function Gasto(nombre, valor = 0, id) {
	this.nombre = nombre;
	this.valor = valor;
	this.id = id;
}

let gastos = [];
let presupuestoTotal = 0;
let gastosTotal = 0;
let saldoTotal = 0;

let cleanForm = (name) => {
	name.reset();
};

// Ingresar presupuesto total
formPresupuesto.addEventListener('submit', (event) => {
	event.preventDefault();
	presupuestoTotal += parseInt(presupuestoInput.value);
	displayPresupuesto.innerHTML = presupuestoTotal.toLocaleString('es-CL', {
		style: 'currency',
		currency: 'CLP',
	});
	console.log(presupuestoTotal);
	cleanForm(formPresupuesto);
	mostrarSaldo();
});
// Rellenar tabla de gastos
let rellenarGastos = () => {
	tablaGastos.innerHTML = '';
	gastos.forEach((gasto) => {
		tablaGastos.innerHTML += `
        <tr >
            <td>${gasto.nombre}</td>
            <td>${gasto.valor.toLocaleString('es-CL', {
							type: 'currency',
							currency: 'CLP',
						})}</td>
            <td><button class="btn btn-danger btnBorrar" ><i class="bi bi-trash3-fill" data-id="${
							gasto.id
						}"></button></i></td>
        </tr>
        `;
	});
	let btnsBorrar = document.getElementsByClassName('btnBorrar');
	let btnBorrar = [...btnsBorrar];
	btnBorrar.forEach((btn) => {
		btn.addEventListener('click', (event) => {
			borrarItem(event.target.dataset.id);
		});
	});
};

// Suma de los gastos ingresados al array
let sumarGastos = () => {
	let total = gastos.reduce((total, item) => {
		return total + parseInt(item.valor);
	}, 0);
	gastosTotal = parseInt(total);
};

// Borrar item
let borrarItem = (id) => {
	let encontrado = gastos.find((gasto) => gasto.id == id);
	let indexEncontrado = gastos.indexOf(encontrado);
	gastos.splice(indexEncontrado, 1);
	sumarGastos();
	mostrarSaldo();
	rellenarGastos();
};

// Ingresar gasto
formGasto.addEventListener('submit', (event) => {
	event.preventDefault();

	console.log(saldoTotal);
	let nombreGasto = gastoNombreInput.value;
	let valorGasto = parseInt(gastoInput.value);
	let idGasto = uuidv4().slice(0, 6);

	let nuevoGasto = new Gasto(nombreGasto, valorGasto, idGasto);
	// valida que gasto no sea mayor al presupuesto
	let gastoTotalTemporal = gastosTotal + nuevoGasto.valor;
	if (saldoTotal < gastoTotalTemporal) {
		alert('No tienes suficiente saldo');
		cleanForm(formGasto);
		return;
	}
	gastosTotal += nuevoGasto.valor;
	gastos.push(nuevoGasto);
	displayGastos.innerHTML = gastosTotal.toLocaleString('es-CL', {
		style: 'currency',
		currency: 'CLP',
	});
	cleanForm(formGasto);
	mostrarSaldo();
	rellenarGastos();
});

// Mostrar saldo en Display
let mostrarSaldo = () => {
	sumarGastos();
	let total = presupuestoTotal - gastosTotal;
	displaySaldo.innerHTML = total.toLocaleString('es-CL', {
		style: 'currency',
		currency: 'CLP',
	});
	saldoTotal = total;
};
