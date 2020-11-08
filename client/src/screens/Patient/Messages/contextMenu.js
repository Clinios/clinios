import React, { useState, useCallback, useEffect } from "react";

import { Grid, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useContextMenu = () => {
  const [xPos, setXPos] = useState("0px");
  const [yPos, setYPos] = useState("0px");
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();

      setXPos(`${e.pageX}px`);
      setYPos(`${e.pageY}px`);
      setShowMenu(true);
    },
    [setXPos, setYPos],
  );

  const handleClick = useCallback(() => {
    // eslint-disable-next-line mdx/no-unused-expressions
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.addEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { xPos, yPos, showMenu };
};

const ContextMenu = (props) => {
  const { xPos, yPos, showMenu } = useContextMenu();
  const { menu, element, deleteHandler } = props;
  const classes = useStyles();

  const onActionHandler = (value) => {
    if (value === "delete") {
      deleteHandler();
    }
  };

  return (
    <>
      {showMenu ? (
        <Grid
          className="menu-container"
          style={{
            top: yPos,
            left: xPos,
          }}
        >
          <Menu
            id="context-menu"
            anchorEl={element}
            keepMounted
            open={showMenu}
            // onClose={handleClose}
            // anchorOrigin={{
            //   vertical: 'bottom',
            //   horizontal: 'center',
            // }}
            // transformOrigin={{
            //   vertical: 'top',
            //   horizontal: 'center',
            // }}
          >
            {menu.length
              && menu.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => onActionHandler(item.value)}
                >
                  {item.label}
                </MenuItem>
              ))}
          </Menu>
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(1),
  },
}));

export default ContextMenu;
