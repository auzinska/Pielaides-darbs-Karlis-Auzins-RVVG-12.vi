import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

export const signOut = () => {
  firebase.auth().signOut();
}
