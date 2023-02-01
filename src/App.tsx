import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import PokemonColection from './components/PokemonColection';
import { Pokemon } from './interface';
interface Pokemons {
  name: string;
  url: string;
}
const App: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getPokemons = async () => {
      setLoading(true);

      const res = await axios.get(
        'https://pokeapi.co/api/v2/pokemon?limit=20&offset=10'
      );
      setNextUrl(res.data.next);
      res.data.results.map(async (pokeName: Pokemons) => {
        const poke = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokeName.name}`
        );
        setPokemons((p) => [...p, poke.data]);
        setLoading(false);
      });
    };
    getPokemons();
  }, []);

  const nextPage = async () => {
    setLoading(true);
    let res = await axios.get(nextUrl);
    setNextUrl(res.data.next);
    res.data.results.map(async (pokeName: Pokemons) => {
      const poke = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokeName.name}`
      );
      setPokemons((p) => [...p, poke.data]);
      setLoading(false);
    });
  };
  return (
    <>
      <div className='app'>
        <div className='container'>
          <header className='pokemon-header'> Pokemon</header>
          <PokemonColection pokemons={pokemons} />
          <div className='btn'>
            <button onClick={nextPage}>
              {' '}
              {loading ? 'Loading...' : 'Load more'}
              {/* write a reload button at the button of page */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
