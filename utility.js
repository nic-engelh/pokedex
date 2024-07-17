window.addEventListener("scroll", async () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;

  if (Math.ceil(scrolled) === scrollable) {
    toggleLoadingModal(true);
    addPokemonCards(7);
    await readPokemonFromList();
    renderPokemonCardsContainer();
    toggleLoadingModal(false);
  }
});

function addPokemonCards(number) {
  CURRENTLOADEDPOKEMON += number;
  return true;
}

function clear() {
  return ``;
}

function nextPokemon(pokemon, right) {
  pokemon = capitalizeFirstLetter(pokemon);
  let pokemonArrayIndex = POKEMON.indexOf(pokemon);
  if (right) {
    rightPokemon = POKEMON[pokemonArrayIndex + 1];
    addPokemonCards(1);
    readPokemonFromList();
    renderPokemonModal(rightPokemon.toLowerCase());
    return true;
  }
  leftPokemon = POKEMON[pokemonArrayIndex - 1];
  addPokemonCards(1);
  readPokemonFromList();
  renderPokemonModal(leftPokemon.toLowerCase());
  return false;
}

function addOnclickAttribute(pokemon) {
  let element1 = document.getElementById("modal-header-image-arrow-forward");
  let element2 = document.getElementById("modal-header-image-arrow-back");
  element1.setAttribute("onclick", `nextPokemon ("${pokemon}", true)`);
  element2.setAttribute("onclick", `nextPokemon ("${pokemon}", false)`);
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

// flavour text needs to cleared of \n \f with lastIndexOf() string method
function clearingString(text) {
  text = text.replaceAll("\n", " ");
  text = text.replaceAll("\f", " ");
  return text;
}

function toggleLoadingModal (boolean) {
  let element = document.getElementById("dialog-loading");
  if (boolean) element.show();
  if (!boolean) element.close();
}