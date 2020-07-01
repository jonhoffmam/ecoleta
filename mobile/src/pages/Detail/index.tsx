import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
    });
  }, []);

  function handleNavigateBack(){
    navigation.goBack();
  }

  function handlePhone() {
    Linking.openURL(`tel:${data.point.phone}`)
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=55${data.point.whatsapp}&text=Olá! \nTenho interesse na coleta de resíduos!`);
  }

  function handleComposeEmail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email]
    })
  }

  if (!data.point) {
    return null; //tela de loading
  }

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb70"/>
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: data.point.image_url }}/>
        
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View>
    <View style={styles.footer} >
      <RectButton style={styles.button} onPress={handlePhone}>
        <Icon name="phone" size={20} color="#FFF"/>
        <Text style={styles.buttonText}>Telefone</Text>
      </RectButton>

      <RectButton style={styles.button} onPress={handleWhatsapp}>
        <FontAwesome name="whatsapp" size={20} color="#FFF"/>
        <Text style={styles.buttonText}>WhatsApp</Text>
      </RectButton>

      <RectButton style={styles.buttonMail} onPress={handleComposeEmail}>
        <Icon name="mail" size={20} color="#FFF"/>
        <Text style={styles.buttonText}>E-mail</Text>
      </RectButton>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 10 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    height: 110,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    // backgroundColor: 'red',
    // paddingVertical: 30,
    paddingTop: 10,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonMail: {
    width: '100%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 40,
    position: 'absolute',
    top: 60,
    left: '11%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;