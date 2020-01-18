import { MaterialIcons } from '@expo/vector-icons';
import { getCurrentPositionAsync, requestPermissionsAsync } from 'expo-location';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

import api from '../../services/api';
import { connect, disconnect, subcribeToNewDevs } from '../../services/socket';

import { styles } from './styles';

export default function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');
  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subcribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebSocket() {
    const { latitude, longitude } = currentRegion;

    disconnect();
    connect(latitude, longitude, techs);
  }

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const { data } = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs,
      },
    });

    setDevs(data);
    setupWebSocket();
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1],
            }}
          >
            <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
            <Callout
              onPress={() => {
                navigation.navigate('Profile', {
                  github_username: dev.github_username,
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <KeyboardAvoidingView
        style={styles.searchForm}
        enabled
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
          returnKeyType="send"
          onSubmitEditing={loadDevs}
        />
        <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
