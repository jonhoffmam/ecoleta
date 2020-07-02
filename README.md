![banner](https://user-images.githubusercontent.com/46982925/86201952-4eed6e80-bb37-11ea-819d-4735decccc2e.png)
## :speech_balloon:Sobre o Projeto
O :recycle:Ecoleta é um projeto de código aberto (Open Source) desenvolvido durante a semana **NLW #01 (Next Level Week 1.0)** oferecido pela [**RocketSeat**](https://rocketseat.com.br/).
Esse projeto tem como objetivo principal o descarte adequado de cada lixo, seja orgânico ou inorgânico, como por exemplo o papel, vidro, metal, plástico, eletrônicos entre outros. Isso é feito através da conexão entre pessoas e/ou entidades que precisam realizar o descarte com as empresas/entidades que realizam esse tipo de coleta, resultando em uma mudança de hábitos culturais e minimizando o acúmulo de lixo disposto no meio ambiente de forma inadequada.

### Como Funciona:grey_question:
O projeto se constitui basicamente em duas funções, que é cadastrar as empresas/entidades que oferecem o serviço de coleta e consultar o cadastro dessas empresas.
O cadastro é realizado através da plataforma web (website), sendo composto por:

 - Upload de imagem do estabelecimento/empresa/ponto de coleta;
 - Nome do ponto de coleta;
 - E-mail, Telefone, WhatsApp;
 - Seleção do endereço através do mapa;
 - Seleção do estado e da cidade;
 - Seleção dos itens de coleta que é realizado pela empresa;

A consulta é realizada através do aplicativo móvel (mobile) o qual poderá:

 - Selecionar o estado e a cidade que deseja consultar os pontos de coleta;
 - Ao clicar no botão para pesquisa é direcionado para a tela que irá mostrar os pontos de coleta na localidade desejada através do mapa;
 - Filtrar as entidades/empresas pelos itens que as mesmas coletam;
 
## :hammer: Tecnologias
Para o projeto de modo geral foram utilizados o ***Node.js, React, React Native*** juntamente com o [***Typescript***](https://www.typescriptlang.org/).
### Back-end (Regras de Negócio)
#### :gear:Server ([Node.js](https://nodejs.org/))
 - [**Celebrate**](https://github.com/arb/celebrate)
 - [**CORS**](https://github.com/expressjs/cors)
 - [**Express**](https://github.com/expressjs/express)
 - [**KnexJS**](http://knexjs.org/)
 - [**Multer**](https://github.com/expressjs/multer)
 - [**TS Node**](https://github.com/TypeStrong/ts-node)
 - [**PostgreSQL**](https://www.postgresql.org/)
 - [**TypeScript**](https://www.typescriptlang.org/)

### Front-end (Interface)
#### :computer:Web ([React](https://reactjs.org/))
 - [**Axios**](https://github.com/axios/axios)
 - [**React Dropzone**](https://github.com/react-dropzone/react-dropzone)
 - [**React Google Maps API**](https://react-google-maps-api-docs.netlify.app/)
 - [**React Icons**](https://github.com/react-icons/react-icons)
 - [**React Router Dom**](https://github.com/ReactTraining/react-router)
 - [**React Scripts**](https://github.com/facebook/create-react-app#readme)
 - [**TypeScript**](https://www.typescriptlang.org/)


#### :iphone:Mobile ([React Native](https://reactnative.dev/))

 - [**Axios**](https://github.com/axios/axios)
 - [**Expo**](https://github.com/expo/expo/tree/master/packages/expo)
 - [**Expo Constants**](https://docs.expo.io/versions/latest/sdk/constants/)
 - [**Expo Font**](https://docs.expo.io/versions/latest/sdk/font/)
 - [**Expo Location**](https://docs.expo.io/versions/latest/sdk/location/)
 - [**Expo Mail Composer**](https://docs.expo.io/versions/latest/sdk/mail-composer/)
 - [**React Navigation**](https://reactnavigation.org/)
 - [**React Native Gesture Handler**](https://github.com/software-mansion/react-native-gesture-handler)
 - [**React Native Maps**](https://github.com/react-native-community/react-native-maps)
 - [**React Native Multiple Select**](https://github.com/toystars/react-native-multiple-select)
 - [**React Native Reanimated**](https://github.com/software-mansion/react-native-reanimated)
 - [**React Native Shimmer Placeholder**](https://github.com/tomzaku/react-native-shimmer-placeholder#readme)
 - [**React Native SVG**](https://github.com/react-native-community/react-native-svg)
 - [**TypeScript**](https://www.typescriptlang.org/)

### Também foram utilizados...
 - [**API IBGE**](https://servicodados.ibge.gov.br/api/docs/localidades?versao=1) - Para importar a lista de [Estados](https://servicodados.ibge.gov.br/api/docs/localidades?versao=1#api-UFs-estadosGet) e [Municípios](https://servicodados.ibge.gov.br/api/docs/localidades?versao=1#api-Municipios-estadosUFMunicipiosGet);
 - [**Insomnia**](https://insomnia.rest/) - Para testar as requisições (GET e POST) da **API** criada;
