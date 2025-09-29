import './App.css';
import Form from './components/form';

function App() {
  return (
    <div className="App">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">User Registration</h1>
        <Form />
      </div>
    </div>
  );
}

export default App;
