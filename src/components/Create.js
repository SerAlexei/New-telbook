import React, {Component} from 'react';
import firebase from '../Firebase';
import {Link} from 'react-router-dom';
import {Button} from "semantic-ui-react";

class Create extends Component{
    constructor(){
        super();
        this.ref = firebase.firestore().collection('boards');
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            phone_number: '',
            lastName: '',
            firstName: '',
            email: '',
            company:  '',
            image: null,
            url: '',
        };
    }
    handleChange = (e) =>{ //Добавление изображения в firebase storage, получение url изображения и запись url в firebase database
        if(e.target.files[0]){
            const image = e.target.files[0];
            this.setState({image});
            firebase.storage().ref(`images/${image.name}`).put(image).then(succees => {
                firebase.storage().ref(`images/${image.name}`).getDownloadURL().then(url => {
                    console.log(url);
                    const state = this.state;
                    state["url"] = url;
                    this.setState(state);
                })
            }
            )
        }
    };

    onChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);

    };
    onSubmit = (e) => {  //Получение данных полей формы и запись в firebase database
        e.preventDefault();
        const {phone_number, lastName, firstName, email, company, url} = this.state;
        this.ref.add({
            phone_number,
            lastName,
            firstName,
            email,
            company,
            url
        })
            .then((docRef) => {
            this.setState({
                phone_number: "",
                lastName: "",
                firstName: "",
                email: "",
                company: "",
                url: ""

            });
            this.props.history.push("/") //Переход после создания на App.js
        }).catch((error) => {
            console.log("Error adding document: ", error);
        });
    };

    render() {
        const {phone_number, lastName, firstName, email, company, url} = this.state;

        return (

            <div className='ui container'>
                <div className="ui segment">
                <h3 className='ui header'>  Add Number </h3>
                <Button><Link to='/'> Back To Phone List</Link></Button>
                <div className="ui form ui segment" onSubmit={this.onSubmit}>
                    <form className="ui form">
                    <div className="field" >
                        <label>First Name:</label>
                        <input
                            required
                            type="text" name="firstName" placeholder="First Name" value={firstName} onChange={this.onChange}/>
                    </div>
                    <div className="field" >
                        <label>Last Name</label>
                        <input
                            required
                            type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={this.onChange}/>
                    </div>
                    <div className="field" >
                        <label>Phone Number</label>
                        <input
                            required
                            pattern={'[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}'}
                            name="phone_number" placeholder="Phone Number" value={phone_number} onChange={this.onChange}/>
                    </div>
                        <div className="field" >
                        <label>E-mail</label>
                        <input
                            required type="email" name="email" placeholder="E-mail" value={email} onChange={this.onChange}/>
                    </div >
                    <div className="field" >
                        <label>Company</label>
                        <input
                            required
                            type="text" name="company" placeholder="Company" value={company} onChange={this.onChange}/>
                    </div >
                        <div className="field" >
                    <input required type="file" className="fileInput" data-url={url} onChange={this.handleChange}  />
                        </div>
                    <button className="ui button ui segment" type="submit">Add number</button>
                </form>
            </div>
            </div>
            </div>
        );
    }
}
export default Create;