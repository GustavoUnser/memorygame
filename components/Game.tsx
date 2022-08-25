import React, { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Dimensions, StyleSheet, Text, View, Image } from "react-native";

interface State {
    pairsLeft: number;
}

const data = [
    { src: "./assets/cactus.png"    },
    { src: "./assets/durian.png"    },
    { src: "./assets/mushroom.png"  },
    { src: "./assets/rain.png"      },
    { src: "./assets/seed.png"      },
    { src: "./assets/sunflower.png" },
    { src: "./assets/tree.png"      },
    { src: "./assets/rainbow.png"   }
];

//lista em state que vai ser a lista para mostrar (a lista data é fixa com todos os imports);
//Ao clicar "Iniciar", chama um metodo que cria uma nova lista local no proprio metodo, percorre a [data] com foreach e da 2 push da lista na nova lista e embaralhando essa lista;
//novaLista.concat([dataItem, dataItem]);
//tlvz nova prop isFounded;
//manipular o key da flatList para renderizar novamente - flatList nao vai renderizar novamente se só mudar as props do item, precisa alterar as props da flatList ou a lista em si;

const Game = () => { 
    const [elapsedTime, setElapsedTime] = useState(0)
    const [running, setRunning] = useState(false)
    const [intervalId, setIntervalId] = useState(-1)
    const [cardList, setCardList] = useState([]);

    const startTimer = useCallback(() => {
		const id = setInterval(() => {
			setElapsedTime(currentValue => currentValue + 1)
		}, 1000)
		
		setIntervalId(id)
        shuffleCards();
	}, [])

    const stopTimer = useCallback(() => {
		clearInterval(intervalId)
	}, [intervalId])

    useEffect(() => {
		if (running) {
			startTimer()
		} else {
			stopTimer()
		}
	}, [running])

    const restartTimer = useCallback(() => {
		setElapsedTime(0)
	}, [])

    const getTimeFormatted = useCallback(() => {
		const minutes = String(Math.floor(elapsedTime/60))
		const seconds = String((elapsedTime % 60))
		return `${minutes.padStart(2, '0')}: ${seconds.padStart(2, '0')}`
	}, [elapsedTime])

    const shuffleCards = () => {
        let newData: any = [...data, ...data]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random()}))
        setCardList(newData);
    }

    // const renderItem = (item: any) => {
    //     return (
    //         <View style={appStyles.card}>
    //             <Image source={item}/>
    //         </View>
    //     )
    // }

    return(
            <View>
                <Text style={appStyles.title}>Jogo da memória</Text>

                <Text style={appStyles.timer}>{getTimeFormatted()}</Text>

                <Button title={running ? 'Reiniciar' : 'Iniciar'} onPress={startTimer} />

                <FlatList 
                    style={appStyles.flatList}
                    data={cardList}
                    renderItem={({item}) => {
                        return(
                            <View style={appStyles.card}>
                                <Image source={{uri: item}}/>
                            </View>
                        ) 
                    }}
                    numColumns={4}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ padding: 10 }}
                />

            <Text style={appStyles.message}>Faltam { 0 /*pairsCount*/} pares</Text>
            </View>
    )
}

const screenWidth = Dimensions.get("screen").width;
const cardMargin = 10;
const cardSize = ((screenWidth - 20) / 4) - (cardMargin * 2);

const appStyles = StyleSheet.create({
    content: {
        backgroundColor: '#ef5350',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 48,
        color: '#ffffff',
        paddingHorizontal: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    timer: {
        color: "#ffffff",
        fontSize: 48,
    },
    message: {
        color: "#ffffff",
        fontSize: 16,
        marginTop: 50,
    },
    action: {
        color: "#ffffff",
        fontSize: 16,
        marginTop: 50,
    },
    flatList: {
        backgroundColor: 'red',
        flexGrow: 0,
    },
    card: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#ddd",
        width: cardSize,
        height: cardSize,
        backgroundColor: "#ffffff",
        padding: 20,
        margin: cardMargin
    }
})


export default Game