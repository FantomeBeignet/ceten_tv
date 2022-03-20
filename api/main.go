package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"encoding/json"

	"net/http"

	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
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
	log.Println("Requested image list")
	fmt.Fprint(w, string(jsonData))
}

func DeleteImage(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	filename := ps.ByName("filename")
	_, err := os.Stat(fmt.Sprintf("%s/images/%s", os.Getenv("REACT_PUBLIC_DIRECTORY"), filename))
	if err != nil {
		http.Error(w, "The file does not exist", http.StatusNotFound)
	} else {
		err := os.Rename(fmt.Sprintf("%s/images/%s", os.Getenv("REACT_PUBLIC_DIRECTORY"), filename), fmt.Sprintf("%s/images/old/%s", os.Getenv("REACT_PUBLIC_DIRECTORY"), filename))
		if err == nil {
			json, _ := json.MarshalIndent(map[string]string{filename: "ok"}, "", "\t")
			w.Header().Set("Content-Type", "application/json")
			fmt.Fprint(w, string(json))
			log.Printf("Deleted image %s", filename)
		}
	}
}

func UploadFile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

    // Parse our multipart form, 10 << 20 specifies a maximum
    // upload of 10 MB files.
    r.ParseMultipartForm(10 << 20)
    // FormFile returns the first file for the given key `myFile`
    // it also returns the FileHeader so we can get the Filename,
    // the Header and the size of the file
    file, handler, err := r.FormFile("image")
    if err != nil {
        log.Fatal(err)
        return
    }
    defer file.Close()

	filename := handler.Filename

    // read all of the contents of our uploaded file into a
    // byte array
    fileBytes, err := ioutil.ReadAll(file)
    if err != nil {
        log.Fatal(err)
    }

	err = ioutil.WriteFile(fmt.Sprintf("%s/images/%s", os.Getenv("REACT_PUBLIC_DIRECTORY"), filename), fileBytes, 0644) 
	
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Uploaded image %s", filename)
	json, _ := json.MarshalIndent(map[string]string{filename: "ok"}, "", "\t")
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, string(json))
}

func main() {	
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	router := httprouter.New()
	router.GET("/api/images", AllImages)
	router.GET("/api/delete/:filename", DeleteImage)
	router.POST("/api/upload", UploadFile)
	handler := cors.Default().Handler(router)

	log.Println("Server running on port 8080")

	log.Fatal(http.ListenAndServe(":8080", handler))
}
