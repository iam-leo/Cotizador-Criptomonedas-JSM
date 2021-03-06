const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const form = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');



const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', () => {
    consultatCriptomonedas();

    form.addEventListener('submit', submitForm);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedasSelect.addEventListener('change', leerValor);
});

//Promise para obtener las cryptomonedas
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

async function consultatCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=ARS';

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas))

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option)
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitForm(e) {
    e.preventDefault();

    //Validar form
    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return
    }

    consultarAPI();
}

//Alerta de error
function mostrarAlerta(mensaje){
    const existeError = document.querySelector('.error');

    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.textContent = mensaje;
        divMensaje.classList.add('error');

        form.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    
    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => {
    //     mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda]);
    //     })

    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }

}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner')
    spinner.innerHTML = `
        <div class="cube1"></div>
        <div class="cube2"></div>
    `

    resultado.appendChild(spinner);
}

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();

    const criptoM = criptomonedasSelect.options[criptomonedasSelect.selectedIndex].text;

    const { CHANGEPCT24HOUR, HIGHDAY, LOWDAY, LASTUPDATE, PRICE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `Un ${criptoM} es igual a: <br><span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El precio mas alto del dia es: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El precio m??s bajo del dia es: <span>${LOWDAY}</span>`;

    const variacion = document.createElement('p');
    variacion.innerHTML = `Variaci??n ??ltimas 24hs: <span>${CHANGEPCT24HOUR}%</span>`;

    const actualizacion = document.createElement('p');
    actualizacion.innerHTML = `Ultima actualizaci??n: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacion);
    resultado.appendChild(actualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}