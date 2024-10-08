import { useEffect, useState } from 'react';
import Layout from './screens/layout';
import Splash from './screens/splashscreen/splash';
import { StyleSheet, View } from 'react-native';

export default function App() {
  const [isshowsplash, setisshowsplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setisshowsplash(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {isshowsplash ? <Splash /> : <Layout />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
