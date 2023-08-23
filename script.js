const POKEMONNAMES = new Set(POKEMON);

// stores key (pokemonName) and value (Pokemon JSON)
let pokemonCache = new Map();

let readPokemonCount = 0; 

// Next steps:
// load 12 pokemon into pokemonCache
// pokemonCache = Map ("PokemonName": "pokemonDataAsJson")
// call getPokemonData 12 times through readPokemonFromList(12) 
// readPokemonFromList returns 12 PokemonNames
// those names are used to fetch the corresponding JSON via API



function init() {

    // call readPokemonFromList 12 times 
    // call following functions to process pokemon data
    // render 12 Pokemon Cards

}

function transferPokemonIntoCache  (number) {
    
    readPokemonCount = readPokemonCount + number;
    
    for (let index = 0; index <= readPokemonCount; index++) {
        const element = array[index];

        
    }

}

async function readPokemonFromList(count) {
    let index = 0;
    for (const pokemon of POKEMONNAMES) {
        let pokemonDataAsJSON = await getPokemonData(pokemon);
        pokemonCache.set(pokemon, pokemonDataAsJSON);
        index++;
        if (index > count){
        return false
        };
    };
}


async function getPokemonData(pokemon) {

    pokemon = pokemon.toLowerCase();

    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    let pokemonDataAsText = await fetch(url);

    let pokemonDataAsJSON = await pokemonDataAsText.json();

    console.log(pokemonDataAsJSON);

    return pokemonDataAsJSON;
}