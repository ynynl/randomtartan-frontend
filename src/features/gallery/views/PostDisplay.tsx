import { Card, CardActions, CardContent, CardHeader, CardMedia, createStyles, IconButton, makeStyles, Menu, MenuItem, Theme, Typography } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUserById, User } from "../../users/usersSlice";
import { deletePostyAsync, Post, updatePostyAsync } from "../postsSlice";
import TimeAgo from 'timeago-react'
import { selectLoggedUser, selectToken } from "../../session/sessionSlice";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Box } from "@material-ui/core";
import MoreIcon from '@material-ui/icons/MoreVert';
import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';


const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 400,
            textAlign: 'left'
        },
        media: {
            height: 0,
            paddingTop: '55%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: red[500],
        },
    }),
);

const PostDisplay = ({ id }: { id: number }) => {
    const token = useAppSelector(selectToken)
    const classes = useStyles();
    const dispatch = useAppDispatch()
    const post = useAppSelector(state => state.posts.entities[id]) as Post
    const author = useAppSelector(state => selectUserById(state, (post as Post).user)) as User
    const date = Date.parse(post.published_at)
    const user = useAppSelector(selectLoggedUser)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const liked = user ? post.like.includes(user.id) : false

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLike = () => {
        if (user) {
            let likeArray
            if (liked) {
                likeArray = post.like.filter(i => i !== user.id)
            } else {
                likeArray = post.like.concat(user.id)
            }

            dispatch(updatePostyAsync(
                {
                    id: post.id,
                    data: {
                        like: likeArray
                    },
                    jwt: token
                }
            ))

        }
    }

    const handleDelete = () => {
        dispatch(deletePostyAsync({
            id: post.id,
            jwt: token
        }))
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            {post &&
                <Card className={classes.root}>
                    <CardHeader
                        subheader={
                            <>
                                <Typography variant="body2" color="textSecondary" component="p" style={{ fontWeight: 600 }}>
                                    {author.username}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    @ <TimeAgo
                                        datetime={date}
                                        locale='en'
                                    />
                                </Typography>
                            </>
                        }
                    />
                    <CardMedia
                        component="img"
                        image={`${baseUrl}${post.tartan.url}`}
                        loading="lazy"
                    />
                    <CardActions disableSpacing>
                        <div>
                            <IconButton aria-label="like" onClick={handleLike}>
                                {liked ?
                                    <FavoriteIcon />
                                    :
                                    <FavoriteBorderIcon />
                                }
                            </IconButton>
                            {post.like.length}
                        </div>
                        < Box flexGrow={1} />
                        {user?.id === post.user &&
                            <Box>
                                <IconButton onClick={handleClick}>
                                    <MoreIcon />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleDelete}><DeleteIcon />Delete</MenuItem>
                                </Menu>
                            </Box>}
                        {/* <IconButton aria-label="download" onClick={() => downloadURI(post.src, 'randomtartan.png')}>
                                <ShareIcon />
                        </IconButton> */}
                    </CardActions>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {post.name}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" component="p">
                            {post.description}
                        </Typography>
                    </CardContent>
                </Card >
            }
        </>

    )


}

export default PostDisplay