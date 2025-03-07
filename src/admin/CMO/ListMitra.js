import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ListMitra extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: []
		}
	}
	
	componentDidMount() {
		axios.get(`https://api.klikfood.id/index.php/listuser/mitra`, { 'headers': { 'Authorization': sessionStorage.api_token } })
		  .then((response) => {
		  	this.setState({
		  		users: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Something Went Wrong :(");
		  })
	}

	indexN(cell, row, enumObject, index) {
	    return (<div>{index+1}</div>) 
	}

	render() {
		return (
			<div>
			<ToastContainer />
				<div className="row clearfix">
				  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				    <div className="card">
				      <div className="header">
				        <h2>
				          List Mitra
				        </h2>
				        
				      </div>
				      <div className="body">
    			        <div className="table-responsive">
    			        	<BootstrapTable data={this.state.users} striped search pagination hover>
	                  		  <TableHeaderColumn dataField='id' isKey={ true } hidden>User ID</TableHeaderColumn>
				        	  <TableHeaderColumn dataField="any" dataFormat={this.indexN} width='80'>No</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='name' dataSort={true}>Name</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='uang' dataSort={true}>Jumlah Uang</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='username' dataSort={true}>Username</TableHeaderColumn>
				        	</BootstrapTable>    
    			        </div>
				      </div>
				    </div>
				  </div>
				</div>
			</div>
		);
	}
}
export default ListMitra;