package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"encoding/json"

	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)


func listImages() []string {
	fmt.Printf("%s/images\n", os.Getenv("REACT_PUBLIC_DIRECTORY"))
	files, err := ioutil.ReadDir(fmt.Sprintf("%s/images", os.Getenv("REACT_PUBLIC_DIRECTORY")))
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
	fmt.Fprint(w, string(jsonData))
}

func main() {
	router := httprouter.New()
	router.GET("/api/images", AllImages)
	handler := cors.Default().Handler(router)

	log.Fatal(http.ListenAndServe(":8080", handler))
}