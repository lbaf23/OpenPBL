import React from 'react';
import DocumentTitle from 'react-document-title';
import {Link, Redirect, Route, Switch} from 'react-router-dom'
import {
  CheckCircleOutlined,
  CheckOutlined,
  CopyOutlined,
  HighlightOutlined,
  StarFilled,
  SyncOutlined
} from "@ant-design/icons";

import PublishedProject from "../PublishedProject";
import EditingProject from "../EditingProject";
import FinishedProject from "../FinishedProject";
import LearningProject from "../LearningProject";
import {Affix, Button, Layout, Menu} from "antd";
import ProjectApi from "../../../api/ProjectApi";
import FavouriteProject from "../FavouriteProject";

class MyProject extends React.PureComponent {
  state = {
    menu: ''
  }

  componentDidMount() {
    this.changeMenu()
  }

  changeMenu = (e) => {
    if (e !== undefined) {
      this.setState({menu: e.key})
      return
    }
    const p = this.props.location.pathname
    if (p.endsWith("/published")) {
      this.setState({menu: 'published'})
    } else if (p.endsWith("/editing")) {
      this.setState({menu: 'editing'})
    } else if (p.endsWith("/finished")) {
      this.setState({menu: 'finished'})
    } else if (p.endsWith("/learning")) {
      this.setState({menu: 'learning'})
    } else if (p.endsWith("/favourite")) {
      this.setState({menu: 'favourite'})
    }
  }

  createProject = e => {
    ProjectApi.createProject()
      .then((res) => {
        if (res.data.code === 200) {
          window.open(`/home/project/${res.data.data}/info/edit`)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  render() {
    const {menu} = this.state
    return (
      <DocumentTitle title="My Project">
        <Layout style={{margin: '20px'}}>
          <Affix offsetTop={0}>
            <Layout.Sider
              breakpoint="lg"
              collapsedWidth="0"
              theme="light"
              style={{backgroundColor: '#f2f4f5'}}
            >
              {this.props.account.tag === '老师' ?
                <Menu
                  defaultSelectedKeys={['published']}
                  className="menu-bar"
                  selectedKeys={[menu]}
                  onClick={e => this.changeMenu(e)}
                  mode="inline"
                >
                  <Menu.Item key="published" icon={<CheckCircleOutlined/>}>
                    <Link to="/home/my-project/published">
                      已发布
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="editing" icon={<HighlightOutlined/>}>
                    <Link to="/home/my-project/editing">
                      未发布
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="finished" icon={<CopyOutlined/>}>
                    <Link to="/home/my-project/finished">
                      已结束
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="favourite" icon={<StarFilled/>}>
                    <Link to="/home/my-project/favourite">
                      收藏夹
                    </Link>
                  </Menu.Item>
                </Menu>
                :
                <Menu
                  defaultSelectedKeys={['learning']}
                  className="menu-bar"
                  selectedKeys={[menu]}
                  onClick={e => this.changeMenu(e)}
                  mode="inline"
                >
                  <Menu.Item key="learning" icon={<SyncOutlined/>}>
                    <Link to="/home/my-project/learning">
                      进行中
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="finished" icon={<CheckOutlined/>}>
                    <Link to="/home/my-project/finished">
                      已完成
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="favourite" icon={<StarFilled/>}>
                    <Link to="/home/my-project/favourite">
                      收藏夹
                    </Link>
                  </Menu.Item>
                </Menu>
              }
              {this.props.account.tag === '老师' ?
                <Button
                  type='primary'
                  shape='round'
                  size="large"
                  onClick={this.createProject}
                  style={{
                    width: '180px',
                    margin: '10px',
                    marginTop: '30px',
                  }}
                >创建项目</Button>
                :
                null
              }
            </Layout.Sider>
          </Affix>
          <Layout.Content style={{marginLeft: '10px'}}>
            {this.props.account.tag === '老师' ?
              <Switch>
                <Route exact path="/home/my-project" render={() => (
                  <Redirect to="/home/my-project/published"/>
                )}/>
                <Route exact path="/home/my-project/published" component={PublishedProject}/>
                <Route exact path="/home/my-project/editing" component={EditingProject}/>
                <Route exact path="/home/my-project/finished" component={FinishedProject}/>
                <Route exact path="/home/my-project/favourite" component={FavouriteProject}/>
              </Switch>
              :
              <Switch>
                <Route exact path="/home/my-project" render={() => (
                  <Redirect to="/home/my-project/learning"/>
                )}/>
                <Route exact path="/home/my-project/learning" component={LearningProject}/>
                <Route exact path="/home/my-project/finished" component={FinishedProject}/>
                <Route exact path="/home/my-project/favourite" component={FavouriteProject}/>
              </Switch>
            }
          </Layout.Content>
        </Layout>
      </DocumentTitle>
    );
  }
}

export default MyProject
