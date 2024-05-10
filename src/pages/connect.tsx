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
      <div className="p-5 h-100 w-100 justify-content-center d-flex">
        
        <div style={{ color: 'white' }} className=" p-4 d-flex flex-column w-100 justify-content-center align-items-center gap-4  bg-dark rounded ">
          <label className="h1 m-4">Connect to your Database</label>
          <div>
            <p className="input_title">Host</p>
            <input className="input_field" onChange={(e) => setHost(e.target.value)} />
          </div>

          <div>
            <p className="input_title">Username</p>
            <input className="input_field" onChange={(e) => setUsername(e.target.value)}></input>
          </div>

          <div>
            <p className="input_title">Password</p>
            <input className="input_field" onChange={(e) => setPassword(e.target.value)}></input>
          </div>

          <div>
            <p className="input_title">Database</p>
            <input className="input_field" onChange={(e) => setDatabase(e.target.value)}></input>
          </div>

          <div>
            <button className="btn btn-primary" onClick={handleConnection}>Connect</button>
          </div>
        </div>
      </div>
    </>
  );
}
