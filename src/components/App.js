import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
 
  render() {
    console.log(this.props);
    return (
      <div className="App">
        <h1>Hello World</h1>
      </div>
    );
  }
}
function mapStateToProps(state){
  // console.log(state);
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  let calender = []
  calender = days.map((day)=>({
    day: day,
    meals : state[day]
  }))
  // console.log(temp);
  return {calender : calender};
}
export default connect(mapStateToProps)(App);
