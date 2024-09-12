import { useEffect, useState } from 'react';
import Layout from './screens/layout';
import Splash from './screens/splashscreen/splash';

export default function App() {
  const [isshowsplash,setisshowsplash] = useState(true)
  useEffect(() =>{
    setTimeout(() => {
      setisshowsplash(false);
    }, 3000); //

  })
  return (
    <>{isshowsplash ? (<Splash /> ):(<Layout />) }</>
  );
}
