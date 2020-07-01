import React, { useEffect, useState, ChangeEvent } from 'react';
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton, TextInput, TapGestureHandler } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';

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



const Home = () => {
	const navigation = useNavigation();
	const [ufs, setUfs] = useState<UF[]>([]);
	const [cities, setCities] = useState<city[]>([]);
	const [selectedUf, setSelectedUf] = useState<string[]>([]);
	const [selectedCity, setSelectedCity] = useState<string[]>([]);
	let [ufForPoints, setUfForPoints] = useState('');
	let [cityForPoints, setCityForPoints] = useState('');
	


	useEffect(() => {
    axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
			setUfs(response.data);			
    });    
  }, []);

  useEffect(() => {
    if ( selectedUf === [] ){
      return 
    }

    axios.get<city[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
      				
      setCities(response.data);
    });
  },[selectedUf]);

	function handleSelectUf(event: any) {		
		ufs.map(uf => (String(uf.id) === event[0] ? ufForPoints = uf.sigla : ''));
		
		setSelectedUf(event);
		setUfForPoints(ufForPoints);
	}

	function handleSelectCity(event: any) {
		cities.map(city => (String(city.id) === event[0] ? cityForPoints = city.nome : ''));	
		
		setSelectedCity(event);
		setCityForPoints(cityForPoints);
	}	
	
	function handleNavigateToPoints() {
    navigation.navigate('Points', {ufForPoints, cityForPoints});
	}

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{width: 274, height: 368}}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title} >Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description} >Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>			
      <View style={styles.footer}>
				{/* <View style={{backgroundColor: 'green'}}> */}
					<MultiSelect          
						uniqueKey='id'
						single
						fixedHeight
						styleDropdownMenuSubsection={styles.dropdownMenuSubsection}
						styleTextDropdown={styles.textDropdown}
						styleInputGroup={styles.inputGroup}
						searchInputStyle={styles.searchInput}
						
						styleItemsContainer={styles.itemsContainer}
						styleSelectorContainer={{backgroundColor: '#FFF', borderRadius: 10}}
						
						styleTextDropdownSelected={styles.textDropdownSelected}
						
						selectText='Selecione o Estado(UF)'
						selectedItems={selectedUf}
						selectedItemFontFamily='Roboto_400Regular'
						selectedItemTextColor='#34CB79'
						selectedItemIconColor='#34CB79'
						
						searchInputPlaceholderText='Digite o nome Estado'
						
						onSelectedItemsChange={handleSelectUf}
						items={ufs.map(uf => ({id: String(uf.id), name: `${uf.nome} (${uf.sigla})`}))}
					/>					
				{/* </View> */}
				{/* <View style={{backgroundColor: 'blue', }}> */}
					<MultiSelect
						uniqueKey='id'
						single={true}
						fixedHeight={true}
						styleDropdownMenuSubsection={styles.dropdownMenuSubsection}
						styleTextDropdown={styles.textDropdown}
						styleInputGroup={styles.inputGroup}
						searchInputStyle={styles.searchInput}

						styleItemsContainer={styles.itemsContainer}
						styleSelectorContainer={{backgroundColor: '#FFF', borderRadius: 10}}

						styleTextDropdownSelected={styles.textDropdownSelected}
						
						selectText='Selecione a Cidade'
						selectedItems={selectedCity}
						selectedItemFontFamily='Roboto_400Regular'
						selectedItemTextColor='#34CB79'
						selectedItemIconColor='#34CB79'

						searchInputPlaceholderText='Digite o nome da Cidade'						

						onSelectedItemsChange={handleSelectCity}
						items={cities.map(city => ({id: String(city.id), name: city.nome}))}
					/>
				{/* </View> */}

        <RectButton style={styles.button} onPress={handleNavigateToPoints} >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 26,
		paddingBottom: 26,		
  },

  main: {
    flex: 1,
		justifyContent: 'center',		
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {
		flex: 0.5,
		flexDirection: 'column',
		// backgroundColor: 'red',
		justifyContent: 'space-between',				
	},

  select: {},
	
	dropdownMenuSubsection: {
		height: 60,
		borderRadius: 10,		
		// borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#CCC',
		paddingHorizontal: 15,
		overflow: 'hidden'
		// backgroundColor: 'red',
		// borderStyle: 'solid',
		// borderColor: '#CCC',
		// borderWidth: 1,		
		// borderRadius: 10,
		// paddingHorizontal: 24,
		// height: 60,
		// paddingBottom: 16,		         
	},

	textDropdown: {
		color: '#CCC',
		paddingHorizontal: 24,
		fontFamily: 'Roboto_400Regular',
		fontSize: 16,
		// fontSize: 16,
		// paddingHorizontal: 24,
		// color: '#CCC',		
		// paddingTop: 5,
		// textAlign: 'left',
	},

	textDropdownSelected: {
		color: '#6C6C80',
		paddingHorizontal: 24,
		fontFamily: 'Roboto_400Regular',
		fontSize: 16,
	},

	inputGroup: {
    height: 60,
		backgroundColor: '#FFF',
		borderRadius: 10,
    marginBottom: 8,
		paddingHorizontal: 15,

		// borderStyle: 'solid',
		// borderWidth: 1,
		// borderTopColor: '#FFF',
		// borderRightColor: '#FFF',
		// borderBottomColor: '#CCC',
		// borderLeftColor: '#FFF',

		// borderBottomRightRadius: 0,
		// borderBottomLeftRadius: 0
	},

	itemsContainer: {
		backgroundColor: '#FFF',
		// borderRadius: 10,
		borderTopWidth: 1,
		borderTopColor: '#CCC',		
	},

	searchInput: {
		color: '#CCC',
		fontFamily: 'Roboto_400Regular',
		fontSize: 16,
	},


  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    // marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;