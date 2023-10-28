async function getPokemonData(requestTyp, id) {
  let url = `https://pokeapi.co/api/v2/${requestTyp}/${id}`;
  let pokemonDataAsText = await fetch(url).catch(err); //.catch(e) --> catch function for error handling
  let pokemonDataAsJSON = await pokemonDataAsText.json();
  return pokemonDataAsJSON;
}

function err() {
  console.log(`EORROR`);
}

// getPokemonSpecies in order to read the corresponding evolution chain which is not in the main pokemon json
async function getPokemonSpecies(pokemon) {
  let rawSpeciesData;
  rawSpeciesData = await getPokemonData("pokemon-species", pokemon);
  pokemonSpecies.set(pokemon, rawSpeciesData);
  return true;
}

async function getPokemon(pokemon) {
  if (pokemonCache.get(pokemon)) {
    return false;
  }
  let pokemonData = await getPokemonData("pokemon", pokemon);
  pokemonCache.set(pokemon, pokemonData);
  return true;
}
