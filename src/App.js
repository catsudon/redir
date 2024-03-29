import React from 'react';
import logo from './logo.svg';
import './App.css';

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
    }, 3000);
  }, [pleasewait])

  const initializeLiff = () => {
    liff
      .init({
        liffId: process.env.REACT_APP_LIFF_ID
      })
      .then(() => {
        initializeApp()
        const search = window.location.search;
        const params = new URLSearchParams(search);
        refer = params.get('refer');
      })
      .then(() => {
        liff.openWindow({
          url: 'https://speedkub.io/register?refer=' + refer,
          external: true
        });
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
        'text': "You've successfully sent a message! Hooray!"
      }]).then(function () {
        window.alert('Message sent');
      }).catch(function (error) {
        window.alert('Error sending message: ' + error);
      });
    }
  }

  const handleGetAccessTokenButton = () => {
    if (!liff.isLoggedIn() && !liff.isInClient()) {
      alert('To get an access token, you need to be logged in. Please tap the "login" button below and try again.');
    } else {
      const accessToken = liff.getAccessToken();
      alert(accessToken);
    }
  }

  const handleLogginButton = () => {
    if (!liff.isLoggedIn()) {
      // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
      liff.login();
    }
  }

  const handleLogoutButton = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
  }

  const sendAlertIfNotInClient = () => {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
  }

  const share = async () => {
    const result = await liff.shareTargetPicker([
      {
        "type": "flex",
        "altText": "share",
        "contents": {
          "type": "bubble",
          "direction": "ltr",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "*ข้อความชวนให้สมัคร*",
                "align": "center",
                "contents": []
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "สมัคร",
                  "uri": "https://liff.line.me/1657084978-W5NaqyDN"
                },
                "color": "#322D2DFF",
                "style": "primary"
              }
            ]
          }
        }
      }
    ])
  }

  return (
    <div className="App">
      <main>
        <section>
          <div className="Card-info">
            <h3>Logged in as</h3>
            <p>
              {isLoggedIn ? profile.displayName : '-'}
            </p>
          </div>
        </section>
        <section>
          {pleasewait}
        </section>
      </main >
    </div>

  );
}

export default App;