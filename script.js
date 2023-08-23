const POKEMONNAMES = new Set(POKEMON);

// stores key (pokemonName) and value (Pokemon JSON)
let pokemonCache = new Map();
let pokemonEvolution = new Map();
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

async function getPokemonData(requestTyp, pokemon) {
    let url = `https://pokeapi.co/api/v2/${requestTyp}/${pokemon}`;
    let pokemonDataAsText = await fetch(url);
    let pokemonDataAsJSON = await pokemonDataAsText.json();
    return pokemonDataAsJSON;
}

function getPokemonTyp(pokemon) {
    // pokemonCache.get(pokemon)
    // ["types"][0]["type"]["name"]

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

async function getPokemonEvolution () {
    // https://pokeapi.co/api/v2/evolution-chain/
    // 530 evolutions in total
    // fetch url https://pokeapi.co/api/v2/evolution-chain/1/
    // save all in an list
    // get pokemon name from list 
    // merge pokemon name with evolution list in a map
    // const map() = ("pokemonName":"pokemonEvolutionList")
    let rawEvolutionData;
    let name; 
    for (let index = 1; index <= 530; index++) {
        rawEvolutionData = await getPokemonData("evolution-chain", index);
        name = rawEvolutionData["chain"]["species"]["name"];
        pokemonEvolution.set(name, rawEvolutionData);
    }
    return true   
}