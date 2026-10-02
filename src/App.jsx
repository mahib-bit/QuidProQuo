import { auth } from './firebase/firebase';

function App() {

    console.log('Firebase Auth:', auth);

    return (
        <div>
            <h1>Quid Pro Quo</h1>
        </div>
    );
}

export default App;