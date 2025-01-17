const BOARD = document.querySelector("#board");
const CURRENT_PLAYER = document.querySelector("#current-player");
const HTML_URL = "http://localhost:4567/";
const API_URL = HTML_URL + "api/";
const DEFAULT_PATH = "./image/";
const MOVABLE_CLASS_NAME = "movable";
const BOARD_ID = parseInt(document.querySelector("#room-number").textContent, 10);
const SYMBOL_TO_IMAGE_PATH = {
    "p": DEFAULT_PATH + "whitePawn.png",
    "P": DEFAULT_PATH + "blackPawn.png",
    "r": DEFAULT_PATH + "whiteRook.png",
    "R": DEFAULT_PATH + "blackRook.png",
    "n": DEFAULT_PATH + "whiteKnight.png",
    "N": DEFAULT_PATH + "blackKnight.png",
    "b": DEFAULT_PATH + "whiteBishop.png",
    "B": DEFAULT_PATH + "blackBishop.png",
    "q": DEFAULT_PATH + "whiteQueen.png",
    "Q": DEFAULT_PATH + "blackQueen.png",
    "k": DEFAULT_PATH + "whiteKing.png",
    "K": DEFAULT_PATH + "blackKing.png"
};
let boardInfo = {};
let pieces = {};
let movablePosition = [];
let isClicked = false;
let source = null;

window.onload = () => {
    const divs = BOARD.querySelectorAll("div");
    document.querySelector("#exit-button").addEventListener("click", exitButtonEvent);
    history.pushState(null, "우아한 체스", HTML_URL+"chess");
    boardJoin();
    for (const div of divs) {
        div.addEventListener("click", divClickEvent);
    }
}

function boardJoin() {
    const newData = {
        "boardId": BOARD_ID,
    }
    const option = getOption("POST", newData);
    fetch(API_URL + "join", option)
    .then((response) => {
        if (!response.ok) {
            throw new Error("보드정보를 조회 할 수 없습니다.");
        }
        return response.json();
    })
    .then(imageSetting)
    .catch((error) => {
        alert(error);
        exitButtonEvent();
    });
}

function imageSetting(responseData) {
    boardInfo = responseData;
    const divs = BOARD.querySelectorAll("div");
    pieces = responseData["pieces"];
    for (const div of divs) {
        const key = div.getAttribute("id");
        if (SYMBOL_TO_IMAGE_PATH[pieces[key]] !== undefined) {
            div.style.backgroundImage = "url(" + SYMBOL_TO_IMAGE_PATH[pieces[key]] + ")";;
        } else {
            div.style.backgroundImage = null;
        }
    }
    dataSetting();
}

function divClickEvent(event) {
    if (boardInfo["isFinish"] === true) {
        exitAsk();
        return;
    }
    const targetPosition = event.target.getAttribute("id");
    if (isClicked === false) {
        if (pieces[targetPosition] === ".") {
            console.log("빈 공간은 움직일 수 없습니다.")
            return;
        }
        const isWhite = boardInfo["isWhiteTurn"];
        if ((isWhite === true && pieces[targetPosition] !== pieces[targetPosition].toLowerCase())
        || (isWhite === false && pieces[targetPosition] !== pieces[targetPosition].toUpperCase())) {
            alert("상대방의 턴입니다.");
            return;
        }
        getMovablePositions(targetPosition);
        isClicked = true;
        source = event.target;
        source.style.backgroundColor = "yellow";
    } else {
        if (source === event.target) {
            isClicked = false;
            source.style.backgroundColor = "";
            source = null;
            movablePositionSetting(false);
            return;
        }
        const targetPosition = event.target.getAttribute("id");
        const isWhite = boardInfo["isWhiteTurn"];
        if (pieces[targetPosition] !== "." && ((isWhite === true && pieces[targetPosition] === pieces[targetPosition].toLowerCase())
        || (isWhite === false && pieces[targetPosition] === pieces[targetPosition].toUpperCase()))) {
            source.style.backgroundColor = "";
            source = event.target;
            source.style.backgroundColor = "yellow";
            movablePositionSetting(false);
            getMovablePositions(targetPosition);
            return;
        }
        if (source !== event.target && !movablePosition.includes(targetPosition)) {
            alert("움직일 수 없는 위치입니다.");
            return;
        }
        movablePositionSetting(false);
        const sourcePosition = source.getAttribute("id");
        isClicked = false;
        source.style.backgroundColor = "";
        movedPieces(sourcePosition, targetPosition);
    }
}

function movedPieces(source, target) {
    const newData = {
        "boardId": BOARD_ID,
        "source": source,
        "target": target
    }
    const option = getOption("PUT", newData);

    fetch(API_URL + "move", option)
    .then((response) => {
        if (!response.ok) {
            throw new Error("문제가 발생했습니다. 관리자에게 문의하세요.");
        }
        return response.json();
    })
    .then(imageSetting)
    .catch((error) => {
        alert(error);
    });
}

function getOption(methodType, bodyData) {
    return {
        method: methodType,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    };
}

function exitAsk() {
    if (confirm("게임이 끝났습니다. 나가시겠습니까?") === true) {
        exitButtonEvent();
    }
}

function getMovablePositions(sourcePosition) {
    const newData = {
        "boardId": BOARD_ID,
        "source": sourcePosition,
    }
    const option = getOption("POST", newData);

    fetch(API_URL + "movablePositions", option)
    .then((response) => {
        if (!response.ok) {
            throw new Error("문제가 발생했습니다. 관리자에게 문의하세요.");
        }
        return response.json();
    })
    .then((responseData) => {
        movablePosition = responseData["movablePositions"];
        movablePositionSetting(true);
    })
    .catch((error) => {
        alert(error);
    });
}

function movablePositionSetting(isDisplay) {
    for (id of movablePosition) {
        const item = document.getElementById(id);
        if (isDisplay === true) {
            item.classList.add(MOVABLE_CLASS_NAME);
        } else {
            item.classList.remove(MOVABLE_CLASS_NAME);
        }
    }
}

function dataSetting() {
    if (boardInfo["isFinish"] === true) {
        document.querySelector("#view-type").textContent = "승리자 :ㅤ";
    }
    const isWhite = boardInfo["isWhiteTurn"];
    let playerType = ""
    if (isWhite === true) {
        playerType = "whitePlayer";
    } else {
        playerType = "blackPlayer"
    }
    CURRENT_PLAYER.textContent = boardInfo[playerType];
}

function exitButtonEvent() {
    location.href = HTML_URL;
}