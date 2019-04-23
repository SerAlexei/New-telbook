import React, {Component} from 'react';
import firebase from '../Firebase';
import {Link} from "react-router-dom";
import {Button} from "semantic-ui-react";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

class Edit extends Component{
    constructor(props){
        super(props);
        this.state = {
            key: '',
            phone_number: '',
            lastName: '',
            firstName: '',
            email: '',
            company: ''
        };
    }
    componentDidMount() {
        const ref = firebase.firestore().collection('boards').doc(this.props.match.params.id); //Получение данных номера из database id
        ref.get().then((doc) =>{
            if (doc.exists){
           const boards = doc.data();
           this.setState({
               key: doc.id,
               phone_number: boards.phone_number,
               lastName: boards.lastName,
               firstName: boards.firstName,
               email: boards.email,
               company: boards.company,
               url: boards.url

           });
            } else {
                console.log("No such document");
            }
        });
    }
    onChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };
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
    onSubmit = (e) => { //Получение данных полей формы и запись в firebase database
        e.preventDefault();
        const {phone_number, lastName, firstName, email, company, url} = this.state;
        const updateRef = firebase.firestore().collection('boards').doc(this.state.key);
        updateRef.set({
            phone_number,
            lastName,
            firstName,
            email,
            company,
            url
        }).then((docRef) =>{
            this.setState({
                key: '',
                phone_number: '',
                lastName: '',
                firstName: '',
                email: '',
                company: '',
                url: ''
            });
            this.props.history.push("/show/"+this.props.match.params.id); //Переход на редактируемый номер телефона по id
        }).catch((error) => {
            console.log("Error adding document: ", error);
        });
    };

    render() {
        return(
            <div className='ui container'>
                <div className="ui segment">
                    <h3 className='ui header'>  Add Number </h3>
                    <Button><Link to='/'> Back To Phone List</Link></Button>
                    <ValidatorForm className="ui form ui segment" onSubmit={this.onSubmit}>
                        <div className="field ">
                            <label>First Name:</label>
                            <TextValidator
                                validators={['required']}
                                errorMessages={['This field is required', 'First name is not valid']}
                                type="text" name="firstName" placeholder="First Name" value={this.firstName} onChange={this.onChange}/>
                        </div>
                        <div className="field">
                            <label>Last Name</label>
                            <TextValidator
                                validators={['required']}
                                errorMessages={['This field is required', 'Last name is not valid']}
                                type="text" name="lastName" placeholder="Last Name" value={this.lastName} onChange={this.onChange}/>
                        </div>
                        <div className="field">
                            <label>Phone Number</label>
                            <TextValidator
                                validators={['required']}
                                pattern={'/^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/'}
                                errorMessages={['This field is required', 'Phone number is not valid']}
                                type="text" name="phone_number" placeholder="Phone Number" value={this.phone_number} onChange={this.onChange}/>
                        </div>
                        <div className="field">
                            <label>E-mail</label>
                            <TextValidator
                                validators={['required', 'isEmail']}
                                errorMessages={['This field is required', 'Email is not valid']}
                                name="email" placeholder="E-mail" value={this.email} onChange={this.onChange}/>
                        </div>
                        <div className="field">
                            <label>Company</label>
                            <TextValidator
                                validators={['required']}
                                errorMessages={['This field is required', 'Company is not valid']}
                                type="text" name="company" placeholder="Company" value={this.company} onChange={this.onChange}/>
                        </div>
                        <input required type="file" className="fileInput" data-url={this.url} onChange={this.handleChange}  />
                        <button className="ui button ui segment" type="submit">Add number</button>
                    </ValidatorForm>
                </div>
            </div>
        );
    }
}export default Edit;