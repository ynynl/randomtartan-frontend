import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Paper, Grid } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectResult } from '../home/tartanSlice';
import { useForm, SubmitHandler } from "react-hook-form";
import { selectLoggedUser, selectToken } from '../session/sessionSlice';
import { createPostsAsync } from '../gallery/postsSlice';
import { useHistory } from "react-router-dom"

type Inputs = {
    name: string,
    description: string,
};

// https://stackoverflow.com/a/35366681/10642745
function dataURItoBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}

// const useGalleryStatus = () => {
//     const status = useAppSelector(selectGalleryStatus))
//     const isLoading = status === 'idle' || status === undefined
//     const isError = status === 'failed'
//     const isSuccess = status === 'success'
//     return { isLoading, isError, isSuccess }
// }

const AddToGalleryForm = ({ open, handleClose, index }: { open: boolean, handleClose: () => void, index: number }) => {
    const dispatch = useAppDispatch()
    const { register, handleSubmit } = useForm<Inputs>();
    const history = useHistory()

    const result = useAppSelector(selectResult)
    const token = useAppSelector(selectToken)
    const user = useAppSelector(selectLoggedUser)

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const file = new File([dataURItoBlob(result)], "fileName.png", { type: "image/png" })

        if (user) {

            const dataObject = {
                ...data,
                user: user.id,
                // src: tartan[index]
            }

            const formData = new FormData()

            formData.append('files.tartan', file, file.name);
            formData.append('data', JSON.stringify(dataObject));

            dispatch(createPostsAsync({ data: formData, jwt: token }))
                .then(res => {
                    handleClose()
                    history.push("/gallery/list")
                })

        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle id="alert-dialog-title">{"Add to Gallery"}</DialogTitle>
                <DialogContent>
                    <Paper >
                        <Grid container spacing={1} style={{margin: 1}}>
                            <Grid item >
                                <img src={result} alt="" height={300} />
                            </Grid>
                            <Grid item sm>
                                <TextField id="name" label="Name of the new tartan"   {...register("name")} />
                                <br />
                                <TextField id="description" label="Description"  {...register("description")} />
                            </Grid>
                        </Grid>
                        {/* <Box flexWrap="wrap" display="flex" justifyContent="center"  >
                            <Box p={1} >
                                <img src={result} alt="" height={300} />
                            </Box>
                            <Box p={1} >
                                <TextField id="name" label="Name of the new tartan" fullWidth  {...register("name")} />
                                <TextField id="description" label="Description" fullWidth {...register("description")} />
                            </Box>
                        </Box> */}
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type='submit' color="primary" autoFocus>
                        Add to Gallery
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddToGalleryForm