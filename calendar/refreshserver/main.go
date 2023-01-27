package main

import "net/http"

func refresh(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	} else {
		w.Write([]byte("Refresh OK"))
	}
}

func main() {
	http.HandleFunc("/refresh", refresh)
	http.ListenAndServe(":3333", nil)
}