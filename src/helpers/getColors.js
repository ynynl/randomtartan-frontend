const getColors = require('get-image-colors')

const getFromImg = async (imgURL) => {
  try {
    const colorSet =  await getColors(imgURL, {count: 30})
    return colorSet.map(color => color._rgb)
  } catch (error) {
    console.error(error);
    return
  }
}

export default getFromImg