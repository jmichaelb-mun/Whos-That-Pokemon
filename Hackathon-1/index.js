
const pokeApi = new PokeAPI();
let score = 0;

async function getPokemonbyID(id) {
    try{
        let newPokemon = await pokeApi.getPokemon(id);
        return newPokemon;
    } catch (err){
        console.error(err);
    }
}

/* Random number generator */
const RANDOMNUM = 800;
function generateRandomID () {
    let randomID = Math.floor(Math.random() * RANDOMNUM + 1);
    return randomID;
}

async function getSprite(id){
    let pokemon = await getPokemonbyID(id);
    let imgContainer = document.getElementById("pokemon__image-container");
    imgContainer.innerHTML = "";
    let imgAudio = document.createElement("a");
    imgAudio.classList.add("pokemon__image-cry");
    imgAudio.addEventListener("click", (e) => {
        playAudio(pokemon.cries.latest);
    });
    let newImg = document.createElement("img");
    newImg.classList.add("pokemon__image");
    newImg.src=pokemon.sprites.other.home.front_default;
    imgAudio.appendChild(newImg);
    imgContainer.appendChild(imgAudio);
}

function playAudio(pokemon){
    let cry = new Audio(pokemon);
    cry.play();
}

async function generatePage(currentScore){
    let newID = generateRandomID();
    let correctPokemon = await getPokemonbyID(newID)
    getSprite(newID);
    await generateOptions(correctPokemon);
    let cont = document.getElementById("user__score");
    cont.innerText = `Your score is : ${currentScore}`;
    
}

function submitHandler(event){
    event.preventDefault();
    let radios = document.getElementsByName("choice");
    let selected = "";
    radios.forEach(element => {
        if(element.checked){
            selected = element;
        }
    });
    if(selected.classList.contains("pokemon__choice--answer")){
        alert("Answer is Correct");
        score += 100;
        generatePage(score);
    }
    else{
        alert("Incorrect, please try again");
    }
}

/* Used id */
const usedIds = [];

/* Validate the displayed pokemon id */
async function validateId(pokemon) {
    if (usedIds.includes(pokemon.id)) {
        pokemon = getPokemonbyID(generateRandomID());
    }
    usedIds.push(pokemon.id);
    return pokemon;
}


/* Options generator */
const optionContainer = document.getElementById("pokemon__options");

async function generateOptions(pokemon) {
    // check the displayed pokemon name
    const optionsIDs = [pokemon.id];
    const options = [pokemon.name];
    while (optionsIDs.length < 4) {
        let randomOptionId = generateRandomID();
        while (optionsIDs.includes(randomOptionId)) {
            randomOptionId = generateRandomID();
        }
        optionsIDs.push(randomOptionId);
        options.push((await getPokemonbyID(randomOptionId)).name);
    }

    // Mix the array order
    shuffleArray(options);

    // Create the DOM
    optionContainer.innerHTML = "";
    const form = document.createElement('form');
    

    options.forEach(option => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = option;
        input.name = "choice";
        input.value = option;
        const label = document.createElement('label');
        label.htmlFor = option;
        label.textContent = option;
        label.classList.add('pokemon__options');
        label.append(input);
        form.append(label);
    })

    
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    form.appendChild(submitBtn);
    form.addEventListener("submit", submitHandler);
    optionContainer.append(form);
    document.getElementById(pokemon.name).classList.add("pokemon__choice--answer");
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}



const form = document.querySelector("form");
form.addEventListener("submit", submitHandler);
generatePage(score);


