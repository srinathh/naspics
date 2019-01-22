package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gobuffalo/packr/v2"
	"github.com/pkg/errors"
	"github.com/srinathh/naspics/naspics_server/internal/treeparse"
	"github.com/srinathh/naspics/naspics_server/internal/vfs"
)

var validExts = []string{".jpg"}
var fs vfs.FileSystem

func isSlashRune(r rune) bool { return r == '/' || r == '\\' }

func containsDotDot(v string) bool {
	if !strings.Contains(v, "..") {
		return false
	}
	for _, ent := range strings.FieldsFunc(v, isSlashRune) {
		if ent == ".." {
			return true
		}
	}
	return false
}

func sanitize(pathName string) (string, os.FileInfo, error) {
	pathName = "/" + pathName

	if containsDotDot(pathName) {
		return "", nil, errors.Errorf("dot dot relative path found")
	}

	fi, err := fs.Stat(pathName)
	if err != nil {
		return "", nil, errors.Errorf("could not stat requested path: %v", err)
	}
	return pathName, fi, nil
}

func serveFolderData(w http.ResponseWriter, r *http.Request) {

	pathName, _, err := sanitize(r.URL.Path)
	if err != nil {
		log.Printf("ERROR: %v", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	files, children, err := treeparse.Children(fs, pathName, validExts)
	if err != nil {
		log.Printf("ERROR: fetching Children: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	siblings, err := treeparse.Siblings(fs, pathName)
	if err != nil {
		log.Printf("ERROR: fetching siblings: %s", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	parents, err := treeparse.Parents(fs, pathName)
	if err != nil {
		log.Printf("ERROR: fetching parents: %s", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	ret := []treeparse.TreeDataElement{files, parents, children, siblings}

	if err := json.NewEncoder(w).Encode(ret); err != nil {
		log.Printf("ERROR: writing encoding json: %s", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func servePics(w http.ResponseWriter, r *http.Request) {
	pathName, fi, err := sanitize(r.URL.Path)
	if err != nil {
		log.Printf("ERROR: %v", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if fi.IsDir() {
		log.Printf("ERROR: the requested path %s is a directory", pathName)
		http.Error(w, "Not found", http.StatusBadRequest)
		return
	}

	if !treeparse.ChkFileExt(pathName, validExts) {
		log.Printf("ERROR: the requested file extension of %s is not supported", pathName)
		http.Error(w, "Not found", http.StatusBadRequest)
		return
	}

	fil, err := fs.Open(pathName)
	if err != nil {
		log.Printf("ERROR: opening the requested file: %s", err)
		http.Error(w, "Not found", http.StatusBadRequest)
		return
	}

	http.ServeContent(w, r, filepath.Base(pathName), fi.ModTime(), fil)

}

func withLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("REQUEST: %s %s %s %s %s", r.RemoteAddr, time.Now().Format(time.RFC3339), r.Method, r.RequestURI, r.Proto)
		next.ServeHTTP(w, r)
	})
}

func main() {
	hostPort := flag.String("http", ":9000", "host and port for the server")
	picsDir := flag.String("pics", "/data/Pictures", "the folder containing pictures to serve")
	flag.Parse()

	fi, err := os.Stat(*picsDir)
	if err != nil {
		log.Fatalf("ERROR: statting picsDir %s: %s", *picsDir, err)
	}
	if !fi.IsDir() {
		log.Fatalf("ERROR: the path %s is not a valid directory", *picsDir)
	}
	fs = vfs.OS(*picsDir)

	box := packr.New("clientCode", "../naspics_client/build")

	http.Handle("/data/", withLogging(http.StripPrefix("/data/", http.HandlerFunc(serveFolderData))))

	http.Handle("/pics/", withLogging(http.StripPrefix("/pics/", http.HandlerFunc(servePics))))

	http.Handle("/", withLogging(http.FileServer(box)))

	http.ListenAndServe(*hostPort, nil)

}
