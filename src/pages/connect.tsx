import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Connect() {
  const [Host, setHost] = useState<string>('');
  const [Username, setUsername] = useState<string>('');
  const [Password, setPassword] = useState<string>('');
  const [Database, setDatabase] = useState<string>('');


  const UserConnectionData = {
    host: Host,
    username: Username,
    password: Password,
    database: Database
  };

  const navigate = useNavigate();

  useEffect(() => {
    const currentHost = sessionStorage.getItem('current_host');
    const currentUsername = sessionStorage.getItem('current_username');
    const currentPassword = sessionStorage.getItem('current_password');
    const currentDatabase = sessionStorage.getItem('current_database');

    if (currentHost || currentUsername || currentPassword || currentDatabase) {
      navigate('/dashboard');
    }
  }, [navigate]);

  function handleConnection() {
    axios.post('http://localhost:5000/Connect', UserConnectionData)
      .then(response => {
        if (response.status === 200) {
          console.log('Connection successful');

          sessionStorage.setItem('current_host', Host);
          sessionStorage.setItem('current_username', Username);
          sessionStorage.setItem('current_password', Password);
          sessionStorage.setItem('current_database', Database);
          sessionStorage.setItem('current_table', '');

          //navigate
          navigate('/dashboard');
        }
      })
      .catch(error => {
        alert('Invalid Credentials')
        navigate('/connect');
        console.log(error.error);
        window.location.reload()
      });
  }

  return (
    <>
      <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>

        <div style={{display: 'flex', alignItems: 'center'}}>
          <img src="./leafsync.svg" alt="" style={{height: '3rem'}}></img>
          <p style={{color: 'white'}}>LeafSync</p>
        </div>
        
        <div style={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center', flex: '1', gap: '2rem'}} >
          <label style={{fontSize: '2rem'}}>Connect Database</label>
          <div>
            {/* <p className="input_title">Host</p> */}
            <input placeholder="Host" className="input_field" onChange={(e) => setHost(e.target.value)} />
          </div>

          <div>
            {/* <p className="input_title">Username</p> */}
            <input placeholder="Username" className="input_field" onChange={(e) => setUsername(e.target.value)}></input>
          </div>

          <div>
            {/* <p className="input_title">Password</p> */}
            <input placeholder="Password" className="input_field" onChange={(e) => setPassword(e.target.value)}></input>
          </div>

          <div>
            {/* <p className="input_title">Database</p> */}
            <input placeholder="Database" className="input_field" onChange={(e) => setDatabase(e.target.value)}></input>
          </div>

          <div>
            <button className="connect_button" onClick={handleConnection}>Connect</button>
          </div>
        </div>
      </div>
    </>
  );
}
