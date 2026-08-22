const playerCount = document.getElementById("playerCount");

const playersContainer = document.getElementById("players");

const continueButton = document.getElementById("continueButton");

const backButton = document.getElementById("backButton");

const nextButton = document.getElementById("nextButton");

const prevButton = document.getElementById("previousButton");

const courtPlayerSelect =
    document.getElementById("courtPlayerSelect");

const benchPlayerSelect =
    document.getElementById("benchPlayerSelect");

const substituteButton =
    document.getElementById("substituteButton");

const benchPlayersContainer =
    document.getElementById("benchPlayers");

let currentPlayers = [];

let currentRotation = 1;

let rotationHistory = [];



function createPlayerInputs() {

    const numberOfPlayers = Number(playerCount.value);

    playersContainer.innerHTML = "";

    for (let i = 1; i <= numberOfPlayers; i++) {

        const playerDiv = document.createElement("div");

        playerDiv.className = "player";

        const positionOptions = `
            <option value="">Bench</option>

            <option value="1">Position 1</option>

            <option value="2">Position 2</option>

            <option value="3">Position 3</option>

            <option value="4">Position 4</option>

            <option value="5">Position 5</option>

            <option value="6">Position 6</option>
        `;

        playerDiv.innerHTML = `
            <label>Player ${i}</label>

            <input 
                type="text"
                class="player-name"
                placeholder="Enter name"
            >

            <select class="player-position">
                ${positionOptions}
            </select>
        `;

        playersContainer.appendChild(playerDiv);
    }
}



function validatePlayers() {

    const nameInputs = document.querySelectorAll(".player-name");

    const positionInputs = document.querySelectorAll(".player-position");

    const positionsUsed = [];

    // Check that every player has a name

    for (const input of nameInputs) {

        if (input.value.trim() === "") {

            alert("Please enter a name for every player.");

            return false;
        }
    }

    // Check positions

    for (const position of positionInputs) {

        const value = position.value;

        // Bench doesn't count as a court position

        if (value !== "") {

            if (positionsUsed.includes(value)) {

                alert(`Position ${value} is assigned to more than one player.`);

                return false;
            }

            positionsUsed.push(value);
        }
    }

    // Make sure positions 1-6 are all filled

    for (let position = 1; position <= 6; position++) {

        if (!positionsUsed.includes(String(position))) {

            alert(`Position ${position} needs a player.`);

            return false;
        }
    }

    return true;
}



function getPlayers() {

    const nameInputs = document.querySelectorAll(".player-name");

    const positionInputs = document.querySelectorAll(".player-position");

    const players = [];

    for (let i = 0; i < nameInputs.length; i++) {

        const name = nameInputs[i].value.trim();

        const position = positionInputs[i].value;

        players.push({

            name: name,

            position: position === "" ? "bench" : Number(position)

        });
    }

    return players;
}



continueButton.addEventListener("click", function () {

    if (!validatePlayers()) {

        return;
    }

    const players = getPlayers();

    showCourt(players);

});



function showCourt(players) {

    currentPlayers = players;

    currentRotation = 1;

    rotationHistory = [

        JSON.parse(JSON.stringify(players))

    ];

    document.getElementById("setupScreen").classList.add("hidden");

    document.getElementById("courtScreen").classList.remove("hidden");

    updateCourt();

}



function updateCourt() {

    for (let position = 1; position <= 6; position++) {

        const positionElement =
            document.getElementById(`position${position}`);

        const player = currentPlayers.find(
            player => player.position === position
        );

        if (player) {

            positionElement.innerHTML = `
                <div class="position-number">
                    Position ${position}
                </div>

                <div>
                    ${player.name}
                </div>

                ${
                    position === 1
                        ? `<div class="server-label">SERVER</div>`
                        : ""
                }
            `;

        } else {

            positionElement.innerHTML = `
                <div class="position-number">
                    Position ${position}
                </div>

                <div>
                    Empty
                </div>
            `;
        }
    }

    document.getElementById("rotationNumber").textContent =
        `Rotation ${currentRotation}`;

    updateSubstitutionOptions();
}


function updateSubstitutionOptions() {

    courtPlayerSelect.innerHTML = "";

    benchPlayerSelect.innerHTML = "";

    benchPlayersContainer.innerHTML = "";

    currentPlayers.forEach((player, index) => {

        if (player.position !== "bench") {

            const option = document.createElement("option");

            option.value = index;

            option.textContent =
                `${player.name} - Position ${player.position}`;

            courtPlayerSelect.appendChild(option);
        }

        else {

            const option = document.createElement("option");

            option.value = index;

            option.textContent = player.name;

            benchPlayerSelect.appendChild(option);

            // Display bench player

            const benchPlayer =
                document.createElement("div");

            benchPlayer.className = "bench-player";

            benchPlayer.textContent = player.name;

            benchPlayersContainer.appendChild(
                benchPlayer
            );
        }

    });

}

function makeSubstitution() {

    const courtIndex =
        Number(courtPlayerSelect.value);

    const benchIndex =
        Number(benchPlayerSelect.value);

    if (
        isNaN(courtIndex) ||
        isNaN(benchIndex)
    ) {
        alert("Please select a player to substitute.");
        return;
    }

    const courtPlayer =
        currentPlayers[courtIndex];

    const benchPlayer =
        currentPlayers[benchIndex];

    const courtPosition =
        courtPlayer.position;

    benchPlayer.position = courtPosition;

    courtPlayer.position = "bench";

    updateCourt();
}


function rotateForward() {

    const rotationMap = {
        1: 6,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5
    };

    currentPlayers.forEach(player => {

        if (player.position !== "bench") {

            player.position = rotationMap[player.position];

        }

    });

    currentRotation++;

    rotationHistory.push(
        JSON.parse(JSON.stringify(currentPlayers))
    );

    updateCourt();

}



function rotateBackward() {

    if (currentRotation <= 1) {

        return;
    }

    const reverseRotationMap = {
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: 1
    };

    currentPlayers.forEach(player => {

        if (player.position !== "bench") {

            player.position = reverseRotationMap[player.position];

        }

    });

    currentRotation--;

    updateCourt();

}



playerCount.addEventListener("change", createPlayerInputs);

createPlayerInputs();



backButton.addEventListener("click", function () {

    document.getElementById("courtScreen").classList.add("hidden");

    document.getElementById("setupScreen").classList.remove("hidden");

});



nextButton.addEventListener("click", rotateForward);

prevButton.addEventListener("click", rotateBackward);

substituteButton.addEventListener(
    "click",
    makeSubstitution
);