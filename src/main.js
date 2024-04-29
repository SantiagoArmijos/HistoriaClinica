//Clase Persona
class Persona {
    constructor(id, imagen, nombre, cedula, celular, direccion, fecha_nacimiento, pais_nacimiento, ciudad_nacimiento) {
        this.id = id;
        this.imagen = imagen;
        this.nombre = nombre;
        this.cedula = cedula;
        this.celular = celular;
        this.direccion = direccion;
        this.fecha_nacimiento = fecha_nacimiento;
        this.pais_nacimiento = pais_nacimiento;
        this.ciudad_nacimiento = ciudad_nacimiento;
        this.listahijos = [];
        this.listaConsultas = [];
    }
}

//Clase Hijo
class Hijo {
    constructor(nombre, parentezco, fecha_nacimiento){
        this.nombre = nombre;
        this.parentezco = parentezco;
        this.fecha_nacimiento = fecha_nacimiento;
    }
}

//Clase Consulta
class Consulta {
    constructor(fecha, motivo, estado){
        this.fecha = fecha;
        this.motivo = motivo;
        this.estado = estado;
    }
}

//Objeto Persona default
const Persona1 = new Persona(1, "imagenes/profile/persona1.jpg", "Santiago Armijos G.", "0106908742", "0996426065", "Av. 27 de Febrero 2-95", "2001-03-21T16:15", "Ecuador", "Cuenca");

//Lista de personas
const lista_personas = [Persona1];
let idPersona;

//Elementos HTML
const selectUsuario = document.querySelector('#lista_usuarios');
const foto_usuario = document.querySelector('#foto_perfil');
const nombre_usuario = document.querySelector('#nombre_usuario');
const cedula_usuario = document.querySelector('#cedula_usuario');
const celular_usuario = document.querySelector('#celular_usuario');
const direccion_usuario = document.querySelector('#direccion_usuario');
const edad_usuario = document.querySelector('#edad_usuario');
const pais_usuario = document.querySelector('#pais_usuario');
const ciudad_usuario = document.querySelector('#ciudad_usuario');
const btn_guardar_editar = document.querySelector('#btn_guardar_editar');
const btn_guardar_nuevo = document.querySelector('#btn_guardar_nuevo');
const tabla_hijos = document.querySelector('#tabla_hijos');
const btn_guardar_hijo = document.querySelector('#btn_guardar_hijo');
const tabla_consultas = document.querySelector('#tabla_consultas');
const btn_guardar_consulta = document.querySelector('#btn_guardar_consulta');

lista_personas.sort((a, b) => a.id - b.id);
//Poner las personas de la lista en la select list
function actualizar_lista(){
    lista_personas.forEach(persona => {
        const option = document.createElement('option');
        option.value = persona.id;
        option.textContent = persona.id + ". " + persona.nombre;
        selectUsuario.appendChild(option);
    });
}

actualizar_lista();

//Lista los datos de la Persona
selectUsuario.addEventListener('change', function() {
    idPersona = this.value;
    // Verificar si el valor seleccionado es un número
    if (!isNaN(idPersona)) {
        const personaSeleccionada = lista_personas.find(persona => persona.id === parseInt(idPersona));
            
        // Verificar si se encontró la persona
        if (personaSeleccionada) {
            cambiarHtml(personaSeleccionada.imagen, personaSeleccionada.nombre, personaSeleccionada.cedula, personaSeleccionada.celular, personaSeleccionada.direccion, personaSeleccionada.fecha_nacimiento, personaSeleccionada.pais_nacimiento, personaSeleccionada.ciudad_nacimiento);
            listarHijos(personaSeleccionada);
            listarConsultas(personaSeleccionada);
        } else {
            foto_usuario.src = "./imagenes/user.png";
        }
    } 
    if (idPersona === "default") {
        foto_usuario.src = "./imagenes/user.png";
        nombre_usuario.textContent = "";
        cedula_usuario.textContent = "";
        celular_usuario.textContent = "";
        direccion_usuario.textContent = "";
        edad_usuario.textContent = "";
        pais_usuario.textContent = "";
        ciudad_usuario.textContent = "";
        tabla_hijos.innerHTML = '';
        tabla_consultas.innerHTML = '';
    }
});

//Editar usuario
btn_guardar_editar.addEventListener('click', function(event) {
    event.preventDefault(); 
    editarUsuario();
});

//Nuevo usuario
btn_guardar_nuevo.addEventListener('click', function(event){
    event.preventDefault(); 
    nuevoUsuario();
});

//Añadir Hijos
btn_guardar_hijo.addEventListener('click', function(event){
    event.preventDefault(); 
    const nombres_completos_hijo = document.querySelector('#nombres_completos_hijo');
    const parentezco_hijo = document.querySelector('#parentezco_hijo');
    const fecha_nacimiento_hijo = document.querySelector('#fecha_nacimiento_hijo');
    const edad = calcularEdad(fecha_nacimiento_hijo.value);
    if (!isNaN(idPersona)){
        const persona = lista_personas.find(persona => persona.id === parseInt(idPersona));
        if (validarFecha(fecha_nacimiento_hijo.value)){
            persona.listahijos.push(new Hijo(nombres_completos_hijo.value, parentezco_hijo.value,edad.años+" a "+edad.meses+" mm "+edad.días+" dd "+edad.horas+" hh "));
            listarHijos(persona);
            document.getElementById('alertaGuardadoExitosoHijo').style.display = 'block';
        }else{
            alert("La fecha de nacimiento no puede ser mayor a la fecha actual.");
        }
    }else{
        alert("Escoja un usuario");
    }
});

//Añadir Consultas
btn_guardar_consulta.addEventListener('click', function(event){
    event.preventDefault(); 
    const fecha_consulta = document.querySelector('#fecha_consulta');
    const motivo_consulta = document.querySelector('#motivo_consulta');
    const estado_consulta = document.querySelector('#estado_consulta');
    if (!isNaN(idPersona)){
        if (validarFecha(fecha_consulta.value)){
            const persona = lista_personas.find(persona => persona.id === parseInt(idPersona));
            persona.listaConsultas.push(new Consulta(fecha_consulta.value, motivo_consulta.value, estado_consulta.value));
            listarConsultas(persona);
            document.getElementById('alertaGuardadoExitosoCns').style.display = 'block';
        }else{
            alert("La fecha de la consulta no puede ser mayor a la fecha actual.");
        }
    }else{
        alert("Escoja un usuario");
    }
});

//Funciones

//Función para calcular edad
function calcularEdad(fechaNacimiento) {
    const fechaNac = new Date(fechaNacimiento);
    const fechaActual = new Date();
    let diferencia = fechaActual - fechaNac;
    // Calcula la cantidad de milisegundos en un año, mes, día y hora
    const milisegundosPorAnio = 1000 * 60 * 60 * 24 * 365.25;
    const milisegundosPorMes = milisegundosPorAnio / 12;
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    const milisegundosPorHora = 1000 * 60 * 60;
    // Calcula la edad en años
    const edadAnios = Math.floor(diferencia / milisegundosPorAnio);
    diferencia -= edadAnios * milisegundosPorAnio;
    // Calcula la edad en meses
    const edadMeses = Math.floor(diferencia / milisegundosPorMes);
    diferencia -= edadMeses * milisegundosPorMes;
    // Calcula la edad en días
    const edadDias = Math.floor(diferencia / milisegundosPorDia);
    diferencia -= edadDias * milisegundosPorDia;
    // Calcula la edad en horas
    const edadHoras = Math.floor(diferencia / milisegundosPorHora);
    // Retorna la edad como un objeto
    return {
        años: edadAnios,
        meses: edadMeses,
        días: edadDias,
        horas: edadHoras
    };
}

//Función para cambiar vista
function cambiarHtml(imagen, nombre, cedula, celular, direccion, edad, pais_nacimiento, ciudad_nacimiento){
    const edad_calculada = calcularEdad(edad);
    foto_usuario.src = imagen;
    nombre_usuario.textContent = nombre;
    cedula_usuario.textContent =cedula;
    celular_usuario.textContent = celular;
    direccion_usuario.textContent = direccion;
    edad_usuario.textContent = edad_calculada.años+" años "+edad_calculada.meses+" meses "+edad_calculada.días+" días "+edad_calculada.horas+" horas";
    pais_usuario.textContent = pais_nacimiento;
    ciudad_usuario.textContent = ciudad_nacimiento;
}

//Función para editar Usuario
function editarUsuario() {
    const foto_perfil_editar = document.querySelector('#foto_perfil_editar');
    const nombres_completos_editar = document.querySelector('#nombres_completos_editar');
    const cedula_editar = document.querySelector('#cedula_editar');
    const celular_editar = document.querySelector('#celular_editar');
    const direccion_editar = document.querySelector('#direccion_editar');
    const fecha_nacimiento_editar = document.querySelector('#fecha_nacimiento_editar');
    const pais_editar = document.querySelector('#pais_editar');
    const ciudad_editar = document.querySelector('#ciudad_editar');
    // Verificar si el valor seleccionado es un número
    if (!isNaN(idPersona)) {
        const personaSeleccionada = lista_personas.find(persona => persona.id === parseInt(idPersona));
        if (validarCedula(cedula_editar.value)){  
            if (validarCelular(celular_editar.value)){
                if (validarFecha(fecha_nacimiento_editar.value)){
                    personaSeleccionada.nombre = nombres_completos_editar.value;
                    personaSeleccionada.cedula = cedula_editar.value;
                    personaSeleccionada.celular = celular_editar.value;
                    personaSeleccionada.direccion = direccion_editar.value;
                    personaSeleccionada.fecha_nacimiento = fecha_nacimiento_editar.value;
                    personaSeleccionada.pais_nacimiento = pais_editar.value;
                    personaSeleccionada.ciudad_nacimiento = ciudad_editar.value;
                    // Muestra la alerta de guardado exitoso
                    document.getElementById('alertaGuardadoExitoso').style.display = 'block';
                }else{
                    alert("La fecha de nacimiento no puede ser mayor a la fecha actual.");
                }
            }else{
                alert("El celular es incorrecto.");
            }
        }else{
            alert("La cédula es incorrecta.");
        }
        cambiarHtml(personaSeleccionada.imagen, personaSeleccionada.nombre, personaSeleccionada.cedula, personaSeleccionada.celular, personaSeleccionada.direccion, personaSeleccionada.fecha_nacimiento, personaSeleccionada.pais_nacimiento, personaSeleccionada.ciudad_nacimiento);
        selectUsuario.innerHTML = '';
        const option = document.createElement('option');
        option.value = "default";
        option.textContent = "Seleccione un Usuario";
        selectUsuario.appendChild(option);
        actualizar_lista();
    } else{
        alert("Escoja un usuario");
    }
}

//Función para agregar nuevo usuario
function nuevoUsuario(){
    const id = (lista_personas.length)+1;
    const foto_perfil_nuevo = document.querySelector('#foto_perfil_nuevo');
    const nombres_completos_nuevo = document.querySelector('#nombres_completos_nuevo');
    const cedula_nuevo = document.querySelector('#cedula_nuevo');
    const celular_nuevo = document.querySelector('#celular_nuevo');
    const direccion_nuevo = document.querySelector('#direccion_nuevo');
    const fecha_nacimiento_nuevo = document.querySelector('#fecha_nacimiento_nuevo');
    const pais_nuevo = document.querySelector('#pais_nuevo');
    const ciudad_nuevo = document.querySelector('#ciudad_nuevo');
    if (validarCedula(cedula_nuevo.value)){
        if (validarCelular(celular_nuevo.value)){
            if (validarFecha(fecha_nacimiento_nuevo.value)){
                const persona = new Persona(id, "imagenes/profile/persona1.jpg", nombres_completos_nuevo.value, cedula_nuevo.value, celular_nuevo.value, direccion_nuevo.value, fecha_nacimiento_nuevo.value, pais_nuevo.value, ciudad_nuevo.value);
                lista_personas.push(persona);
                selectUsuario.innerHTML = '';
                const option = document.createElement('option');
                option.value = "default";
                option.textContent = "Seleccione un Usuario";
                selectUsuario.appendChild(option);
                actualizar_lista();
                document.getElementById('alertaGuardadoExitosoNuevo').style.display = 'block';
            }else{
                alert("La fecha de nacimiento no puede ser mayor a la fecha actual.");
            }
        }else{
            alert("El celular es incorrecto.");
        }
    }else{
        alert("La cédula es incorrecta.");
    }
}

//Función para listar hijos en la tabla
function listarHijos(persona){
    tabla_hijos.innerHTML = '';
    // Itera sobre la lista de hijos de la persona
    persona.listahijos.forEach(hijo => {
        // Crea una nueva fila para el hijo
        const fila = document.createElement('tr');
        // Agrega las celdas con la información del hijo
        const nombreCelda = document.createElement('td');
        nombreCelda.textContent = hijo.nombre;
        fila.appendChild(nombreCelda);
        const parentezcoCelda = document.createElement('td');
        parentezcoCelda.textContent = hijo.parentezco;
        fila.appendChild(parentezcoCelda);
        const fechaNacimientoCelda = document.createElement('td');
        fechaNacimientoCelda.textContent = hijo.fecha_nacimiento;
        fila.appendChild(fechaNacimientoCelda);
        // Agrega la fila a la tabla
        tabla_hijos.appendChild(fila);
    });
}

//Función para listar consultas en la tabla
function listarConsultas(persona){
    tabla_consultas.innerHTML = '';
    persona.listaConsultas.forEach(Consulta => {
        const fila = document.createElement('tr');
        // Agrega las celdas con la información de la Consulta
        const nombreCelda = document.createElement('td');
        nombreCelda.textContent = Consulta.fecha;
        fila.appendChild(nombreCelda);
        const motivoCelda = document.createElement('td');
        motivoCelda.textContent = Consulta.motivo;
        fila.appendChild(motivoCelda);
        const estadoCelda = document.createElement('td');
        estadoCelda.textContent = Consulta.estado;
        fila.appendChild(estadoCelda);
        // Agrega la fila a la tabla
        tabla_consultas.appendChild(fila);
    });
}

//Función para validar la cédula
function validarCedula(cedula) {
    // Validar que la cédula tenga 10 dígitos
    if (cedula.length !== 10) {
        return false;
    }
    // Validar que todos los caracteres sean dígitos
    if (!/^\d+$/.test(cedula)) {
        return false;
    }
    // Extraer los dígitos de la cédula
    const digitos = cedula.split('').map(Number);
    // Validar el último dígito (dígito verificador)
    const digitoVerificador = digitos.pop();
    const suma = digitos.reduce((acc, curr, idx) => {
        const valor = idx % 2 === 0 ? curr * 2 : curr;
        return acc + (valor > 9 ? valor - 9 : valor);
    }, 0);
    const resultado = 10 - (suma % 10);
    return resultado === digitoVerificador;
}

//Función para validar celular
function validarCelular(celular){
    if (celular.length !== 10) {
        return false;
    }else{
        return true;
    }
}

//Función para validar la fecha
function validarFecha(fecha){
    const fechaActual = new Date().toISOString().slice(0,16);
    if (fecha > fechaActual) {
        return false;
    }else{
        return true;
    }
}

//Funciones para agregar ciudades a los países
function cargarCiudades() {
    const paisSeleccionado = document.getElementById('pais_editar').value;
    const paisSeleccionadoNeuvo = document.getElementById('pais_nuevo').value;
    const ciudadSelect = document.getElementById('ciudad_editar');
    const ciudadSelectNuevo = document.getElementById('ciudad_nuevo');
    ciudadSelect.innerHTML = ''; 
    if (paisSeleccionado === 'Ecuador') {
        agregarCiudad(ciudadSelect, 'Cuenca');
        agregarCiudad(ciudadSelect, 'Guayaquil');
        agregarCiudad(ciudadSelect, 'Quito');
    } else if (paisSeleccionado === 'Colombia') {
        agregarCiudad(ciudadSelect, 'Bogotá');
        agregarCiudad(ciudadSelect, 'Medellín');
        agregarCiudad(ciudadSelect, 'Cali');
    }else{
        agregarCiudad(ciudadSelect, 'Lima');
        agregarCiudad(ciudadSelect, 'Cusco');
        agregarCiudad(ciudadSelect, 'Puno');
    }
    ciudadSelectNuevo.innerHTML = '';
    if (paisSeleccionadoNeuvo === 'Ecuador'){
        agregarCiudad(ciudadSelectNuevo, 'Cuenca');
        agregarCiudad(ciudadSelectNuevo, 'Guayaquil');
        agregarCiudad(ciudadSelectNuevo, 'Quito');
    } else if (paisSeleccionadoNeuvo === 'Colombia'){
        agregarCiudad(ciudadSelectNuevo, 'Bogotá');
        agregarCiudad(ciudadSelectNuevo, 'Medellín');
        agregarCiudad(ciudadSelectNuevo, 'Cali');
    }else{
        agregarCiudad(ciudadSelectNuevo, 'Lima');
        agregarCiudad(ciudadSelectNuevo, 'Cusco');
        agregarCiudad(ciudadSelectNuevo, 'Puno');
    }
}
function agregarCiudad(select, ciudad) {
    const opcion = document.createElement('option');
    opcion.value = ciudad;
    opcion.textContent = ciudad;
    select.appendChild(opcion);
}