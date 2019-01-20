import React from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


export default class Gallery extends React.Component {

    render() {
        const images = [
            {original: 'http://192.168.1.112/Pictures/after_naisha/2013-08/2013-08-01_11-33-00.jpg' },
            {original: 'http://192.168.1.112/Pictures/after_naisha/2013-08/2013-08-01_11-34-55.jpg'},
        ]

        return (
            <ImageGallery items={images} />
        );
    }
};
