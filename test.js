import React, { useEffect, useState } from 'react';
import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import './App.css';
import Todo from './Todo';
import db from './firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { signInWithGoogle, signOut } from './login';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [note, setNote] = useState('');
  const [time, setTime] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const intervalID = setInterval(() => {
      fetch('https://worldtimeapi.org/api/ip')
        .then(response => response.json())
        .then(data => {
          const datetime = new Date(data.datetime);
          const hours = datetime.getHours().toString().padStart(2, '0');
          const minutes = datetime.getMinutes().toString().padStart(2, '0');
          const seconds = datetime.getSeconds().toString().padStart(2, '0');
          setTime(`${hours}:${minutes}:${seconds}`);
        })
        .catch(error => {
          console.error(error);
        });
    }, 1000);

    // Listen for changes to the "todos" collection and update the local state
    const unsubscribe = db.collection('todos').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, todo: doc.data().todo, note: doc.data().note, timestamp: doc.data().timestamp })));
    });

    // Listen for changes to the authentication state and update the local state
    const authUnsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
      clearInterval(intervalID);
    };
  }, []);

  const addTodo = (event) => {
    event.preventDefault();

    db.collection('todos').add({
      todo: input,
      note: note,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    setInput('');
    setNote('');
  }

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  const signOut = () => {
    firebase.auth().signOut();
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Virtuālais piezīmju bloks🚀!</h1>
      <h3 className="text-center">Laiks Latvijā</h3>
      <h3 className="text-center">{time}</h3>

      {user ? (
        <div className="user-info text-center mb-4">
          <p>Signed in as {user.email}</p>
          <Button onClick={signOut} variant="primary">Sign out</Button>
        </div>
      ) : (
        <Button onClick={signInWithGoogle} variant="primary">Sign in with Google</Button>
      )}

        <div className="form-container mt-5">
        <form className="row g-3">
            <div className="col-md-6">
            <label htmlFor="todo-input" className="form-label">✅ Notikums</label>
            <input type="text" className="form-control" id="todo-input" value={input} onChange={event => setInput(event.target.value)} />
            </div>
            <div className="col-md-6">
            <label htmlFor="note-input" className="form-label">✅ Piezīmes</label>
            <input type="text" className="form-control" id="note-input" value={note} onChange={event => setNote(event.target.value)} />
            </div>
            <div className="col-md-12 d-flex justify-content-center">
            <button type='submit' onClick={addTodo} className="btn btn-primary" disabled={!input}>Pievietot</button>
            </div>
        </form>
        <ul className="list-group mt-3">
            {todos.map(todo => (
            <Todo key={todo.id} todo={todo} />
            ))}
        </ul>
        </div>
    </div>
    );
}

export default App;  