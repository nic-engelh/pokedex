const POKEMONNAMES = new Set(POKEMON);

// stores key (pokemonName) and value (Pokemon JSON)
let pokemonCache = new Map();

let currentLoadedPokemon = 0; 

// Next steps:
// load 12 pokemon into pokemonCache
// pokemonCache = Map ("PokemonName": "pokemonDataAsJson")
// call getPokemonData 12 times through readPokemonFromList(12) 
// readPokemonFromList returns 12 PokemonNames
// those names are used to fetch the corresponding JSON via API

// renderCards - a function which renders initial cards from pokemonCache according to the current Pokemon count
// renderCurrentPokemonDetailCard - renders detail card of the clicked pokemons abilities

// getPokemonTyp 

function init() {

    // call readPokemonFromList 12 times 
    // call following functions to process pokemon data
    // render 12 Pokemon Cards

}

async function transferPokemonIntoCache  (pokemon) {
    let pokemonData = await getPokemonData(pokemon);
    pokemonCache.set(pokemon, pokemonData);
    return true;
}

function readPokemonFromList(count) {
    currentLoadedPokemon = currentLoadedPokemon + count;
    let index = 0;
    for (const pokemon of POKEMONNAMES) {
        if (index > currentLoadedPokemon){
            break;
        } else if (pokemonCache.has(pokemon)){
            continue;
        }
        transferPokemonIntoCache(pokemon);
        index++;
    };
    return true;
}

async function getPokemonData(pokemon) {

    pokemon = pokemon.toLowerCase();
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    let pokemonDataAsText = await fetch(url);
    let pokemonDataAsJSON = await pokemonDataAsText.json();
    console.log(pokemonDataAsJSON);
    return pokemonDataAsJSON;
}