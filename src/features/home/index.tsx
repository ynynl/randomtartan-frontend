import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { generateTartan } from './tartanAPI';
import { selectSrcImg } from './tartanSlice';
import Uploader from './uploader';
import DispayCanvas from '../display'
// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Container, Box } from '@material-ui/core';


// const guide = [
//   { icon: <PublishIcon />, title: '1. upload', content: 'Upload your JPG or PNG to our image resizer.' },
//   { icon: <TuneIcon />, title: '2. generate', content: 'Upload your JPG or PNG to our image resizer.' },
//   { icon: <GetAppIcon />, title: '3. download', content: 'Upload your JPG or PNG to our image resizer.' },
// ]

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     guideContainer: {
//       marginTop: theme.spacing(2),
//       marginBottom: theme.spacing(2),
//     },
//     guide: {
//       padding: theme.spacing(2),
//       textAlign: 'left',
//       color: theme.palette.text.secondary,
//     },
//   }),
// );

const Home = () => {
  const img = useAppSelector(selectSrcImg)
  const [background, setBackground] = useState<string[]>([])

  useEffect(() => {
    const getBackground = async () => {
      const bg = await generateTartan({
        colors: [[244, 244, 251], [212, 220, 232], [220, 220, 220]],
        size: 256,
        twill: 'tartan'
      })
      setBackground(bg)
    }
    getBackground()
  }, [])
  return (
    <>
      <Grid
        container
        className='tartan-header '
        style={{ backgroundImage: `url("${background}")` }}
        justify="center"
      >

        <Grid item>
          <small>自动格纹生成器</small>
          <h1>
            Random Tartan Generator
          </h1>
          <p>Upload your image and turn it into beautiful patterns.</p>
          <Uploader />
        </Grid>
      </Grid>

      <Container id='displayCanvas'>

        <Box py={9} >
          {img.length !== 0 &&
            <DispayCanvas />
          }
        </Box>

        {/* <Box m={1}>
          <Typography variant='h5' color="textSecondary">
            How to Generate tartans in three simple steps.
          </Typography>
          <Grid container spacing={6} justify='center' alignItems="center" className={classes.guideContainer}>
            {guide.map(({ icon, title, content }, idx) => <Grid key={idx} item sm color="primary">
              <Card elevation={0} className={classes.guide}>
                <CardContent>
                  <Typography variant="h6" component="h2" color="textSecondary">
                    {icon}  {title}
                  </Typography>
                  <Typography gutterBottom>
                    {content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>)}
          </Grid>
        </Box> */}

      </Container>
    </>
  )
}

export default Home;
