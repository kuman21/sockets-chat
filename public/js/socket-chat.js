var socket = io();

let params = new URLSearchParams( window.location.search );

if ( !params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

let user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(resp) {
        console.log('Usuarios Conectados', resp)
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('createMessage', {
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// Escuchar información
socket.on('createMessage', function(message) {
    console.log('Servidor:', message);
});

// Escuchar cambio de usuarios
socket.on('personsList', function(persons) {
    console.log(persons);
});

// Mensajes Privados
socket.on('privateMessage', function(message) {
    console.log('Mensaje Privado:', message);
})