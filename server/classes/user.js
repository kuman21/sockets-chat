class User {
    constructor() {
        this.persons = [];
    }

    addPerson( id, name, room ) {
        const person = { id, name, room };
        this.persons.push( person );
        return this.persons;
    }

    getPerson( id ) {
        const person = this.persons.filter( p => p.id === id)[0];
        
        return person;
    }

    getPersons() {
        return this.persons;
    }

    getPersonsByRoom( room ) {
        const personsInRoom = this.persons.filter( p => p.room === room );
        
        return personsInRoom;
    }

    deletePerson( id ) {
        const personDeleted = this.getPerson(id);

        this.persons = this.persons.filter( p => p.id !== id );

        return personDeleted;
    }
}

module.exports = {
    User
}