import React from 'react';
import logo from './logo.svg';
import './App.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { BallTriangle } from 'react-loader-spinner'

const liff = window.liff

const App = () => {

  const [os, setOs] = React.useState('')
  const [language, setLanguage] = React.useState('')
  const [version, setVersion] = React.useState('')
  const [isInClient, setIsInClient] = React.useState('')
  const [isLoggedIn, setIsLoggedIn] = React.useState('')
  const [isLoggedInText, setIsLoggedInText] = React.useState('')
  const [profile, setProfile] = React.useState('')
  const [pleasewait, setPleasewait] = React.useState('please wait . . .')
  const search = window.location.search;
  const params = new URLSearchParams(search);
  let refer = params.get('refer');


  React.useEffect(() => {
    initializeLiff()
  }, [])

  React.useEffect(() => {
    setTimeout(() => {
      liff.closeWindow();
    }, 1500);
  }, [pleasewait])

  const initializeLiff = () => {
    liff
      .init({
        liffId: process.env.REACT_APP_LIFF_ID
      })
      .then(() => {
        handleSendMessageButton()
      })
      .then(() => {
        setPleasewait("")
      })
      .catch((err) => {
        alert(err)
      })
  }

  const initializeApp = () => {
    displayLiffData();
    displayIsInClientInfo();
  }

  const displayLiffData = () => {
    setOs(liff.getOS())
    setLanguage(liff.getLanguage())
    setVersion(liff.getVersion())
    setIsInClient(liff.isInClient())
    setIsLoggedIn(liff.isLoggedIn())
    setIsLoggedInText(liff.isLoggedIn() ? 'True' : 'False')
    liff.getProfile().then(profile => setProfile(profile))
  }

  const displayIsInClientInfo = () => {
    if (liff.isInClient()) {
      setIsInClient('You are opening the app in the in-app browser of LINE.');
    } else {
      setIsInClient('You are opening the app in an external browser.');
    }
  }

  const handleOpenExternalWindowButton = () => {
    liff.openWindow({
      url: 'https://line.me',
      external: true
    });
  }

  const handleCloseLIFFAppButton = () => {
    if (!liff.isInClient()) {
      sendAlertIfNotInClient()
    } else {
      liff.closeWindow();
    }
  }



  const handleSendMessageButton = () => {
    if (!liff.isInClient()) {
      sendAlertIfNotInClient();
    } else {
      liff.sendMessages([{
        'type': 'text',
        'text': "แลกสิทธิ์รับ 100 POPCOIN ฟรี"
      }]).then(function () {
        window.alert('Complete!');
      }).catch(function (error) {
        window.alert('Error: ' + error);
      });
    }
  }

  const sendAlertIfNotInClient = () => {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
  }

  return (
    <div className="App">
      <main>
        <BallTriangle color="#58eddc" height={80} width={80} />
      </main>

    </div>

  );
}

export default App;