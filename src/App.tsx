import { PropsWithChildren, useEffect, useState } from 'react'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { TemporaryDrawer } from 'components'
import { useFavorites } from 'hooks'
import { Box, Button, Modal, TextField } from '@mui/material'
import { RadioStation } from 'entities'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

const RadioTitle = (
  props: PropsWithChildren<{
    windowDimensions: { width: number; height: number }
  }>
) => {
  if (props.windowDimensions.width > 720)
    return <h1 className="text-2xl font-medium">{props.children}</h1>
  else return <h1 className="text-xl font-medium">{props.children}</h1>
}

function App() {
  const {
    favorites,
    findRadioStation,
    addRadioStation,
    deleteRadioStation,
    editRadioStationName,
  } = useFavorites()

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [audio, setAudio] = useState<HTMLAudioElement | undefined>(undefined)
  const [playing, setPlaying] = useState(false)
  const [selectedRadio, setSelectedRadio] = useState<RadioStation | undefined>(
    undefined
  )
  const [editingRadio, setEditingRadio] = useState<RadioStation | undefined>(
    undefined
  )
  const [editedName, setEditedName] = useState<string>('')

  const selectRaioStation = (radioStation: RadioStation) => {
    setPlaying(false)
    setSelectedRadio(radioStation)
    if (audio) audio.pause()
    setAudio(new Audio(radioStation.url))
    setPlaying(true)
  }

  useEffect(() => {
    if (audio) {
      if (playing) audio.play()
      else audio.pause()
    }
  }, [audio, playing])

  useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', () => setPlaying(false))
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false))
      }
    }
  }, [audio])

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="w-full h-full min-h-screen bg-neutral-500 overflow-auto">
        <Modal
          open={editingRadio !== undefined}
          onClose={() => setEditingRadio(undefined)}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className="flex flex-col gap-5">
              <TextField
                sx={{ width: '100%' }}
                id="filled-basic"
                label="Edit the name"
                variant="filled"
                placeholder={editingRadio?.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEditedName(event.target.value)
                }}
              />
              <div className="flex flex-row-reverse gap-5">
                <Button
                  variant="contained"
                  onClick={() => {
                    const newName = editedName ?? editingRadio?.name
                    editRadioStationName(editingRadio!.id, newName)
                    setEditedName('')
                    setEditingRadio(undefined)
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="text"
                  onClick={() => setEditingRadio(undefined)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
        <div className="flex flex-col items-center mt-10 mb-10">
          <h1 className="text-white text-3xl font-medium">Radio Browser</h1>
          <div className="flex flex-row itmes-center justify-between w-10/12 mt-5 mb-2">
            <h2 className="text-white">FAVORITE RADIOS</h2>
            <TemporaryDrawer
              findRadioStation={findRadioStation}
              addRadioStation={addRadioStation}
              deleteRadioStation={deleteRadioStation}
            >
              <div className="flex flex-row items-center gap-1 hover:cursor-pointer">
                <SearchIcon color="primary" />
                <h2 className="text-white">Search stations</h2>
              </div>
            </TemporaryDrawer>
          </div>
          <Box
            sx={{
              width: '90%',
              bgcolor: 'grey.300',
              paddingBottom: 0.5,
              borderRadius: '10px',
            }}
          >
            <Box
              sx={{
                borderBottom: 2,
                borderColor: 'grey.400',
                padding: 2,
              }}
            >
              <div className="flex flex-row items-center gap-3">
                {selectedRadio !== undefined &&
                  (playing ? (
                    <div onClick={() => setPlaying(false)}>
                      <StopIcon
                        sx={{
                          fontSize: '38pt',
                          ':hover': {
                            color: 'grey.600',
                            cursor: 'pointer',
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div onClick={() => setPlaying(true)}>
                      <PlayArrowIcon
                        sx={{
                          fontSize: '38pt',
                          ':hover': {
                            color: 'grey.600',
                            cursor: 'pointer',
                          },
                        }}
                      />
                    </div>
                  ))}
                <RadioTitle windowDimensions={windowDimensions}>
                  {selectedRadio === undefined
                    ? 'PICK A RADIO STATION'
                    : selectedRadio.name}
                </RadioTitle>
              </div>
            </Box>
            {favorites &&
              Object.keys(favorites).map((key) => (
                <>
                  {favorites[key] !== undefined && (
                    <Box
                      sx={{
                        padding: 1.5,
                        margin: 1,
                        backgroundColor: 'white',
                        borderRadius: '6px',
                      }}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <div
                          onClick={() => {
                            if (selectedRadio?.id === favorites[key]?.id) {
                              if (playing) setPlaying(false)
                              else setPlaying(true)
                            } else {
                              selectRaioStation(favorites[key]!)
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              backgroundColor: 'grey.500',
                              borderRadius: '50%',
                              ':hover': {
                                backgroundColor: 'grey.600',
                                cursor: 'pointer',
                              },
                            }}
                          >
                            {selectedRadio?.id === favorites[key]?.id &&
                            playing ? (
                              <StopIcon sx={{ fontSize: '38pt' }} />
                            ) : (
                              <PlayArrowIcon sx={{ fontSize: '38pt' }} />
                            )}
                          </Box>
                        </div>
                        <div className="flex flex-col w-full">
                          <RadioTitle windowDimensions={windowDimensions}>
                            {favorites[key]?.name}
                          </RadioTitle>
                          {windowDimensions.width > 720 && (
                            <p className="text-sm">{`${favorites[key]?.country}${favorites[key]?.state ? ', ' + favorites[key].state : ''}${favorites[key]?.tags ? ', ' + favorites[key].tags : ''}`}</p>
                          )}
                        </div>
                        <div className="flex flex-row-reverse gap-2">
                          <div
                            onClick={() =>
                              deleteRadioStation(favorites[key]!.id)
                            }
                          >
                            <DeleteIcon
                              sx={{
                                fontSize: '25pt',
                                ':hover': {
                                  color: 'grey.600',
                                  cursor: 'pointer',
                                },
                              }}
                            />
                          </div>
                          <div onClick={() => setEditingRadio(favorites[key]!)}>
                            <EditIcon
                              sx={{
                                fontSize: '25pt',
                                ':hover': {
                                  color: 'grey.600',
                                  cursor: 'pointer',
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Box>
                  )}
                </>
              ))}
          </Box>
          <TemporaryDrawer
            findRadioStation={findRadioStation}
            addRadioStation={addRadioStation}
            deleteRadioStation={deleteRadioStation}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
