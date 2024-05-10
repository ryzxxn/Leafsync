import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { FaUserAstronaut } from 'react-icons/fa';

export default function Home() {

  return (
    <>
      <div className="main_body_component" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ padding: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <div>
            <FaGithub
              href="https://github.com/ryzxxn/LeafSync"
              style={{ color: 'white', fontSize: '1.9rem', cursor: 'pointer' }}
            />
          </div>
          <div>
            <Link to="https://github.com/ryzxxn/LeafSync"><FaUserAstronaut style={{ color: 'white', fontSize: '1.9rem' }} /></Link>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'stretch', flexDirection: 'column', padding: '0rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="./leafsync.svg" alt="" style={{ height: '10rem' }}></img>
            <p style={{ fontSize: '2rem', color: 'white', fontFamily: 'sans-serif' }}>LEAFSYNC</p>
          </div>
          <div style={{ color: 'white' }}>
            <p style={{ margin: '0rem 2rem' }} className='hero_desc'>Built For performance, Security and Developers</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0rem 2rem' }}>
          <Link className="connect_button" style={{ margin: '2rem 0rem', textDecoration: 'none', color: 'white', padding: '.3rem .4rem', textShadow: '1px 1px 3px white', transition: '300ms', width: 'max-content' }} to="/connect">Get Started</Link>
        </div>
      </div>
    </>
  );
}