package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"text/template"

	_ "github.com/lib/pq"
)

// Establishing our HTML skeleton and building functions to serve
// the basic skeleton

var html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>D3 Application</title>
  <meta name="description" content="D3 app">
  <meta name="author" content="Nathaniel Forde">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="public/js/react.js"></script>
  <link rel="stylesheet" type="text/css" href="public/css/w3.css">
  <link rel="stylesheet" type="text/css" href="public/css/specific.css">
  <script src="public/js/jQuery.js"></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js'></script>
  <script src="public/js/reactDom.js"></script>
</head>

<script>
var data = {{.}}; 
</script>

<body>

<!-- Top container -->
<div class="w3-bar w3-top w3-black w3-large" style="z-index:4">
	<button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey" onclick="w3_open();">
	<i class="fa fa-bars"></i>  
		Menu
	</button>
	<span class="w3-bar-item w3-right">
	D3 App 
	</span>
</div>


<!-- Sidebar/menu -->
<nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index:3;width:300px;" id="mySidebar">
<br>
  <div class="w3-container w3-row">
    <div class="w3-col s4">
      <img src="public/images/avatar.png" class="w3-circle w3-margin-right" style="width:46px">
    </div>
    <div class="w3-col s8 w3-bar">
			<span>Welcome</span>
			<br>
			<a href="#" class="w3-bar-item w3-button">
			<i class="fa fa-envelope"></i>
			</a>
			<a href="#" class="w3-bar-item w3-button">
			<i class="fa fa-user"></i>
			</a>
			<a href="#" class="w3-bar-item w3-button">
			<i class="fa fa-cog"></i>
			</a>
    </div>
	</div>
	
	<hr>
	
  <div class="w3-container">
    <h5>Dashboard</h5>
  </div>
  <div id="menuItems" class="w3-bar-block">
  </div>
</nav>

<div id = "tableDisplay">
</div>

  <script src="public/js/filterMenu.js"></script>
</body>
</html>`

type page struct {
	htmlTemp *template.Template
	params   map[string]string
	db       *sql.DB
}

func (p page) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	err := r.ParseForm()
	if err != nil {
		log.Printf("Failed to parse form %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	for key := range r.Form {
		p.params[key] = r.Form.Get(key)
		log.Println("home:", key, p.params[key])
	}

	data := getIris(p.db)

	observations, err := json.Marshal(data)
	if err != nil {
		log.Printf("Failed to parse json %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = p.htmlTemp.Execute(w, string(observations))
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to execute template", 500)
		return
	}

}

/// Getting the Iris data set to serve to our website.

type ObservedFlower struct {
	SepalLength float64 `json:"sepalLength"`
	SepalWidth  float64 `json:"sepalWidth"`
	PetalLength float64 `json:"petalLength"`
	PetalWidth  float64 `json:"petalWidth"`
	Iris        string  `json:"iris"`
}

type ObservedFlowers struct {
	Obs []ObservedFlower `json:"observations"`
}

func (flowers ObservedFlowers) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		log.Printf("Failed to parse form %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	observations, err := json.Marshal(flowers.Obs)
	if err != nil {
		log.Printf("Failed to parse json %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(observations)
}

func getIris(db *sql.DB) ObservedFlowers {

	rows, err := db.Query(`SELECT * FROM iris`)
	if err != nil {
		log.Println(err)
	}

	var irisData ObservedFlowers
	for rows.Next() {
		var i ObservedFlower
		err = rows.Scan(&i.PetalLength,
			&i.PetalWidth, &i.SepalLength, &i.SepalWidth, &i.Iris)
		if err != nil {
			log.Print(err)
		}
		irisData.Obs = append(irisData.Obs, i)
	}

	return irisData

}

// Accessing the database and serving the website.
func main() {

	pwd := os.Getenv("POSTGRES")
	connStr := fmt.Sprintf("user=postgres dbname=basic sslmode=disable password = %s", pwd)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Print(err)
	}

	var tpl = template.Must(template.New("index.html").Parse(html))
	var home = page{
		htmlTemp: tpl,
		params:   map[string]string{},
		db:       db,
	}

	mux := http.NewServeMux()
	mux.Handle("/", home)
	//mux.Handle("/data", data)
	fs := http.FileServer(http.Dir("public"))
	mux.Handle("/public/", http.StripPrefix("/public", fs))
	fmt.Println("Listening:")
	err = http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
