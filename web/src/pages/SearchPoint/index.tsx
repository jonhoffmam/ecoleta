import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import Geocode from 'react-geocode';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import './styles.css';

const center = { lat: 0, lng: 0 };

const SearchPoint = () => {
  const { typeLocal, setLocal } = useParams();
  const [initialPosition, setInitialPosition] = useState(center);

  useEffect(() => {
    if (typeLocal === 'myLocal') {
      const setLocalSplit = setLocal?.split(',') ?? [];
      const latLng = {
        lat: Number(setLocalSplit[0]),
        lng: Number(setLocalSplit[1]),
      };
      setInitialPosition(latLng);
    } else {
      Geocode.setKey(String(process.env.REACT_APP_GOOGLE_MAPS_API_KEY));
      Geocode.setLanguage('pt-BR');
      Geocode.setRegion('br');

      Geocode.fromAddress(setLocal!).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(lat, lng);
          const latLng = {
            lat: lat,
            lng: lng,
          };
          setInitialPosition(latLng);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [typeLocal, setLocal]);

  return (
    <div id='page-search-point'>
      <header>
        <img src={logo} alt='Ecoleta' />
        <Link to='/'>
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <p>{setLocal}</p>

      <div className='constainerForm'>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap
            mapContainerClassName='googleMaps-container'
            center={initialPosition}
            zoom={15}
            options={{ disableDefaultUI: true }}
            // onClick={handleMapClick}
          >
            <Marker position={initialPosition} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default SearchPoint;
