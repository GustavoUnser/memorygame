import React, { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Dimensions, StyleSheet, Text, View, Image, TouchableWithoutFeedback } from "react-native";

enum State {
    HIDED,
    VISIBLE,
    MATCHED,
}

enum ActionMemorizer {
    PLAYING,
    WAITING,
    FINISHED,
}

interface ItemMemorizer {
    data: string,
    state: State,
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
]

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
    const [memorizerGrid, setMemorizerGrid] = useState<ItemMemorizer[]>([])
    const [pairsLeft, setPairsLeft] = useState(8)
    const [action, setAction] = useState(ActionMemorizer.WAITING)

    const startTimer = useCallback(() => {
        const id = setInterval(() => {
          setElapsedTime(currentValue => currentValue + 1)
        }, 1000)
    
        setIntervalId(id)
      }, [])
    

    const stopTimer = useCallback(() => {
		clearInterval(intervalId)
	}, [intervalId])
    
    useEffect(() => {
        if (running) {
          startTimer()
        } else {
          restartTimer(ActionMemorizer.FINISHED)
          stopTimer()
        }
    }, [running])

    const restartTimer = useCallback((newAction: ActionMemorizer) => {
        setAction(newAction)
        setElapsedTime(0)
      }, [])

    const toggleRunning = () => {
        setRunning(!running)
        if (action === ActionMemorizer.WAITING) {
          setAction(ActionMemorizer.PLAYING)
        }
    }

    const getTimeFormatted = useCallback(() => {
        const minutes = Math.floor(elapsedTime / 60).toString()
        const seconds = (elapsedTime % 60).toString()
        return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
      }, [elapsedTime])

    const shuffleCards = () => {
        let newData: any = [...data, ...data]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random()}))
        setCardList(newData);
    }

    

    const handleItemClick = (item: ItemMemorizer, index: number) => {
        if (action !== ActionMemorizer.PLAYING) return
    
        if (item.state === State.HIDED) {
          let visibleItems = memorizerGrid.filter(i => i.state === State.VISIBLE)
          let newState = State.VISIBLE
          let newMemorizerGrid = [...memorizerGrid]
    
          if (visibleItems.length == 1 && visibleItems.some(i => i.data === item.data)) {
            newMemorizerGrid = memorizerGrid.map(i => i.data === item.data ? { ...i, state: State.MATCHED } : i)
            newState = State.MATCHED
          } else if (visibleItems.length > 1) {
            newMemorizerGrid = memorizerGrid.map(i => i.state === State.VISIBLE ? { ...i, state: State.HIDED } : i)
          }
    
          newMemorizerGrid[index] = {
            ...item,
            state: newState
          }
          setMemorizerGrid(newMemorizerGrid)
        }
    }
    

    return(
            <View>
                <Text style={appStyles.title}>Jogo da memória</Text>

                <Text style={[appStyles.timer, action === ActionMemorizer.PLAYING ? {} : appStyles.disabled]}>{getTimeFormatted()}</Text>

                <Button title={running ? 'Reiniciar' : 'Iniciar'} onPress={startTimer} />

                <FlatList 
                    scrollEnabled={false}
                    data={memorizerGrid}
                    keyExtractor={(grid, index) => `${grid}_${index}`}
                    numColumns={4}
                    renderItem={({ item, index }) => (
                      <TouchableWithoutFeedback onPress={() => { handleItemClick(item, index) }}>
                        <View style={[appStyles.item, action === ActionMemorizer.PLAYING && 
                            item.state !== State.MATCHED ? {} : appStyles.disabled]}>
                          <Text style={appStyles.item_content}>{item.state !== State.HIDED ? item.data : ""}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  />

        <Text style={[appStyles.message, action === ActionMemorizer.PLAYING ? {} :
             appStyles.disabled]}>Ainda faltam {pairsLeft} pares.</Text>
        <Button color='black' title={running ? 'Reiniciar' : 'Iniciar'} onPress={toggleRunning} />
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
        textAlign: 'center'
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
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderWidth: 5,
        borderColor: '#304494',
        width: 75,
        height: 75,
      },
      item_content: {
        fontSize: 38,
      },
      disabled: {
        color: 'grey',
        borderColor: 'grey'
      }
})


export default Game
