import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { FiSearch, FiX, FiMapPin, FiNavigation } from 'react-icons/fi';
import { MdLocationCity } from 'react-icons/md';
import axios from 'axios';

import { zipCodeMask } from '../../components/Masks';

interface UF {
	id: number;
	sigla: string;
	nome: string;
	regiao: object;
}

interface city {
	id: number;
	nome: string;
}



const Search = (props: any) => {
	const [ufs, setUfs] = useState<UF[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [selectedUf, setSelectedUf] = useState('');
	const [selectedCity, setSelectedCity] = useState('');

	const [clickedSearch, setClickedSearch] = useState(false);

	const [selectedAdress, setSelectedAdress] = useState('');
	const [selectedTypeAdress, setSelectedTypeAdress] = useState<number[]>([])
	const [typeAdressName, setTypeAdressName] = useState('');
	const [selectedZipCode, setSelectedZipCode] = useState('');

	const history = useHistory();

	useEffect(() => {
    setClickedSearch(props.value)    
  },[props.value]);
	
	useEffect(() => {
		if (selectedTypeAdress[0] !== 1) {
			return
		}
		if (selectedAdress === '') {
			console.log('Aguarde, carregando sua localização...');			
		
			navigator.geolocation.getCurrentPosition(position => {			
				const {latitude, longitude} = position.coords;
				const latLng = `${latitude},${longitude}`;

				setSelectedAdress(latLng);
				console.log(latLng);
			});
			return
		}
	},[selectedAdress, selectedTypeAdress]);
	
	useEffect(() => {
		if (selectedZipCode === '') {
			return
		} else if (selectedZipCode.length === 9) {

			axios.get(`https://viacep.com.br/ws/${selectedZipCode}/json/`)
				.then(response => {
					const {logradouro, bairro, localidade, uf} = response.data;

					const adress =					
						bairro === '' ?
						`${localidade}-${uf}` : `${logradouro}, ${bairro}, ${localidade}-${uf}`;
					
					console.log(adress);

					setSelectedAdress(adress);
				})
		}
	},[selectedZipCode]);

	useEffect(() => {
		if (selectedTypeAdress[0] !== 3) {
			return
		}
		axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
			.then(response => {
			setUfs(response.data);
		});		
	}, [selectedTypeAdress]);

	useEffect(() => {
		if ( selectedUf === '' ) { 
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
		setSelectedAdress(`${city}-${selectedUf}`)
	}

	function handleInputZipCode(event: ChangeEvent<HTMLInputElement>) {
		const zipCode = event.target.value;

		setSelectedZipCode(zipCodeMask(zipCode));		
	}
	
	function handleSearch() {
		history.push(`/search-point/${typeAdressName}/${selectedAdress}`);		
	}

	function handleClickTypeAdress(event: MouseEvent<HTMLLIElement>) {
		const id = event.currentTarget.value;
		const adressName = event.currentTarget.id;
		
		setTypeAdressName(adressName);

		const alreadyItems = selectedTypeAdress.findIndex(item => item === id);

		if (alreadyItems >= 0) {
			const filteredItems = selectedTypeAdress.filter(item => item !== id);
			
			setSelectedTypeAdress(filteredItems);
		} else {
			
			setSelectedTypeAdress([id]);
		}
	}

	return (

		clickedSearch ?
			<div className="containerFinal">
				
				<fieldset>
					<p className="messageFinal">Pesquisar ponto de coleta</p>							 
				
					<ul>
							<li
								key="myLocal"											
								value={1}
								id="myLocal"
								onClick={handleClickTypeAdress}
								className={selectedTypeAdress.includes(1) ? 'selected' : ''}
							>
								<FiMapPin />
								<strong>Minha Localização</strong>
								<span>
									<FiMapPin />
								</span>
							</li>
						
						<li
							key="zipCode"										
							value={2}
							id="zipCode"
							onClick={handleClickTypeAdress}
							className={selectedTypeAdress.includes(2) ? 'selected' : ''}
						>
							<FiNavigation />
							<strong>CEP</strong>
							<span>
								<FiNavigation />
							</span>
						</li>

						<li
							key="adress"										
							value={3}
							id="adress"
							onClick={handleClickTypeAdress}
							className={selectedTypeAdress.includes(3) ? 'selected' : ''}
						>
							<MdLocationCity />
							<strong>Estado e Cidade</strong>
							<span>
								<MdLocationCity />
							</span>									
						</li>								
					</ul>
				</fieldset>

				{selectedTypeAdress.includes(2) &&
					<fieldset>
						<div className="field">
							<label htmlFor="cep">CEP</label>
							<input
								type="text"
								name="cep"
								id="cep"
								placeholder="Digite seu CEP"
								value={selectedZipCode}
								onChange={handleInputZipCode}
							/>										
						</div>
					</fieldset>
				}

				{selectedTypeAdress.includes(3) &&

					<fieldset>
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
				}

							<button
								disabled={
									selectedTypeAdress[0] > 0 ? false : true}
								className={selectedTypeAdress[0] > 0 ? 'buttonSearch' : 'buttonDisable'}
								onClick={handleSearch}
							>
								<span>
									<FiSearch />
								</span>
								<strong>Pesquisar</strong>

							</button>
							
							<button										
								className="buttonClose" 
								onClick={() => {setClickedSearch(!clickedSearch); props.onClick()}}
							>							
								<span>
									<FiX />
								</span>							
								<strong>Fechar</strong>
							</button>								
			</div>
		: <div></div>
	)
}

export default Search;