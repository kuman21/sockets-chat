let parameters = new URLSearchParams( window.location.search );

// Referencias Jquwery
const divUsuarios = $('#divUsuarios');
const formSend = $('#formSend');
const txtMessage = $('#txtMessage');
const divChatbox = $('#divChatbox');

// Funciones para renderizar usuarios
function renderUsers( persons ) {
    let html = `
        <li>
            <a href="javascript:void(0)" class="active"> Chat de <span> ${parameters.get('room')}</span></a>
        </li>
    `;

    for (let i = 0; i < persons.length; i++) {
        html += `
            <li>
                <a data-id="${persons[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persons[i].name} <small class="text-success">online</small></span></a>
            </li>
        `;
    }

    divUsuarios.html(html);
}

function renderMessage( message, me ) {
    let html = '';
    let date = new Date(message.date);
    let hour = date.getHours() + ':' + date.getMinutes();

    let adminClass = 'info';
    if ( message.name === 'admin' ) {
        adminClass = 'danger';
    }

    if ( me ) {
        html += `
            <li class="animated fadeIn reverse">
                <div class="chat-content">
                    <h5>${ message.name }</h5>
                    <div class="box bg-light-inverse">${ message.message }</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                <div class="chat-time">${ hour }</div>
            </li>
        `;
    } else {
        html += `
            <li class="animated fadeIn">
                ${ (message.name !== 'admin') ? '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>' : '' }
                <div class="chat-content">
                    <h5>${ message.name }</h5>
                    <div class="box bg-light-${ adminClass }">${ message.message }</div>
                </div>
                <div class="chat-time">${hour}</div>
            </li>
        `;
    }   
    
    divChatbox.append(html);
}

function scrollBottom() {
    // selectors
    let newMessage = divChatbox.children('li:last-child');

    // heights
    let clientHeight = divChatbox.prop('clientHeight');
    let scrollTop = divChatbox.prop('scrollTop');
    let scrollHeight = divChatbox.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners
divUsuarios.on('click', 'a', function() {
    const id = $(this).data('id');
    
    if ( id ) {
        console.log(id);
    }
});

formSend.on('submit', function(e) {
    e.preventDefault();

    if (txtMessage.val().trim().length === 0) {
        return;
    }

    // Enviar información
    socket.emit('createMessage', {
        name: parameters.get('name'),
        message: txtMessage.val()
    }, function(message) {
        txtMessage.val('').focus();
        renderMessage(message, true);
        scrollBottom();
    });
})