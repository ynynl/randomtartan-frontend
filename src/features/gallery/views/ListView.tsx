import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchPostsAsync, selectAllPosts, selectTotal } from "../postsSlice"
import { Box, CircularProgress } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import PostDisplay from "./PostDisplay";



const ListView = () => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(selectAllPosts);
    const [page, setPage] = useState(1)
    const total = useAppSelector(selectTotal)

    useEffect(() => {
        dispatch(fetchPostsAsync({ page: 0, limit: 5 }))
    }, [dispatch])

    const loadFuncLess = () => {
        dispatch(fetchPostsAsync({ page: page + 1, limit: 1 }))
        setPage(page + 1)
    }

    return (
        <Box display="flex" justifyContent="center">
            <InfiniteScroll
                dataLength={posts.length} //This is important field to render the next data
                next={loadFuncLess}
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
                {posts.length &&
                    posts.map(post =>
                        <Box key={post.id} p={1} flexGrow={1}>
                            <PostDisplay id={post.id} />
                        </Box>)
                }
            </InfiniteScroll>
        </Box>

    )
}

export default ListView