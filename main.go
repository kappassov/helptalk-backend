package main

import (
	"net/http"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/jinzhu/gorm"
	"fmt"
)

var db *gorm.DB

const (
    HOST = "seniordb.csmmqn9yk8xp.eu-north-1.rds.amazonaws.com"
    PORT = 5432
    USER = "postgres"
    PASSWORD = "seniorproject"
    DBNAME = "seniordb"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("<h1>Hello World!</h1>"))
}

func main() {
	dbUrl := fmt.Sprintf(
        "host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
        HOST, PORT, USER, PASSWORD, DBNAME,
    )
	fmt.Println(dbUrl)
	db, err := gorm.Open("postgres", dbUrl)
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("Connected!")
	
	defer db.Close()

	
	mux := http.NewServeMux()

	mux.HandleFunc("/", indexHandler)
	http.ListenAndServe(":8090", mux)
}