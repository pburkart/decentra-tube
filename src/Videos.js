import React, { Component } from 'react';
import {userSession} from 'blockstack';
import "./styles/style.css";
import {jsonCopy, remove, add, check} from './assets/utils'
import { appConfig, VIDEOS_FILENAME} from './assets/constants'

export default class Videos extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      videos: [],
      value: '',
  	};

    this.loadVideos = this.loadVideos.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    this.checkVideo = this.checkVideo.bind(this);
  }

  componentWillMount(){
    this.loadVideos();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
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
     this.props.userSession.putFile(VIDEOS_FILENAME, JSON.stringify(videos), options)
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
    return (
      <div>
        <div id="addVideo" className="frame" style={{borderColor: '#f8f9fa'}}>
          <form onSubmit={this.addVideo} className="input-group">
            <input className="form-control" type="text" onChange={this.handleChange} value={this.state.value} required placeholder="Video URL.." autoFocus={true}/>
            <div className="input-group-append" id="add-Video">
              <input type="submit" className="btn btn-primary" value="Add"/>
            </div>
          </form>
        </div>
        <br></br>
        <div className="row justify-content-center">
          <div className="frame">
            {this.state.videos.map((Video, i) =>
              <ul key={i}>
                <div className="row">
                  <div className="col">
                    <span className="input-group-text">
                      <div className="Video">
                        <iframe src={Video[0]} frameborder="0" width="100%" height="100%" allowfullscreen></iframe>
                      </div>
                      <div className="delete">
                        <button id='deleteVideo'className="btn btn-primary" data-index={i} onClick={this.removeVideo}>
                          <div className="X" data-index={i}>X</div>
                        </button>
                      </div>
                    </span>
                    </div>
                  </div>
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}
