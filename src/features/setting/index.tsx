import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchTartan, selectSrcColors, shuffleColors, TartanParams } from '../home/tartanSlice';
import { Slider, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Switch, Select, MenuItem, Divider } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import AddIcon from '@material-ui/icons/Add';
import AddToGalleryForm from './AddToGallery'
// import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Controller, useForm } from "react-hook-form";
import { selectLoggedUser } from '../session/sessionSlice';

export const defaultValues: TartanParams = {
    numColors: 5,
    size: 128,
    twill: 'tartan',
    colors: []
}

const Setting = ({
    handleExport,
    handleScale,
    showImg,
    handleShowImg,
    handleSave,
    handleNext,
    handlePrev,
    hasPrev,
    hasNext,
    index
}: {
    handleExport: () => void,
    handleScale: (event: any, newValue: number | number[]) => void,
    showImg: boolean,
    handleShowImg: () => void,
    handleSave: () => void,
    handleNext: () => void,
    handlePrev: () => void,
    hasPrev: boolean,
    hasNext: boolean,
    index: number
}): JSX.Element => {

    const srcColors = useAppSelector(selectSrcColors)
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectLoggedUser)

    const [openAddForm, setOpenAddForm] = useState(false);

    const { handleSubmit, control } = useForm({
        defaultValues
    })

    const onSubmit = (data: TartanParams) => {
        data.colors = shuffleColors(srcColors, data.numColors)
        dispatch(fetchTartan(data))
    }

    const handleAddToGallery = () => {
        if (user) {
            handleExport()
            setOpenAddForm(true)
        }
    }

    // Work around for a typescript issue:
    const SubmitButton = (props: unknown) => <button {...props} type='submit' />;
    const props = {
        component: SubmitButton,
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <List >
                    <ListItem {...props} button>
                        <ListItemIcon>
                            <AutorenewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Update" />
                    </ListItem>
                    <Divider />


                    <ListItem button onClick={handlePrev} disabled={!hasPrev}>
                        <ListItemIcon>
                            <KeyboardArrowLeftIcon />
                        </ListItemIcon>
                        <ListItemText primary="Previous" />
                    </ListItem>
                    <ListItem button onClick={handleNext} disabled={!hasNext}>
                        <ListItemIcon>
                            <KeyboardArrowRightIcon />
                        </ListItemIcon>
                        <ListItemText primary="Next" />
                    </ListItem>
                    <Divider />


                    {/* <ListItem button >
                        <ListItemIcon>
                            <BookmarkBorderIcon />
                        </ListItemIcon>
                        <ListItemText primary="Collect" secondary='coming soon' />
                    </ListItem> */}

                    <ListItem button onClick={handleAddToGallery}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add to Gallery" secondary='Log in to share'/>
                    </ListItem>

                    <ListItem button onClick={handleSave}>
                        <ListItemIcon>
                            <SaveAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Download" />
                    </ListItem>




                    <Divider />

                    <ListItem>
                        <ListItemText id="switch-list-label-bluetooth" primary="Pattern" />
                        <ListItemSecondaryAction>
                            <div style={{ width: 80 }}>
                                <Controller
                                    render={
                                        ({ field }) => <Select
                                            {...field}
                                        >
                                            <MenuItem value={'tartan'}>Tartan</MenuItem>
                                            <MenuItem value={'madras'}>Madras</MenuItem>
                                            <MenuItem value={'net'}>Net</MenuItem>
                                        </Select>
                                    }
                                    name="twill"
                                    control={control}
                                />
                            </div>
                        </ListItemSecondaryAction>
                    </ListItem>


                    <ListItem>
                        <ListItemText id="switch-list-label-bluetooth" primary="Max Strip" />
                        <ListItemSecondaryAction>
                            <div style={{ width: 80 }}>
                                <Controller
                                    render={
                                        ({ field }) => <Slider
                                            {...field}
                                            onChange={(_, value) => {
                                                field.onChange(value);
                                            }}
                                            getAriaValueText={(value) => `${value}`}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            min={2}
                                            max={17}
                                        />
                                    }
                                    name="numColors"
                                    control={control}
                                />
                            </div>
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemText id="switch-list-label-bluetooth" primary="Grid Size" />
                        <ListItemSecondaryAction>
                            <div style={{ width: 80 }}>
                                <Controller
                                    render={
                                        ({ field }) => <Slider
                                            {...field}
                                            onChange={(_, value) => {
                                                field.onChange(value);
                                            }} getAriaValueText={(value) => `${value}`}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            step={64}
                                            min={128}
                                            max={256}
                                        />
                                    }
                                    control={control}
                                    name="size"
                                />
                            </div>
                        </ListItemSecondaryAction>
                    </ListItem>



                    <Divider />

                    <ListItem>
                        <ListItemText id="switch-list-label-bluetooth" primary="Image Scale" />
                        <ListItemSecondaryAction>
                            <div style={{ width: 80 }}>
                                <Slider
                                    defaultValue={50}
                                    min={1}
                                    max={100}
                                    onChange={handleScale}
                                    aria-labelledby="continuous-slider" />
                            </div>
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemText id="switch-list-label-wifi" primary="Show Image" />
                        <ListItemSecondaryAction>
                            <Switch
                                checked={showImg}
                                onChange={handleShowImg}
                                edge="end"
                                inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </form>
            <AddToGalleryForm open={openAddForm} handleClose={() => setOpenAddForm(false)} index={index}/>
        </>
    )
}

export default Setting
