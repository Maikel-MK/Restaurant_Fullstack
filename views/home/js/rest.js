const btnGuardarCliente = document.querySelector('#guardar-cliente')
const contenido = document.querySelector('#resumen .contenido')
// const axios = require('axios'); // Importar axios


//crear un objeto para guardar la informacion del cliente

let cliente ={
    mesa:'',
    hora:'',
    pedido:[]
}

let mesa = []

const categorias = {
    1:"Pizzas",
    2:"Postres",
    3:"Jugos",
    4:"Combos",
    5:"Cafe"
}

btnGuardarCliente.addEventListener('click',guardarcliente)

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.invalida')

    if(!existeAlerta){
        const alerta = document.createElement('div')
        alerta.textContent = mensaje
        alerta.classList.add('invalida')
        document.querySelector('.modal-body form').appendChild(alerta)

        setTimeout(()=>{
            alerta.remove()
        },3000)
    }
}

async function guardarcliente() {
    //console.log('si guardoo')
    const mesa = document.querySelector('#mesa').value 
    const hora = document.querySelector('#hora').value 

    //una forma de validar si no esta vacio sin el if es:
    const camposVacios = [mesa,hora].some(i=>i=='')//some lo toma para un booleano que si al menos 1 de los que estan alli esta vacio todo saldra false
    //si todos estan vacios saldra true

    if(camposVacios){
        mostrarAlerta("Los Campos Son Obligatorios")
    } else {
        try {
            // Verifica si la mesa existe
            const responseMesa = await axios.get(`api/mesas/obtener-mesa-por-mesa/${mesa}`)
            
            if (responseMesa.data && responseMesa.data.textOk) { // Si la mesa existe
                mostrarAlerta("La mesa ya está registrada")
            } else if (responseMesa.data && responseMesa.data.error) { // Si la mesa no existe
                // Procede con el guardado
                cliente = {...cliente,mesa,hora}

                // Oculta la ventana modal
                var modalFormulario = document.querySelector('#formulario')
                var modal = bootstrap.Modal.getInstance(modalFormulario)
                modal.hide()

                mostrarSecciones()
                obtenerMenu()
            } else {
                console.error('Respuesta inesperada:', responseMesa.data);
                mostrarAlerta("Ocurrió un error al verificar la mesa")
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Si la mesa no existe, pero el servidor respondió con un 404
                cliente = {...cliente,mesa,hora}
                console.log('catch')
                // Oculta la ventana modal
                var modalFormulario = document.querySelector('#formulario')
                var modal = bootstrap.Modal.getInstance(modalFormulario)
                modal.hide()

                mostrarSecciones()
                obtenerMenu()
            } else {
                console.error('Error desconocido:', error.message);
                mostrarAlerta("Ocurrió un error al verificar la mesa")
            }
        }
    }
}





function mostrarSecciones(){
    const secciones = document.querySelectorAll('.d-none')
    //console.log(secciones)
    secciones.forEach(i => i.classList.remove('d-none'))
}

async function obtenerMenu() {
    try {
        const url = 'api/menus/lista-menu';
        console.log('Realizando solicitud a:', url);

        const respuesta = await axios.get(url);
        console.log('Respuesta recibida:', respuesta.data);

        // Verificar si la respuesta tiene la estructura esperada
        if (respuesta.data && respuesta.data.data && Array.isArray(respuesta.data.data)) {
            // Acceder al array "menu" dentro del primer elemento de "data"
            const menu = respuesta.data.data[0].menu;

            // Verificar si "menu" es un array
            if (Array.isArray(menu)) {
                mostrarMenu(menu);
            } else {
                console.error('El campo "menu" no es un array:', menu);
            }
        } else {
            console.error('La respuesta no tiene la estructura esperada:', respuesta.data);
        }
    } catch (error) {
        console.error('Error al obtener el menú:', error.message);
    }
}

    function mostrarMenu(menu) {
        const contenido = document.querySelector('#menu .contenido');
        contenido.innerHTML = ''; // Limpiar el contenido anterior
    
        // Verificar si menu es un array
        if (!Array.isArray(menu)) {
            console.error('El parámetro menu no es un array:', menu);
            return;
        }
    
        menu.forEach(item => {
            const fila = document.createElement('div');
            fila.classList.add('row', 'border-top');
    
            const nombre = document.createElement('div');
            nombre.classList.add('col-md-3', 'py-3');
            nombre.textContent = item.nombre;
    
            const precio = document.createElement('div');
            precio.classList.add('col-md-3', 'py-3');
            precio.textContent = `$${item.precio}`;
    
            const categoria = document.createElement('div');
            categoria.classList.add('col-md-3', 'py-3');
            categoria.textContent = categorias[item.categoria];
    
            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'number';
            inputCantidad.min = 0;
            inputCantidad.value = 0;
            inputCantidad.id = `producto-${item.id}`;
            inputCantidad.classList.add('form-control');
            inputCantidad.oninput = function() {
                const cantidad = parseInt(inputCantidad.value);
                agregarOrden({ ...item, cantidad });
            };
    
            const agregar = document.createElement('div');
            agregar.classList.add('col-md-3', 'py-3');
            agregar.appendChild(inputCantidad);
    
            fila.appendChild(nombre);
            fila.appendChild(precio);
            fila.appendChild(categoria);
            fila.appendChild(agregar);
    
            contenido.appendChild(fila);
        });
    }

function agregarOrden(producto){
    let {pedido} = cliente
   // console.log(pedido)
    //console.log(producto)
    
    //si cantidad > 0
    //catidad ==0 
    
    if(producto.cantidad>0){
        //validar que el producto exista
        //console.log(pedido)
        if(pedido.some(i => i.id === producto.id)){
            //aqui se puede hacer con some porque some retorna con un booleano
            // y debe ser con pedido porque pedido es una arreglo 
            //y producto es un objeto

            //console.log(pedido)
            const pedidoActualizado = pedido.map(i=>{
                if(i.id === producto.id){
                    i.cantidad = producto.cantidad
                }
                    return i
                
            })
          //  console.log('pedido actualizado')
                cliente.pedido = [... pedidoActualizado]
        }else{
            //el caso de que no exista el item
            //lo agregamos como un nuevo item
         //   console.log('no existe el producto, lo agrego')
            cliente.pedido = [...pedido,producto]
           // console.log(cliente.pedido)
        }
    }else{
        const res = pedido.filter(i=> i.id !== producto.id
        )
        //console.log(res)
        cliente.pedido = res
       // console.log(cliente.pedido)

}
limpiarHTML()

    if(cliente.pedido.length){
        actualizarResumen()
    }else{
        //pedido vacio
        mensajePedidoVacio()
    }


}


function actualizarResumen(){
    const resumen  = document.createElement('div')
    resumen.classList.add('col-md-6','card','py-5','px-3','shadow')

    //mostrar mesa
    const mesa = document.createElement('p')
    mesa.textContent = `Mesa: ${cliente.mesa}`
    mesa.classList.add('fw-bold')

    //mostrar Hora
    const hora = document.createElement('p')
    hora.textContent = `Hora: ${cliente.hora}`
    hora.classList.add('fw-bold')

    //mostrar items del menu cosumido
    const heading = document.createElement('h3')
    heading.textContent = `Pedidos:`
    heading.classList.add('my-4')

    //extraer pedido del objeto cliente

    const {pedido} = cliente
    console.log(pedido)
    const grupo = document.createElement('ul')
    grupo.classList.add('list-group')

    pedido.forEach(i=>{
        
        const {nombre,precio,cantidad,id} = i
        const lista = document.createElement('li')
        lista.classList.add('list-group-item')

        const nombreP = document.createElement('h4')
        nombreP.classList.add('text-center', 'my-4')
        nombreP.textContent = `Nombre : ${nombre}`

        const precioP = document.createElement('p')
        precioP.classList.add('fw-bold')
        precioP.textContent = `Precio : $ ${precio}`

        const CantidadP = document.createElement('p')
        CantidadP.classList.add('fw-bold')
        CantidadP.textContent = `Cantidad : ${cantidad}`

        const subtotalP = document.createElement('p')
        subtotalP.classList.add('fw-bold')
        subtotalP.textContent = `SubTotal: ${calcularSubtotal(i)}`

        const btnEliminar = document.createElement('button')
        btnEliminar.classList.add('btn','btn-danger')
        btnEliminar.textContent = 'Eliminar Pedido'

        btnEliminar.onclick = function(){
            eliminarProducto(id)
        }

        lista.appendChild(nombreP)
        lista.appendChild(precioP)
        lista.appendChild(CantidadP)
        lista.appendChild(subtotalP)
        lista.appendChild(btnEliminar)

        grupo.appendChild(lista)
    })

    resumen.appendChild(mesa)
    resumen.appendChild(hora)
    resumen.appendChild(heading)
    resumen.appendChild(grupo)

    contenido.appendChild(resumen)

    formularioPropinas()
}

function formularioPropinas(){
    const formulario = document.createElement('div')
    formulario.classList.add('col-md-6','formulario')

    const heading =document.createElement('h3')
    heading.classList.add('my-4')
    heading.textContent = 'Propina'

    //Propina 10%
    //const checkBox = document.createElement('input')
    const checkBox10 = document.createElement('input')
    checkBox10.type = 'radio'
    checkBox10.name = 'propina'
    checkBox10.value = '10'
    //checkBox10.textContent = 'prueba'
    checkBox10.classList.add('form-check-input')
    console.log('llamado a celular propina')
   // console.log(checkBox10)

   //***************OJO */

   checkBox10.onclick = calcularPropina

   const checkBox110 = document.createElement('label')
   checkBox110.textContent = '10%'
   checkBox110.classList.add('form-check-label')

   const checkDiv10 = document.createElement('div')
   checkDiv10.classList.add('form-check')

   console.log(checkDiv10)
   checkDiv10.appendChild(checkBox10)
   checkDiv10.appendChild(checkBox110)

   //propina 25%

   const checkBox25 = document.createElement('input')
   checkBox25.type = 'radio'
   checkBox25.name = 'propina'
   checkBox25.value = '25'
   checkBox25.classList.add('form-check-input')
   //console.log(checkBox25)
   checkBox25.onclick = calcularPropina

   const checkLabel25 = document.createElement('label')
   checkLabel25.textContent = '25%'
   checkLabel25.classList.add('form-check-label')

   const checkDiv25 = document.createElement('div')
   checkDiv25.classList.add('form-check')

   checkDiv25.appendChild(checkBox25)
   checkDiv25.appendChild(checkLabel25)

   formulario.appendChild(checkDiv10)
   formulario.appendChild(checkDiv25)
   contenido.appendChild(formulario)

}

function calcularPropina() {
    console.log('calcular propina');
    const radioSeleccionado = document.querySelector('[name="propina"]:checked').value;
    console.log(radioSeleccionado);

    const { pedido } = cliente;
    let subtotal = 0;
    pedido.forEach(item => {
        subtotal += item.cantidad * item.precio;
    });

    const propina = ((subtotal * parseInt(radioSeleccionado)) / 100)
    const total = propina + subtotal;

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar');

    // Subtotales, propina y total (código existente)
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalP = document.createElement('span');
    subtotalP.classList.add('fs-normal');
    subtotalP.textContent = `$${subtotal}`;
    subtotalParrafo.appendChild(subtotalP);

    const propinaParrafo = document.createElement('span');
    propinaParrafo.classList.add('fw-normal');
    propinaParrafo.textContent = 'Propina: ';

    const propinaP = document.createElement('span');
    propinaP.classList.add('fw-normal');
    propinaP.textContent = `$${propina}`;
    propinaParrafo.appendChild(propinaP);

    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3', 'fw-bold');
    totalParrafo.textContent = 'Total a Pagar: ';

    const totalp = document.createElement('p');
    totalp.classList.add('fs-normal');
    totalp.textContent = `$${total}`;

    // Crear botón "Guardar Pedido"
    const botonGuardar = document.createElement('button');
    botonGuardar.textContent = "Guardar Pedido";
    botonGuardar.classList.add('btn', 'btn-success', 'mt-3');
    botonGuardar.addEventListener('click', () => {
        guardarPedidoEnMesa(total);
    });

    // Crear botón "Actualizar Pedido"
    const botonActualizar = document.createElement('button');
    botonActualizar.textContent = "Actualizar Pedido";
    botonActualizar.classList.add('btn', 'btn-warning', 'mt-3', 'ms-2');
    botonActualizar.style.display = 'none'; // Ocultar inicialmente
    botonActualizar.addEventListener('click', () => {
        const idMesa = cliente.id; // Asegúrate de que el ID de la mesa esté disponible en el objeto `cliente`
        actualizarPedidoEnMesa(total, idMesa);
    });

    // Agregar botones al contenedor
    const botonesContainer = document.createElement('div');
    botonesContainer.classList.add('d-flex', 'justify-content-end');
    botonesContainer.appendChild(botonGuardar);
    botonesContainer.appendChild(botonActualizar);

    // Agregar elementos al contenedor de totales
    totalParrafo.appendChild(totalp);

    const totalPagarDiv = document.querySelector('.total-pagar');
    if (totalPagarDiv) {
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);
    divTotales.appendChild(botonesContainer);

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(divTotales);

    // Devolver referencias a los botones para manipularlos fuera de esta función
    return { botonGuardar, botonActualizar };
}

// Función para mostrar el botón "Actualizar Pedido" y ocultar "Guardar Pedido"
function mostrarBotonActualizar(botonGuardar, botonActualizar) {
    botonGuardar.style.display = 'none';
    botonActualizar.style.display = 'block';
}

// Función para mostrar el botón "Guardar Pedido" y ocultar "Actualizar Pedido"
function mostrarBotonGuardar(botonGuardar, botonActualizar) {
    botonGuardar.style.display = 'block';
    botonActualizar.style.display = 'none';
}



async function guardarPedidoEnMesa(total) {
    const { mesa, hora, pedido } = cliente;

    // Calcular la propina (puedes ajustar esto según tu lógica)
    const propina = total;

    // Estructurar los datos para enviar al backend
    const datosReserva = {
        mesa: parseInt(mesa), // Asegúrate de que sea un número
        hora,
        pedidos: pedido.map(item => ({
            id: item.id,
            producto: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            subtotal: item.cantidad * item.precio
        })),
        propina,
        total
    };

    try {
        // Enviar los datos al backend para crear una nueva reserva
        const respuesta = await axios.post('api/mesas/reservaMesa', datosReserva);
        console.log('Reserva guardada correctamente:', respuesta.data);

        // Limpiar el estado del cliente después de guardar
        cliente = {
            mesa: '',
            hora: '',
            pedido: []
        };

        // Actualizar la interfaz de usuario
        limpiarHTML();
        mensajePedidoVacio();
    } catch (error) {
        console.error('Error al guardar la reserva:', error.message);

        // Mostrar un mensaje de error al usuario
        alert('Hubo un error al guardar la reserva. Por favor, inténtalo de nuevo.');
    }
}


function calcularSubtotal(i){
    const {cantidad,precio} = i
    return `$ ${cantidad*precio}`
}


function eliminarProducto(id){
    const {pedido} = cliente
    cliente.pedido = pedido.filter(i=>i.id !== id)

    limpiarHTML()

    if(cliente.pedido.length){
        actualizarResumen()
    }else{
        mensajePedidoVacio()
    }

    //ahora como eliminamos el producto debemos actulizar la cantidad a cero
    console.log(id)
    const productoEliminado = `#producto-${id}`
    const inputEliminado = document.querySelector(productoEliminado)
    inputEliminado.value = 0

}

function mensajePedidoVacio(){
    const texto = document.createElement('p')
    texto.textContent = "Agrega Productos al Pedido"
    texto.classList.add('text-center')
 
    contenido.appendChild(texto)
}



function limpiarHTML(){

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }

}


// agregar un boton para agregar una nueva mesa (se puede hacer con tap o con acordeon)
//hacerle json 


//nota de la nota agregar un boton para guardar la mesa
//agregar en el json los datos de la mesa
//agregar en el boton de menudespues de agregar dicho boton un boton para editar o eliminar el pedido de la mesa
//en el modal acordeon establecer los datos guardados

// Función para obtener y mostrar las mesas reservadas
async function obtenerMesasReservadas() {
    try {
        const url = 'api/mesas/lista-mesas';
        console.log('Realizando solicitud a:', url);

        const respuesta = await axios.get(url);
        console.log('Respuesta recibida:', respuesta.data);

        // Verificar si la respuesta tiene la estructura esperada
        if (respuesta.data && respuesta.data.data && Array.isArray(respuesta.data.data)) {
            mostrarMesasEnModal(respuesta.data.data);
        } else {
            console.error('La respuesta no tiene la estructura esperada:', respuesta.data);
        }
    } catch (error) {
        console.error('Error al obtener las mesas reservadas:', error.message);
    }
}

// Función para mostrar las mesas en el modal
function mostrarMesasEnModal(mesas) {
    const contenidoMesas = document.querySelector('#contenido-mesas');
    contenidoMesas.innerHTML = ''; // Limpiar el contenido anterior

    mesas.forEach((mesa, index) => {
        // Crear el acordeón para cada mesa
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');

        // Crear el encabezado del acordeón
        const accordionHeader = document.createElement('h2');
        accordionHeader.classList.add('accordion-header');
        accordionHeader.id = `heading${index}`;

        const accordionButton = document.createElement('button');
        accordionButton.classList.add('accordion-button', 'collapsed');
        accordionButton.type = 'button';
        accordionButton.setAttribute('data-bs-toggle', 'collapse');
        accordionButton.setAttribute('data-bs-target', `#collapse${index}`);
        accordionButton.setAttribute('aria-expanded', 'false');
        accordionButton.setAttribute('aria-controls', `collapse${index}`);
        accordionButton.textContent = `Mesa: ${mesa.mesa} - Hora: ${mesa.hora} - Total: $${mesa.total}`;

        accordionHeader.appendChild(accordionButton);

        // Crear el cuerpo del acordeón
        const accordionCollapse = document.createElement('div');
        accordionCollapse.id = `collapse${index}`;
        accordionCollapse.classList.add('accordion-collapse', 'collapse');
        accordionCollapse.setAttribute('aria-labelledby', `heading${index}`);
        accordionCollapse.setAttribute('data-bs-parent', '#contenido-mesas');

        const accordionBody = document.createElement('div');
        accordionBody.classList.add('accordion-body');

        // Mostrar los detalles de los pedidos
        const pedidosLista = document.createElement('ul');
        pedidosLista.classList.add('list-group');

        mesa.pedidos.forEach(pedido => {
            const itemLista = document.createElement('li');
            itemLista.classList.add('list-group-item');
            itemLista.textContent = `${pedido.producto} - Cantidad: ${pedido.cantidad} - Subtotal: $${pedido.subtotal}`;
            pedidosLista.appendChild(itemLista);
        });

        // Botones de editar y eliminar
        const botonesAccion = document.createElement('div');
        botonesAccion.classList.add('d-flex', 'justify-content-end', 'mt-3');

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-warning', 'me-2');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => {
            const { botonGuardar, botonActualizar } = calcularPropina();
            editarMesa(mesa.id, botonGuardar, botonActualizar);
        }; // Función para editar

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarMesa(mesa.id); // Función para eliminar

        botonesAccion.appendChild(btnEditar);
        botonesAccion.appendChild(btnEliminar);

        accordionBody.appendChild(pedidosLista);
        accordionBody.appendChild(botonesAccion);
        accordionCollapse.appendChild(accordionBody);

        // Agregar el encabezado y el cuerpo al acordeón
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);

        // Agregar el acordeón al contenido del modal
        contenidoMesas.appendChild(accordionItem);
    });
}

// Llamar a la función cuando se abra el modal
const mesas = document.getElementById('mesas')
mesas.addEventListener('show.bs.modal', obtenerMesasReservadas);

async function eliminarMesa(id) {
    try {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta mesa?');
        if (!confirmacion) return;

        const respuesta = await axios.delete(`api/mesas/eliminar-mesa/${id}`);
        console.log('Mesa eliminada:', respuesta.data);

        // Actualizar la lista de mesas en el modal
        obtenerMesasReservadas();
    } catch (error) {
        console.error('Error al eliminar la mesa:', error.message);
        alert('Hubo un error al eliminar la mesa. Por favor, inténtalo de nuevo.');
    }
}

async function editarMesa(id, botonGuardar, botonActualizar) {
    try {
        // Verificar que los botones existan
        if (!botonGuardar || !botonActualizar) {
            throw new Error('Los botones no están definidos');
        }

        // Obtener los datos de la mesa desde el backend
        const respuesta = await axios.get(`api/mesas/obtener-mesa/${id}`);
        const mesa = respuesta.data.data;

        // Cargar los datos en la interfaz
        cargarDatosEnInterfaz(mesa);

        // Mostrar el botón "Actualizar Pedido" y ocultar "Guardar Pedido"
        botonGuardar.style.display = 'none';
        botonActualizar.style.display = 'block';

        // Guardar el ID de la mesa en el objeto `cliente` para usarlo al actualizar
        cliente.id = mesa.id;
    } catch (error) {
        console.error('Error al obtener los datos de la mesa:', error.message);
        alert('Hubo un error al cargar la mesa. Por favor, inténtalo de nuevo.');
    }
}

function cargarDatosEnInterfaz(mesa) {
    // Cargar la mesa y la hora
    document.querySelector('#mesa').value = mesa.mesa;
    document.querySelector('#hora').value = mesa.hora;

    // Limpiar el pedido actual
    cliente.pedido = [];

    // Cargar los pedidos
    mesa.pedidos.forEach(pedido => {
        const producto = {
            id: pedido.id,
            nombre: pedido.producto,
            precio: pedido.precio,
            cantidad: pedido.cantidad
        };

        // Agregar el producto al pedido del cliente
        cliente.pedido.push(producto);

        // Actualizar la interfaz para reflejar el pedido
        const inputCantidad = document.querySelector(`#producto-${producto.id}`);
        if (inputCantidad) {
            inputCantidad.value = producto.cantidad;
        }
    });

    // Actualizar el resumen del pedido
    actualizarResumen();
}

async function actualizarPedidoEnMesa(total, id) {
    const { mesa, hora, pedido } = cliente;

    // Calcular la propina (puedes ajustar esto según tu lógica)
    const propina = total;

    // Estructurar los datos para enviar al backend
    const datosReserva = {
        mesa: parseInt(mesa), // Asegúrate de que sea un número
        hora,
        pedidos: pedido.map(item => ({
            id: item.id,
            producto: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            subtotal: item.cantidad * item.precio
        })),
        propina,
        total
    };

    try {
        // Enviar los datos al backend para actualizar la reserva
        const respuesta = await axios.put(`api/mesas/actualizar-mesa/${id}`, datosReserva);
        console.log('Reserva actualizada correctamente:', respuesta.data);

        // Limpiar el estado del cliente después de actualizar
        cliente = {
            mesa: '',
            hora: '',
            pedido: []
        };

        // Actualizar la interfaz de usuario
        limpiarHTML();
        mensajePedidoVacio();
    } catch (error) {
        console.error('Error al actualizar la reserva:', error.message);

        // Mostrar un mensaje de error al usuario
        alert('Hubo un error al actualizar la reserva. Por favor, inténtalo de nuevo.');
    }
}