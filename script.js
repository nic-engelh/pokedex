const POKEMONNAMES = new Set(POKEMON);

// stores key (pokemonName) and value (Pokemon JSON)
let pokemonCache = new Map();
let pokemonEvolution = new Map();
let pokemonSpecies = new Map();
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

// getPokemonSpecies in order to read the corresponding evolution chain which is noch in the main pokemon json

function init() {

    // call readPokemonFromList 12 times 
    // call following functions to process pokemon data
    // render 12 Pokemon Cards
    // get Pokemon species for the 12 cards

}

async function transferPokemonIntoCache  (pokemon) {
    let pokemonData = await getPokemonData("pokemon", pokemon);
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
        pokemon = pokemon.toLowerCase();
        transferPokemonIntoCache(pokemon);
        index++;
    };
    return true;
}

async function getPokemonData(requestTyp, id) {
    let url = `https://pokeapi.co/api/v2/${requestTyp}/${id}`;
    let pokemonDataAsText = await fetch(url).catch(); //.catch(e) --> catch function for error handling
    let pokemonDataAsJSON = await pokemonDataAsText.json();
    return pokemonDataAsJSON;
}

function err (){
    console.log(`EORROR`);
}

function getPokemonTyp(pokemon) {
    // pokemonCache.get(pokemon)
    // ["types"][0]["type"]["name"]
    // TODO Loop for returning all typs 
    let pokemonObject = pokemonCache.get(pokemon);
    let pokemonTyp = pokemonObject["types"][0]["type"]["name"];
    return pokemonTyp;
}

function getPokemonSprite(pokemon) {
    // ["sprites"]["front_default"]
    // ["sprites"]["other"]["official-artwork"]["fron_defaul"]
    let pokemonObject = pokemonCache.get(pokemon);
    let pokemonSprite = pokemonObject["sprites"]["other"]["official-artwork"]["front_default"];
    return pokemonSprite;
}


async function getPokemonSpecies(pokemon) {
    let rawSpeciesData;
    rawSpeciesData = await getPokemonData("pokemon-species", pokemon);
    pokemonSpecies.set(pokemon, rawSpeciesData);
    return true;
}

function getEvolutionChain (pokemon) {
    if (!(pokemonSpecies.has(pokemon))) {
        getPokemonSpecies(pokemon);
    };
    let pokemonObject = pokemonSpecies.get(pokemon);
    let evolutionChain = pokemonObject["evolution_chain"]["url"];
    let chainNumber = evolutionChain.slice(42, -1);
    return chainNumber;

    // what if evolution_chain returns NULL ?!
}
    
async function getPokemonEvolution (pokemon) {
    let chainNumber = getEvolutionChain(pokemon);
    let rawEvolutionData = await getPokemonData("evolution-chain", chainNumber);
    pokemonEvolution.set(pokemon, rawEvolutionData);
    return true  
}