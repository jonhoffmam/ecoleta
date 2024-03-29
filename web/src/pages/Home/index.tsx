import React, { useState } from 'react';
import { FiLogIn, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Search from '../../components/Search';

import logo from '../../assets/logo.svg';
import './styles.css';

const Home = () => {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div id='page-home'>
      <div className='content'>
        <header>
          <img src={logo} alt='Ecoleta' />
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

          <Link to='/create-point'>
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastrar ponto de coleta</strong>
          </Link>

          <button className='buttonOpenSearch' onClick={() => setOpenSearch(!openSearch)}>
            <span>
              <FiSearch />
            </span>
            <strong>Pesquisar ponto de coleta</strong>
          </button>

          <Search value={openSearch} onClick={() => setOpenSearch(!openSearch)} />
        </main>
        <div className='img-background'></div>
      </div>
    </div>
  );
};

export default Home;
