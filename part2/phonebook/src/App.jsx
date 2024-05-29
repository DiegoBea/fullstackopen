import { useState, useEffect } from "react";
import phoneService from "./services/phones.js";

const Filter = ({ filter, onChange }) => {
  return (
    <>
      <input id="Filter" onChange={onChange} />
    </>
  );
};

const PersonForm = (props) => {
  return (
    <>
      <form>
        <div>
          name:{}
          <input value={props.newName} onChange={props.onChangeName} />
        </div>
        <div>
          phone:{}
          <input value={props.newPhone} onChange={props.onChangePhone} />
        </div>
        <div>
          <button type="submit" onClick={props.onClickAdd}>
            add
          </button>
        </div>
      </form>
    </>
  );
};

const Persons = ({ persons, onClickDelete }) => {
  return persons.map((person) => (
    <div key={person.id}>
      {person.name} {person.number}{" "}
      <button onClick={() => onClickDelete(person)}>Eliminar</button>
      <br />
    </div>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");

  const personsToShow =
    filter.length == 0
      ? persons
      : persons.filter((person) => person.name.includes(filter));

  useEffect(() => {
    console.log("effect");
    phoneService.getAll().then((response) => setPersons(response));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleAddPerson = (event) => {
    event.preventDefault();
    let copy = [...persons];
    if (persons.some((item) => item.name == newName)) {
      let person = copy.find((person) => person.name == newName);
      person.number = newPhone;
      phoneService.update(person).then((response) => {
        setPersons(copy);
        setNewName("");
        setNewPhone("");
      });
      return;
    }

    let person = { name: newName, number: newPhone };
    phoneService.insert(person).then((response) => {
      copy.push(response);
      setPersons(copy);
      setNewName("");
      setNewPhone("");
    });
  };

  const handleRemovePhone = (contact) => {
    console.log(contact);
    phoneService.remove(contact).then((response) => {
      setPersons(persons.filter((person) => person.id !== contact.id));
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      Filter shown with{" "}
      <Filter onChange={(event) => handleFilterChange(event)} />
      <h3>Add a new</h3>
      <PersonForm
        onChangeName={(event) => handleNameChange(event)}
        newName={newName}
        onChangePhone={(event) => handlePhoneChange(event)}
        newPhone={newPhone}
        onClickAdd={(event) => handleAddPerson(event)}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onClickDelete={handleRemovePhone} />
      <div>Debug: {filter}</div>
    </div>
  );
};

export default App;
