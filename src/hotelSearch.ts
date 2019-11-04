const mockUrl: string =
  'https://myreservations.omnibees.com/default.aspx?q=5462&version=MyReservation&sid=3ad97cf9-d771-4783-8ecf-8b1fd87cb0af#/&diff=false&CheckIn=29112019&CheckOut=02122019&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-'

interface SearchOptions {
  checkin: string
  checkout: string
}

interface SearchResult {
  name: string
  price: number
  description: string
  images: Array<string>
}

function searchHotels(searchOptions: SearchOptions): Array<SearchResult> {
  console.log(mockUrl, searchOptions)
  // Get Search results

  return [
    {
      name: '',
      price: 0,
      description: '',
      images: [''],
    },
  ]
}

export default searchHotels
