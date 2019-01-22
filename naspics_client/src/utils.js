export function getTitle(path){
    const ttl = path.split("/").pop();
    if (ttl === ""){
        return "/"
    }
    return ttl
}