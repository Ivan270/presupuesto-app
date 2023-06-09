import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

function Gasto(nombre, valor = 0, id) {
	this.nombre = nombre;
	this.valor = valor;
	this.id = id;
}
// Formatea numeros a moneda CLP
const formatter = new Intl.NumberFormat('es-CL', {
	style: 'currency',
	currency: 'CLP',
});
let gastos = [];
let presupuestoTotal = 0;
let gastosTotal = 0;
let saldoTotal = 0;

let cleanForm = (formName) => {
	formName.reset();
};

let validarInput = (input) => {
	if (isNaN(input)) {
		alert('El número ingresado no es válido');

		return false;
	} else if (input < 0) {
		alert('El número debe ser mayor a 0');
		return false;
	} else {
		return true;
	}
};

let ingresarPresupuesto = () => {
	// Valida que numero ingresado sea numero y mayor o igual a 0
	if (validarInput(presupuestoInput.value)) {
		// Permite agregar mas presupuesto, no queda fijo con el primer submit
		presupuestoTotal += parseInt(presupuestoInput.value);
		displayPresupuesto.innerHTML = formatter.format(presupuestoTotal);
	}
};

// Mostrar saldo en Display
let mostrarSaldo = () => {
	sumarGastos();
	let total = presupuestoTotal - gastosTotal;
	displaySaldo.innerHTML = formatter.format(total);
	saldoTotal = total;
};

// Formulario Ingresar presupuesto total
formPresupuesto.addEventListener('submit', (event) => {
	event.preventDefault();
	ingresarPresupuesto();
	cleanForm(formPresupuesto);
	mostrarSaldo();
});

// Suma de los gastos ingresados al array
let sumarGastos = () => {
	let total = gastos.reduce((total, item) => {
		return total + parseInt(item.valor);
	}, 0);
	gastosTotal = parseInt(total);
};

// Rellenar tabla de gastos
let rellenarGastos = () => {
	tablaGastos.innerHTML = '';
	gastos.forEach((gasto) => {
		tablaGastos.innerHTML += `
        <tr >
            <td>${gasto.nombre}</td>
            <td>${formatter.format(gasto.valor)}</td>
                        <td><button class="btn btn-danger btnBorrar" ><i class="bi bi-trash3-fill" data-id="${
													gasto.id
												}"></button></i></td>
                        </tr>
                        `;
	});
	// Manejar evento de boton borrar item
	let btnsBorrar = document.getElementsByClassName('btnBorrar');
	let btnBorrar = [...btnsBorrar];
	btnBorrar.forEach((btn) => {
		btn.addEventListener('click', (event) => {
			borrarItem(event.target.dataset.id);
		});
	});
};

// Borrar item
let borrarItem = (id) => {
	let encontrado = gastos.find((gasto) => gasto.id == id);
	let indexEncontrado = gastos.indexOf(encontrado);
	gastosTotal -= encontrado.valor;
	displayGastos.innerHTML = formatter.format(gastosTotal);
	gastos.splice(indexEncontrado, 1);
	mostrarSaldo();
	rellenarGastos();
};

let agregarGasto = () => {
	// Valida que numero ingresado sea numero y mayor o igual a 0
	if (validarInput(gastoInput.value)) {
		let nombreGasto = gastoNombreInput.value;
		let valorGasto = parseInt(gastoInput.value);
		let idGasto = uuidv4().slice(0, 6);
		// Crea nuevo objeto de gasto
		let nuevoGasto = new Gasto(nombreGasto, valorGasto, idGasto);
		// valida que gasto no sea mayor al saldo total
		if (saldoTotal < nuevoGasto.valor) {
			alert('No tienes suficiente saldo');
			cleanForm(formGasto);
			return;
		}
		gastosTotal += nuevoGasto.valor;
		gastos.push(nuevoGasto);
		displayGastos.innerHTML = formatter.format(gastosTotal);
	}
};

// Formulario Ingresar gasto
formGasto.addEventListener('submit', (event) => {
	event.preventDefault();
	agregarGasto();
	cleanForm(formGasto);
	mostrarSaldo();
	rellenarGastos();
});
