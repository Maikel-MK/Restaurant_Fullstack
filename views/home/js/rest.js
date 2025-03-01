const btnGuardarCliente = document.querySelector('#guardar-cliente')
const contenido = document.querySelector('#resumen .contenido')

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

function guardarcliente(){
    //console.log('si guardoo')
    const mesa = document.querySelector('#mesa').value 
    const hora = document.querySelector('#hora').value 

    //una foramde validar si no esta vacio sin el if es:
    const camposVacios = [mesa,hora].some(i=>i=='')//some lo toma para un booleano que si al menos 1 de los que estan alli esta vacio todo saldra false
    //si todos estan vacios saldra true

    //esta es la manera para que no se repitan los mensajes (en este caso los de error)

    if(camposVacios){
        const existeAlerta = document.querySelector('.invalida')

        if(!existeAlerta){
            const alerta = document.createElement('div')
            alerta.textContent = "Los Campos Son Obligatorios"
            alerta.classList.add('invalida')
            document.querySelector('.modal-body form').appendChild(alerta)
    
            setTimeout(()=>{
                alerta.remove()
            },3000)
        }
        
    }else{
        //en caso que los campos esten llenos
        //console.log('campos llenos') 
        cliente = {...cliente,mesa,hora}

        //cuando le de al boton de cerrar oculte la ventana modal

        var modalFormulario = document.querySelector('#formulario')
        var modal = bootstrap.Modal.getInstance(modalFormulario)
        modal.hide()

        mostrarSecciones()
        obtenerMenu()
    }
}
function mostrarSecciones(){
    const secciones = document.querySelectorAll('.d-none')
    //console.log(secciones)
    secciones.forEach(i => i.classList.remove('d-none'))
}


function obtenerMenu(){
    const url = 'http://localhost:4000/menu'
    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(res=>mostrarMenu(res))
    .catch(error=>console.log(error))
}

function mostrarMenu(menu){
   // console.log('mostrar')
    //console.log(menu)

    const contenido = document.querySelector('#menu .contenido')

    menu.forEach(i=>{
        const fila = document.createElement('div')
        fila.classList.add('row','border-top')

        const nombre = document.createElement('div')
        nombre.classList.add('col-md-3', 'py-3')
        nombre.textContent = i.nombre

        const precio = document.createElement('div')
        precio.classList.add('col-md-3', 'py-3')
        precio.textContent = `$${i.precio}`
     //   '$',i.precio

        const categoria = document.createElement('div')
        categoria.classList.add('col-md-3', 'py-3')
        categoria.textContent = categorias[i.categoria]

        const inputCantidad = document.createElement('input')
        inputCantidad.type = 'number'
        inputCantidad.min = 0
        inputCantidad.value = 0
        inputCantidad.id = `producto-${i.id}`
        inputCantidad.classList.add('form-control')
        inputCantidad.oninput = function(){ //con oninput se puede crear una funcion que haga que acepte solamente nuemros para validarlos
            const cantidad = parseInt(inputCantidad.value)
            agregarOrden({...i,cantidad})
        }

        const agregar = document.createElement('div')
        agregar.classList.add('col-md-3', 'py-3')
        agregar.appendChild(inputCantidad)

        fila.appendChild(nombre)
        fila.appendChild(precio)
        fila.appendChild(categoria)
        fila.appendChild(agregar)


        contenido.appendChild(fila)
    })
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

    const botonGuardar = document.createElement('button');
    botonGuardar.textContent = "Guardar Pedido";
    botonGuardar.classList.add('btn', 'btn-success', 'mt-3');
    botonGuardar.addEventListener('click', function() {
        guardarPedidoEnMesa(total);
    });

    totalParrafo.appendChild(totalp);

    const totalPagarDiv = document.querySelector('.total-pagar');
    if (totalPagarDiv) {
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);
    divTotales.appendChild(botonGuardar);

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(divTotales);
}

function guardarPedidoEnMesa(total) {
    const pedidoCompleto = {
        mesa: cliente.mesa,
        hora: cliente.hora,
        pedido: cliente.pedido,
        total: total
    };

    mesa.push(pedidoCompleto);
    console.log(mesa); // Para verificar que se guardó correctamente
    mostrarModalMesonero();
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


document.getElementById('mesas').addEventListener('show.bs.modal', function () {
    mostrarPedidosEnModal();
});
function mostrarPedidosEnModal() {
    const contenidoMesas = document.querySelector('#contenido-mesas');
    contenidoMesas.innerHTML = ''; // Limpiar el contenido anterior

    mesa.forEach((pedido, index) => {
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
        accordionButton.textContent = `Mesa: ${pedido.mesa} - Hora: ${pedido.hora} - Total: $${pedido.total}`;

        accordionHeader.appendChild(accordionButton);

        // Crear el cuerpo del acordeón
        const accordionCollapse = document.createElement('div');
        accordionCollapse.id = `collapse${index}`;
        accordionCollapse.classList.add('accordion-collapse', 'collapse');
        accordionCollapse.setAttribute('aria-labelledby', `heading${index}`);
        accordionCollapse.setAttribute('data-bs-parent', '#contenido-mesas');

        const accordionBody = document.createElement('div');
        accordionBody.classList.add('accordion-body');

        // Mostrar los detalles del pedido
        const pedidoLista = document.createElement('ul');
        pedidoLista.classList.add('list-group');

        pedido.pedido.forEach(item => {
            const itemLista = document.createElement('li');
            itemLista.classList.add('list-group-item');
            itemLista.textContent = `${item.nombre} - Cantidad: ${item.cantidad} - Subtotal: $${item.cantidad * item.precio}`;
            pedidoLista.appendChild(itemLista);
        });

        accordionBody.appendChild(pedidoLista);
        accordionCollapse.appendChild(accordionBody);

        // Agregar el encabezado y el cuerpo al acordeón
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);

        // Agregar el acordeón al contenido del modal
        contenidoMesas.appendChild(accordionItem);
    });
}
