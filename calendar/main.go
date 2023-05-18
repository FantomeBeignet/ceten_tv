package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-co-op/gocron"
	"github.com/julienschmidt/httprouter"
)

func RefreshFromRequest(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	RefreshCalendar()
}

func main() {
	logfile, err := os.OpenFile("/app/logs/agenda.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Unable to open log file: %v", err)
	}
	defer logfile.Close()
	log.SetOutput(logfile)

	s := gocron.NewScheduler(time.UTC)
	s.Every(1).Days().At("7:00;12:00;17:00").Do(RefreshCalendar)
	s.StartAsync()

	router := httprouter.New()
	router.GET("/", RefreshFromRequest)
	log.Fatal(http.ListenAndServe(":8080", router))
}
