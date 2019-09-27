package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"
)

func apiHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Sleeping for 10 seconds...")
	time.Sleep(time.Duration(10 * time.Second))
	query, ok := r.URL.Query()["q"]
	if !ok || len(query[0]) < 1 {
		fmt.Println("No query param found")
		return
	}
	f := time.Now().Format("Mon Jan _2 2006 15:04:05")
	fmt.Printf("Finished, returning %s for #%s \n", f, query[0])
	fmt.Fprintf(w, "Response at %s for #%s", f, query[0])
}

func viewHandler(w http.ResponseWriter, r *http.Request) {

	filename := r.URL.Path
	filename = strings.TrimPrefix(filename, "/")
	if len(filename) == 0 {
		filename = "index.html"
	}
	fmt.Printf("Loading %v\n", filename)
	body, err := ioutil.ReadFile(filename)
	if err != nil {
		fmt.Printf("Ooops: %v", err)
	} else {
		w.Write(body)
	}
}

func main() {
	http.HandleFunc("/api", apiHandler)
	http.HandleFunc("/", viewHandler)
	fmt.Println("Ready, listen on 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
