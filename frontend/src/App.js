import React, { useEffect, useState } from 'react';

import './styles/global.css';
import './styles/app.css';
import './styles/main.css';
import './styles/sidebar.css';

import DevForm from './components/DevForm';
import DevItem from './components/DevItem';
import api from './services/api';

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const { data } = await api.get('/devs');

      setDevs(data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(dev) {
    const { data } = await api.post('/devs', dev);

    setDevs([...devs, data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
