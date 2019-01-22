package treeparse

import (
	"path/filepath"
	"strings"

	"github.com/pkg/errors"
	"github.com/srinathh/naspics/naspics_server/internal/vfs"
)

const (
	TitleChildren = "Sub-Folders"
	TitleParents  = "Parent Folders"
	TitleSiblings = "Sibling Folders"
)

/*
this is the data structure expected by the client. The first element of the array
is the current folder & pictures in the current folder. The following elements are
the folder navigation that should be shown in the left bar

data:[
	{
		title:"/Pictures/after_naisha/2013/2013-06",
		items: [
			"/Pictures/after_naisha/2013/2013-06/2013-06-25_063730.jpg",
			"/Pictures/after_naisha/2013/2013-06/2013-06-25_173514.jpg",
		],
	},
	{
		title:"Parent Folders",
		items:[
			"/Pictures",
			"/Pictures/after_naisha",
			"/Pictures/after_naisha/2013"
		]
	},
	{
		title:"Sub-Folders",
		items:[
			"/Pictures/after_naisha/2013/2013-06/before_birth",
		]
	},
	{
		title:"Sibling Folders",
		items:[
			"/Pictures/after_naisha/2013/2013-07",
			"/Pictures/after_naisha/2013/2013-08",
			"/Pictures/after_naisha/2013/2013-09",
		]
	}
]
*/

// TreeDataElement represents a single unit of the array to be to client
type TreeDataElement struct {
	Title string   `json:"title"`
	Items []string `json:"items"`
}

// ChkFileExt checks if a given pathname's extension corresponds to one
// of the acceptable File Types passed to the function in a non-case
// sensitive way (to handle .JPG and .jpg etc)
func ChkFileExt(pathName string, fileExts []string) bool {
	ext := strings.ToLower(filepath.Ext(pathName))
	for _, fileExt := range fileExts {
		if ext == fileExt {
			return true
		}
	}
	return false
}

// Children searches the current folder for files of given filetypes and return a DataElement
func Children(fs vfs.FileSystem, pathName string, fileExts []string) (files TreeDataElement, children TreeDataElement, err error) {
	files = TreeDataElement{pathName, []string{}}
	children = TreeDataElement{TitleChildren, []string{}}

	fis, err := fs.ReadDir(pathName)
	if err != nil {
		return files, children, errors.Wrapf(err, "error reading directory: %s", pathName)
	}

	for _, fi := range fis {
		if fi.IsDir() {
			children.Items = append(children.Items, filepath.Join(pathName, fi.Name()))
			continue
		}
		if ChkFileExt(fi.Name(), fileExts) {
			files.Items = append(files.Items, filepath.Join(pathName, fi.Name()))
		}
	}

	return files, children, nil
}

// Siblings searches the parent of the current folder for more sibling folders. Special case for root folder
// it won't show any sibling folders and return empty
func Siblings(fs vfs.FileSystem, pathName string) (TreeDataElement, error) {
	siblings := TreeDataElement{TitleSiblings, []string{}}

	parent := filepath.Dir(pathName)
	if parent == pathName {
		return siblings, nil
	}

	fis, err := fs.ReadDir(parent)
	if err != nil {
		return siblings, errors.Wrapf(err, "error reading directory: %s", pathName)
	}

	for _, fi := range fis {
		if fi.IsDir() {
			siblings.Items = append(siblings.Items, filepath.Join(parent, fi.Name()))
		}
	}
	return siblings, nil
}

// Parents searches for all the parents of current folder
func Parents(fs vfs.FileSystem, pathName string) (TreeDataElement, error) {
	parents := TreeDataElement{TitleParents, []string{}}

	curPathName := pathName
	for {
		parent := filepath.Dir(curPathName)
		// we've reached the root. stop
		if parent == curPathName {
			break
		}
		fi, err := fs.Stat(parent)
		if err != nil {
			return parents, errors.Wrapf(err, "error statting %s", parent)
		}
		if !fi.IsDir() {
			return parents, errors.Errorf("the parent %s is not a directory", parent)
		}

		parents.Items = append(parents.Items, parent)
		curPathName = parent
	}

	for i := len(parents.Items)/2 - 1; i >= 0; i-- {
		opp := len(parents.Items) - 1 - i
		parents.Items[i], parents.Items[opp] = parents.Items[opp], parents.Items[i]
	}

	return parents, nil
}
