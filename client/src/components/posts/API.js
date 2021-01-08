import axios from "axios";

export default {
    search: function(isbn,apikey) {
        alert("Im searching")
        return axios.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn + '&key=' + apikey)
    },
    saveBook: function(bookInfo) {
        return axios.post(`/${bookInfo.id}`);
    }
};