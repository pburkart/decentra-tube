import React, { Component } from 'react';

export default class Dashboard extends Component {

  render() {
    const { handleSignOut, userSession } = this.props;
    return (
      <nav id="subnav" class="navbar navbar-dark bg-dark navbar-static-top">
        <a href="#">
          Profile
        </a>
        <button align="right" className="btn btn-danger" id="signout-button" onClick={ handleSignOut.bind(this) }>
          Logout
        </button>
      </nav>
    );
  }
}
