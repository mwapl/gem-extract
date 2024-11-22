let timeout;

extractPairingsBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    clearTimeout(timeout);
    okMessage.style.display = "none";
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: extractPairing,
        },
        (results) => {
            const { result } = results[0];
            navigator.clipboard.writeText(result);
            okMessage.style.display = "block";
            clearTimeout(timeout);
            timeout = setTimeout(() => (okMessage.style.display = "none"), 3000);
        }
    );
});

function extractPairing() {
    var result = 'Table,"Player 1",Country,Points,"Player 2",Country,Points\n';
    document.querySelectorAll("table.pairings-table tr").forEach((row) => {
        const column = row.querySelector('.pairings-table__cell--table-num')
	const tableColumn = column?.innerText.trim();
        const tableNumber = tableColumn && parseInt(tableColumn);
        if (tableColumn && tableNumber && !isNaN(tableNumber)) {
            const player1Element = row.querySelectorAll('.pairings-table__cell--left .team__display-name span')[1]
	    const player1PointsStr = row.querySelectorAll('.pairings-table__cell--left .team__info span')[0].innerText.split(/[^0-9]/)
	    const player1Points = 3*parseInt(player1PointsStr[0]) + parseInt(player1PointsStr[2])
	   
	    const player2Element = row.querySelectorAll('.pairings-table__cell--right .team__display-name span')[1]
	    const player2PointsStr = row.querySelectorAll('.pairings-table__cell--right .team__info span')[0].innerText.split(/[^0-9]/)
	    const player2Points = 3*parseInt(player2PointsStr[0]) + parseInt(player2PointsStr[2])
	    
	    result += tableNumber.toString(10) +
		',"' + player1Element?.innerText?.trim() + '",FR,' + player1Points.toString(10) +
		',"' + player2Element?.innerText?.trim() + '",FR,' + player2Points.toString(10) +
		'\n';

	    console.log(tableNumber.toString(10) +
			',"' + player1Element?.innerText?.trim() + '",FR,' + player1Points.toString(10) +
			',"' + player2Element?.innerText?.trim() + '",FR,' + player2Points.toString(10)
		       );
        }
    });
    return result;
}


extractOutstandingBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    clearTimeout(timeout);
    okMessage.style.display = "none";
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: extractOutstanding,
        },
        (results) => {
            const { result } = results[0];
            navigator.clipboard.writeText(result);
            okMessage.style.display = "block";
            clearTimeout(timeout);
            timeout = setTimeout(() => (okMessage.style.display = "none"), 3000);
        }
    );
});

function extractOutstanding() {
    var result = '';
    document.querySelectorAll("table.pairings-table tr").forEach((row) => {
        const column = row.querySelector('.pairings-table__cell--table-num')
	const tableColumn = column?.innerText.trim();
        const tableNumber = tableColumn && parseInt(tableColumn);
        if (tableColumn && tableNumber && !isNaN(tableNumber)) {
            const player1Element = row.querySelectorAll('.pairings-table__cell--left .team__display-name span')[1]
	    const match_result = row.querySelectorAll('.pairings-table__cell--result div.match-result div.box-score')
	    if (match_result.length === 2  // Skip bye awarded player
		&& match_result[0]?.textContent?.trim() == '_')
		result += tableNumber.toString(10) + '\n';
        }
    });
    return result;
}


