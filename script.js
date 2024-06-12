// Fetch Shananana
const fetchShananana = await fetch('https://classic.warcraftlogs.com:443/v1/rankings/character/Shananana/Auberdine/EU?api_key=12d9c0158217c02d36891fced0ddf422');
const Shananana = await fetchShananana.json();

function genererPersonnage(character){
    const infoCharacter = character[0];
    const charName = infoCharacter.characterName;
    const className = infoCharacter.class;
    const specName = infoCharacter.spec;
    const sectionPerso = document.querySelector(".character");
    const fichePerso = document.createElement("figure");
    const nomPerso = document.createElement("h2");
    nomPerso.innerText = charName;
    const specPerso = document.createElement("h3");
    specPerso.innerText = className + " - " + specName;
    sectionPerso.appendChild(fichePerso);
    fichePerso.appendChild(nomPerso);
    fichePerso.appendChild(specPerso);
}

genererPersonnage(Shananana);

function genererParses(character){
    for (let i = 0; i < character.length; i++){
        const parse = character[i];
        const fightName = parse.encounterName;
        const startFight = parse.startTime;
        const diffRaid = parse.difficulty;
        const sizeRaid = parse.size;
        const ilvlFight = parse.ilvlKeyOrPatch;
        const dpsFight = Math.round(parse.total);
        const percentileFight = Math.round(parse.percentile);

        const sectionPerso = document.querySelector(".character");
        const inlineResult = document.createElement("p");

        inlineResult.innerText = fightName + " - DPS: " + dpsFight + " - Percentile: " + percentileFight;

        if (percentileFight < 25)
            inlineResult.classList.add("poor")
        else if (percentileFight < 50)
            inlineResult.classList.add("uncommon")
        else if (percentileFight < 75)
            inlineResult.classList.add("rare")
        else if (percentileFight < 95)
            inlineResult.classList.add("epic")
        else if (percentileFight < 98)
            inlineResult.classList.add("legendary")
        else if (percentileFight = 99)
            inlineResult.classList.add("astounding")
        else if (percentileFight = 100)
            inlineResult.classList.add("artifact")

        sectionPerso.appendChild(inlineResult)
        console.log(inlineResult);
    }
}

genererParses(Shananana);