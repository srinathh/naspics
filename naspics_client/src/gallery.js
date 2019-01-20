import React from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import PropTypes from 'prop-types';
import "./gallery.css";

export default class Gallery extends React.Component {

    render() {
        var images;
        if(this.props.pics.length===0){
            images = [{original:"/default.png"}]
        }else{
            images = this.props.pics.map((item)=>{
                return {original:this.props.prefix+item}
            })
        }

        return (
            <ImageGallery 
                items={images} 
                lazyLoad={true}     
                showThumbnails={false}
                showBullets={true}
                useBrowserFullscreen={false}
                default={"/default.png"}
            />
        );
    }
}

Gallery.propTypes = {
    pics    : PropTypes.array.isRequired,
    prefix  : PropTypes.string.isRequired,
}