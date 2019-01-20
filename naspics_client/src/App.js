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
        // Don't call this.setState() here!
        this.state = {
            open:false,
            data:{
                curFolder:"/Pictures/after_naisha/2013/2013-06",
                pics: [
                    "/Pictures/after_naisha/2013/2013-06/2013-06-25_063730.jpg",
                    "/Pictures/after_naisha/2013/2013-06/2013-06-25_173514.jpg",
                ],
                nav:[
                    {
                        title:"Parent Folders",
                        items:[
                            "/Pictures",
                            "/Pictures/after_naisha",
                            "/Pictures/after_naisha/2013"
                        ]
                    },
                    {
                        title:"Sub-Folders",
                        items:[
                            "/Pictures/after_naisha/2013/2013-06/before_birth",
                        ]
                    },
                    {
                        title:"Sibling Folders",
                        items:[
                            "/Pictures/after_naisha/2013/2013-07",
                            "/Pictures/after_naisha/2013/2013-08",
                            "/Pictures/after_naisha/2013/2013-09",
                        ]
                    }
                ]
            }
        };
        this.onFolderSelect= this.onFolderSelect.bind(this);
      }

    onFolderSelect(name){
        console.log("fetching path:"+name)
        this.setState({open: false})
    }

    render(){
        return (
            <div>
                <TopAppBar
                    title={getTitle(this.state.data.curFolder)}
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
                            <FolderTree data={this.state.data.nav} callback={this.onFolderSelect} />
                            <a href="#"></a>
                        </DrawerContent>
                    </Drawer>
                    <DrawerAppContent>
                        <Gallery pics={this.state.data.pics} prefix="http://192.168.1.112" />
                    </DrawerAppContent>
                </TopAppBarFixedAdjust>
            </div>
        )
    }
}
