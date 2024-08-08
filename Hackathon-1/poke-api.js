class PokeAPI {
    constructor(){
        this.baseURL = "https://pokeapi.co/api/v2/pokemon/";
    }
    async getPokemon(pokemonID){
        let id = pokemonID.toString();
        let pokemon = await axios.get(`${this.baseURL}${id}`);
        return pokemon.data;
    }
}