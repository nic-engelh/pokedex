
function createPokemonBadgeTypeHTML (pokemonType) {
    return /*html*/`
        <span class="badge rounded-pill text-white text-bg-light bg-opacity-50">${pokemonType}</span>
    `   
}

function createPokemonCardHTML (pokemonSprite,pokemonName, pokemonTitle) {
    return /*html*/`
        <div class="col">
            <div class="card rounded-4 shadow-lg hover" id="${pokemonName}-card" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="renderPokemonModal('${pokemonName}')" >
                <div class="row h-25">
                    <div class="col">
                        <div class="card-body">
                            <h3 class="card-title text-white  mb-4 display-7 lh-1 fw-bold">${pokemonTitle}</h3>
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
        <li class="list-group-item">Height: ${pokemonHeight} m</li>
        <li class="list-group-item">Weight: ${pokemonWeight} kg</li>
        <li class="list-group-item" id="modal-body-list-ability" >
        Abilities:
        </li>
    `;
}

// genera, gender, eggGroup1, generation
function createPokemonModalListBottomHTML ( pokemonGenera, pokemonGender, pokemonEggGroup1, pokemonGeneration) {
    // insert into id="modal-body-list-2"
    return /*html*/`
        <li class="list-group-item">Category: ${pokemonGenera}</li>
        <li class="list-group-item">Gender: ${pokemonGender}</li>
        <li class="list-group-item">Egg Group: ${pokemonEggGroup1}</li>
        <li class="list-group-item">Generation: ${pokemonGeneration}</li>
    `;
}

function createPokemonEvolutionStepHTML (pokemonSprite,pokemonName, pokemonIndex) {
    return /*html*/`
        <div class="col" id="modal-body-evolution-Step-${pokemonName}">
            <img class="h-50 w-50" src= "${pokemonSprite}" alt="Picutre of ${pokemonName}">
            <h6>${pokemonName}</h6>
            <h6>#${pokemonIndex}</h6>
        </div>
    `
}

function createChevronHTML (){
    return /*html*/`
        <span class="col material-symbols-outlined fs-1">
            chevron_right
        </span>
    `
}

function createPokemonMovesListHTML (moveName) {
    return /*html*/`
        <div class="col-md-auto">
            <span class="badge rounded-pill text-bg-secondary">${moveName}</span>          
        </div>
    `
}

function createDivHTML(id) {
    return /*html*/ `
          <div class="col-3" id="${id}">
          </div>  
      `;
  }

  function createArrowsHTML(){
    /*html*/`
        <div class="container justify-content-evenly">
        <span class="material-symbols-outlined">arrow_back_ios</span>
        <span class="material-symbols-outlined">arrow_forward_ios</span>
        </div>
    `

  }