import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './App.css';
import firebase from './Firebase';
import {Button, Image} from "semantic-ui-react";


class App extends Component{
  constructor(props){
    super(props);
    this.ref = firebase.firestore().collection('boards');
    this.unsubscrible = null;
    this.state = {
      boards: [],
      searchWord: ''
    }
  }

  onCollectionUpdate = (querySnapshot) => { //
    const boards = [];
    querySnapshot.forEach((doc) => {
      const {phone_number, lastName, firstName, email, company, url} = doc.data();
      boards.push({
        key: doc.id,
        doc,
        phone_number,
        lastName,
        firstName,
        email,
        company,
        url
      });
    });
    this.setState({
      boards
    });
  };

  componentDidMount() {
    this.unsubscrible = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  searchFunc = (event) => {
    this.setState({searchWord: event.target.value});
  };

  render() {
    return(
        <div className='ui container'>
          <div className="ui segment">
          <h3 className="ui center aligned header">Phone List</h3>
            <div className="headerContainer">
              <Button><Link to='/create/'>Add Number</Link></Button>
              <div className="ui search searchSection">
                <div className="ui icon input">
                  <input className='semantic-input prompt'
                         onChange={this.searchFunc}
                         value={this.state.searchWord}
                         placeholder="Search..."/>
                  <i className="search icon">
                  </i>
                </div>
              </div>

            </div>
            <table className='ui celled table'>
              <thead>
              <tr className="table_Phone">
                <th>Foto</th>
                <th>Phone Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>E-mail</th>
                <th>Company</th>
              </tr>
              </thead>
              <tbody>
              {this.state.boards.map(boards => {
                if(boards.firstName.toLowerCase().includes(this.state.searchWord.toLowerCase()) || boards.phone_number.includes(this.state.searchWord) ||
                    boards.lastName.toLowerCase().includes(this.state.searchWord.toLowerCase()) || boards.company.toLowerCase().includes(this.state.searchWord.toLowerCase())||
                    boards.email.includes(this.state.searchWord) ) {
                  return (
                      <tr className="table_Phone" >
                        <td data-label="Foto" className="imageTd"><Image className="imgFront" src={boards.url}/></td>
                        <td data-label="Phone Number"> <Link to={`/show/${boards.key}`}>{boards.phone_number}</Link></td>
                        <td data-label="First Name">{boards.firstName}</td>
                        <td data-label="Last Name">{boards.lastName}</td>
                        <td data-label="E-mail">{boards.email}</td>
                        <td data-label="Company">{boards.company}</td>
                      </tr>
                  )
                }
                else {
                  return (
                      <tr className="table_Phone">
                      </tr>
                  )
                }
              })}
              </tbody>
            </table>
          </div>




        </div>
    );
  }
}

export default App;
