import {createStyles, Dialog, makeStyles, Theme } from "@material-ui/core";
import { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { Post } from "../postsSlice";
import PostDisplay from "./PostDisplay";



const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        img: {
            verticalAlign: 'bottom',
            maxHeight: '100%',
            minWidth: '100%',
            objectFit: 'cover',
            borderRadius: '5px'
        }
    }),
);



const ImageDisplay = ({ id }: { id: number }) => {
    const classes = useStyles();
    const post = useAppSelector(state => state.posts.entities[id]) as Post

    const [open, setOpen] = useState(false)

    return (
        <>
            <img
                src={`${baseUrl}${post.tartan.url}`}
                alt=""
                className={classes.img}
                loading="lazy"
                onClick={() => setOpen(true)}
            />
            <Dialog open={open} onClose={() => setOpen(false)} scroll='body'>
                    <PostDisplay id={post.id}></PostDisplay>
            </Dialog>
        </>

    )


}

export default ImageDisplay