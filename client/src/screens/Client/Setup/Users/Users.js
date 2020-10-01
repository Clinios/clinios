import React, { useState, useEffect } from "react";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { UsersList } from "./components";
import NewOrEditUser from "./components/modal/NewOrEditUser";
import UsersService from "../../../../services/users.service";
import { AuthConsumer } from "./../../../../providers/AuthProvider";
import Video from "./../../../../components/videos/Video";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: "40px 0px",
    },
    uploadButtons: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "450px",
        marginBottom: theme.spacing(2),
        "& h1": {
            [theme.breakpoints.up("md")]: {
                marginRight: theme.spacing(4),
            },
        },
    },
    card: {
        minHeight: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));

export default function Users(props) {
    const classes = useStyles();
    const [selectedUser, setSelectedUser] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userslist, setUserList] = useState([]);
    const [isNewUser, setIsNewUser] = useState(true);
    const [forward, setForward] = useState([]);

    const type = [
        {value: 'PP',label: 'Primary Provider'},
        { value: 'SP', label:'Secondary Provider'},
        { value: 'A', label: 'Administrative'},
        { value: 'L', label: 'Limited'}];
    const Status = [
        { value: 'A', label:'Active'},
        { value: 'I', label:'Inactive' },
        { value: 'D', label:'Deleted' },
    ]
    const Schedule = [
        
        {value: 'F', label:'Full'},
        {value: 'H', label: 'Half' },
        { value: 'Q', label: 'Quarter' },
    ];
    const fetchManagerUsers = () => {
        UsersService.getAll().then((res) => {
            console.log(res)
            setUserList(res.data);
        });
    };

    useEffect(() => {
        fetchManagerUsers();
        fetchForward();
    }, []);

    const fetchForward = () =>{
        UsersService.getForward().then((res) => {
            let forwardObj = [{
                'value': 0, 'label': ''
            }];
            setForward(forwardObj);
            res.data.forEach(val =>{
                const value = {
                    'value': val.id, 'label': val.name
                }
                forwardObj.push(value);
            })
            setForward(forwardObj);
            
        });
    }
    const handleEditButtonClick = (id) => {
        setIsEditModalOpen(true);
        setIsNewUser(false);
        const userById = userslist.filter(
            (userItem) => userItem.id === id
        );
        const updateUser = _.head(userById);
        setSelectedUser(updateUser);
    };


    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setIsNewUser(false);
        fetchManagerUsers();
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        fetchManagerUsers();
    };

    const handleOnNewClick = () => {
        setIsEditModalOpen(true);
        setIsNewUser(true);
        setSelectedUser("");
    };

    return (
        <AuthConsumer>
            {context => (
                <React.Fragment>
                    <CssBaseline />
                    <Container maxWidth={ false } className={ classes.root }>
                        <div className={ classes.uploadButtons }>
                            <Typography component="h1" variant="h2" color="textPrimary">
                                Users
              </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                onClick={ () => handleOnNewClick() }
                            >
                                New
              </Button>
                        </div>
                        <Grid container justify="center" spacing={ 2 }>
                            <Grid item md={ 12 } xs={ 12 }>
                                <Typography component="p" variant="body2" color="textPrimary">
                                    This page is used to manage users
                                    
                                </Typography>
                                <UsersList
                                    users={ userslist }
                                    onEdit={ handleEditButtonClick }
                                />
                            </Grid>
                            <Grid item md={ 12 } xs={ 12 }>
                                <Card className={ classes.card }>
                                    <CardContent>
                                        <Typography variant="h4" gutterBottom>
                                            <Video url="https://www.youtube.com/watch?v=ysz5S6PUM-U" />
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                          <NewOrEditUser
                            selectedUser={ selectedUser }
                            isOpen={ isEditModalOpen }
                            onClose={ () => handleEditModalClose(false) }
                            prevuser={ context.user }
                            isNewUser={ isNewUser }
                            type={ type}
                            status={ Status}
                            schedule={ Schedule}
                            forward = {forward}
                        />
{/*                         <DeleteAppointmentModal
                            id={ selectedAppointmentId }
                            isOpen={ isDeleteModalOpen }
                            onClose={ () => handleDeleteModalClose(false) }
                        />  */}
                    </Container>
                </React.Fragment>
            ) }
        </AuthConsumer>
    );
}
