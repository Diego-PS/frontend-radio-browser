import { RadioStation } from 'entities'
import { useState } from 'react'

export const useFavorites = () => {
  const favoriteRadioStationsKey = 'favoriteRadioStations'

  const getFavoriteRadioStations = (): Record<
    string,
    RadioStation | undefined
  > => {
    const jsonRadioStations = localStorage.getItem(favoriteRadioStationsKey)
    const radioStations = jsonRadioStations
      ? (JSON.parse(jsonRadioStations) as Record<string, RadioStation>)
      : {}
    return radioStations
  }

  const [favorites, setFavorites] = useState<
    Record<string, RadioStation | undefined>
  >(getFavoriteRadioStations())

  const findRadioStation = (id: string): RadioStation | undefined => {
    const radioStations = getFavoriteRadioStations()
    return radioStations[id]
  }

  const setFavoriteRadioStations = (
    radioStations: Record<string, RadioStation | undefined>
  ) => {
    localStorage.setItem(
      favoriteRadioStationsKey,
      JSON.stringify(radioStations)
    )
    setFavorites(radioStations)
  }

  const addRadioStation = (radioStation: RadioStation) => {
    const radioStations = getFavoriteRadioStations()
    radioStations[radioStation.id] = radioStation
    setFavoriteRadioStations(radioStations)
  }

  const deleteRadioStation = (id: string) => {
    const radioStations = getFavoriteRadioStations()
    radioStations[id] = undefined
    setFavoriteRadioStations(radioStations)
  }

  const editRadioStationName = (id: string, name: string) => {
    const radioStations = getFavoriteRadioStations()
    if (!radioStations[id]) {
      throw new Error(
        `Radio station with ${id} is not in the favorites, so it cannot be edited`
      )
    }
    radioStations[id].name = name
    setFavoriteRadioStations(radioStations)
  }

  return {
    favorites,
    findRadioStation,
    addRadioStation,
    deleteRadioStation,
    editRadioStationName,
  }
}
