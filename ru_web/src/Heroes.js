import React, { useEffect, useState } from 'react';
const { send, openExternal } = window.electronAPI || {};

const Heroes = () => {
  const [heroes, setHeroes] = useState([]);
  const [buffData, setBuffData] = useState({});
  const [proData, setProData] = useState({});
  const [search, setSearch] = useState('');
  const [darkTheme, setDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }

    // Если темы нет в localStorage, определяем по времени суток, хз зачем, но пусть будет
    const currentHour = new Date().getHours();
    return currentHour < 6 || currentHour >= 18;
  });

  useEffect(() => {
    const loadData = async () => {
      const [imgRes, buffRes, proRes] = await Promise.all([
        fetch('/img.json'),
        fetch('/buff.json'),
        fetch('/pro.json')
      ]);
      const imgJson = await imgRes.json();
      const buffJson = await buffRes.json();
      const proJson = await proRes.json();

      setHeroes(Object.entries(imgJson));
      setBuffData(buffJson);
      setProData(proJson);
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
  }, [darkTheme]);

  const filteredHeroes = heroes.filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  const handleClose = () => {
    send('close-window');
  };

  const handleMinimize = () => {
    send('minimize-window');
  };

  
  const handleLinkClick = (e, url) => {
    e.preventDefault();
    if (openExternal) {
      openExternal(url);
    } else {
      console.error("openExternal не доступен, пробую использовать window.open.");
      window.open(url); 
    }
  };

  return (
    <div
      style={{
        width: '900px',
        height: '600px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        background: darkTheme ? '#2f2f2f' : '#f5f5f5',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div
        style={{
          height: '40px',
          background: darkTheme ? '#1e1e1e' : '#ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          WebkitAppRegion: 'drag'
        }}
      >
        <div style={{ visibility: 'hidden', width: '70px' }}></div>
        <div style={{ fontWeight: 'bold', color: darkTheme ? '#fff' : '#000' }}>Герои</div>
        <div style={{ display: 'flex', WebkitAppRegion: 'no-drag' }}>
          <button
            onClick={handleMinimize}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              marginLeft: '10px',
              color: darkTheme ? '#fff' : '#000'
            }}
          >
            ―
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              marginLeft: '10px',
              color: darkTheme ? '#fff' : '#000'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <h1
        style={{
          textAlign: 'center',
          margin: '20px 0 10px',
          color: darkTheme ? '#fff' : '#000'
        }}
      > 
      </h1>

      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: 'calc(100% - 60px)',
          padding: '10px 15px',
          borderRadius: '8px',
          border: darkTheme ? '1px solid #555' : '1px solid #ccc',
          margin: '0 auto 20px',
          fontSize: '16px',
          boxSizing: 'border-box',
          backgroundColor: darkTheme ? '#444' : '#fff',
          color: darkTheme ? '#fff' : '#000',
          display: 'block'
        }}
      />

      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '50px',
          right: '20px',
          backgroundColor: darkTheme ? '#fff' : '#333',
          color: darkTheme ? '#333' : '#fff',
          border: 'none',
          borderRadius: '50%',
          padding: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s, color 0.3s',
          WebkitAppRegion: 'no-drag'
        }}
      >
        {darkTheme ? '🌑' : '🌕'}
      </button>
      <div
        style={{
          overflowY: 'auto',
          maxHeight: 'calc(100% - 120px)', 
          padding: '0 20px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          {filteredHeroes.map(([name, { img }]) => (
            <div
              key={name}
              style={{
                position: 'relative',
                textAlign: 'center',
                background: darkTheme ? '#3c3c3c' : '#fff',
                borderRadius: '10px',
                padding: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={`/img/${img}`}
                  alt={name}
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    transition: '0.3s'
                  }}
                />
                <div
                  className="hover-buttons"
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    opacity: '0',
                    transition: 'opacity 0.3s',
                    borderRadius: '8px',
                    gap: '10px'
                  }}
                >
                  <a
                    href={buffData[name]?.info_url}
                    onClick={(e) => buffData[name]?.info_url && handleLinkClick(e, buffData[name].info_url)}
                    style={{
                      padding: '6px 12px',
                      background: '#ff4e4e',
                      color: '#fff',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '13px'
                    }}
                  >
                    Dotabuff
                  </a>
                  <a
                    href={proData[name]?.info_url}
                    onClick={(e) => proData[name]?.info_url && handleLinkClick(e, proData[name].info_url)}
                    style={{
                      padding: '6px 12px',
                      background: '#4e8bff',
                      color: '#fff',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '13px'
                    }}
                  >
                    ProTracker
                  </a>
                </div>
              </div>
              <div
                style={{
                  fontWeight: '500',
                  fontSize: '14px',
                  marginTop: '2px',
                  color: darkTheme ? '#fff' : '#000'
                }}
              >
                {name}
              </div>
            </div>
          ))}
        </div>

        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
            marginBottom: '40px',
            paddingBottom: '20px'
          }}
        >
          <a
            href="https://www.donationalerts.com/r/pashka8"
            onClick={(e) => handleLinkClick(e, "https://www.donationalerts.com/r/pashka8")}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: darkTheme ? '#6441a4' : '#9146ff',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(145, 70, 255, 0.2)',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: darkTheme ? '2px solid #9146ff' : 'none',
              textAlign: 'center',
              WebkitAppRegion: 'no-drag',
              width: '300px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(145, 70, 255, 0.3)';
              e.currentTarget.style.backgroundColor = '#7e3ad9';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(145, 70, 255, 0.2)';
              e.currentTarget.style.backgroundColor = darkTheme ? '#6441a4' : '#9146ff';
            }}
          >
            💰 DonationAlerts
          </a>
        </div>
      </div>

      <style>{`
        .hover-buttons:hover {
          opacity: 1 !important;
        }
        div:hover > .hover-buttons {
          opacity: 1 !important;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${darkTheme ? '#555' : '#f1f1f1'};
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default Heroes;