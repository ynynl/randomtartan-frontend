import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { creatColorsAsync, fetchTartan, setImgsrc, shuffleColors } from '../tartanSlice';
import { Avatar, Box, Button, Typography } from '@material-ui/core';
import { defaultValues } from '../../setting';
import { unwrapResult } from '@reduxjs/toolkit';
import img1 from './sample-1.jpeg'
import img2 from './sample-2.jpeg'
import img3 from './sample-3.jpeg'

const Uploader = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const initImage = (imageURL: string) => {
        document.getElementById("displayCanvas")?.scrollIntoView({ behavior: 'smooth' });
        dispatch(setImgsrc(imageURL))
        dispatch(creatColorsAsync(imageURL))
        .then(unwrapResult)
        .then(srcColors =>
            dispatch(fetchTartan({ ...defaultValues, colors: shuffleColors(srcColors, defaultValues.numColors) }))
            )
        }
        
        const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {

            const inputFile: File = e.target.files[0]
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target) {
                    initImage(e.target.result as string)
                }
            }
            reader.readAsDataURL(inputFile);
        }
    }

    const handleSample = (img: string) => {
        initImage(img)
    }

    return (
        <>
            <Box pb={4}>
                <input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span">
                        Upload
                    </Button>
                </label>
            </Box>
            <Box m={1}>
                <Typography>
                    or try use these images
                </Typography>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center" >
                <Box m={1}>
                    <Avatar alt="sample" src={img1} onClick={() => handleSample(img1)} />
                </Box>
                <Box m={1}>
                    <Avatar alt="sample" src={img2} onClick={() => handleSample(img2)} />
                </Box>
                <Box m={1}>
                    <Avatar alt="sample" src={img3} onClick={() => handleSample(img3)} />
                </Box>
            </Box>
        </>
    );
}

export default Uploader
