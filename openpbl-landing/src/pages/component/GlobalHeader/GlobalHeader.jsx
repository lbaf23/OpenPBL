import React from "react";
import {Avatar, Badge, Button, Col, Dropdown, Layout, Menu, Row} from "antd";
import {Link} from "react-router-dom";
import {LogoutOutlined, SettingOutlined, BellOutlined} from '@ant-design/icons';

import * as Auth from "../../User/Auth/Auth"
import AuthApi from "../../../api/AuthApi"

import './global-header.less'

const {Header} = Layout;

class GlobalHeader extends React.PureComponent {
  state = {
    current: this.props.current,
    account: null,
  }

  componentDidMount() {
    AuthApi.getAccount()
      .then((res) => {
        if (res.data.code === 200) {
          this.setState({
            account: res.data.data
          })
          localStorage.setItem("type", res.data.data.tag)
        } else {
          localStorage.setItem("type", "")
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  handleRightDropdownClick(e) {
    let account = this.state.account;
    console.log(account)
    if (e.key === 'my-account') {
      window.open(Auth.getMyProfileUrl(account));
    } else if (e.key === 'logout') {
      AuthApi.logout()
        .then((res) => {
          if (res.data.code === 200) {
            this.setState({
              account: null
            })
            localStorage.setItem("type", "")
            window.location.href = '/'
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }

  renderRightDropdown() {
    const menu = (
      <Menu onClick={this.handleRightDropdownClick.bind(this)} style={{width: '150px', padding: '5px'}}>
        <Menu.Item key='my-account'>
          <SettingOutlined/>&nbsp;&nbsp;
          我的账户
        </Menu.Item>
        <Menu.Item key='logout'>
          <LogoutOutlined/>&nbsp;&nbsp;
          退出账号
        </Menu.Item>
      </Menu>
    )
    return (
        <Dropdown overlay={menu} placement="bottomRight">
          <div style={{cursor: 'pointer'}}>
            <Avatar size="large" src={this.state.account.avatar}/>&nbsp;
            <span>{this.state.account.name}</span>
          </div>
        </Dropdown>
    );
  }

  renderAccount() {
    if (this.state.account === undefined || this.state.account === null) {
      return (
        <a href={Auth.getAuthorizeUrl()}>
          登录注册
        </a>
      );
    } else {
      return (
        this.renderRightDropdown()
      )
    }
  }

  render() {
    const {current} = this.state;
    return (
      <div>
        <Header style={{backgroundColor: 'white'}}>
          <Row>
            <Col xxl={15} xl={11} lg={8} md={6} sm={6} xs={10}>
              <Link to="/landing">
                <div className="logo">
                  <span style={{fontSize: '25px', color: 'black', float: 'left', marginLeft: '80px'}}>OpenCT</span>
                </div>
              </Link>
            </Col>
            <Col xxl={6} xl={10} lg={12} md={14} sm={12} xs={6}>
              <Menu theme="light" mode="horizontal" defaultSelectedKeys={[current]} style={{border: 0}}>
                <Menu.Item key="landing">
                  <Link to="/landing">
                    首页
                  </Link>
                </Menu.Item>
                <Menu.Item key="project">
                  <Link to="/project">
                    公共项目
                  </Link>
                </Menu.Item>
                <Menu.Item key="my-project">
                  <Link to="/my-project">
                    我的空间
                  </Link>
                </Menu.Item>
                <Menu.Item key="bbs">
                  <a href="https://bbs.open-ct.com">
                    在线论坛
                  </a>
                </Menu.Item>
              </Menu>
            </Col>
            <Col xxl={3} xl={3} lg={4} md={4} sm={6} xs={8}>
              {
                <>
                  <span style={{float: 'left'}}>
                    <Link to="/message/all">
                      <Button
                        shape="circle"
                        type="text"
                        icon={
                          <Badge count={999} overflowCount={99} size="small">
                            <BellOutlined />
                          </Badge>
                        }
                        size="large"
                      />
                    </Link>
                  </span>
                  {this.renderAccount()}
                </>
              }
            </Col>
          </Row>
        </Header>
      </div>
    );
  }
}

export default GlobalHeader;
