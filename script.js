async function fetchCharacter(characterSelected) {
    const response = await fetch('https://classic.warcraftlogs.com:443/v1/rankings/character/' + characterSelected + '/Auberdine/EU?api_key=12d9c0158217c02d36891fced0ddf422');
    const characterFetched = await response.json();
    return characterFetched;
}

const couleursClasse = {
    "Death Knight": "dk",
    "Druid": "druid",
    "Hunter": "hunter",
    "Mage": "mage",
    "Paladin": "paladin",
    "Priest": "priest",
    "Rogue": "rogue",
    "Shaman": "shaman",
    "Warlock": "warlock",
    "Warrior": "warrior"
};

function genererPersonnage(characterFetched) {
    const infoCharacter = characterFetched[0];
    if (!infoCharacter) {
        console.error("infoCharacter is undefined");
        return;
    }
    const charName = infoCharacter.characterName;
    const className = infoCharacter.class;
    const specName = infoCharacter.spec;
    const sectionPerso = document.querySelector(".character");
    const fichePerso = document.createElement("figure");
    const nomPerso = document.createElement("h2");
    nomPerso.innerText = charName;
    const classColor = couleursClasse[className];
    if (classColor) {
        nomPerso.classList.add(classColor);
    } else {
        console.warn(`No color class found for class name: ${className}`);
    }
    const specPerso = document.createElement("h3");
    specPerso.innerText = className + " - " + specName;
    sectionPerso.appendChild(fichePerso);
    fichePerso.appendChild(nomPerso);
    fichePerso.appendChild(specPerso);
}

function genererParses(character) {
    for (let i = 0; i < character.length; i++) {
        const parse = character[i];
        const fightName = parse.encounterName;
        const encounterID = parse.encounterID;
        const dpsFight = Math.round(parse.total);
        const percentileFight = Math.round(parse.percentile);
        const startFight = parse.startTime;
        const diffRaid = parse.difficulty;
        const sizeRaid = parse.size;
        const ilvlFight = parse.ilvlKeyOrPatch;
        const sectionPerso = document.querySelector(".character");
        const bossName = document.createElement("h3");
        if (encounterID == 1034 || encounterID == 1029 || encounterID == 1026)
            bossName.innerHTML = `<i class="fa-solid fa-skull"></i> ${fightName} <i class="fa-solid fa-crown"></i>`;
        else
            bossName.innerHTML = `<i class="fa-solid fa-skull"></i> ${fightName}`;
        
        const percentileColorMap = [
            { threshold: 100, class: "artifact" },
            { threshold: 99, class: "astounding" },
            { threshold: 95, class: "legendary" },
            { threshold: 75, class: "epic" },
            { threshold: 50, class: "rare" },
            { threshold: 25, class: "uncommon" },
            { threshold: 0, class: "poor" }
        ];
        function getColorClass(percentile) {
            for (const range of percentileColorMap) {
                if (percentile >= range.threshold) {
                    return range.class;
                }
            }
            return "poor"; // Default class if no match is found
        }
        const parseColor = getColorClass(percentileFight);
        const inlineResult = document.createElement("p");

        inlineResult.innerHTML =`
        <div class="parse ${parseColor}">
        DPS: <b>${dpsFight}</b> at ilvl <b>${ilvlFight}</b> - Percentile: <b>${percentileFight}</b>
        </div>`;
        sectionPerso.appendChild(bossName)
        sectionPerso.appendChild(inlineResult)
    }
}

const desiredOrder = ["Conclave of Wind", "Al'Akir", "Omnotron Defense System", "Magmaw", "Atramedes", "Chimaeron", "Maloriak", "Nefarian's End", "Halfus Wyrmbreaker", "Theralion and Valiona", "Ascendant Council", "Cho'gall"];

function sortCharacterFetched(characterFetched) {
    return characterFetched.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.encounterName);
        const indexB = desiredOrder.indexOf(b.encounterName);
        if (indexA === -1) return 1; // elements not found in the desired order should come last
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
}

const sectionSelect = document.querySelector(".selection")
const charSelect = document.createElement("select");
const characters = ["Keilath", "Shananana", "Adajeed", "Kylania", "Bloodskain", "Møhrzoc", "Ocissa", "Proutzette", "Ravissante", "Ravzed"];
characters.forEach(character => {
    const option = document.createElement("option");
    option.value = character;
    option.textContent = character;
    charSelect.appendChild(option);
});

const textSelect = document.createElement("p");
textSelect.innerText = "Select a character";

sectionSelect.appendChild(textSelect);
sectionSelect.appendChild(charSelect);

const boutonSelect = document.createElement("button");
boutonSelect.innerText = "Load";
boutonSelect.classList.add("load");
sectionSelect.appendChild(boutonSelect);

boutonSelect.addEventListener("click", async function () {
    const sectionPerso = document.querySelector(".character");
    sectionPerso.innerHTML = '';
    const characterSelected = charSelect.value;
    console.log(characterSelected);

    try {
        const characterFetched = await fetchCharacter(characterSelected);
        sortCharacterFetched(characterFetched);
        genererPersonnage(characterFetched);
        genererParses(characterFetched);
    } catch (error) {
        console.error("Failed to fetch character data:", error);
    }
});