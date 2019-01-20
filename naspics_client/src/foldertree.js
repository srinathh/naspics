import React, {Component} from 'react';
import List, {ListGroup, ListGroupSubheader, ListDivider} from '@material/react-list';
import PropTypes from 'prop-types';
import FolderItem from './folderitem';
import "@material/react-list/dist/list.css";

export default class FolderTree extends Component{

    render(){
        const parentListItems = this.props.data.parents.map((folderName)=>{
            return(<FolderItem key={folderName} folderName={folderName} callback={this.props.callback} />)
        })

        const siblingsListItems = this.props.data.siblings.map((folderName)=>{
            return(<FolderItem key={folderName} folderName={folderName} callback={this.props.callback} />)
        })

        const childrenListItems = this.props.data.children.map((folderName)=>{
            return(<FolderItem key={folderName} folderName={folderName} callback={this.props.callback} />)
        })

        return(
            <ListGroup>
                <ListGroupSubheader tag='h2'>Parents</ListGroupSubheader>
                <List singleSelection>
                    {parentListItems}
                </List>
                <ListDivider />
                <ListGroupSubheader tag='h2'>Children</ListGroupSubheader>
                <List singleSelection>
                    {childrenListItems}
                </List>
                <ListDivider />
                <ListGroupSubheader tag='h2'>Siblings</ListGroupSubheader>
                <List singleSelection>
                    {siblingsListItems}
                </List>
                <ListDivider />
            </ListGroup>
        )
    }


}


FolderTree.propTypes = {
    data        : PropTypes.shape({
        folder      : PropTypes.string.isRequired,
        parents     : PropTypes.array.isRequired,
        siblings    : PropTypes.array.isRequired,
        children    : PropTypes.array.isRequired,
    }),
    callback    : PropTypes.func.isRequired,
}