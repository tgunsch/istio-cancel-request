const {
    fromEvent,
    from,
    timer,
} = rxjs;

const {
    map,
    switchMap,
    debounceTime,
    distinctUntilChanged,
    filter,
} = rxjs.operators;


let results = document.getElementById('results');

const source = timer(1000, 2000);

const subscribe = source.subscribe(() =>
    fetch(`/api`)
        .then(
            data =>
                results.innerText = "Current time is " + data.json()
        )

);

