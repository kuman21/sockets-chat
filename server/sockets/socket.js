const { io } = require('../server');
const { User } = require('../classes/user');
const { createMessage } = require('../utilities/utilities');

const users = new User();

io.on('connection', (client) => {
    client.on('enterChat', ( data, callback ) => {
        if ( !data.name || !data.room) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario'
            });
        }

        client.join(data.room);

        users.addPerson(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('personsList', users.getPersonsByRoom(data.room));

        callback(users.getPersonsByRoom(data.room));
    });

    client.on('createMessage', ( data ) => {
        const person = users.getPerson( client.id );

        const message = createMessage( person.name, data.message );
        client.broadcast.to(person.room).emit('createMessage', message);
    });

    client.on('disconnect', () => {
        const personDeleted = users.deletePerson(client.id);

        client.broadcast.to(personDeleted.room).emit('createMessage', createMessage('admin', `${ personDeleted.name } abandonó el chat`));
        client.broadcast.to(personDeleted.room).emit('personsList', users.getPersonsByRoom(personDeleted.room));
    });

    // Mensajes Privados
    client.on('privateMessage', ( data ) => {
        const person = users.getPerson( client.id );

        client.broadcast.to(data.for).emit('privateMessage', createMessage( person.name, data.message ));
    });
});