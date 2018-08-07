// find nodes
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

// listen for login
btnLogin.addEventListener('click', e => {
    // collect fields
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    // attempt login
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});

// listen for signup
btnSignUp.addEventListener('click', e => {
    // collect fields
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    // attempt signup
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});

btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
});

// are we logged in?
firebase.auth().onAuthStateChanged(firebaseuser => {
if (firebaseuser) {
    console.log('Logged in: ' + firebaseuser.email);
    btnLogout.classList.remove('hide');
    btnSignUp.classList.add('hide');
} else {
    console.log('See ya later...');
    btnLogout.classList.add('hide');
}

});