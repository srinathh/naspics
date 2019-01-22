import React, {Component} from 'react';
import List, {ListGroup, ListGroupSubheader, ListDivider} from '@material/react-list';
import PropTypes from 'prop-types';
import FolderItem from './folderitem';
import "@material/react-list/dist/list.css";

export default class FolderTree extends Component{

    render(){
        const groups = this.props.data.map((group)=>{
            const itemsList = group.items.map((item)=>{
                return(<FolderItem key={item} folderName={item} callback={this.props.callback} />)
            })

            if(itemsList.length === 0){
                return <div />
            }

            return (
                <div key={group.title}>
                    <ListGroupSubheader tag='h2'>{group.title}</ListGroupSubheader>
                    <List singleSelection>
                        {itemsList}
                    </List>
                    <ListDivider />
                </div>
            )
        })
        return (
            <ListGroup>
                {groups}
            </ListGroup>
        )
    }

}


FolderTree.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.string).isRequired,
    })),
    callback    : PropTypes.func.isRequired,
}