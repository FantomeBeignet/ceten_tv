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
	"github.com/joho/godotenv"
)


func listImages() []string {
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

func DeleteImage(w http.ResponseWriter, r*http.Request, ps httprouter.Params) {
	filename := ps.ByName("filename")
	_, err := os.Stat(fmt.Sprintf("%s/images/%s", os.Getenv("REACT_PUBLIC_DIRECTORY"), filename))
	if err != nil {
		http.Error(w, "The file does not exist", http.StatusNotFound)
	} else {
		err := os.Rename(fmt.Sprintf("%s/images/%s", os.Getenv("REACT_PUBLIC_DIRECTORY"), filename), fmt.Sprintf("%s/images/old/%s", os.Getenv("REACT_PUBLIC_DIRECTORY"), filename))
		if err == nil {
			json, _ := json.MarshalIndent(map[string]bool{"ok": true}, "", "\t")
			fmt.Print(w, string(json))
		}
	}
}

func main() {	
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	router := httprouter.New()
	router.GET("/api/images", AllImages)
	router.GET("/api/delete/:filename", DeleteImage)
	handler := cors.Default().Handler(router)

	log.Fatal(http.ListenAndServe(":8080", handler))
}
