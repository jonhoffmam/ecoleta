import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  ufForPoints: string;
  cityForPoints: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([0]);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
	const [state, setState] = useState(Boolean);

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;  

	useEffect(() => {
		setState(false);
	}, []);	

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Oooops...', 'Precisamos da sua permissão para obter a localização!');
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const {latitude, longitude} = location.coords;
      
      setInitialPosition([
        latitude,
        longitude
      ])
    }

    loadPosition()
  }, []);

  useEffect(() => {
    api.get('points', {
      params: {
        city: routeParams.cityForPoints,
        uf: routeParams.ufForPoints,
        items: selectedItems
      }
    }).then(response => {
			setPoints(response.data);			
    }).catch(() => console.log(selectedItems))
  }, [selectedItems]);

  function handleNavigateBack(){
    navigation.goBack();
	}
	
	function handleNavigateToDetail(id: number){
		navigation.navigate('Detail', {point_id: id});
	}

  function handleSelectItem(id: number){
    
    const alreadyItems = selectedItems.findIndex(item => item === id);

    if (alreadyItems >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);      
      setSelectedItems(filteredItems);
    } else {      
      setSelectedItems([...selectedItems, id]);
      console.log('Itens selecionados:', selectedItems)
    }
  }

  return (
		<>
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateBack}>
        <Icon name="arrow-left" size={20} color="#34cb70"/>
      </TouchableOpacity>

      <Text style={styles.title}>Bem vindo!</Text>
      <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
      
				<View style={styles.mapContainer}>
					{initialPosition[0] !== 0 ? (
						<MapView 
							style={styles.map}
							initialRegion={{
								latitude: -20.3609742, //initialPosition[0],
								longitude: -40.6638466,//initialPosition[1],
								latitudeDelta: 0.015,
								longitudeDelta: 0.015,
						}}
						>
							<Marker
								coordinate={{
									latitude: -20.3609742,//initialPosition[0],
									longitude: -40.6638466, //initialPosition[1],
								}}
							>
							</Marker>

							{points.map(point => (
								<Marker
									key={String(point.id)}
									style={styles.mapMarker}
									onPress={() => handleNavigateToDetail(point.id)}
									coordinate={{
										latitude: point.latitude,
										longitude: point.longitude,
									}}
								>
								
									<View style={styles.mapMarkerContainerDetail}/>
									<View style={styles.mapMarkerContainer}>
										<Image style={styles.mapMarkerImage} source={{ uri: point.image_url}}/>
										<Text style={styles.mapMarkerTitle}>{point.name}</Text>						
									</View>								
								
								</Marker>
							))}

						</MapView>
					) : <ShimmerPlaceHolder
								style={styles.shimmerMapContainer}
								autoRun={true}
								visible={state}
							/>
						}
				</View>			
    </View>

    <View style={styles.itemsContainer}>
			<ScrollView 
				horizontal 
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 20 }}
			>
        {items.map(item => (
          <TouchableOpacity 
            key={String(item.id)} 
            style={[
              styles.item,
              selectedItems.includes(item.id) ? styles.selectedItem : {}
            ]} 
            onPress={() => handleSelectItem(item.id)}
            activeOpacity={0.5}
          >
            <SvgUri width={42} height={42} uri={item.image_url} />
            <Text style={styles.itemTitle}>{item.title}</Text>
				  </TouchableOpacity>
        ))}
							
			</ScrollView>
    </View>
	</>
  );	
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 10 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
		marginTop: 16,		
	},
	
	shimmerMapContainer: {			
		backgroundColor: '#ebebeb',
		overflow: 'hidden',
		flex: 1,
		width: '100%',		
		borderRadius: 10,			
		marginTop: 16,				
	},

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },	

  mapMarkerContainer: {
    width: 90,
		height: 70,
		position: 'absolute',    
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

	mapMarkerContainerDetail: {
		width: 40,
    height: 40,
    position: 'absolute',
    top: '40%',
    left: '30%',    
		backgroundColor: '#34CB79',		
    borderRadius: 50,
    borderTopLeftRadius: 0,
    transform: [{
      rotate: '225deg'
    },],
	},

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 11,
		lineHeight: 23,
		textAlign: 'center',
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
		marginBottom: 16,
		height: 120,		
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 110,
    width: 110,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 11,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
    backgroundColor: 'rgba(52, 203, 121,0.2)'
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;