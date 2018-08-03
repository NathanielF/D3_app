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

var home page
var err error

func init() {
	var tpl = template.Must(template.New("index.html").Parse(html))
	home = page{htmlTemp: tpl}
}

var html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>D3 Application</title>
  <meta name="description" content="The HTML5 Herald">
  <meta name="author" content="SitePoint">
  <script src="public/js/react.js"></script>
  <link rel="stylesheet" type="text/css" href="public/css/w3.css">.
  <script src="public/js/reactDom.js"></script>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"
  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
  crossorigin="anonymous"></script>
</head>

<body>

<!-- Top container -->
<div class="w3-bar w3-top w3-black w3-large" style="z-index:4">
  <button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey" onclick="w3_open();"><i class="fa fa-bars"></i>  Menu</button>
  <span class="w3-bar-item w3-right">Logo</span>
</div>


<!-- Sidebar/menu -->
<nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index:3;width:300px;" id="mySidebar"><br>
  <div class="w3-container w3-row">
    <div class="w3-col s4">
      <img src="/w3images/avatar2.png" class="w3-circle w3-margin-right" style="width:46px">
    </div>
    <div class="w3-col s8 w3-bar">
      <span>Welcome</span><br>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-envelope"></i></a>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-user"></i></a>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-cog"></i></a>
    </div>
  </div>
  <hr>
  <div class="w3-container">
    <h5>Dashboard</h5>
  </div>
  <div id="menuItems" class="w3-bar-block">
  </div>
</nav>

  <script src="public/js/filterMenu.js"></script>
</body>
</html>`

type page struct {
	htmlTemp *template.Template
}

func (p page) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := p.htmlTemp.Execute(w, nil)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to execute template", 500)
		return
	}
}

type observedFlower struct {
	SepalLength float64 `json:"sepalLength"`
	SepalWidth  float64 `json:"sepalWidth"`
	PetalLength float64 `json:"petalLength"`
	PetalWidth  float64 `json:"petalWidth"`
	Iris        string  `json:"iris"`
}

type observedFlowers struct {
	obs []observedFlower
}

func (flowers observedFlowers) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		log.Printf("Failed to parse form %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	observations, err := json.Marshal(flowers.obs)
	if err != nil {
		log.Printf("Failed to parse json %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(observations)
}

func main() {

	pwd := os.Getenv("POSTGRES")
	connStr := fmt.Sprintf("user=postgres dbname=basic sslmode=disable password = %s", pwd)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Print(err)
	}
	rows, err := db.Query(`SELECT * FROM iris`)
	if err != nil {
		log.Print(err)
	}

	var irisData observedFlowers
	for rows.Next() {
		var i observedFlower
		err = rows.Scan(&i.PetalLength,
			&i.PetalWidth, &i.SepalLength, &i.SepalWidth, &i.Iris)
		if err != nil {
			log.Print(err)
		}
		irisData.obs = append(irisData.obs, i)
	}

	mux := http.NewServeMux()
	mux.Handle("/", home)
	mux.Handle("/data", irisData)
	fs := http.FileServer(http.Dir("public"))
	mux.Handle("/public/", http.StripPrefix("/public", fs))
	fmt.Println("Listening:")
	err = http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
