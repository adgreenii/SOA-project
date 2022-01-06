import React from 'react';

const error = 'Internal server error';

class FlightsSection extends React.Component {

  state = {
    listLength: 0
  };

  username = this.props.username;
  token = this.props.token;
  flights = [];

  getFlights = () => {
    const url_flights = 'http://localhost:8094/access/user/flights?';
    console.log(`sending request: ${url_flights}`);
    fetch(url_flights + new URLSearchParams({
        username: this.username
        }),{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': this.token
        },
    }).then(response => response.json())
    .then(data => {
        console.log(`${data.length} flights obtained successfully for user: ${this.username}`);
        this.flights = data;
        console.log(this.flights);
        this.setState({ listLength: data.length });

    }).catch((err)=>{
        console.log(`Error API call: ${err}`);
        alert(error);
    });
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.getFlights();
  }

  addFlight = () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    if (from === '' || to === ''){
      alert('Invalid data.');
    } else {
      const url_flight = 'http://localhost:8094/access/user/flight';
      console.log(`sending request: ${url_flight}`);

      fetch(url_flight,{
          method:'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': this.token
          },
          body: JSON.stringify({
              "username": this.username,
              "from": from,
              "to": to
          })
      }).then(response => response.json())
      .then(data => {
          const api_error = data.error;
          if(typeof api_error == 'undefined'){
              console.log("Flight successfully saved.");
              this.getFlights();
          } else {
              alert(api_error);
          }
      }).catch((err) => {
          console.log(`Error API call: ${err}`);
          alert(error);
      });
    }
  }

  render() {
    console.log('mount');

    return (
      <div>
        <h2>Add a new flight:</h2>
        <div>
          <label htmlFor="from">From:</label>
          <input id="from" type="text"></input><br/>
          <label htmlFor="to">To:</label>
          <input id="to" type="text"></input><br/>
          <button onClick={() => this.addFlight()}>Add new flight</button>
        </div>
        <h2>Current list of flights:</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {
                this.flights.map((flight,index) => (
                  <tr key={index}>
                    <td>{flight.from}</td>
                    <td>{flight.to}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default FlightsSection;