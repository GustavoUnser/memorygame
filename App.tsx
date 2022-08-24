import React from 'react'
import { StyleSheet, View } from 'react-native'

import Game from './components/Game';

export default class App extends React.Component {
	render() {
		return(
			<View style={appStyles.content}>
				<Game/>
			</View>
		)
	}
};

const appStyles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#ef5350',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
