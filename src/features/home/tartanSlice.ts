import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import {
  RootState,
} from '../../app/store';
import getColors from '../../helpers/getColors'

import { generateTartan } from './tartanAPI'

export type TartanParams = {
  numColors: number,
  colors: string[],
  size: 128 | 192 | 256,
  twill: 'tartan' | 'madras' | 'net'
}

export interface TartanState {
  src: string;
  srcColors: string[];
  tartans: string[]
  result: string,
  status: 'idle' | 'loading' | 'failed' | 'success';
}

const initialState: TartanState = {
  src: '',
  srcColors: [],
  tartans: [],
  result: '',
  status: 'idle',
};

export const shuffleColors = (colors: string[], num: number) => {
  const workingColor = []
  for (let i = 0; i < num; i++) {
    workingColor.push(colors[Math.floor(Math.random() * colors.length)])
  }
  return workingColor
}

export const creatColorsAsync = createAsyncThunk(
  'tartan/initColors',
  async (imgSrc: string) => {
    const srcColors = await getColors(imgSrc);
    return srcColors
  }
);

export const fetchTartan = createAsyncThunk(
  'tartan/fetchTartan',
  async (params: TartanParams) => {
    const tartan = await generateTartan(params)
    return tartan;
  }
);

export const tartanSlice = createSlice({
  name: 'tartan',
  initialState,
  reducers: {
    setImgsrc: (state, action: PayloadAction<string>) => {
      state.src = action.payload
    },
    setResult: (state, action) => {
      state.result = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(creatColorsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(creatColorsAsync.fulfilled, (state, action) => {
        state.status = 'success';
        state.srcColors = action.payload
      })
      .addCase(fetchTartan.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTartan.fulfilled, (state, action) => {
        state.status = 'success';
        state.tartans = state.tartans.concat(action.payload)
      });
  },
});

export const { setImgsrc, setResult: setCurrentTartan, setResult } = tartanSlice.actions;

export const selectSrcImg = (state: RootState) => state.tartan.src;

export const selectSrcColors = (state: RootState) => state.tartan.srcColors;

export const selectTartan = (state: RootState) => state.tartan.tartans;

export const selectResult = (state: RootState) => state.tartan.result;

export default tartanSlice.reducer;
