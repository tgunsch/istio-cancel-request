const {
    fromEvent,
    from,
    timer
} = rxjs;

const {
    tap,
    switchMap
} = rxjs.operators;


let result = document.getElementById('results');
let startButton = document.getElementById('start');
let cancelButtton = document.getElementById('cancel');
let requestNumber = 0;
let controller;
let signal;

cancelButtton.disabled = true;

const fetchData = (num) =>
    fetch(`/api?q=${num}`, {signal})
        .then(response => {
            return response.text()
        });


startButton.addEventListener('click', () => {
    requestNumber++;
    logMessage("Start request #" + requestNumber + " at " + new Date() + " pending ...");
    controller = new AbortController();
    signal = controller.signal;
    cancelButtton.disabled = false;
    startButton.disabled = true;
    fetchData(requestNumber)
        .then((data) => {
            logMessage("Received response: " + data);
        })
        .catch(err => {
            if (err.name === 'AbortError') {
                logMessage('Cancelled request #' + requestNumber + " " + new Date());
            } else {
                logMessage('Oops for request #' + requestNumber + " " + err);
            }
        })
        .finally(() => {
            startButton.disabled = false;
            cancelButtton.disabled = true;
        })
});


// fromEvent(startButton, 'click')
//     .pipe(
//         tap(() => {
//             requestNumber++;
//             logMessage("Start request " + requestNumber + " at "  + new Date()  + " pending ...");
//             controller = new AbortController();
//             signal = controller.signal;
//         }),
//         switchMap(() => from(fetchData(requestNumber)))
//     ).subscribe((data) => {
//         logMessage("Received response: " + data);
//     });


fromEvent(cancelButtton, 'click')
    .subscribe(() => {
        controller.abort();
    });

function logMessage(msg) {
    let newResult = document.createElement('li');
    newResult.textContent = msg;
    result.appendChild(newResult);
}