
import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const CustomMenuComponent = ({menuItems=[], anchorEl=null, handleClose=()=>{}, callBack=()=>{}}) => {


    const items = menuItems && menuItems.map( m => <MenuItem onClick={()=>{handleClose(); callBack(m.value)}}>{m.label}</MenuItem>)
    return <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
    >
        
        {items}
    </Menu>
}

export default CustomMenuComponent;