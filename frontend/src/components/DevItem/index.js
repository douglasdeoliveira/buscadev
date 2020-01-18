import PropTypes from 'prop-types';
import React, { useState } from 'react';

import api from '../../services/api';

import './styles.css';

export default function DevItem({ dev }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const [techs, setTechs] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  async function handleDeleteUser() {
    if (window.confirm(`Você deseja excluir o usuário ${dev.name}?`)) {
      try {
        await api.delete(`/devs/${dev.github_username}`);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleOpenEdit() {
    setEdit(true);
  }

  function handleCloseEdit() {
    setEdit(false);

    // clean form
    setName('');
    setTechs('');
    setAvatarUrl('');
    setBio('');
    setLatitude('');
    setLongitude('');
  }

  async function handleEditUser() {
    try {
      await api.put(`/devs/${dev.github_username}`, {
        name,
        techs,
        avatar_url,
        bio,
        latitude,
        longitude,
      });

      alert(`O usuário ${dev.github_username} foi atualizado com sucesso`);
    } catch (error) {
      alert('Erro ao atualizar o usuário');
    }
  }

  return edit ? (
    <li className="dev-item">
      <form onSubmit={handleEditUser}>
        <header>
          <div className="info">
            <img src={dev.avatar_url} alt={dev.name} />
          </div>

          <div className="settings">
            <button type="submit">Salvar</button>

            <button type="button" onClick={handleCloseEdit}>
              Cancelar
            </button>
          </div>
        </header>

        <div className="user-edit">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder={dev.name}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label htmlFor="techs2">Techs</label>
          <input
            type="text"
            name="techs"
            id="techs2"
            placeholder={dev.techs}
            value={techs}
            onChange={e => setTechs(e.target.value)}
            required
          />

          <label htmlFor="avatar_url">Avatar Url</label>
          <input
            type="url"
            name="avatar_url"
            id="avatar_url"
            placeholder="Insira o link da sua foto"
            value={avatar_url}
            onChange={e => setAvatarUrl(e.target.value)}
            required
          />

          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            placeholder={dev.bio}
            value={bio}
            onChange={e => setBio(e.target.value)}
            required
          />

          <label htmlFor="latitude2">Latitude</label>
          <input
            type="number"
            name="latitude"
            id="latitude2"
            placeholder={dev.location.coordinates[1]}
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            required
          />

          <label htmlFor="longitude2">Longitude</label>
          <input
            type="number"
            name="longitude"
            id="longitude2"
            placeholder={dev.location.coordinates[0]}
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            required
          />
        </div>
      </form>
    </li>
  ) : (
    <li className="dev-item">
      <header>
        <div className="info">
          <img src={dev.avatar_url} alt={dev.name} />
          <div className="user-info">
            <strong>{dev.name}</strong>
            <span>{dev.techs.join(', ')}</span>
          </div>
        </div>

        <div className="settings">
          <button type="button" className="edit" onClick={handleOpenEdit}>
            Editar
          </button>
          <button type="button" onClick={handleDeleteUser}>
            Exlcuir
          </button>
        </div>
      </header>
      <p>{dev.bio}</p>
      <a
        href={`https://github.com/${dev.github_username}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Acessar perfil no Github
      </a>
    </li>
  );
}

DevItem.propTypes = {
  dev: PropTypes.shape().isRequired,
};
