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

// getPokemonSpecies in order to read the corresponding evolution chain which is not in the main pokemon json

// TODO: add combotypes like dragon ground 

function init() {

    // call readPokemonFromList 12 times 
    // call following functions to process pokemon data
    // render 12 Pokemon Cards
    // get Pokemon species for the 12 cards

}

async function getPokemon (pokemon) {
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
        getPokemon(pokemon);
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

function getPokemonType(pokemon) {
    // pokemonCache.get(pokemon)
    // ["types"][0]["type"]["name"]
    let pokemonObject = pokemonCache.get(pokemon);
    let pokemonType = [];
    for (const type of pokemonObject["types"]) {
        pokemonType.push(type["type"]["name"]); 
    }
    return pokemonType; // returns array of pokemon types
}

function getPokemonSprite(pokemon) {
    // ["sprites"]["front_default"]
    // ["sprites"]["other"]["official-artwork"]["front_defaul"]
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

async function getEvolutionChain (pokemon) {
    if (!(pokemonSpecies.has(pokemon))) {
        await getPokemonSpecies(pokemon);
    };
    let pokemonObject = pokemonSpecies.get(pokemon);
    let evolutionChain = await pokemonObject["evolution_chain"]["url"];
    let chainNumber = evolutionChain.slice(42, -1);
    return chainNumber;

    // what if evolution_chain returns NULL ?!
}
    
async function getPokemonEvolution (pokemon) {
    let chainNumber = await getEvolutionChain(pokemon);
    let rawEvolutionData = await getPokemonData("evolution-chain", chainNumber);
    pokemonEvolution.set(pokemon, rawEvolutionData);
    return true  
}

function renderPokemonCardBackground (pokemonName) {
    let pokemonType = getPokemonType(pokemonName);
    let cardContainer = document.getElementById(`${pokemonName}-card`);
    cardContainer.classList.add(pokemonType[0]);
    // TODO testing
    // TODO add doubles types to CSS/Const like ground and dragon
}

function renderPokemonType (pokemonName) {
    let container = document.getElementById(`${pokemonName}-type`);
    let pokemonType = getPokemonType(pokemonName); 
    for (const type of pokemonType) {
        container.innerHTML += createPokemonBadgeTypeHTML (pokemonName, type);
    };
}

function createPokemonBadgeTypeHTML (pokemonName, pokemonType) {
    return /*html*/`
        <span class="badge rounded-pill text-white text-bg-light bg-opacity-50">${pokemonType}</span>
    `;
}

function createPokemonCardHTML (pokemonSprite, pokemonName, pokemonType, pokemonColor) {

    return /*html*/`
        <div class="col">
            <div class="card h-50 rounded-4 shadow-lg " id="${pokemonName}-card">
                <div class="row h-25">
                    <div class="col">
                        <div class="card-body">
                            <h3 class="card-title text-white  mb-4 display-6 lh-1 fw-bold">${pokemonName}</h3>
                            <div class="container-fluid" id="${pokemonName}-type">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row h-75">
                    <div class="col h-100">
                        <img class="img-fluid h-100 float-end" src="${pokemonSprite}" alt="">Image of ${pokemonName}</img>
                    </div>
                </div>
            </div>
          </div>
    `;

}