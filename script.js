const POKEMONNAMES = new Set(POKEMON);
// stores key (pokemonName) and value (Pokemon Main Data JSON)
let pokemonCache = new Map();
// stores key (pokemonName) and value (Pokemon Evolution Chain JSON)
let pokemonEvolution = new Map();
// stores key (pokemonName) and value (Pokemon Species JSON)
let pokemonSpecies = new Map();
// stores the current number of loaded Pokemon
let CURRENTLOADEDPOKEMON = 0;
let CURRENTMODALCOLOR = null;

async function init() {
  addPokemonCards(24);
  await readPokemonFromList();
  renderPokemonCardsContainer();
}

async function readPokemonFromList() {
  let index = 0;
  for (const pokemon of POKEMONNAMES) {
    if (index > CURRENTLOADEDPOKEMON) {
      break;
    } else if (pokemonCache.has(pokemon)) {
      continue;
    }
    let currentPokemon = pokemon.toLowerCase();
    await getPokemon(currentPokemon);
    await getPokemonSpecies(currentPokemon);
    index++;
  }
  return true;
}

function renderPokemonCardsContainer() {
  let i = 0;
  document.getElementById("card-container").innerHTML = clear();
  for (const [key, value] of POKEMONNAMES.entries()) {
    if (i > CURRENTLOADEDPOKEMON) {
      break;
    }
    let currentPokemon = value.toLowerCase();
    renderPokemonCard(currentPokemon);
    i++;
  }
}

function getPokemonType(pokemon) {
  // returns array of pokemon types
  let pokemonObject = pokemonCache.get(pokemon);
  let pokemonType = [];
  for (const type of pokemonObject["types"]) {
    pokemonType.push(type["type"]["name"]);
  }
  return pokemonType;
}

function getPokemonSprite(pokemon) {
  let pokemonObject = pokemonCache.get(pokemon);
  let pokemonSprite =
    pokemonObject["sprites"]["other"]["official-artwork"]["front_default"];
  return pokemonSprite;
}

async function getEvolutionChain(pokemon) {
  if (!pokemonSpecies.has(pokemon)) {
    await getPokemonSpecies(pokemon);
  }
  let pokemonObject = pokemonSpecies.get(pokemon);
  let evolutionChain = await pokemonObject["evolution_chain"]["url"];
  let chainNumber = evolutionChain.slice(42, -1);
  return chainNumber;
  // what if evolution_chain returns NULL ?!
}

async function getPokemonEvolution(pokemon) {
  let chainNumber = await getEvolutionChain(pokemon);
  let rawEvolutionData = await getPokemonData("evolution-chain", chainNumber);
  pokemonEvolution.set(pokemon, rawEvolutionData);
  return true;
}

function getPokemonIndex(pokemon) {
  // reading the pokemon index of pokemonCache from the last version entry
  let pokemonObject = pokemonCache.get(pokemon);
  let pokemonIndex = pokemonObject["id"];
  return pokemonIndex;
}

// renderPokemonCard - a function which renders initial cards from pokemonCache according to the current Pokemon count
async function renderPokemonCard(pokemonName) {
  let container = document.getElementById("card-container");
  let sprite = await getPokemonSprite(pokemonName);
  let pokemonTitle = pokemonName.toUpperCase();
  container.innerHTML += createPokemonCardHTML(
    sprite,
    pokemonName,
    pokemonTitle
  );
  renderPokemonType(pokemonName);
  await renderPokemonCardBackground(pokemonName);
  return true;
}

async function renderPokemonCardBackground(pokemonName) {
  let pokemonType = getPokemonType(pokemonName);
  let typeColor = await getTypeColor(pokemonType[0]);
  let cardContainer = document.getElementById(`${pokemonName}-card`);
  cardContainer.classList.add(typeColor);
  // TODO testing
}

function getTypeColor(pokemonType) {
  let type;
  if (Array.isArray(pokemonType)) {
    type = pokemonType[0];
  } else {
    type = pokemonType;
  }
  color = POKEMONCOLOR.get(type);
  return color;
}

function renderPokemonType(pokemonName) {
  let container = document.getElementById(`${pokemonName}-type`);
  let pokemonType = getPokemonType(pokemonName);
  for (const type of pokemonType) {
    container.innerHTML += createPokemonBadgeTypeHTML(type);
  }
}

async function renderPokemonModal(pokemonName) {
  // insert all html-create functions for modal or pokemon detail card/dialog here
  changeModalImg(pokemonName);
  clearModalHeaderBackground();
  changeModalHeaderBackground(pokemonName);
  changeModalHeaderTitle(pokemonName);
  changeModalHeaderTypes(pokemonName);
  changeModalHeaderIndex(pokemonName);
  await changeModalAboutSectionTop(pokemonName);
  changeModalAboutSectionBottom(pokemonName);
  changeModalPokemonAbilities(pokemonName);
  changeModalStatsSection(pokemonName);
  changeModalEvolutionSection(pokemonName);
  changeModalMoveSection(pokemonName);
  addOnclickAttribute(pokemonName);
}
