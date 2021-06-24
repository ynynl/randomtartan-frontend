import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { generateTartan } from './tartanAPI';
import { selectSrcImg } from './tartanSlice';
import Uploader from '../uploader';
import DispayCanvas from '../generator'
import { Grid, Container, Box } from '@material-ui/core';


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
      </Container>
    </>
  )
}

export default Home;
