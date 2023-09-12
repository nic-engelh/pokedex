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

function getPokemonIndex (pokemon) {
    // reading the pokemon index of pokemonCache from the last version entry
    let pokemonObject = pokemonCache.get(pokemon);
    let pokemonIndex = pokemonObject[`game_indices`].pop();
    return pokemonIndex[`game_index`];
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
    changeModalPokemonAbilities(pokemonName);
    changeModalAboutSectionTop (pokemonName); 
    changeModalAboutSectionBottom (pokemonName);
    changeModalStatsSection (pokemonName);
    changeModalEvolutionSection(pokemonName);
}

function changeModalHeader (pokemonName) {
    let container = document.getElementById(`staticBackdropLabel`);
    let pokemonType = getPokemonType(pokemonName);
    container.innerHTML = clear();
    // adds pokemon name to the modal header
    container.innerHTML = pokemonName; 
    // adds poekemon types
    for (const type of pokemonType) {
        container.innerHTML += createPokemonBadgeTypeHTML(type);
    };
    // adds pokemon index
    container.innerHTML += getPokemonIndex(pokemonName);
}

function changeModalPokemonAbilities (pokemon) {
    let container = document.getElementById(`modal-body-list-ability`);
    let pokemonObject = pokemonCache.get(pokemon);
    let pokemonAbilities = pokemonObject["abilities"];
    container.innerHTML = clear();
    container.innerHTML = `Abilities: `
    // adding "Ability" label 
    for (const ability of pokemonAbilities){
        let abilityName = ability["ability"]["name"];
        container.innerHTML +=  abilityName;
    }
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

function getRandomPokemonFlavourText (pokemon) {
    let pokemonObject = pokemonSpecies.get(pokemon);
    let textObject = pokemonObject["flavor_text_entries"];
    let size = textObject.length;
    let random;
    do {
        random = Math.floor(Math.random() * size);
    } while ( (textObject[random]['language']['name']) != 'en' );
    let clearedText = clearingString(textObject[random][`flavor_text`])
    return clearedText;
}

// flavour text needs to cleared of \n \f with lastIndexOf() string method
function clearingString (text) {
    text = text.replaceAll("\n", " ");
    text = text.replaceAll("\f", " ");
    return text;    
}

function changeModalAboutSectionTop (pokemon) {
    let container =  document.getElementById(`modal-body-list-1`);
    let pokemonObject = pokemonCache.get(pokemon);
    let flavourText = getRandomPokemonFlavourText(pokemon);
    let height = pokemonObject[`height`];
    let specie = pokemonObject[`species`][`name`];
    let weight = pokemonObject[`weight`];
    container.innerHTML = createPokemonModalListTopHTML (specie, height, weight, flavourText)
}

function changeModalAboutSectionBottom (pokemon) {
    let container =  document.getElementById(`modal-body-list-2`);
    let pokemonObject = pokemonSpecies.get(pokemon);
    let genera = pokemonObject[`genera`][7];
    let gender = pokemonObject[`gender_rate`];
    gender = checkPokemonGender (gender);
    // egg groups could be up to size 2 
    // TODO case difference for 1 or 2 egg groups
    let eggGroup1 = pokemonObject[`egg_groups`][0][`name`];
    let eggGroup2 = pokemonObject[`egg_groups`][1][`name`];
    let generation = pokemonObject[`generation`][`name`];
    container.innerHTML = createPokemonModalListBottomHTML (genera, gender, eggGroup1, eggGroup2, generation);
}

function checkPokemonGender (gender) {
   const genderDetail = new Map([
        ["-1", "unkown"],
        ["8", "only female"],
        ["0", "only male"]
      ]);
    let item = genderDetail.get(gender);
    return item;
} 

function changeModalStatsSection (pokemon) {
    let pokemonObject = pokemonCache.get(pokemon);
    let attributes = [];
    for (const item in pokemonObject[`stats`] ) {
        attributes.push(item);
    }
    // array entry order: hp, attack, defense, specialAttack, specialDefense, speed
    renderChart (attributes);
    return true;
}

function changeModalEvolutionSection(pokemon) {

    // check for base version of pokemon via species entries
    // save the evolution chain wihtin an cache array
    // loop through array and create html content of each pokemon evolution step
    // corner case 1: one pokemon has several possibile evolutions variants
    // corner case 2: every step has several possibile evolutions variants
    // one pokemon has not more than theree evolutions except mega und gigantamax versions

    let pokemonObject = pokemonEvolution.get(pokemon);
    let basePokemon = pokemonObject['chain']['species']['name'];
    let basePokemonEvo = pokemonEvolution.get(basePokemon);

    let evoStepTwo =  basePokemonEvo[`chain`][`evolves_to`][0][`species`][`name`];
    let evoStepThree =  basePokemonEvo[`chain`][`evolves_to`][0][`evolves_to`][0][`species`][`name`];
    let evoStepFour =  basePokemonEvo[`chain`][`evolves_to`][0][`evolves_to`][0][`evolves_to`][0][`species`][`name`];
    
}
function getPokemonEvolutionsVariants (basePokemon) {
    // loop through the array of evolves_to[i] and save all names into an array "evolutionsVariants"  
    // e.g.: eevee


}

async function getPokemonEvolutionSteps (basePokemon) {
    let array = [];
    array.push(basePokemon);
    let name = basePokemon;
    let object = pokemonEvolution.get(name);
    object = object[`chain`][`evolves_to`][0];
    do {
        name = object[`species`][`name`];
        // evolves_to array weiter verwenden
        object = object[`evolves_to`][0];
        array.push(name);
    }
    while (object); // loop as long as evolves_to != null
    return array;
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

function createPokemonModalListTopHTML (pokemonSpecie, pokemonHeight, pokemonWeight, pokemonFlavourText) {
    // insert into id="modal-body-list-1"
    return /*html*/`
        <li class="list-group-item">Info: ${pokemonFlavourText}</li>
        <li class="list-group-item">Species: ${pokemonSpecie}</li>
        <li class="list-group-item">Height: ${pokemonHeight}</li>
        <li class="list-group-item">Weight: ${pokemonWeight}</li>
        <li class="list-group-item" id="modal-body-list-ability" >
        Abilities:
        </li>
    `;
}


// genera, gender, eggGroup1, generation
function createPokemonModalListBottomHTML ( pokemonGenera, pokemonGender, pokemonEggGroup1, pokemonEggGroup2,  pokemonGeneration) {
    // insert into id="modal-body-list-2"
    return /*html*/`
        <li class="list-group-item">Category: ${pokemonGenera}</li>
        <li class="list-group-item">Gender: ${pokemonGender}</li>
        <li class="list-group-item">Egg Group: ${pokemonEggGroup1}</li>
        <li class="list-group-item">Egg Group: ${pokemonEggGroup2}</li>
        <li class="list-group-item">Generation: ${pokemonGeneration}</li>
    `;
}

function createPokemonEvolutionStepHTML (pokemonSprite,pokemonName, pokemonIndex) {
    return /*html*/`
        <div class="container-sm d-flex flex-column">
                  <img class="h-50 w-50" src= "${pokemonSprite}" alt="Picutre of ${pokemonName}">
                  <h5>${pokemonName}</h5>
                  <h6>${pokemonIndex}</h6>
                </div>
    `
}
