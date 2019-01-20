import React from 'react';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';

import '@material/react-material-icon/dist/material-icon.css';
import "@material/react-list/dist/list.css";

export default class FolderItem extends React.Component{
    render(){
        var icon = <MaterialIcon icon='folder' />
        if(this.props.FolderOpen){
            icon = <MaterialIcon icon='folder_open' />
        }

        return(
            <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
                <ListItemText primaryText={this.props.folderName}/>
            </ListItem>
        )
    }
}

FolderItem.propTypes = {
    folderOpen  : PropTypes.bool.isRequired,
    folderName  : PropTypes.string.isRequired,
}
