const {
    from,
    timer
} = rxjs;

const {
    tap,
    switchMap
} = rxjs.operators;


let result = document.getElementById('result');
let httpStatus = document.getElementById('http-status');

addEventListener('click', () => {
    controller.abort();
    httpStatus.innerHTML = '';
});

const controller = new AbortController();
const signal = controller.signal;
const fetchData = () => fetch('/api', { signal }).then(data => data.text());

timer(0, 12000)
    .pipe(
        tap(() => httpStatus.innerHTML = 'http request pending ...'),
        switchMap(() => from(fetchData()))
        )   
    .subscribe((data) => {
        result.innerHTML = data;
        httpStatus.innerHTML = '';
    });

