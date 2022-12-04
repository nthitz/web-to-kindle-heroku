import logo from './logo.svg';
import './App.css';
import Time from './Time';
import Weather from './Weather'
import Bus from './Bus';
import IFPA from './IFPA';
function App() {
  return (
    <div className="App">
      <Time />
      <Weather />
      <Bus />
      <IFPA />
    </div>
  );
}

export default App;
