const POKEMONNAMES = new Set(POKEMON);
// stores key (pokemonName) and value (Pokemon Main Data JSON)
let pokemonCache = new Map();
// stores key (pokemonName) and value (Pokemon Evolution Chain JSON)
let pokemonEvolution = new Map();
// stores key (pokemonName) and value (Pokemon Species JSON)
let pokemonSpecies = new Map();
// stores the current number of loaded Pokemon
let CURRENTLOADEDPOKEMON = 0;

async function init() {
  // call readPokemonFromList 12 times
  // call following functions to process pokemon data
  // render 12 Pokemon Cards
  // get Pokemon species for the 12 cards
  addPokemonCards(8);
  await readPokemonFromList();
  renderPokemonCardsContainer();
}

window.addEventListener("scroll", async () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;

  if (Math.ceil(scrolled) === scrollable) {
    addPokemonCards(4);
    await readPokemonFromList();
    renderPokemonCardsContainer();
  }
});

function addPokemonCards(x) {
  CURRENTLOADEDPOKEMON += x;
  return true;
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
  container.innerHTML += createPokemonCardHTML(sprite, pokemonName);
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
  changeModalHeaderBackground(pokemonName);
  changeModalHeader(pokemonName);
  await changeModalAboutSectionTop(pokemonName);
  changeModalAboutSectionBottom(pokemonName);
  changeModalPokemonAbilities(pokemonName);
  changeModalStatsSection(pokemonName);
  changeModalEvolutionSection(pokemonName);
  changeModalMoveSection(pokemonName);
}

function changeModalHeader(pokemonName) {
  let container = document.getElementById("staticBackdropLabel");
  let pokemonType = getPokemonType(pokemonName);
  container.innerHTML = clear();
  // adds pokemon name to the modal header
  container.innerHTML = pokemonName;
  // adds poekemon types
  for (const type of pokemonType) {
    container.innerHTML += createPokemonBadgeTypeHTML(type);
  }
  // adds pokemon index
  container.innerHTML += getPokemonIndex(pokemonName);
}

function changeModalPokemonAbilities(pokemon) {
  let container = document.getElementById("modal-body-list-ability");
  let pokemonObject = pokemonCache.get(pokemon);
  let pokemonAbilities = pokemonObject["abilities"];
  container.innerHTML = clear();
  container.innerHTML = `Abilities: `;
  // adding "Ability" label
  for (const ability of pokemonAbilities) {
    let abilityName = ability["ability"]["name"];
    container.innerHTML += abilityName;
    container.innerHTML += ` `;
  }
}

function changeModalImg(pokemon) {
  let sprite = getPokemonSprite(pokemon);
  document.getElementById("modal-header-image").src = sprite;
  return true;
}

function changeModalHeaderBackground(pokemon) {
  let container = document.getElementById("modal-header");
  let pokemonType = getPokemonType(pokemon);
  let color = getTypeColor(pokemonType);
  container.classList.add(color);
  return true;
}

async function getRandomPokemonFlavourText(pokemon) {
  let pokemonObject = await pokemonSpecies.get(pokemon);
  let textObject = pokemonObject["flavor_text_entries"];
  let size = textObject.length;
  let random;
  do {
    random = Math.floor(Math.random() * size);
  } while (textObject[random]["language"]["name"] != "en");
  let clearedText = clearingString(textObject[random]["flavor_text"]);
  return clearedText;
}

// flavour text needs to cleared of \n \f with lastIndexOf() string method
function clearingString(text) {
  text = text.replaceAll("\n", " ");
  text = text.replaceAll("\f", " ");
  return text;
}

async function changeModalAboutSectionTop(pokemon) {
  let container = document.getElementById(`modal-body-list-1`);
  let pokemonObject = pokemonCache.get(pokemon);
  let flavourText = await getRandomPokemonFlavourText(pokemon);
  let height = pokemonObject["height"];
  let specie = pokemonObject["species"]["name"];
  let weight = pokemonObject["weight"];
  container.innerHTML = createPokemonModalListTopHTML(
    specie,
    height,
    weight,
    flavourText
  );
}

async function changeModalAboutSectionBottom(pokemon) {
  let container = document.getElementById("modal-body-list-2");
  let pokemonObject = pokemonSpecies.get(pokemon);
  let genera = await getPokemonGenera(pokemonObject["genera"]);
  let gender = pokemonObject["gender_rate"];
  gender = checkPokemonGender(gender);
  // egg groups could be up to size 2
  // TODO case difference for 1 or 2 egg groups
  let eggGroup1 = pokemonObject["egg_groups"][0]["name"];
  // let eggGroup2 = pokemonObject["egg_groups"][1]["name"];
  let generation = pokemonObject["generation"]["name"];
  // add eggGroup2
  container.innerHTML = createPokemonModalListBottomHTML(
    genera,
    gender,
    eggGroup1,
    generation
  );
}

function getPokemonGenera(pokemonGenera) {
  // pokemonObject["genera"]
  for (const item of pokemonGenera) {
    let languageCheck = item["language"]["name"];
    if (languageCheck === "en") {
      return item["genus"];
    }
    continue;
  }
  return false;
}

function checkPokemonGender(gender) {
  if (gender == 8) {
    return "only female";
  }
  if (gender == 0) {
    return "only male";
  } else {
    return "unkown";
  }
}

function changeModalStatsSection(pokemon) {
  let pokemonObject = pokemonCache.get(pokemon);
  let attributes = [];
  for (const item of pokemonObject["stats"]) {
    attributes.push(item);
  }
  // array entry order: hp, attack, defense, specialAttack, specialDefense, speed
  renderChart(attributes);
  return true;
}

async function changeModalEvolutionSection(pokemon) {
  let element = document.getElementById("modal-body-evolution");
  element.innerHTML = clear();
  let pokemonArray = await getPokemonEvolutionProcess(pokemon);
  loopingPokemonEvolutionSteps(pokemonArray, element, true);
  return true;
}
async function loopingPokemonEvolutionSteps(pokemonArray, element, addArrow) {
  // loop through array and create html content of each pokemon evolution step
  for (const pokemon of pokemonArray) {
    if (Array.isArray(pokemon)) {
      // TODO change element into new div
      let newElement = await renderDiv(element);
      addArrow = false;
      await loopingPokemonEvolutionSteps(pokemon, newElement, addArrow);
    } else {
      if (pokemon === pokemonArray.slice(-1)[0]) {
        addArrow = false;
      }
      await renderModalEvolutionSection(pokemon, element, addArrow);
    }
  }
}

function renderDiv(oldElement) {
  oldElement.innerHTML += createDivHTML("modal-body-evolution-variant-box");
  let newElement = document.getElementById("modal-body-evolution-variant-box");
  return newElement;
}

async function renderModalEvolutionSection(pokemon, element, addArrow) {
  await getPokemon(pokemon);
  let sprite = getPokemonSprite(pokemon);
  let index = getPokemonIndex(pokemon);
  element.innerHTML += createPokemonEvolutionStepHTML(sprite, pokemon, index);
  if (addArrow) {
    element.innerHTML += createChevronHTML();
  }
}

async function getPokemonEvolutionProcess(pokemon) {
  // check for base version of pokemon via species entries
  // save the evolution chain wihtin an cache array like pokemonObject
  // one pokemon has not more than theree evolutions except mega und gigantamax versions
  await getPokemonEvolution(pokemon);
  let pokemonObject = pokemonEvolution.get(pokemon);
  let basePokemon = pokemonObject["chain"]["species"]["name"];
  await getPokemonEvolution(basePokemon);
  let pokemonEvolutionProcess = getPokemonEvolutionSteps(basePokemon);
  return pokemonEvolutionProcess;
}

async function getPokemonEvolutionSteps(basePokemon) {
  // loop through the array of evolves_to[i] and save all names into an array "evolutionsVariants"
  let pokemonEvolutionVariants = [];
  pokemonEvolutionVariants.push(basePokemon);
  let pokemonObject = await pokemonEvolution.get(basePokemon);
  let pokemonObject1 = pokemonObject["chain"]["evolves_to"];
  // pokemon second evolution step
  let pokemonObject2 = pokemonObject["chain"]["evolves_to"][0]["evolves_to"];
  let pokemonArray = loopingPokemonVariants(pokemonObject1);
  if (pokemonObject2.length > 0) {
    let pokemonArray2 = loopingPokemonVariants(pokemonObject2);
    pokemonEvolutionVariants.push(pokemonArray, pokemonArray2);
  } else {
    pokemonEvolutionVariants.push(pokemonArray);
  }
  return pokemonEvolutionVariants;
}

function loopingPokemonVariants(pokemonObject) {
  let variants = [];
  for (const pokemonVariant of pokemonObject) {
    let pokemonVariantName = pokemonVariant["species"]["name"];
    variants.push(pokemonVariantName);
  }
  if (variants.length > 1) {
    return variants;
  }
  let variant = variants.pop();
  return variant;
}

function changeModalMoveSection(pokemonName) {
  let container = document.getElementById("modal-body-list-moves");
  let pokemonObject = pokemonCache.get(pokemonName);
  let pokemonMoves = pokemonObject["moves"];
  container.innerHTML = clear();
  // adding "Moves" label
  for (const move of pokemonMoves) {
    let moveName = move["move"]["name"];
    container.innerHTML += createPokemonMovesListHTML(moveName);
  }
}

function clear() {
  return ``;
}
