const container = getElement('.container'),
      pokedex = getElement('.pokedex'),
      pkmnArte = getElement('.pkmnCardLeft'),
      pkmnInfo = getElement('.pkmnCardInfos');

const arrayPkmn = []

function convertDcmtr(numDecim){
    return numDecim/10
}

function getElement(element){
    return document.querySelector(element);
}   

const fetchPkmns = () => {
    for(let i = 1; i <= 251; i++) {
        const baseUrl = `https://pokeapi.co/api/v2/pokemon/${i}`;
        arrayPkmn.push(fetch(baseUrl).then(resp => resp.json()))
    }
    //Mapeando apenas as props desejadas
    Promise.all(arrayPkmn).then(result => {
        const pokemons = result.map( data => ({
            nome: data.name.toUpperCase(),
            id: data.id,
            idString: data.id.toString().padStart(3,'0'),
            sprite: data.sprites.versions['generation-v']['black-white']['animated']['front_default']
        }))
        mostrarPkmns(pokemons);
    })
}

const mostrarPkmns = (pokemonObj) => {
    const pkmnHTML = pokemonObj.map (pkmn => `
        <li onclick="detailPkmn(${pkmn.id})" class="pkmnName">
           ${pkmn.idString} - ${pkmn.nome}
        </li>
        <img class="pkmnSprite" src="${pkmn.sprite}"></img>
        `).join('');
        pokedex.innerHTML = pkmnHTML;
}

const detailPkmn = (pokemonId) => {
    Promise.all(arrayPkmn).then(result => {
        const pokemons = result.map( data => ({
            nome: data.name.toUpperCase(),
            id: data.id,
            idString: data.id.toString().padStart(3,'0'),
            sprite: data.sprites['front_default'],
            arte: data.sprites.other['official-artwork']['front_default'],
            tipo: data.types.map( type => type.type.name).join(' - ').toString().toUpperCase(),
            altura: convertDcmtr(data.height),
            peso: convertDcmtr(data.weight),
        }))
        const pkmnCard = pokemons[pokemonId-1]
        const pkmnArteHtml = `
        <img class="pkmnArte" src="${pkmnCard.arte}"></img>
        `
        const cardHtml = `
        <div class="pkmnCardName">${pkmnCard.nome} - #${pkmnCard.idString}</div>
        <div class="pkmnInfos">
         <p>TIPO(s): ${pkmnCard.tipo}</ p>
         <p>Altura: ${pkmnCard.altura}m</p>
         <p>Peso: ${pkmnCard.peso}Kg</p>

        
        </div>
        `; 
        console.log(cardHtml);
        pkmnArte.innerHTML = pkmnArteHtml;
        pkmnInfo.innerHTML = cardHtml;

    })
}

fetchPkmns();