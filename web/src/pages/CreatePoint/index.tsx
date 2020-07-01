import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import axios from 'axios';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';
import logo from '../../assets/logo.svg';


const center = {lat: 0, lng: 0};

interface Item {
	id: number;
	title: string;
	image_url: string;
}

interface UF {
	id: number;
	sigla: string;
	nome: string;
	regiao: object;
}

interface city {
	nome: string;
}

const CreatePoint = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [ufs, setUfs] = useState<UF[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [selectedUf, setSelectedUf] = useState('0');
	const [selectedCity, setSelectedCity] = useState('0');
	const [initialPosition, setInitialPosition] = useState(center);
	const [selectedPosition, setSelectedPosition] = useState(center);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [selectedFile, setSelectedFile] = useState<File>();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		whatsapp: ''
	});
	const history = useHistory();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {			
			const latLng = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}

			setInitialPosition(latLng)
			setSelectedPosition(latLng)
		})      
	}, []);  
	
	useEffect(() => {
		api.get('items').then(response => {
			setItems(response.data);
		});
	}, []);

	useEffect(() => {
		axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
			.then(response => {
			setUfs(response.data);
		});    
	}, []);

	useEffect(() => {
		if ( selectedUf === '0' ){ 
			return 
		}

		axios.get<city[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
			.then(response => {
			const cityNames = response.data.map(city => city.nome);

			setCities(cityNames);
		});

	}, [selectedUf]);

	function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
		const uf = event.target.value;

		setSelectedUf(uf);
	}

	function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
		const city = event.target.value;

		setSelectedCity(city);
	}
	
	function handleMapClick(event: any) {
		const position = {
			lat: parseFloat(event.latLng.lat()),
			lng: parseFloat(event.latLng.lng()),
		}
		console.log(position);
		setSelectedPosition(position);
	}
	
	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const {name, value} = event.target;

		setFormData({ ...formData, [name]: value});
	}
	
	function handleSelectItem(id: number){
		
		const alreadyItems = selectedItems.findIndex(item => item === id);

		if (alreadyItems >= 0) {
			const filteredItems = selectedItems.filter(item => item !== id);
			console.log('Item desselecionado:', id);
			setSelectedItems(filteredItems);
		} else {
			console.log('Item selecionado:', id);
			setSelectedItems([...selectedItems, id]);
		}
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		const {name, email, phone, whatsapp} = formData;
		const uf = selectedUf;
		const city = selectedCity;
		const latitude = selectedPosition.lat;
		const longitude = selectedPosition.lng;
		const items = selectedItems;
		const image = selectedFile;

		const data = new FormData();

			data.append('name', name);
			data.append('email', email);
			data.append('phone', phone);
			data.append('whatsapp', whatsapp);
			data.append('uf', uf);
			data.append('city', city);
			data.append('latitude', String(latitude));
			data.append('longitude', String(longitude));
			data.append('items', items.join(','));
			
			if (image) {
				data.append('image', image);
			}

		
		await api.post('points', data);
		console.log(data);
		alert('Ponto de coleta criado!');

		history.push('/');
	}

	return (
		<div id="page-create-point">
			<header>
				<img src={logo} alt="Ecoleta"/>

				<Link to="/">
					<FiArrowLeft />
					Voltar para Home
				</Link>
				</header>

				<form onSubmit={handleSubmit}>
					<h1>Cadastro do <br/> ponto de coleta</h1>

					<Dropzone onFileUploaded={setSelectedFile}/>

					<fieldset>
						<legend>
							<h2>Dados</h2>
						</legend>

						<div className="field">
							<label htmlFor="name">Nome da Entidade</label>
							<input 
								type="text"
								name="name"
								id="name"
								onChange={handleInputChange}
							/>
						</div>

						<div className="field">
							<label htmlFor="email">E-mail</label>
							<input 
								type="email"
								name="email"
								id="email"
								onChange={handleInputChange}
							/>
						</div>

						<div className="field-group">
							<div className="field">
								<label htmlFor="phone">Telefone</label>
								<input 
									type="text"
									name="phone"
									id="phone"
									onChange={handleInputChange}
								/>
							</div>
							<div className="field">
								<label htmlFor="whatsapp">WhatsApp</label>
								<input 
									type="text"
									name="whatsapp"
									id="whatsapp"
									onChange={handleInputChange}
								/>
							</div>
						</div>
					</fieldset>

					<fieldset>
						<legend>
							<h2>Endereço</h2>
							<span>Selecione o endereço no mapa</span>             
						</legend>						

						<LoadScript
							googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
						>
							<GoogleMap
								mapContainerClassName="googleMaps-container"                
								center={initialPosition}
								zoom={15}
								options={{disableDefaultUI: true}}
								onClick={handleMapClick}								
							>
								<Marker position={selectedPosition} />
							</GoogleMap>
						</LoadScript>

						<div className="field-group">
							<div className="field">
								<label htmlFor="uf">Estado (UF)</label>
								<select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
									<option value="0">Selecione um Estado</option>
									{ufs.map(uf => (
										<option key={uf.id} value={uf.sigla}>{uf.nome} ({uf.sigla})</option>
									))}
								</select>                
							</div>
							<div className="field">
								<label htmlFor="city">Cidade</label>
								<select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
									<option value="0">Selecione uma Cidade</option>
									{cities.map(city => (
										<option key={city} value={city}>{city}</option>
									))}
								</select>                
							</div>
						</div>
					</fieldset>

					<fieldset>
						<legend>
							<h2>Itens de Coleta</h2>
							<span>Selecione um ou mais itens abaixo</span>
						</legend>

						<ul className="items-grid">
							{items.map(item => (
								<li 
									key={item.id} 
									onClick={() => handleSelectItem(item.id)}
									className={selectedItems.includes(item.id) ? 'selected' : ''}
								>
								<img src={item.image_url} alt={item.title}/>
								<span>{item.title}</span>
							</li>
							))}              
						</ul>
					</fieldset>
				
					<button type="submit">
						Cadastrar ponto de Coleta
					</button>  
				</form>   
		</div>
	)
}

export default CreatePoint;