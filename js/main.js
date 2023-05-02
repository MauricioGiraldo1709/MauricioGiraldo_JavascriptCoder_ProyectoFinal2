let contenedorDeDestinos = document.getElementById("selectDestino");
let consultaEdad = document.getElementById('edadAConsultar')
consultaEdad.addEventListener('submit',muestraEdad)

const usuarioJSON = localStorage.getItem('usuario');
if (usuarioJSON) {
  const usuario = JSON.parse(usuarioJSON);
  document.getElementById('nombre').value = usuario.nombre;
  document.getElementById('apellido').value = usuario.apellido;
  document.getElementById('edad').value = usuario.edad;
}

//Función que pregunta al usuario si es mayor/menor de edad, solo si es mayor podrá acceder
function muestraEdad(e) {
  e.preventDefault();
  let nombreUsuario = document.getElementById('nombre').value
  let apellidoUsuario = document.getElementById('apellido').value
  let edadUsuario = document.getElementById('edad').value
  let cajaEdad = document.getElementById('mensajeEdad')
  if (edadUsuario <= 17) {
    Swal.fire({
      title: 'Lo sentimos',
      text: `${nombreUsuario} ${apellidoUsuario} usted tiene ${edadUsuario}, no es mayor de edad, no puede agendar un viaje`,
      icon: 'error'
    });
  } else {
      // Muestra el select de destinos solo si el usuario es mayor de edad
      Swal.fire({
        title: 'Bienvenido(a)',
        text: `${nombreUsuario} ${apellidoUsuario}, usted tiene ${edadUsuario}, puede agendar un viaje!`,
        icon: 'success'
      });
      destinosPromise.then((destinos) => {
          selectPaises(
              "el destino",
              contenedorDeDestinos,
              destinos,
              "seleccionPais"
          );
      });
      // Crear objeto usuario
      const usuario = {
        nombre: nombreUsuario,
        apellido: apellidoUsuario,
        edad: edadUsuario
      };

      // Convertir objeto a JSON
      const usuarioJSON = JSON.stringify(usuario);

      // Guardar en LocalStorage
      localStorage.setItem('usuario', usuarioJSON);
  }
}

const destinosPromise = opcionesDeViaje();
let destinos = [];
//Función que por medio de fetch y un forEach llama los datos del archivo data.json, para insertarlos en el array destinos
function opcionesDeViaje() {
    return new Promise((resolve, reject) => {
      fetch("../json/data.json")
        .then((response) => response.json())
        .then((data) => {
            //Este forEach trae los datos del archivo json
          data.forEach((destino) => {
            const pais = destino.pais;
            const provincia = destino.provincia;
            const precio = destino.precio
            const existePais = destinos.find(
              (destino) => destino.pais === pais
            );
            if (!existePais) {
              destinos.push({ pais: pais, provincias: [{provincia: provincia, precio: precio}] });
            } else {
              existePais.provincias.push({provincia: provincia, precio: precio});
            }
          });
          resolve(destinos);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
  
//Función que llama los datos 
function selectPaises(destinoElegido, contenedor, array, idSeleccion) {
  let divSeleccion = document.createElement("div")
  divSeleccion.classList.add('form-group', 'selector')
  let labelSeLect = document.createElement("label")
  labelSeLect.innerText =`Seleccione ${destinoElegido}`
  labelSeLect.setAttribute('for','required',idSeleccion)

  let seleccion = document.createElement("select");
  seleccion.className = 'form-select'
  seleccion.innerHTML = `<option value = ''>Seleccione ${destinoElegido} </option>
    ${
      array.map((pais) => {
        return `<option value=${pais.pais}>${pais.pais}</option>`;
      }).join("")}
    }
    `;

  contenedor.querySelector('#' + idSeleccion)?.remove()
  seleccion.setAttribute("id", idSeleccion)
  divSeleccion.appendChild(labelSeLect)
  divSeleccion.appendChild(seleccion)
  contenedor.appendChild(divSeleccion)
  seleccion.addEventListener("change",elegirPais.bind(null,contenedor,array))
}
  
function elegirPais(contenedor,array,e) {
  const paisElegido = e.target.value
  const destinoSeleccionado = array.find((destino)=> destino.pais === paisElegido)
  
  if (destinoSeleccionado) {
    let seleccionDeProvincias = document.createElement('select')
    seleccionDeProvincias.className = 'form-select'
    seleccionDeProvincias.innerHTML = `<option value=''>Seleccione la provincia</option>
      ${
        destinoSeleccionado.provincias.map((provincia) => {
          return `<option value="${provincia.provincia}">${provincia.provincia}</option>`;
        }).join('')}`;
    seleccionDeProvincias.setAttribute('id', 'selectProvincia');
    seleccionDeProvincias.setAttribute('required',true)

    const anteriorSelect = contenedor.querySelector('#selectProvincia')
    if (anteriorSelect) {
      anteriorSelect.replaceWith(seleccionDeProvincias)
    } else {
      let divSeleccionProvincias = document.createElement("div")
      divSeleccionProvincias.classList.add('form-group', 'selector')
      let labelSelectProvincias = document.createElement('label')
      labelSelectProvincias.innerText = 'Seleccione la provincia'
      divSeleccionProvincias.appendChild(labelSelectProvincias)
      divSeleccionProvincias.appendChild(seleccionDeProvincias)
      contenedor.appendChild(divSeleccionProvincias)
    }
      
    //input para indicar la cantidad de días a estar en el destino
    let inputDias = document.createElement('input')
    inputDias.setAttribute('type', 'number')
    inputDias.setAttribute('id', 'inputDias')
    inputDias.setAttribute('required', true)
    inputDias.className = 'form-control'
    inputDias.setAttribute('placeholder', 'Ingrese la cantidad de días aquí')

    let labelDias = document.createElement('label')
    labelDias.setAttribute('for', 'inputDias')
    labelDias.innerText = 'Ingrese la cantidad de días que pasará en su destino:'

    //Calendario para marcar la fecha de salida del viaje
    let fechaSalida = document.createElement("input")
    fechaSalida.setAttribute("type", "date")
    fechaSalida.setAttribute("id", "fechaSalida")
    fechaSalida.className = "form-control"
    fechaSalida.setAttribute("placeholder", "Seleccione la fecha aquí")

    let fechaSalidaLabel = document.createElement('label')
    fechaSalidaLabel.setAttribute('for', 'fechaSalida')
    fechaSalida.setAttribute('required', true)
    fechaSalidaLabel.innerText = 'Seleccione una fecha de salida para su viaje:'
      
    //Calendario para marcar la fecha de retorno del viaje
    let fechaRetorno = document.createElement('input')
    fechaRetorno.setAttribute('type', 'date')
    fechaRetorno.setAttribute('id', 'fechaRetorno')
    fechaRetorno.setAttribute('required', true)
    fechaRetorno.className = 'form-control'
    fechaRetorno.setAttribute('placeholder', 'Seleccione la fecha aquí')

    let fechaRetornoLabel = document.createElement('label')
    fechaRetornoLabel.setAttribute('for', 'fechaRetorno')
    fechaRetornoLabel.innerText = 'Seleccione una fecha de retorno para su viaje:'


    let btnReservarViaje = document.createElement("button")
    btnReservarViaje.className = 'button2'
    btnReservarViaje.type = 'submit'
    btnReservarViaje.innerText = "Reservar Viaje"

    const anteriorInput = contenedor.querySelector('#inputDias')
    const anteriorBtn = contenedor.querySelector('button')
    const anteriorInputFechaSalida = contenedor.querySelector("#fechaSalida")
    const anteriorInputFechaRetorno = contenedor.querySelector("#fechaRetorno")

    if (anteriorInput && anteriorBtn && anteriorInputFechaSalida && anteriorInputFechaRetorno) {
      anteriorInput.replaceWith(inputDias)
      anteriorInputFechaSalida.replaceWith(fechaSalida)
      anteriorInputFechaRetorno.replaceWith(fechaRetorno)
      anteriorBtn.replaceWith(btnReservarViaje)
    } else {
      contenedor.appendChild(labelDias)
      contenedor.appendChild(inputDias)
      contenedor.appendChild(fechaSalidaLabel)
      contenedor.appendChild(fechaSalida)
      contenedor.appendChild(fechaRetornoLabel)
      contenedor.appendChild(fechaRetorno)
      contenedor.appendChild(btnReservarViaje)
    }


    btnReservarViaje.addEventListener("click", () => {
      e.preventDefault();
      const dias = inputDias.value;
      const fechaSalidaViaje = fechaSalida.value
      const fechaRetornoViaje = fechaRetorno.value
      if (dias === '' || fechaSalidaViaje === '' || fechaRetornoViaje === '') {
        swal.fire({
          icon: 'warning',
          title: '¡Faltan campos obligatorios!',
          text: 'Por favor, completa todos los campos obligatorios para continuar.'
        });
        return;
      }
      const precio = destinoSeleccionado.provincias.find((provincia) => provincia.provincia === seleccionDeProvincias.value)?.precio ?? 0
      const costoTotal = precio * 2
      
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: '¿Estás seguro en reservar?',
        text: "Los campos se guardarán de la manera actual",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Sí, quiero reservarlo!',
        cancelButtonText: '¡No, editaré los datos!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            '¡Reservado!',
            `Tu viaje para el ${fechaSalidaViaje}, con retorno en la fecha ${fechaRetornoViaje} ha sido reservado. Estarás en dicho destino por ${dias} días y el costo es de $${costoTotal}`,
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Puedes seguir editando los datos',
            'error'
          )
        }
      })
    });

    seleccionDeProvincias.addEventListener("change", (e)=>{
      const provinciaElegida = e.target.value
      const destino = array.find((destino)=> destino.pais === paisElegido && destino.provincias.some((provincia) => provincia.provincia === provinciaElegida))
      if (destino) {
        const precio = destino.provincias.find((provincia) => provincia.provincia === provinciaElegida).precio || "desconocido"

      }
    })
  }
}