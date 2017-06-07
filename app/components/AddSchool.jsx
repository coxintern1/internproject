var React = require("react");
var actions = require("../actions/SchoolActions");

module.exports = React.createClass({
    getInitialState:function(){
      return {
          name:"",
          tagline:""
      }  
    },
addSchool:function(e){
var name = e.target.name;
      var state = this.state;
      var lookup = {
    
    'description': state,
}
   $.ajax({
      url: "http://localhost:8081/defineProcess",
      dataType: 'json',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(lookup),
      success: function(data) {
        //We set the state again after submission, to update with the submitted data
        this.setState({data: data});
        console.log(data)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("http://localhost:8081/defineProcess", status, err.toString());
      }.bind(this)
    });
},
    handleInputChange:function(e){
      e.preventDefault();
      var name = e.target.name;
      var state = this.state;
      state[name] = e.target.value;
      this.setState(state);
    },
   
    render:function(){
        return(
            <form className="form" onSubmit={this.addSchool}>
                    <div className="form-group">
                    <label className="control-label" htmlFor="BusinessUnit">Business Unit Name:</label>
                    <input type="text" className="form-control" id="BusinessUnit" name="BusinessUnit" value={this.state.BusinessUnit} onChange={this.handleInputChange} placeholder="Co Media or Cox Automotive" />                    
                </div>
                  <div className="form-group">
                    <label className="control-label" htmlFor="Env">Environment Name:</label>
                    <input type="text" className="form-control" id="Env" name="Env" value={this.state.Env} onChange={this.handleInputChange} placeholder="AWS or ONPRIME " />                    
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="name">Process Name:</label>
                    <input type="text" className="form-control" id="name" name="name" value={this.state.name} onChange={this.handleInputChange} placeholder="Process Name" />                    
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="tagline">Process Description:</label>
                    <input type="text" className="form-control" id="tagline" name="tagline" value={this.state.address} onChange={this.handleInputChange} placeholder="Process Description" />                    
                </div>
                <div className="form-group">
                    <button className="btn" type="submit">Add Process</button>
                </div>
            </form>
        )
    }
})

