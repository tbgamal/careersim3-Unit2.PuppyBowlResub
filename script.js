const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const playerDetailsContainer = document.getElementById('player-details')
let newPlayerForm = document.querySelector("#new-player-form > form")
// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2309-FTB-ET-WEB-FT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const state = {
    players: []

}

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch (`${APIURL}players`)
        // console.log(response)
        const json = await response.json();
        // console.log(json.data.players)
        state.players = json.data.players
        console.log(state.players)
        // console.log(state.players.name)
        return state.players

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

//DELETE THIS LATER
// fetchAllPlayers()

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch (`${APIURL}players/`)
        const json = await response.json()
        console.log(json.data.players.indexOf(playerid))
        const singlePlayerId = json.data.player.id
        console.log (singlePlayerId)
        // // const div = document.createElement("div")
        // playerDetailsContainer.innerHTML = `
        // <img src = "${singlePlayer.imageUrl}
        // <p>${singlePlayer.id}</p>
        // <h2>${singlePlayer.name}</h2>
        // <p>${singlePlayer.breed}</p>
        // <p>${singlePlayer.status}</p>
        // <p>${singlePlayer.teamId}</p>
        // `

        // return playerDetailsContainer

        // playerDetailsContainer.appendChild(div)


        // const playerDetails = () => {
        //     const div = document.createElement("div")
        //     div.innerHTML = `
        //     <img src = "${singlePlayer.imageUrl}
        //     <p>${singlePlayer.id}</p>
        //     <h2>${singlePlayer.name}</h2>
        //     <p>${singlePlayer.breed}</p>
        //     <p>${singlePlayer.status}</p>
        //     <p>${singlePlayer.teamId}</p>
        //     `
        //     console.log(div)
        //     return div
        
        // const playerDetails = singlePlayer.map ((player) => {
        //     const div = document.createElement("div")
        //     div.innerHTML = `
        //     <img src = "${player.imageUrl}
        //     <p>${player.id}</p>
        //     <h2>${player.name}</h2>
        //     <p>${player.breed}</p>
        //     <p>${player.status}</p>
        //     <p>${player.teamId}</p>
        //     `
        //     console.log(div)
        //     return div
        // })
        // playerDetailsContainer.replaceChildren(playerDetails)

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};
    // fetchSinglePlayer(756)
const addNewPlayer = async (playerObj) => {
    try {
        playerObj.preventDefault();
        let newPlayerForm = document.querySelector("#new-player-form > form")

        let name = newPlayerForm.name.value
        console.log(name)
        let breed = newPlayerForm.breed.value
        console.log(breed)
        let status = newPlayerForm.status.value
        console.log(status)
        let imageUrl = newPlayerForm.imageUrl.value
        console.log(imageUrl)
        let teamId = newPlayerForm.teamId.value
        console.log(teamId)

        const response = await fetch (`${APIURL}players/`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                name, breed, status, imageUrl, teamId
            })
        })

        init()

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch (`${APIURL}players/${playerId}`, {
            method: "DELETE"
        })
        console.log(response)

        init()

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        if (!playerList.length) {
            playerContainer.innerHTML = "<li>No players.</li>"

        }
        
        const allPlayers = playerList.map((player) => {
            const li = document.createElement("li")
            li.innerHTML = `
            <p>${player.id}</p>
            <h2>${player.name}</h2>
            <p>${player.breed}</p>
            <img src = "${player.imageUrl}" />
            `
            const removeBtn = document.createElement("button")
            removeBtn.innerText ="X"
            removeBtn.addEventListener ("click", () => {
                removePlayer(player.id)
                console.log("DELETED")
            })

            const detailsBtn = document.createElement("button")
            detailsBtn.innerText = "See Details"
            detailsBtn.addEventListener ("click", async () => {
                const response = await fetch (`${APIURL}players/${player.id}`)
                const json = await response.json()

                playerDetailsContainer.innerHTML = `
                <img src = ${player.imageUrl} />
                <p>${player.id}</p>
                <p>${player.name}</p>
                <p>${player.breed}</p>
                <p>${player.status}</p>
                <p>${player.teamId}</p>
                `
                
                console.log("fetched " + player.id)
            })

            li.appendChild(detailsBtn)
            li.appendChild(removeBtn)
            return li

            
            
            
        })
        playerContainer.replaceChildren(...allPlayers)

    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        newPlayerFormContainer.innerHTML = `
        <form id="new-player-form">
            <label>
                Name
                <input type="text" name="name" />
            </label>
            <label>
                Breed
                <input type="text" name="breed" />
            </label>
            <label>
                Status
                <select id="status">
                <option value="field">field</option>
                <option value="bench" selected>bench</option>
                </select>
            </label>
            <label>
                Image URL
                <input type="url" name="imageUrl" />
            </label>
            <label>
                Team
                <input type="number" name="teamId" />
            </label>
            <button>Add Player</button>
        </form>            
        `
        newPlayerFormContainer.addEventListener("submit", addNewPlayer)
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();