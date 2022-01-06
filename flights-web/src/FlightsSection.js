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

    const titleDiv = {
      margin: "auto",
      width: "60%",
      border: ".3rem solid #63532a",
      borderRadius: "1rem",
      padding: "10px"
    };
    const addFlightDiv = {
      margin: "auto",
      width: "50%",
      border: ".3rem solid #63532a",
      borderRadius: "1rem",
      padding: "10px"
    };
    const addFlightInputDiv = {
      margin: "auto",
      width: "60%"
    }
    const loginInput = {
      width: "100%",
      padding: "12px 20px",
      margin: "8px 0",
      display: "inline-block",
      border: "1px solid #63532a",
      borderRadius: "4px",
      boxSizing: "border-box"
   };
   const button = {
      width: "100%",
      backgroundColor: "#63532a",
      color: "white",
      padding: "14px 20px",
      margin: "8px 0",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    };
    const table = {
      borderCollapse: "collapse",
      width: "100%"
    };
    const tdth = {
      border: "1px solid #63532a",
      padding: "8px"
    };


    return (
      <div>
        <div>
          <div style={addFlightDiv}>
            <div style={addFlightInputDiv}>
              <h2>Add a new flight:</h2>
            </div>
            <div style={addFlightInputDiv}>
              <label htmlFor="from">From:</label>
              <input id="from" type="text" style={loginInput}></input><br/>
            </div>
            <div style={addFlightInputDiv}>
              <label htmlFor="to">To:</label>
              <input id="to" type="text" style={loginInput}></input><br/>
            </div>
            <div style={addFlightInputDiv}>
              <button  style={button} onClick={() => this.addFlight()}>Add new flight</button>
            </div>
          </div>
        </div>
        <div>
          <div style={addFlightDiv}>
            <div style={addFlightInputDiv}>
              <h2>Current list of flights:</h2>
            </div>
            <div style={addFlightInputDiv}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={tdth}>From</th>
                    <th style={tdth}>To</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.flights.map((flight,index) => (
                      <tr key={index}>
                        <td style={tdth}>{flight.from}</td>
                        <td style={tdth}>{flight.to}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default FlightsSection;