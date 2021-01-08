// import React, {Component} from 'react';
// import Books from './components/Books';
// import API from './components/API';
// import barray from './Books';

// const apikey = 'AIzaSyCeAp2Iyywk86cdbiYb2k5PnnziOwsa5gk'
// const isbn = '9780395647417'
// const url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn + '&key=' + apikey;
// class App extends Component {
//   constructor(){
//     super();
    
//   this.state = {
//     books:[],
//     res:""
//    }

//   }

//     componentDidMount(){
//     API.search(isbn,apikey)
//         .then(res => this.setState({books:res.data.items})).then(barray.push(res.data.items)).then(console.log(this.state.books))
//         .catch(err => console.log(err));
//     }
//       render() {
//         return (
//           <div>
            
//             {this.state.books.map(book => <h1>{book.volumeInfo.title}</h1>)}

//           </div>
//         )
//     }
// }

// export default App;