import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import ArtArr from './ArtArr';
import { StyleSheet, TextInput, Image, ImageBackground, Text, View, TouchableHighlight, Platform } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

export default function App() {
  const [artIds, setArtIds] = useState([3, 12, 16, 14, 42, 37, 28, 6, 24, 32]);
  const [userInput, setUserInput] = useState(0);
  const [currentArt, setCurrentArt] = useState(0);
  const [artData, setArtData] = useState([]);
  const [currentActualPrice, setCurrentActualPrice] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  let [fontsLoaded] = useFonts({
    'FinkHeavy': require('./assets/fonts/FinkHeavy/FinkHeavy.ttf'),
  });

  const onPressStart = () => {
    let newArtOrder = shuffleArt(ArtArr)
    setArtData(newArtOrder);
    setCurrentArt(1);
  }

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
  }

  const onPressSubmit = (actualPrice) => {
    if (userInput < actualPrice + 500 && userInput > actualPrice - 500) {
      setScore(score + 1);
    }

    const nextQuestion = currentArt + 1;
    setCurrentArt(nextQuestion);

    alert(`You submitted your guess of ${userInput} bells!`)
  }

  const onChangeTextHandler = (text) => {
    setUserInput(text);
    console.log(text);
  }

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // } else {
    if (currentArt === 0) {
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
            <TouchableHighlight style={styles.button} onPress={onPressStart} underlayColor="white">
              <Text style={styles.buttonText}>START!</Text>
            </TouchableHighlight>
          <StatusBar style="auto" />
          </View>
        </ImageBackground>
      )
    } else {
      return (
        <ImageBackground
        source={require('./assets/phonebg.png')}
        style={styles.bg}>
          <View style={styles.container}>
            <Text style={styles.title}>The Bell is Right!</Text>
            <Text style={styles.artName}>{artData[currentArt].name['name-USen']}</Text>
            <Image
              style={styles.image}
              source={{
                uri: artData[currentArt]['image_uri'],
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Take your best guess!"
              onChangeText={(text) => onChangeTextHandler(text)}
              defaultValue={userInput}
            />
            <TouchableHighlight onPress={onPressSubmit} style={styles.button} underlayColor="white">
              <Text style={styles.buttonText}>GUESS</Text>
            </TouchableHighlight>
          <StatusBar style="auto" />
          </View>
        </ImageBackground>
      );
    }
  // }
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
    // fontFamily: 'FinkHeavy'
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
  input: {
    height: 40,
  },
  button: {
    width: 260,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c9d2f8',
    borderRadius: 10,
    overflow: 'hidden'
  },
  buttonText: {
    fontWeight: 'bold'
  }
});