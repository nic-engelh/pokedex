const POKEMONNAMES = new Set(POKEMON);

// stores key (pokemonName) and value (Pokemon Main Data JSON)
let pokemonCache = new Map();
// stores key (pokemonName) and value (Pokemon Evolution Chain JSON)
let pokemonEvolution = new Map();
// stores key (pokemonName) and value (Pokemon Species JSON)
let pokemonSpecies = new Map();
// stores the current number of loaded Pokemon
let currentLoadedPokemon = 0; 

// Next steps:
// load 12 pokemon into pokemonCache
// pokemonCache = Map ("PokemonName": "pokemonDataAsJson")
// call getPokemonData 12 times through readPokemonFromList(12) 
// readPokemonFromList returns 12 PokemonNames
// those names are used to fetch the corresponding JSON via API

// renderCurrentPokemonDetailCard - renders detail card of the clicked pokemons abilities

async function init() {

    // call readPokemonFromList 12 times 
    // call following functions to process pokemon data
    // render 12 Pokemon Cards
    // get Pokemon species for the 12 cards

    await renderChart();

}

async function getPokemon (pokemon) {
    let pokemonData = await getPokemonData(`pokemon`, pokemon);
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
    let pokemonDataAsText = await fetch(url).catch(err); //.catch(e) --> catch function for error handling
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
    for (const type of pokemonObject[`types`]) {
        pokemonType.push(type[`type`][`name`]); 
    }
    return pokemonType; // returns array of pokemon types
}

function getPokemonSprite(pokemon) {
    // ["sprites"]["front_default"]
    // ["sprites"]["other"]["official-artwork"]["front_defaul"]
    let pokemonObject = pokemonCache.get(pokemon);
    let pokemonSprite = pokemonObject[`sprites`][`other`][`official-artwork`][`front_default`];
    return pokemonSprite;
}

// getPokemonSpecies in order to read the corresponding evolution chain which is not in the main pokemon json
async function getPokemonSpecies(pokemon) {
    let rawSpeciesData;
    rawSpeciesData = await getPokemonData(`pokemon-species`, pokemon);
    pokemonSpecies.set(pokemon, rawSpeciesData);
    return true;
}

async function getEvolutionChain (pokemon) {
    if (!(pokemonSpecies.has(pokemon))) {
        await getPokemonSpecies(pokemon);
    };
    let pokemonObject = pokemonSpecies.get(pokemon);
    let evolutionChain = await pokemonObject[`evolution_chain`][`url`];
    let chainNumber = evolutionChain.slice(42, -1);
    return chainNumber;

    // what if evolution_chain returns NULL ?!
}
    
async function getPokemonEvolution (pokemon) {
    let chainNumber = await getEvolutionChain(pokemon);
    let rawEvolutionData = await getPokemonData(`evolution-chain`, chainNumber);
    pokemonEvolution.set(pokemon, rawEvolutionData);
    return true  
}

// renderPokemonCard - a function which renders initial cards from pokemonCache according to the current Pokemon count
function renderPokemonCard (pokemonName){
    let container = document.getElementById(`card-container`); 
    let sprite = getPokemonSprite(pokemonName);
    container.innerHTML += createPokemonCardHTML(sprite, pokemonName);
    renderPokemonType(pokemonName);
    renderPokemonCardBackground(pokemonName);
    return true;
}

function renderPokemonCardBackground (pokemonName) {
    let pokemonType = getPokemonType(pokemonName);
    let typeColor = getTypeColor(pokemonType[0]);
    let cardContainer = document.getElementById(`${pokemonName}-card`);
    cardContainer.classList.add(typeColor);
    // TODO testing
    // TODO add doubles types to CSS/Const like ground and dragon
}

function getTypeColor(pokemonType) {
    color = POKEMONCOLOR.get(pokemonType);
    return color;
}

function renderPokemonType (pokemonName) {
    let container = document.getElementById(`${pokemonName}-type`);
    let pokemonType = getPokemonType(pokemonName); 
    for (const type of pokemonType) {
        container.innerHTML += createPokemonBadgeTypeHTML (type);
    };
}

function renderPokemonModal (pokemonName){
    // insert all html-create functions for modal or pokemon detail card/dialog here
    changeModalImg(pokemonName);
    changeModalHeaderBackground(pokemonName);
    changeModalHeader(pokemonName);
}

function changeModalHeader (pokemonName) {
    // add pokemon number 
    // add pokemon types
    let container = document.getElementById(`staticBackdropLabel`);
    let pokemonType = getPokemonType(pokemonName);
    container.innerHTML = clear();
    container.innerHTML = pokemonName; 
    for (const type of pokemonType) {
        container.innerHTML += createPokemonBadgeTypeHTML(type);
    };
    container.innerHTML += getPokemonIndex(pokemonName);
}

function changeModalPokemonAbilities (pokemon) {
    let container = document.getElementById(`modal-body-list-ability`);
    let pokemonObject = pokemonCache.get(pokemon);
    let pokemonAbilities = pokemonObject["abilities"];
    container.innerHTML = clear();
    // adding "Ability" label 
    for (const ability of pokemonAbilities){
        let abilityName = ability["ability"]["name"];
        container.innerHTML +=  abilityName;
    }
}

function getPokemonIndex (pokemon) {
    // reading the pokemon index of pokemonCache from the last version entry
    let pokemonObject = pokemonCache.get(pokemon);
    let pokemonIndex = pokemonObject[`game_indices`].pop();
    return pokemonIndex[`game_index`];
}

function changeModalImg (pokemon) {
    let sprite = getPokemonSprite(pokemon);
    document.getElementById(`modal-header-image`).src = sprite;
    return true;
}

function changeModalHeaderBackground (pokemon) {
    let container = document.getElementById(`modal-header`);
    let pokemonType = getPokemonType(pokemon);
    let color =  getTypeColor(pokemonType);
    container.classList.add(color);
    return true;
}

function clear () {
    return ``;
}

function createPokemonBadgeTypeHTML (pokemonType) {
    return /*html*/`
        <span class="badge rounded-pill text-white text-bg-light bg-opacity-50">${pokemonType}</span>
    `   
}

function createPokemonCardHTML (pokemonSprite, pokemonName) {
    return /*html*/`
        <div class="col">
            <div class="card h-50 rounded-4 shadow-lg" id="${pokemonName}-card" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="renderModal(${pokemonName})" >
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
                        <img class="img-fluid h-100 float-end" src="${pokemonSprite}" alt="Image of ${pokemonName}"></img>
                    </div>
                </div>
            </div>
          </div>
    `;
}

function createPokemonModalListTopHTML (pokemonSpecie, pokemonHeight, pokemonWeight, pokemonAbilities) {
    // insert into id="modal-body-list-1"
    return /*html*/`
        <li class="list-group-item">Species: ${pokemonSpecie}</li>
                  <li class="list-group-item">Height: ${pokemonHeight}</li>
                  <li class="list-group-item">Weight: ${pokemonWeight}</li>
                  <li class="list-group-item">
                    Abilities: ${pokemonAbilities}
                  </li>
    `;
}

function createPokemonModalListBottomHTML (pokemonGender, pokemonEggGroup, pokemonEggCycle) {
    // insert into id="modal-body-list-2"
    return /*html*/`
        <li class="list-group-item">Gender: ${pokemonGender}</li>
        <li class="list-group-item">Egg Group: ${pokemonEggGroup}</li>
        <li class="list-group-item">Egg Cycle: ${pokemonEggCycle}</li>
    `;
}
