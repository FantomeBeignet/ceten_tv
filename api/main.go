package main

import (
	"fmt"
	"io/ioutil"
	"log"

	"encoding/json"

	"net/http"

	"github.com/julienschmidt/httprouter"
)

func listImages() []string {
	files, err := ioutil.ReadDir("/tmp/")
    if err != nil {
        log.Fatal(err)
    }
	images := make([]string, 0)
	for _, img := range files {
		if !img.IsDir() {
			images = append(images, img.Name())
		}
	}
	return images
}

func AllImages(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	imageList := listImages()
	jsonData, err := json.MarshalIndent(imageList, "", "\t")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Fprint(w, jsonData)
}

func main() {
	router := httprouter.New()
	router.GET("/admin", AllImages)

	log.Fatal(http.ListenAndServe(":8080", router))
}