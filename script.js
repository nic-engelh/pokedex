const pokemonSet = new Set(POKEMON);

function init() {


}

function readPokemonFromList() {

    pokemonSet.forEach(pokemon => {
        return pokemon;
    });
}


async function getPokemonData() {

    let pokemon = "croconaw";
    
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    let pokemonDataAsText = await fetch(url);

    let pokemonDataAsJSON = await pokemonDataAsText.json();

    console.log(pokemonDataAsJSON);

}