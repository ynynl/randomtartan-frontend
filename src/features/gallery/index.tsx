import { CardContent } from "@material-ui/core"
import { Button, Card, Container, Grid, IconButton } from "@material-ui/core"
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink, useRouteMatch } from 'react-router-dom'
import GridView from "./views/GridView";
import ListView from "./views/ListView";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useEffect } from "react";
import galleryAPI from "./galleryAPI";
import { useAppDispatch } from "../../app/hooks";
import { setTotal } from "./postsSlice";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        sectionDesktop: {
            width: '140px',
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        }
    }))

const Gallery = () => {
    const dispatch = useAppDispatch()
    const classes = useStyles();
    const { path, url } = useRouteMatch();

    useEffect(() => {
        async function getCount() {
            try {
                const total = await galleryAPI.count()
                dispatch(setTotal(total))
            } catch (error) {
            }
        }
        getCount()
    }, [dispatch])

    return (
        <Container>
            <Router>
                <Grid
                    container
                    direction="row-reverse"
                    justify="center"
                    spacing={1}
                >
                    <Grid item className={classes.sectionDesktop}>
                        <Card
                            style={{ position: 'fixed', textAlign: 'left' }}
                        >
                            <CardContent>
                                <IconButton component={RouterLink} to={`${url}/grid`} >
                                    <ViewCompactIcon />
                                </IconButton>
                                Compact
                                <IconButton component={RouterLink} to={`${url}/list`} >
                                    <ViewDayIcon />
                                </IconButton>
                                List
                            </CardContent>
                            <CardContent>
                                <Button variant='contained' href='/'>
                                    New Post
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs >
                        <div className={classes.sectionMobile}>
                            <IconButton component={RouterLink} to={`${path}/grid`} >
                                <ViewCompactIcon />
                            </IconButton>
                            <IconButton component={RouterLink} to={`${path}/list`} >
                                <ViewDayIcon />
                            </IconButton>
                        </div>
                        <Switch>
                            <Route path={`${path}/list`}>
                                <ListView />
                            </Route>
                            <Route path={`${path}/grid`}>
                                <GridView />
                            </Route>
                            <Route path={`${path}/`}>
                                <GridView />
                            </Route>
                        </Switch>
                    </Grid>
                </Grid>
            </Router >
        </Container >
    )
}
export default Gallery