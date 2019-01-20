import React, {Component} from 'react';
import Gallery from './gallery';
import MaterialIcon from '@material/react-material-icon';
import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle} from '@material/react-drawer';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import FolderItem from './folderitem';

import '@material/react-button/dist/button.css';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';
import "@material/react-drawer/dist/drawer.css";
import "@material/react-list/dist/list.css";

export default class App extends Component{
    state = {
        selectedIndex: 0, 
        open:false
    };
    render(){
        return (
        <div>
        <TopAppBar
            title='NasPics'
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
                <List
                    singleSelection
                    selectedIndex={this.state.selectedIndex}
                    handleSelect={(selectedIndex) => this.setState({selectedIndex})}
                >
                    <ListItem>
                        <ListItemText primaryText='Photos'/>
                    </ListItem>
              </List>
            </DrawerContent>
            </Drawer>
          <DrawerAppContent>
            <Gallery/>
          </DrawerAppContent>

      </TopAppBarFixedAdjust>
    </div>
  )
        }
}
