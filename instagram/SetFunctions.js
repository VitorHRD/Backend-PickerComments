function sort(array) {
    let length = Math.floor(Math.random() * array.length)

    return length
}

function count(autorArray, commentsArray, autorImg) {
    const count = [];
    let id = 0;
    autorArray.forEach(autor => { count.push({ id: id++, autorImg: autorImg[id], autor: autor, text: commentsArray[id] }) })
    return count
}
module.exports ={sort , count}