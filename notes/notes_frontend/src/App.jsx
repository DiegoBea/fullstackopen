import {useState, useEffect} from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteService from "./services/notes";
import loginService from './services/login.js';
import login from "./services/login.js";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  /**
   * Check if the user is already logged using localStorage and save his data
   */
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  /**
   * Login screen
   * @returns {JSX.Element}
   */
  const loginForm = () => {
    return <>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type='text' value={username} name='username' onChange={({target}) => setUsername(target.value)}/>
        </div>
        <div>
          password
          <input type='password' value={password} name='password' onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type='submit'>login</button>
      </form>
    </>
  }

  /**
   * Notes form
   * @returns {JSX.Element}
   */
  const noteForm = () => {
    return <>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
    </>
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = {...note, important: !note.important};

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          `Note '${note.content}' was already removed from server '${error}'`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  /**
   * Function to handle login with credentials
   * @param event
   * @returns {Promise<void>}
   */
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password)

    try {
      // Try to get user login in
      const user = await loginService.login({username, password});

      // Store user in localStorage
      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      // Set user token
      noteService.setToken(user.token)

      // Set values
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // Set the error and remove it in 5 seconds
      setErrorMessage('Wrong credentials')
      console.log(exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      {user === null
        ? loginForm()
        : <div><p>{user.name} logged-in</p>{noteForm()}</div>
      }
      <Footer/>
    </div>
  );
};

export default App;
