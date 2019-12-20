import React, { Component } from 'react';
import {
  Person, UserSession
} from 'blockstack'
import {jsonCopy, remove, add, check} from './assets/utils'
import { appConfig, VIDEOS_FILENAME} from './assets/constants'

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      videos: [],
      value: '',
  	};

    this.loadVideos = this.loadVideos.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    this.checkVideo = this.checkVideo.bind(this);
  }

  componentWillMount(){
    this.loadVideos();
  }

  componentWillReceiveProps(nextProps){
    const nextVideos = nextProps.videos;
    if(nextVideos){
      if(nextVideos.length !== this.state.videos.length){
        this.setState({ videos: jsonCopy(nextVideos) });
      }
    }
  }

  loadVideos() {
    const options = { decrypt: true };

    this.props.userSession.getFile(VIDEOS_FILENAME, options)
     .then((content) => {
       if(content) {
         const videos = JSON.parse(content);
         this.setState({videos});
       }
     })
   }

   saveVideos(videos){
     const options = { encrypt: true };
     this.props.userSession.putFile(VIDEOS_FILENAME, JSON.STRINGIFY(videos), options)
   }

   removeVideo(e) {
     e.preventDefault();
     //fixed: undefined data-index from input
     const videos = remove(e.currentTarget.dataset.index, this.state);
     this.setState({ videos });
     this.saveVideos(videos);
   }

   addVideo(e) {
     e.preventDefault();
     const videos = add(this.state);
     this.setState({value: '', videos});
     this.saveVideos(videos);
   }

   checkVideo(e) {
     const videos = check(e.target.dataset.index, this.state);
     this.setState({ videos });
     this.saveVideos(videos);
   }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    return (
      !userSession.isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
          </button>
        </p>
      </div> : null
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }
}
