import { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
// we are using the expo-secure-store package to securely save our tokens
// you may do something different in production
import * as SecureStore from 'expo-secure-store';

// IMPORTANT //
// replace this URL everytime you start ngrok
const URL = 'https://replace-me-with-your-url.ngrok-free.app'

export default function App() {

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // in order to use async / await we must define a function inside our
    // useEffect and then call it (it doesn't make much sense but whatever)
    const checkToken = async () => {
      // this will get the token from our SecureStore if we have one
      const token = await SecureStore.getItemAsync("authToken")
      if (token) {
        const res = await fetch(`${URL}/check_token`)
        const data = await res.json()
        setCurrentUser(data)
        }
    }
    checkToken()
    .catch(console.error)
  }, [])

  const handleLogin = async () => {
    console.log("Logging in")
    // ideally we would send the username / password but I'm keeping it simple here
    const res = await fetch(`${URL}/login`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      setCurrentUser(data.current_user)
      // we get the token and store it in our secured storage
      await SecureStore.setItemAsync("authToken", data.token)
    }
  }

  const handleLogout = async () => {
    console.log("Logging out --> setting user state to null and deleting auth token")
    setCurrentUser(null)
    await SecureStore.deleteItemAsync("authToken")
  }

  const handleGetFromStorage = async () => {
    // this is just here so we can easily see the token, we wouldn't actually do
    // this in production...
    const token = await SecureStore.getItemAsync("authToken")
    console.log(`${token} gotten from secure storage`)
  }

  const handleFetchProtected = async () => {
    const token = await SecureStore.getItemAsync("authToken")
    const res = await fetch(`${URL}/protected`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    console.log(data)
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

      <Button
      onPress={handleGetFromStorage}
      title={'Get from storage'}
      color={'green'}
      accessibilityLabel={'I am here for accessibility'} />

      <Button
      onPress={handleFetchProtected}
      title={'Get Protected'}
      color={'red'}
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
