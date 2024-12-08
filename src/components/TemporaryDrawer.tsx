import Drawer from '@mui/material/Drawer'
import { TextField } from '@mui/material'
import React, { useEffect, useState, PropsWithChildren } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'
import { RadioStation } from 'entities'
import { getRadioStations } from 'api'
import DoneIcon from '@mui/icons-material/Done'

const RadioStationbButton = ({
  radioStation,
  findRadioStation,
  addRadioStation,
  deleteRadioStation,
}: {
  radioStation: RadioStation
  findRadioStation: (id: string) => RadioStation | undefined
  addRadioStation: (radioStation: RadioStation) => void
  deleteRadioStation: (id: string) => void
}) => {
  const [selected, setSelected] = useState(
    findRadioStation(radioStation.id) !== undefined
  )

  const handleClick = () => {
    if (selected) {
      deleteRadioStation(radioStation.id)
      setSelected(false)
    } else {
      addRadioStation(radioStation)
      setSelected(true)
    }
  }

  return (
    <div onClick={handleClick} className="w-full">
      <Box
        sx={{
          bgcolor: 'grey.700',
          ':hover': {
            bgcolor: 'grey.600',
            cursor: 'pointer',
          },
          borderRadius: '5px',
          paddingX: 2,
          paddingY: 1,
          width: '100%',
        }}
      >
        <div className="flex flex-row justify-center items-center w-full gap-1">
          <ListItemText primary={radioStation.name} />
          {selected && <DoneIcon color="primary" />}
        </div>
      </Box>
    </div>
  )
}

export const TemporaryDrawer = ({
  findRadioStation,
  addRadioStation,
  deleteRadioStation,
  children,
}: PropsWithChildren<{
  findRadioStation: (id: string) => RadioStation | undefined
  addRadioStation: (radioStation: RadioStation) => void
  deleteRadioStation: (id: string) => void
}>) => {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const [radioStations, setRadioStations] = useState<RadioStation[]>([])
  const [searchName, setSearchName] = useState<string>('')
  const [hasMore, setHasMore] = useState(true)

  const getRadios = async () => {
    console.log('Get radios!')
    const newRadioStations = await getRadioStations({
      name: searchName,
      limit: 20,
      offset: radioStations.length,
    })
    if (newRadioStations.length === 0) {
      setHasMore(false)
      return
    }
    setRadioStations((prev) => [...prev, ...newRadioStations])
  }

  useEffect(() => {
    setRadioStations([])
    setHasMore(true)
    console.log('First fetch')
    getRadioStations({ name: searchName, limit: 20, offset: 0 }).then(
      (newRadioStations) => {
        setRadioStations(newRadioStations)
      }
    )
  }, [searchName])

  useEffect(() => {
    setSearchName('')
  }, [open])

  const DrawerList = (
    <Box
      sx={{ width: 350, bgcolor: 'grey.900' }}
      role="presentation"
      className="overflow-hidden"
    >
      <div id="scrollableDiv" className="h-full overflow-auto flex-1">
        <div className=" flex flex-col items-center justify-center w-full">
          <TextField
            id="filled-basic"
            label="Search here"
            variant="filled"
            margin="normal"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearchName(event.target.value)
            }}
          />
        </div>
        <InfiniteScroll
          dataLength={radioStations.length}
          next={() => {
            getRadios()
          }}
          scrollableTarget="scrollableDiv"
          hasMore={hasMore}
          loader={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={2}
            >
              <CircularProgress />
            </Box>
          }
          style={{ overflow: 'hidden' }}
        >
          <List>
            {radioStations.map((item) => (
              <ListItem key={item.id}>
                <RadioStationbButton
                  radioStation={item}
                  findRadioStation={findRadioStation}
                  addRadioStation={addRadioStation}
                  deleteRadioStation={deleteRadioStation}
                />
              </ListItem>
            ))}
          </List>
        </InfiniteScroll>
      </div>
    </Box>
  )

  return (
    <>
      <div onClick={toggleDrawer(true)}>{children}</div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  )
}
