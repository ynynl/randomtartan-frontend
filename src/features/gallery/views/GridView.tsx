import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchPostsAsync, selectAllPosts, selectTotal } from "../postsSlice"
import { Box, CircularProgress } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import ImageDisplay from "./ImageDisplay";

const GridView = () => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(selectAllPosts);
    const [page, setPage] = useState(1)
    const total = useAppSelector(selectTotal)

    useEffect(() => {
        dispatch(fetchPostsAsync({ page: 0, limit: 5 }))
    }, [dispatch])

    const loadFuncMore = () => {
        dispatch(fetchPostsAsync({ page: page, limit: 5 }))
        setPage(page + 1)
    }

    return (
        <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            next={loadFuncMore}
            hasMore={posts.length < total}
            loader={<div style={{ height: '60px' }}>
                <CircularProgress disableShrink color="secondary" />
            </div>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                    <b>You have reached to the end</b>
                </p>
            }
        >
            <Box display="flex" flexDirection="row" flexWrap="wrap">
                {posts.length &&
                    posts.map(post => <Box flexGrow={1} key={post.id} style={{ height: '40vh' }} m={1} >
                        <ImageDisplay id={post.id} />
                    </Box>
                    )}
            </Box>
        </InfiniteScroll>
    )
}

export default GridView