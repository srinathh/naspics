import React from 'react';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import {getTitle} from './utils';

import '@material/react-material-icon/dist/material-icon.css';
import "@material/react-list/dist/list.css";

export default class FolderItem extends React.Component{
    render(){
        return(
            <ListItem onClick={()=>this.props.callback(this.props.folderName)}>
                <ListItemGraphic graphic={<MaterialIcon icon='folder' />} />
                <ListItemText primaryText={getTitle(this.props.folderName)}/>
            </ListItem>
        )
    }
}

FolderItem.propTypes = {
    folderName  : PropTypes.string.isRequired,
    callback    : PropTypes.func.isRequired,
}
