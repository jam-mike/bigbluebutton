import React, { Component } from 'react';
import { makeCall } from '/imports/ui/services/api';
import { render } from 'react-dom';
import Base from '/imports/startup/client/base';
import JoinHandler from '/imports/ui/components/join-handler/component';
import AuthenticatedHandler from '/imports/ui/components/authenticated-handler/component';
import Subscriptions from '/imports/ui/components/subscriptions/component';

class MiddleMan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      shouldJoin: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    const nameUpdate = { name: event.target.value };
    const emailUpdate = { email: event.target.value };

    const newState = event.target.name == 'Full Name' ? nameUpdate : emailUpdate;
    this.setState(newState);
  }

  handleClick(event) {
    const meetingID = new URLSearchParams(location.search).get('meetingID');
    const fullName = this.state.name;
    const email = this.state.email;

    let url = `http://192.168.86.40/bigbluebutton/api/bouncer?meetingID=${meetingID}&fullName=${fullName}&email=${email}`;
    window.location.replace(url);
    return false;
  }

  render() {
    const shouldJoin = window.location.search.indexOf('sessionToken') !== -1;
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
      )
    } else {
      return (
				<div>
					<p>Middle Man</p>
					<form>
						<label>Full Name:
							<input
								name="Full Name"
								type="text"
								defaultValue={this.state.name}
								onChange={this.handleChange}/>
						</label>

						Email:
							<input
								name="Email"
								type="text"
								defaultValue={this.state.email}
								onChange={this.handleChange}/>

						<input type="button" value="Join" onClick={this.handleClick}></input>
					</form>

				</div>
      );
    }
  }
}

export default MiddleMan;
