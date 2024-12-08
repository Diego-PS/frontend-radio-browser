import { config } from 'config'
import { RadioStation } from 'entities'

export const getRadioStations = async (query?: {
  name?: string
  limit?: number
  offset?: number
}): Promise<RadioStation[]> => {
  const { name, limit, offset } = query ?? {}
  let url = `${config.apiUrl}/json/stations/search?limit=${limit ?? 10}`
  if (name) url += `&name=${name}`
  if (offset) url += `&offset=${offset}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const radioStations: RadioStation[] = data.map(
      (station: {
        stationuuid: string
        name: string
        url: string
        country?: string
        state?: string
        tags?: string
      }) => ({
        id: station.stationuuid,
        name: station.name,
        url: station.url,
        country: station.country,
        state: station.state,
        tags: station.tags,
      })
    )
    return radioStations
  } catch (error) {
    console.error(`Error fetching stations`, error)
    return []
  }
}
