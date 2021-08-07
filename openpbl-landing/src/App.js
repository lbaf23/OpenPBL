import { Route, BrowserRouter, Switch } from "react-router-dom";

import './App.less';
import Home from './pages/Home/index'
import Project from "./pages/Project";
import MyProject from "./pages/Project/MyProject";
import ProjectInfo from "./pages/Project/ProjectInfo/index";
import PublicProject from "./pages/Project/PublicProject";
import LearningProject from "./pages/Project/LearningProject";
import FinishedProject from "./pages/Project/FinishedProject";

import AuthCallback from "./pages/User/Auth/AuthCallback";
import Learning from "./pages/Project/LearningPage";
import EditInfo from "./pages/Project/CreateProject/Info";
import EditOutlined from "./pages/Project/CreateProject/Outline"
import SectionEditPage from "./pages/Project/CreateProject/Section/SectionEditPage";
import PreviewSection from "./pages/Project/PreviewProject/PreviewSection";
import SurveyEditPage from "./pages/Project/CreateProject/Survey/SurveyEditPage";
import Evidence from "./pages/Project/Evidence";
import Message from "./pages/Message";
import AllMessage from "./pages/Message/AllMessage";
import UnreadMessage from "./pages/Message/UnreadMessage";

function App() {
  return (
      <div className="App">
        <BrowserRouter>
            <Route exact path="/" component={Home} />
            <Route exact path="/callback" component={AuthCallback} />

            <Route exact path="/landing" component={Home} />
            <Route exact path="/project" component={Project} />
            <Route exact path="/my-project" component={MyProject} />

            <Route exact path="/project/public" component={PublicProject} />
            <Route exact path="/project/learning" component={LearningProject} />
            <Route exact path="/project/finished" component={FinishedProject} />

            <Route exact path="/project/:id/info" component={ProjectInfo} />

            <Route exact path="/project/:id/info/edit" component={EditInfo} />
            <Route exact path="/project/:id/outline/edit" component={EditOutlined} />

            <Route exact path="/project/:pid/student/:sid/evidence" component={Evidence} />

            <Route exact path="/project/:pid/section/:sid/edit" component={SectionEditPage} />
            <Route exact path="/project/:pid/section/:sid/task/:tid/survey/edit" component={SurveyEditPage} />
            <Route exact path="/project/:pid/section/:sid/preview" component={PreviewSection} />

            <Route path="/message" component={Message}/>

            <Route exact path="/project/learning/:pid/:cid/:sid" component={Learning} />
        </BrowserRouter>
      </div>
  );
}

export default App;
