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
    const fullname = this.state.name;
    const meetingID = '1234535432';
    this.setState({ shouldJoin: true });
    render(this.render(), document.getElementById('app'))

    const joinUrl = 'http://192.168.86.40/bigbluebutton/api/join?fullName=User+1707771&joinViaHtml5=true&meetingID=random-5346003&password=mp&redirect=true&checksum=88ceec1344a2fe3d548ac7ce3e9dd1cf5cf694e3';

    fetch(joinUrl).then(res => {
      console.log('shiittt', res)
      window.top.location = res.url;
    });

    makeCall('requestJoinURL', { fullname: fullname, meetingID: meetingID });
  }

  render() {
    // return (
    // 	<div>
    // 		<JoinHandler>
    // 			 <AuthenticatedHandler>
    // 				 <Subscriptions>
    // 					 <Base />
    // 				 </Subscriptions>
    // 			 </AuthenticatedHandler>
    // 		 </JoinHandler>
    // 	</div>
    // );



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

						<button onClick={this.handleClick}>Join</button>
					</form>

				</div>
      );
    }
  }
}

export default MiddleMan;
