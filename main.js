const {
    fromEvent,
    from,
} = rxjs;
const {
    map,
    switchMap,
    debounceTime,
    distinctUntilChanged,
    filter,
} = rxjs.operators;

let searchBox = document.getElementById('search');
let results = document.getElementById('results');

let search = (term) => {
    return fetch(`/api?q=${term}`)
        .then(data => data.text());
};

let input$ = fromEvent(searchBox, 'input')
    .pipe(
        debounceTime(100),
        map(e => e.target.value),
        filter(query => query.length >= 2 || query.length === 0),
        distinctUntilChanged(),
        switchMap(value => value ?
            from(search(value)) :
            from(Promise.resolve(""))
        )
    );

let subscription = input$.subscribe(data => {
    let newResult = document.createElement('li');
    newResult.textContent = data;
    results.appendChild(newResult);
})

