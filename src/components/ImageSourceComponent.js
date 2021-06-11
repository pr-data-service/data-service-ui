


import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import AppRootContext from './AppRootContext';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "50%",
        height: 600,
        maxHeight: 600,
        maxWidth: 900
    },
    imgContainer: {
        overflow: "auto",
        height: "95%"
    },
    imgActionContainer: {
        height: "5%",
        paddingTop: 15,
        display: "flex",
        float: "right"
    },
    img: {
        maxWidth: 600,
        maxHeight: 700,
        cursor: "zoom-in",
        transition: "transform 0.25s ease",
    },
    button: {
        height: 29
    },
    input: {
        display: 'none',
    },
    zoomIn: {
        transform: "scale(2)",        
        margin: "190px 100px"
    },
    zoomOut: {

    }
}));

const ImageSourceComponent = () => {
    const classes = useStyles();
    const { showSnackbar } = React.useContext(AppRootContext);
    const [files, setFiles] = React.useState([]);
    const [index, setIndex] = React.useState(0);
    //const [zoomIndex, setZoomIndex] = React.useState(1);
    const [isZoom, setIsZoom] = React.useState(false);

    const onChange = (event) => {
        let files = event.target.files; // FileList object
        setFiles(files);
        setIsZoom(false);
    }

    const onChangePrevNext = (type) => () => {
        if(type == "NEXT") {
            if(index < files.length -1) {
                setIndex(index+1)
            } else {
                showSnackbar("No more images!");
            }
        } else {
            if(index > 0) {
                setIndex(index-1)
            } else {
                showSnackbar("This is first image!");
            }
        }
        setIsZoom(false);
    }

    const zoom = (event) => {
        //setZoomIndex(zoomIndex+1);
        setIsZoom(!isZoom);
    }

    const imgName = files && files.length > 0 ? files[index].name : "";
    const objUrl = files && files.length > 0 ? URL.createObjectURL(files[index]) : "";

    const style = isZoom ? {transform: "scale(2)", margin: "250px 150px"} : {};
    return <Box className={classes.root}>
        <label>{imgName}</label>
        <Box className={classes.imgContainer}>            
            <label>
                <img src={objUrl} className={classes.img} style={style} onDoubleClick={zoom}/>
            </label>            
        </Box>
        <Box className={classes.imgActionContainer}>
            <input accept="image/*" id="contained-button-file" onChange={onChange} multiple type="file" className={classes.input} />
            <label htmlFor="contained-button-file">
                <Button variant="contained" title={"Browse"} color="default" className={classes.button} startIcon={<FolderOpenIcon />} component="span">
                Browse
                </Button>
            </label>
            <Box style={{width: 10}}></Box>
            <Button variant="contained" title={"Previous"} color="default" className={classes.button} startIcon={<SkipPreviousIcon />} component="span" onClick={onChangePrevNext("PREV")}>
                Previous
            </Button>
            <Box style={{width: 10}}></Box>
            <Button variant="contained" title={"Next"} color="default" className={classes.button} startIcon={<SkipNextIcon />} component="span" onClick={onChangePrevNext("NEXT")}>
                Next
            </Button>
        </Box>
    </Box>
}

export default ImageSourceComponent;
