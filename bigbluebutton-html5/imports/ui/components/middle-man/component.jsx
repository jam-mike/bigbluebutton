import React, { Component } from "react";
import { makeCall } from "/imports/ui/services/api";
import { render } from "react-dom";
import { styles } from "./styles";
import Base from "/imports/startup/client/base";
import JoinHandler from "/imports/ui/components/join-handler/component";
import AuthenticatedHandler from "/imports/ui/components/authenticated-handler/component";
import Subscriptions from "/imports/ui/components/subscriptions/component";

class MiddleMan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      moderatorPW: "",
      shouldJoin: false,
      showModeratorPW: false
    };

    const baseName = Meteor.settings.public.app.cdn + Meteor.settings.public.app.basename;
    this.logoUrl = `${baseName}/resources/images/jam/jamLogo.png`
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    const nameUpdate = { name: event.target.value };
    const emailUpdate = { email: event.target.value };
    const modPWUpdate = { moderatorPW: event.target.value };

    if (event.target.name === "Full Name") {
      this.setState(nameUpdate, this.setAllowJoin);
    } else if (event.target.name == "Email") {
      this.setState(emailUpdate, this.setAllowJoin);
    } else if (event.target.name == "ModeratorPW") {
      this.setState(modPWUpdate, this.setAllowJoin);
    } else if (event.target.name == "isModerator") {
      this.setState({ showModeratorPW: event.target.checked }, this.setAllowJoin);
    }
  }

  setAllowJoin() {
    const moderatorValid = !this.state.showModeratorPW || (this.state.showModeratorPW && this.state.moderatorPW != "");
    this.setState({ allowJoin:  moderatorValid && this.state.name != "" && this.state.email != ""});
  }

  handleClick(event) {
    const params = new URLSearchParams(location.search);
    const meetingID = params.get("meetingID");
    const target = params.get("target");
    const fullName = this.state.name;
    const email = this.state.email;
    const moderatorPW = this.state.moderatorPW;

    let url = `${window.location.origin}/bigbluebutton/api/bouncer?meetingID=${meetingID}&full_name=${fullName}&email=${email}&target=${target}`;
    if (moderatorPW) url += `&moderatorPW=${moderatorPW}`;
    window.location.replace(url);
    return false;
  }

  render() {
    const shouldJoin = window.location.search.indexOf("sessionToken") !== -1;
    if (shouldJoin) {
      return (
        <div>
          <JoinHandler>
            <AuthenticatedHandler>
              <Subscriptions>
                <Base />
              </Subscriptions>
            </AuthenticatedHandler>
          </JoinHandler>
        </div>
      );
    }
    return (
      <div id="middleman">
        <div className={styles.middlemanHeader}>
          <img src={this.logoUrl}/>
        </div>
        <div className={styles.middlemanContainer}>
          <form>
            <div className={styles.middlemanInput}>
              <label htmlFor="Full Name">Full Name:</label>
              <input
                name="Full Name"
                id="Full Name"
                type="text"
                defaultValue={this.state.name}
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.middlemanInput}>
              <label htmlFor="Email">Email:</label>
              <input
                name="Email"
                id="Email"
                type="email"
                defaultValue={this.state.email}
                onChange={this.handleChange}
              />
            </div>
            { this.state.showModeratorPW ?  
              <div className={styles.middlemanInput}>
                <label htmlFor="ModeratorPW">Moderator Password:</label>
                <input
                  name="ModeratorPW"
                  id="ModeratorPW"
                  type="password"
                  defaultValue={this.state.moderatorPW}
                  onChange={this.handleChange}
                />
              </div>
            : null }
            <div className={styles.middlemanCheckInput}>
              <label>I am the moderator</label>
              <input
                name="isModerator"
                type="checkbox"
                defaultValue="false"
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.middlemanJoin}>
              <input type="button" value="Join" onClick={this.handleClick} disabled={!this.state.allowJoin}/>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default MiddleMan;
