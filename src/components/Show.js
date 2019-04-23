import React, {Component} from 'react';
import firebase from '../Firebase';
import {Link} from 'react-router-dom';
import { Button} from 'semantic-ui-react';

class Show extends Component{
    constructor(props){
        super(props);
        this.state = {
            boards: [],
            key:''
        };
    }
    componentDidMount() {
        const ref = firebase.firestore().collection('boards').doc(this.props.match.params.id);
        ref.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    boards: doc.data(),
                    key: doc.id,
                    // isLoading: false
                });

            } else {
                console.log("No such document!");
            }
        });
    }
    delete(id){
        firebase.firestore().collection('boards').doc(id).delete().then(()=>{ //Удаление номера по id
           console.log("Document successfully deleted!");
           this.props.history.push("/") //Переход после удаления на App.js
        }).catch((error)=>{
           console.error("Error removing document: ", error);
        });
    }

    render() {
        return(
            <div className='ui container'>
                <div className="ui segment">
                    <h3 className="ui center aligned header">Card</h3>
                    <div className="headerContainer_Show">
                        <Button className="buttonShow"><Link to='/'> Back To Phone List</Link></Button>
                    </div>

                    <div className="ui centered card">
                        <div className="image">
                            <img className="right floated mini ui image" src={this.state.boards.url} alt=""/>
                        </div>
                        <div className="content">
                            <div className="header"><h3 className=' phone_number'>{this.state.boards.phone_number}</h3>
                            </div>
                            <div className="meta">{this.state.boards.firstName} {this.state.boards.lastName}</div>
                            <div className="meta">{this.state.boards.email}</div>
                            <div className="description">{this.state.boards.company}</div>
                            <div className="extra content">
                                <div className='ui two buttons editButton'>
                                    <Button basic color='green'>
                                        <Link to={`/edit/${this.state.key}`}>Edit</Link>
                                    </Button>
                                    <Button basic color='red' onClick={this.delete.bind(this, this.state.key)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Show;