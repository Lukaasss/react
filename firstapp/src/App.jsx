import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button name="Hans" age="17" />
        <Button name="Peter" age="17" />
        <Button name="Hansel" age="17" />

      </header>
    </div>
  );
}

export default App;