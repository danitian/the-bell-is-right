import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import ArtArr from './ArtArr';
import { StyleSheet, TextInput, Image, ImageBackground, Text, View, TouchableHighlight, Platform } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

export default function App() {
  const [userInput, setUserInput] = useState(0);
  const [currentArt, setCurrentArt] = useState(null);
  const [artData, setArtData] = useState([]);
  const [currentActualPrice, setCurrentActualPrice] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [players, setPlayers] = useState(1);
  const [player, setPlayer] = useState(1);
  const [winner, setWinner] = useState('');

  const onPressStart = (playerNumber) => {
    let newArtOrder = shuffleArt(ArtArr).slice(0, 10);
    setArtData(newArtOrder);
    setCurrentArt(0);

    if (playerNumber === 2) {
      setPlayers(2);
    }
  };

  const shuffleArt = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  const onPressSubmit1 = () => {
    const actualPrice = artData[currentArt]['buy-price'];
    const weightedDifference = (( (score1 * currentArt) + ( 100 * Math.abs(actualPrice - userInput) / actualPrice ) ) / (currentArt + 1))
    setScore1(weightedDifference.toFixed(2))

    const nextQuestion = currentArt + 1;
    if (nextQuestion >= 10) {
      setShowScore(true);
      alert(`Thanks for playing!`);
    } else {
      setCurrentArt(nextQuestion);
    }
  };

  const onPressSubmit2 = () => {
    const actualPrice = artData[currentArt]['buy-price'];

    const nextQuestion = currentArt + 1;
    let weightedDifference;

    if (player === 1) {
      weightedDifference = (( (score1 * currentArt) + ( 100 * Math.abs(actualPrice - userInput) / actualPrice ) ) / (currentArt + 1))
      setScore1(weightedDifference.toFixed(2))
      setPlayer(2);
    } else {
      weightedDifference = (( (score2 * currentArt) + ( 100 * Math.abs(actualPrice - userInput) / actualPrice ) ) / (currentArt + 1))
      setScore2(weightedDifference.toFixed(2))

      if (nextQuestion >= 10) {
        setShowScore(true);
        if (score1 < score2) {
          setWinner('Player 1');
        } else {
          setWinner('Player 2');
        }

        alert(`Thanks for playing!`);
      } else {
        setCurrentArt(nextQuestion);
        setPlayer(1);
      }
    }
  };

  const onChangeTextHandler = (text) => {
    setUserInput(text);
  };

  const onPressReset = () => {
    setUserInput(0);
    setCurrentArt(null);
    setArtData([]);
    setCurrentActualPrice(0);
    setShowScore(false);
    setScore1(0);
    setScore2(0);
  };

  if (currentArt === null) {
    return (
      <ImageBackground
        source={require('./assets/phonebg.png')}
        style={styles.bg}>
        <View style={styles.container}>
          <Text style={styles.title}>The Bell is Right!</Text>
          <Image
            style={styles.homeImage}
            source={
              require('./assets/redd.png')
            }
          />
          <TouchableHighlight style={styles.button} onPress={() => onPressStart(1)} underlayColor="white">
            <Text style={styles.buttonText}>1 PLAYER START!</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => onPressStart(2)} underlayColor="white">
            <Text style={styles.buttonText}>2 PLAYERS START!</Text>
          </TouchableHighlight>
        <StatusBar style="auto" />
        </View>
      </ImageBackground>
    )
  } else if (players === 1) {
    return (
      <ImageBackground
      source={require('./assets/phonebg.png')}
      style={styles.bg}>
        {showScore ? (
          <View style={styles.container}>
            <Text style={styles.score}>
              You were {score1}% off from the actual price on average!
            </Text>
            <TouchableHighlight style={styles.button} onPress={onPressReset} underlayColor="white">
              <Text style={styles.buttonText}>RESET!</Text>
            </TouchableHighlight>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.title}>The Bell is Right!</Text>
            <Text style={styles.artName}>"{artData[currentArt].name['name-USen']}"</Text>
            <Image
              style={styles.image}
              source={{
                uri: artData[currentArt]['image_uri'],
              }}
            />
            <Text style={styles.description}>
              {artData[currentArt]['museum-desc']}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Take your best guess!"
              onChangeText={(text) => onChangeTextHandler(text)}
              defaultValue={userInput}
              clearTextOnFocus={true}
            />
            <TouchableHighlight onPress={onPressSubmit1} style={styles.button} underlayColor="white">
              <Text style={styles.buttonText}>GUESS</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.reset} onPress={onPressReset} underlayColor="white">
              <Text style={styles.buttonText}>RESET</Text>
            </TouchableHighlight>
          <StatusBar style="auto" />
          </View>
        )}
      </ImageBackground>
    );
  } else {
    return (
      <ImageBackground
      source={require('./assets/phonebg.png')}
      style={styles.bg}>
        {showScore ? (
          <View style={styles.container}>
            <Text style={styles.score}>
              {winner} WINS!
            </Text>
            <Text>
              Player 1 was{"\n"}
              {score1}% off from the actual price on average{"\n"}
              {"\n"}
              Player 2 was{"\n"}
              {score2}% off from the actual price on average
            </Text>
            <TouchableHighlight style={styles.button} onPress={onPressReset} underlayColor="white">
              <Text style={styles.buttonText}>RESET!</Text>
            </TouchableHighlight>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.title}>The Bell is Right!</Text>
            <Text>Player {player}'s turn</Text>
            <Text style={styles.artName}>"{artData[currentArt].name['name-USen']}"</Text>
            <Image
              style={styles.image}
              source={{
                uri: artData[currentArt]['image_uri'],
              }}
            />
            <Text style={styles.description}>
              {artData[currentArt]['museum-desc']}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Take your best guess!"
              onChangeText={(text) => onChangeTextHandler(text)}
              defaultValue={userInput}
            />
            <TouchableHighlight onPress={onPressSubmit2} style={styles.button} underlayColor="white">
              <Text style={styles.buttonText}>GUESS</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.reset} onPress={onPressReset} underlayColor="white">
              <Text style={styles.buttonText}>RESET</Text>
            </TouchableHighlight>
          <StatusBar style="auto" />
          </View>
        )}
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    marginBottom: 40,
    color: '#964B00',
    fontFamily: 'MarkerFelt-Wide'
  },
  homeImage: {
    width: 256,
    height: 340,
    resizeMode: "cover",
    justifyContent: "center",
    marginBottom: 40
  },
  artName: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width: 256,
    height: 256,
  },
  description: {
    marginTop: 20,
    marginBottom: 20,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  input: {
    margin: 10,
    padding: 10,
    width: 260,
    height: 40,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#c9d2f8',
    justifyContent: 'center',
    textAlign: 'center',
  },
  button: {
    width: 260,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c9d2f8',
    borderColor: '#964B00',
    borderWidth: 3,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 40,
  },
  reset: {
    width: 260,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c9d2f8',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 3,
    overflow: 'hidden',
    marginTop: 40
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#964B00'
  },
  score: {
    marginBottom: 10,
    fontSize: 20,
    color: 'red'
  }
});