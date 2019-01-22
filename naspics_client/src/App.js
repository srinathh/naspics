import React, {Component} from 'react';
import Gallery from './gallery';
import MaterialIcon from '@material/react-material-icon';
import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent } from '@material/react-drawer';
import FolderTree from './foldertree';
import {getTitle} from './utils';

import '@material/react-button/dist/button.css';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';
import "@material/react-drawer/dist/drawer.css";
import "@material/react-list/dist/list.css";

export default class App extends Component{
    constructor(props) {
        super(props);
        this.onFolderSelect= this.onFolderSelect.bind(this);
        this.refreshPath= this.refreshPath.bind(this);
        this.state = {
            open:false,
            data:[ { title:"NasPics", items:[] } ]
        }
    }

    componentDidMount() {
        this.refreshPath('/data/')
    }
    
    refreshPath(path){
        fetch(path)
          .then(response => response.json())
          .then(data => this.setState({ data }))
          .catch(error => {
              console.log(error)
              this.setState({title:"NasPics",items:[]})});
    }

    onFolderSelect(path){
        this.refreshPath('/data'+path)
        this.setState({open: false})
    }

    render(){
        return (
            <div>
                <TopAppBar
                    title={getTitle(this.state.data[0].title)}
                    navigationIcon={
                        <MaterialIcon
                            icon='menu'
                            onClick = {() => this.setState({open: !this.state.open})} 
                        />
                    }
                />
                <TopAppBarFixedAdjust>
                    <Drawer 
                        modal 
                        open={this.state.open}
                    >
                        <DrawerContent>
                            <FolderTree data={this.state.data.slice(1)} callback={this.onFolderSelect} />
                            <a href="#"></a>
                        </DrawerContent>
                    </Drawer>
                    <DrawerAppContent>
                        <Gallery pics={this.state.data[0].items} prefix="/pics" />
                    </DrawerAppContent>
                </TopAppBarFixedAdjust>
            </div>
        )
    }
}
