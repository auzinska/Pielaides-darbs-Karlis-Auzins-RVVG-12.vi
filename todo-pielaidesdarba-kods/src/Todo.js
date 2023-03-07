import { ListItem, List, ListItemAvatar, ListItemText, Button, Modal, makeStyles } from '@material-ui/core'
import './Todo.css';
import React, { useState } from 'react';
import db from './firebase'

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function Todo (props) {
    const { id, todo: todoText, note, timestamp } = props.todo;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(todoText);
    const [noteInput, setNoteInput] = useState(note);

    const formattedTimestamp = new Date(timestamp?.toDate()).toLocaleString();

    const handleOpen = () => {
        setOpen(true);
    };

    const updateTodo = () => {
        db.collection('todos').doc(id).set({
            todo: input,
            note: noteInput,
            timestamp: new Date(),
        }, { merge: true });
        setOpen(false);
    };

    const deleteTodo = () => {
        db.collection('todos').doc(id).delete();
    };

    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className={classes.paper}>
                    <h1>Edit todo</h1>
                    <input placeholder={todoText} value={input} onChange={(e) => setInput(e.target.value)} />
                    <input placeholder={note} value={noteInput} onChange={(e) => setNoteInput(e.target.value)} />
                    <Button onClick={updateTodo}>Submit</Button>
                </div>
            </Modal>
            <List className='todo_list'>
                <ListItem>
                    <ListItemAvatar>
                    </ListItemAvatar>
                    <ListItemText primary={todoText} secondary={note} />
                </ListItem>
                <Button onClick={handleOpen}>Edit</Button>
                <Button onClick={deleteTodo}>❌</Button>
            </List>
            <li className="list-group-item">
                <div className="todo-container">
                    <div className="todo-text">
                    <p className="todo">{todoText}</p>
                    <p className="note">{note}</p>
                    </div>
                    <div className="timestamp">{formattedTimestamp}</div>
                </div>
            </li>
        </>
    );
}

export default Todo;
