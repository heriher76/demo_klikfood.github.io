import React, { Component } from 'react';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';
import { Redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

class Cart extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
	 		carts: [],
	 		hargaNya: [],
			beratNya: [],
			jumlahHarga: '',
			jumlahBerat: '',
			servis: '',
			jumlahOngkir: '',
	 		listOngkir: []
	    };

		this.handleDeleteCart = this.handleDeleteCart.bind(this);
	}

	componentWillMount() {
		var carts = JSON.parse(localStorage.getItem('cart'));
		let jumlahBeratNya = null;
		let jumlahHargaNya = null;
		if(carts){
			carts.map((item, i) => {
				this.state.carts.push(item);
				jumlahBeratNya += Number(item[4]);
				jumlahHargaNya += Number(item[1]);
			})
			this.setState({
				jumlahBerat: jumlahBeratNya,
				jumlahHarga: jumlahHargaNya
			})
		}
	}

	componentDidMount() {
		console.log(this.state.jumlahHarga)
		const cekOngkir = new FormData();
		console.log(sessionStorage);
		cekOngkir.set('tujuan', sessionStorage.kota);
		cekOngkir.set('berat', this.state.jumlahBerat);

		axios.defaults.headers = {  
			'Authorization': sessionStorage.api_token 
		}
		
		axios.post(`http://apiklikfood.herokuapp.com/ongkir/harga`, cekOngkir)
	      .then(res => {
	      	console.log(res);
	      	this.setState({
	      		listOngkir: res.data.data
	      	})
	      }).catch(err => {
	  //     	if(localStorage.getItem('redirectOnce')){
			// 	window.location.href='/admin/distribution/order/courier';
			// 	localStorage.removeItem('redirectOnce');
			// }
	      });

	      // this.setState({
	      // 	jumlahTotal: this.state.jumlahHarga + this.state.jumlahOngkir
	      // })
	}

	handleDeleteCart = i => {
		// this.setState( state => {
		const carts = this.state.carts.filter((item, j) => i !== j);
		
		// 	return {
		// 		carts,
		// 	}
		// });
		console.log(carts);
		localStorage.setItem('cart', JSON.stringify(carts));
		this.setState({
			carts: JSON.parse(localStorage.getItem('cart'))
		})
		window.location.href='/cart';
		console.log(this.state);
	}

	handleChange = (event) => {
		this.setState({ 
			servis: event.target.value,
			jumlahOngkir: event.target.id
		})
	}

	handleSubmitOrder = (e) => {
		e.preventDefault();

		const willParsedCart = JSON.parse(localStorage.getItem('cart'));
		let finalCart = [...Array(willParsedCart.length)].map( x => Array(2).fill(0) );

		willParsedCart.map((item,i) => {
			finalCart[i][0] = (item[2].split('/')[0]);
			finalCart[i][1] = (item[3]);
		})
		console.log(finalCart);
		var obj = {
		    'produk' : finalCart,
		    'servis' : this.state.servis
		};
		console.log(obj);
		
		axios.defaults.headers = {  
			'Authorization': sessionStorage.api_token 
		}

		axios.post(`http://apiklikfood.herokuapp.com/transaksi/store`, obj)
	      .then(res => {
	      	console.log(res);
	      	toast.success(res.data.messages);
	      	setTimeout(() => {
	      		window.location.href='/admin/transactions/pembelian';
	      	}, 3000)
	      }).catch(err => {
	      	console.log(err);
	      	toast.error("Tidak Bisa Diorder :( ");
	      });
	}

	render() {
		if (this.state.carts.length === 0) {
			{toast.warning("Silahkan Pilih Produk Dahulu !")}
			return (
				<Redirect to={'/'}/>
			)
	    }
		if (sessionStorage.length === 0) {
			{toast.success("Login Terlebih Dahulu !")}
			return (
				<Redirect to={'/login'}/>
			)
	    }
		return (
			<div>
			<ToastContainer />
				<section id="cart_items">
		          <div className="container">
		            <div className="breadcrumbs">
		              <ol className="breadcrumb">
		                <li><a href="/">Home</a></li>
		                <li className="active">Shopping Cart</li>
		              </ol>
		            </div>
		            <div className="table-responsive cart_info">
		              <table className="table table-condensed">
		                <thead>
		                  <tr className="cart_menu" onClick={e => console.log(this.state.carts)}>
		                    <td className="image">Item</td>
		                    <td className="description" />
		                    <td className="price">Price</td>
		                    <td className="quantity">Quantity</td>
		                    <td className="total">Total</td>
		                    <td />
		                  </tr>
		                </thead>
		                <tbody>
		                { this.state.carts.map( (cart, index) => 
		                  <tr>
		                    <td className="cart_product">
		                      <a href><img src={ "http://bajax.0hi.me/produk/"+ cart[2] } alt="cart" width="150" /></a>
		                    </td>
		                    <td className="cart_description">
		                      <h4><a href>{ cart[0] }</a></h4>
		                      {/*<p>Web ID: 1089772</p>*/}
		                    </td>
		                    <td className="cart_price">
		                      <p>Rp. { cart[1] }</p>
		                    </td>
		                    <td className="cart_quantity">
		                      <div className="cart_quantity_button">
		                        <a className="cart_quantity_up" onClick={e => {
		                        	const newJumlah = this.state.carts.slice();
		                        	newJumlah[index][3] += 1;
		                        	this.setState({carts: newJumlah});
		                        	console.log(this.state.carts); 
		                        } } href> + </a>
		                        <input className="cart_quantity_input" type="text" value={cart[3]} name="quantity" autoComplete="off" size={2} />
		                        <a className="cart_quantity_down" onClick={e => {
		                        	const newJumlah = this.state.carts.slice();
		                        	if(newJumlah[index][3] > 1)
		                        		newJumlah[index][3] -= 1;
		                        		this.setState({carts: newJumlah});
		                        	console.log(this.state.carts); 
		                        } }  href> - </a>
		                      </div>
		                    </td>
		                    <td className="cart_total">
		                      <p className="cart_total_price">Rp. { cart[1] * cart[3] }</p>
		                    </td>
		                    <td className="cart_delete">
		                      <a className="cart_quantity_delete" id={cart[0]} onClick={() => this.handleDeleteCart(index) } href><i className="fa fa-times" id={index} /></a>
		                    </td>
		                  </tr>
		                ) }
		                </tbody>
		              </table>
		            </div>
		          </div>
		        </section> {/*/#cart_items*/}
		        <section id="do_action">
		          <div className="container">
		            <div className="heading">
		              <h3>Silahkan Pilih Metode Pengiriman</h3>
		              <p>Pengiriman Via JNE dan akan dikirim menurut Kota yang telah didaftarkan ketika register.</p>
		            </div>
		            <div className="row">
		              <div className="col-sm-6">
		                <div className="chose_area">
		                  <ul className="user_option">
		                  	{ 
		                  		(this.state.listOngkir.length !== null) ?
			                  	this.state.listOngkir.map((item,i) => 
		                  		<React.Fragment>
					        		<li key={i}>
				                      <input style={{position: 'relative'}} type="radio" id={item.cost[0].value} name="servis" onChange={this.handleChange} value={item.service} /> { item.service }
				                      <label>Rp.{ item.cost[0].value } { item.service } { item.cost[0].etd } Hari</label>
				                    </li>
				        		</React.Fragment>
				        		)
				        		: null
				        	}
		                  </ul>
		                  {/*<ul className="user_info">
		                    <li className="single_field">
		                      <label>Country:</label>
		                      <select>
		                        <option>United States</option>
		                        <option>Bangladesh</option>
		                        <option>UK</option>
		                        <option>India</option>
		                        <option>Pakistan</option>
		                        <option>Ucrane</option>
		                        <option>Canada</option>
		                        <option>Dubai</option>
		                      </select>
		                    </li>
		                    <li className="single_field">
		                      <label>Region / State:</label>
		                      <select>
		                        <option>Select</option>
		                        <option>Dhaka</option>
		                        <option>London</option>
		                        <option>Dillih</option>
		                        <option>Lahore</option>
		                        <option>Alaska</option>
		                        <option>Canada</option>
		                        <option>Dubai</option>
		                      </select>
		                    </li>
		                    <li className="single_field zip-field">
		                      <label>Zip Code:</label>
		                      <input type="text" />
		                    </li>
		                  </ul>*/}
		                  {/*<a className="btn btn-default update" href>Get Quotes</a>
		                  <a className="btn btn-default check_out" href>Continue</a>*/}
		                </div>
		              </div>
		              <div className="col-sm-6">
		                <div className="total_area">
		                  <ul>
		                    <li>Keranjang Sub Total <span>Rp. { this.state.jumlahHarga }</span></li>
		                    <li>Biaya Pengiriman <span>Rp. { this.state.jumlahOngkir }</span></li>
		                    <li>Total <span>Rp. { Number(this.state.jumlahHarga) + Number(this.state.jumlahOngkir) }</span></li>
		                  </ul>
		                  {/*<a className="btn btn-default update" href>Update</a>*/}
		                  <button className="btn btn-default update" onClick={this.handleSubmitOrder} href>Pesan Sekarang !</button>
		                </div>
		              </div>
		            </div>
		          </div>
		        </section>{/*/#do_action*/}
		        <footer id="footer">
			      	<FooterTop />
			      	<FooterBottom />
		      	</footer>
			</div>
		);
	}
}
export default Cart;