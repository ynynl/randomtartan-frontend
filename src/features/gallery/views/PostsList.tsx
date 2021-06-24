import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchPostsAsync, selectAllPosts } from "../postsSlice"
import { Box, CircularProgress, Grow } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import PostDisplay from "./PostDisplay";
import ImageDisplay from "./ImageDisplay";
import galleryAPI from "../galleryAPI";

const useTotal = () => {
    const [total, setTotal] = useState(0)
    useEffect(() => {
        async function getCount() {
            try {
                const countAsync = await galleryAPI.count()
                setTotal(countAsync)
            } catch (error) {
                setTotal(0)
            }
        }
        getCount()
    }, [])
    return total
}

const PostsList = ({ listView }: { listView: boolean }) => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(selectAllPosts);
    const [page, setPage] = useState(1)
    const total = useTotal()

    useEffect(() => {
        dispatch(fetchPostsAsync({ page: 0, limit: 5 }))
    }, [])

    const loadFuncLess = () => {
        dispatch(fetchPostsAsync({ page: page + 1, limit: 1 }))
        setPage(page + 1)
    }

    const loadFuncMore = () => {
        dispatch(fetchPostsAsync({ page: page, limit: 5 }))
        setPage(page + 1)
    }

    return (
        <>
            {listView ?
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
                                <b>Yay! You have seen it all</b>
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

                :
                <InfiniteScroll
                    dataLength={posts.length} //This is important field to render the next data
                    next={loadFuncMore}
                    hasMore={posts.length < total}
                    loader={<div style={{ height: '60px' }}>
                        <CircularProgress disableShrink color="secondary" />
                    </div>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
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
            }
        </>

    )
}

export default PostsList