//imports
import React, { Component } from 'react';
import './userProfile.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectedWallet from '../../containers/selectedWallet';
import { Layout, Menu } from 'antd';
import {API} from '../../store/middlewares/apiService';
import CreateWallet from '../createWallet';
import CreateWalletView from '../CreateWalletView';
import { rateBTCtoEUR } from '../../lib/btcPriceFetchAPI';

const { Sider } = Layout;

//users profile component, create a link to a creation of new wallet and its redirect, append all existing wallets of user
class UserProfile extends Component {
  constructor (props) {
    super(props);
    this.getWallets();
    this.state = {
      view: null,
      form: false,
      rate: 0
    };
  }

  getWallets = () => {
    this.props.fetchGetWallets();
  }

  handleOnClick = (e) => {
    this.setState({
      view:e
    });
  }

  handleAddWallet = () => {
    this.setState({
      form: !this.state.form
    });
  }

  renderSideWallets = () => {
    if(this.props.renderWallets.wallets && this.props.renderWallets.wallets.length) {
      return this.props.renderWallets.wallets.map(e => {
        return (
          <Menu.Item key={e.publickey} >
            <a onClick={() => this.handleOnClick(e)}>
              <div className='userprofile-menuitem'>
                <p >{e.alias}</p>
                <p>{e.balance/1000000000}</p>
                <p>{(e.balance/1000000000) * this.state.rate}</p>
              </div>
            </a>
          </Menu.Item>
        );
      });
    }
  }

  renderMainWallet = () => {
    if(this.state.view===null) return <CreateWalletView />;
    return <SelectedWallet wallet={this.state.view}></SelectedWallet>;
  }

  renderCreateWallet = () => {
    if(this.state.form===false) return;
    return <CreateWallet/>;
  }

  componentDidMount() {
    rateBTCtoEUR()
      .then(res => {
        this.setState({rate: res});
        console.log(this.state.rate);
      });


  }

  render() {
    return (
      <div className ='userprofile-father'>
        <Layout>
          <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
              {this.renderSideWallets()}
              <button onClick={() => {this.handleAddWallet();}}primary className='addwallet' theme="dark">Add Wallet</button>
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            {this.renderMainWallet()}
            {this.renderCreateWallet()}
          </Layout>
        </Layout>
      </div>
    );
  }
}


UserProfile.propTypes = {
  userLogged: PropTypes.object.isRequired,
  renderWallets: PropTypes.object.isRequired,
  getWallets: PropTypes.object.isRequired,
  fetchGetWallets: PropTypes.func.isRequired,
};



const mapStateToProps = state => ({
  userLogged: state.userLogged,
  renderWallets: state.getWallets
});

const mapDispatchToProps = (dispatch) => ({
  fetchGetWallets: () => dispatch({
    type: 'FETCH_GET_WALLETS',
    [API]: {
      path: '/wallet'
    }
  })
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
