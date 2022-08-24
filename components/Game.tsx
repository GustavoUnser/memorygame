import React, { useCallback, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";


interface State {
    pairsLeft: number;
}
  

const Game = () => { 
    const [elapsedTime, setElapsedTime] = useState(0)
    const [running, setRunning] = useState(false)
    const [intervalId, setIntervalId] = useState(-1)

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

    return(
            <View>
                <Text style={appStyles.title}>Jogo da memória</Text>

                <Text style={appStyles.timer}>{getTimeFormatted()}</Text>

                <Button title={running ? 'Reiniciar' : 'Iniciar'} onPress={startTimer} />

            <Text style={appStyles.message}>Faltam { 0 /*pairsCount*/} pares</Text>
            </View>
    )
}

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
        fontSize: 96,
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
    }
})


export default Game