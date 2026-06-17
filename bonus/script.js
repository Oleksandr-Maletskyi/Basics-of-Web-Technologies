let isGameOver = false;
let isFlagMode = false;
const GRID_SIZE = 10;
const TOTAL_MINES = 10;

function generateMinesweeperData(width, height, totalMines) {
    let grid = [];

    for (let y = 1; y <= height; y++) {
        for (let x = 1; x <= width; x++) {
            grid.push({
                x: x.toString(),
                y: y.toString(),
                value: 0,
                status: "closed",
                isMine: false
            });
        }
    }

    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        let randomIndex = Math.floor(Math.random() * grid.length);
        if (!grid[randomIndex].isMine) {
            grid[randomIndex].isMine = true;
            grid[randomIndex].value = "B";
            minesPlaced++;
        }
    }

    const getCell = (x, y) => grid.find(c => c.x === x.toString() && c.y === y.toString());

    for (let i = 0; i < grid.length; i++) {
        let cell = grid[i];
        if (cell.isMine) continue;

        let numX = parseInt(cell.x);
        let numY = parseInt(cell.y);
        let minesAround = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                let neighbor = getCell(numX + dx, numY + dy);
                if (neighbor && neighbor.isMine) minesAround++;
            }
        }
        cell.value = minesAround;
    }
    return grid;
}

let gameData = generateMinesweeperData(GRID_SIZE, GRID_SIZE, TOTAL_MINES);

let pivot = new WebDataRocks({
    container: "#wdr-component",
    toolbar: false,
    report: {
        dataSource: { data: gameData },
        slice: {
            rows: [{ uniqueName: "y" }],
            columns: [{ uniqueName: "x" }],
            measures: [{ uniqueName: "value", aggregation: "none" }]
        },
        options: {
            grid: {
                showTotals: "off",
                showGrandTotals: "off",
                showHeaders: false
            }
        }
    }
});

function styleMinesweeperCells(cellBuilder, cellData) {
    if (cellData.type !== "value") return;
    if (!cellData.columns || !cellData.columns.length || !cellData.rows || !cellData.rows.length) return
    let x = cellData.columns[0].caption;
    let y = cellData.rows[0].caption;
    let cellRecord = getCellRecord(x, y);
    
    if (!cellRecord) return;

    cellBuilder.addClass("ms-cell");

    if (cellRecord.status === "closed") {
        cellBuilder.text = "";
        cellBuilder.addClass("ms-closed");
    } 
    else if (cellRecord.status === "flag") {
        cellBuilder.text = "🚩";
        cellBuilder.addClass("ms-flag");
    } 
    else if (cellRecord.status === "open") {
        cellBuilder.addClass("ms-open");

        if (cellRecord.isMine) {
            cellBuilder.text = "💣";
            cellBuilder.addClass("ms-mine");
        } 
        else {
            if (cellRecord.value === 0) {
                cellBuilder.text = "";
            } else {
                cellBuilder.text = cellRecord.value;
                cellBuilder.addClass(`ms-num-${cellRecord.value}`);
            }
        }
    }
}
pivot.customizeCell(styleMinesweeperCells);

function getCellRecord(x, y) {
    return gameData.find(c => c.x === x.toString() && c.y === y.toString());
}

function revealIsland(x, y) {
    let cell = getCellRecord(x, y);
    if (!cell || cell.status === "open" || cell.status === "flag") return;

    cell.status = "open";
    if (cell.value > 0) return;

    let numX = parseInt(x);
    let numY = parseInt(y);

    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            revealIsland(numX + dx, numY + dy);
        }
    }
}

function checkWinCondition() {
    let hiddenCells = gameData.filter(c => c.status === "closed" || c.status === "flag");
    if (hiddenCells.length === TOTAL_MINES) {
        isGameOver = true;
        setTimeout(() => alert("🎉 Перемога! Ти розмінував усе поле!"), 100);
    }
}

pivot.on('cellclick', function(cellData) {
    if (cellData.type !== "value" || isGameOver) return;
    if (!cellData.columns || !cellData.columns.length || !cellData.rows || !cellData.rows.length) return;
    let x = cellData.columns[0].caption;
    let y = cellData.rows[0].caption;
    let clickedCell = getCellRecord(x, y);
    
    if (!clickedCell) return;

    if (isFlagMode) {
        if (clickedCell.status === "closed") clickedCell.status = "flag";
        else if (clickedCell.status === "flag") clickedCell.status = "closed";
        
        pivot.updateData({ data: gameData });
        return;
    }

    if (clickedCell.status === "flag" || clickedCell.status === "open") return;

    if (clickedCell.isMine) {
        clickedCell.status = "open";
        isGameOver = true;
        setTimeout(() => alert("💥 Бум! Ти програв."), 100);
        
        gameData.forEach(c => { if (c.isMine) c.status = "open"; });
    } 
    else if (clickedCell.value === 0) {
        revealIsland(x, y);
    } 
    else {
        clickedCell.status = "open";
    }

    if (!isGameOver) checkWinCondition();

    pivot.updateData({ data: gameData });
});

let flagButton = document.getElementById("flagToggle");
let restartButton = document.getElementById("restartBtn");

flagButton.addEventListener("click", function() {
    isFlagMode = !isFlagMode;
    if (isFlagMode) {
        flagButton.innerText = "Режим: 🚩 Ставити прапорці";
        flagButton.style.backgroundColor = "#ff9800";
    } else {
        flagButton.innerText = "Режим: ⛏️ Копати";
        flagButton.style.backgroundColor = "#4CAF50";
    }
});

restartButton.addEventListener("click", function() {
    isGameOver = false;
    isFlagMode = false;
    flagButton.innerText = "Режим: ⛏️ Копати";
    flagButton.style.backgroundColor = "#4CAF50";
    
    gameData = generateMinesweeperData(GRID_SIZE, GRID_SIZE, TOTAL_MINES);
    pivot.updateData({ data: gameData });
});