import { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

import * as SecureStore from 'expo-secure-store';

// IMPORTANT //
// replace this URL everytime you start ngrok
const URL = 'https://add-your-ngrok-url-here.ngrok-free.app'

// NGROK IS A THING FOR SENDING A URL TO SOMEONE ELSE TO ACCESS YOUR LOCALHOST
// TUNNEL

export default function App() {

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function checkToken() {
      const token = await SecureStore.getItemAsync("access_token")
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      const res = await fetch(`${URL}/check_token`, { headers })
      const data = await res.json()
      console.log('user on refresh', data.current_user)
      setCurrentUser(data.current_user)
    }

    checkToken()
  }, [])

  const handleLogin = async () => {
    const res = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: 'Chett', password: '123yaycats'})
    })
    const data = await res.json()
    console.log('current_user', data.current_user);
    setCurrentUser(data.current_user)
    console.log(data.access_token);
    SecureStore.setItemAsync("access_token", data.access_token)
  }

  const handleLogout = async () => {
    setCurrentUser(null)
    SecureStore.deleteItemAsync("access_token")
  }

  return (
    <View style={styles.container}>

      <Text>I am react app</Text>

      <StatusBar style="auto" />
      { currentUser ? <Text>Current User: {currentUser.username}</Text> : null }

      <Button
      onPress={handleLogin}
      title={'Login'}
      color={'red'}
      accessibilityLabel={'I am here for accessibility'} />

      <Button
      onPress={handleLogout}
      title={'Logout'}
      color={'blue'}
      accessibilityLabel={'I am here for accessibility'} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
