import { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [ facts, setFacts] = useState([])
  //const [listening, setListening] = useState(false)

  useEffect(() => {
    //if(!listening) {
      const events = new EventSource('http://localhost:3001/events')

      events.addEventListener('open', () => {
        console.log('SSE opened!');
      });
  
      events.addEventListener('message', (event) => {
        const parsedData = JSON.parse(event.data)
        console.log('*********', {parsedData}, event.data)
  
        setFacts((facts) => facts.concat(parsedData))
      });

      // events.onmessage = (event) => {
      //   const parsedData = JSON.parse(event.data)
      //   console.log('*********', {parsedData})
      //   //console.log(event)
  
      //   setFacts((facts) => facts.concat(parsedData))
      // }

      events.addEventListener('error', (e) => {
        console.log('Errors bro', e)
      })

      return () => {
        events.close();
      };
  
      //setListening(true)
  // }
  }, [])
  return (
    <table>
      <thead>
        <tr>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        { facts.map((fact, i) => (
          <tr key={i}>
            <td>{fact.info}</td>
            <td>{fact.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
