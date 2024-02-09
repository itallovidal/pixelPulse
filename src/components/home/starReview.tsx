import React from 'react'
import { HStack, Pressable } from 'native-base'
import { Star } from 'phosphor-react-native'
import { GlobalContext } from '../context/globalContextProvider'
import { ReviewContext } from '../context/ReviewContext'

function StarReview() {
  const { theme } = React.useContext(GlobalContext)
  const { rating, updateRating } = React.useContext(ReviewContext)

  const stars = []

  for (let i = 1; i < 6; i++) {
    stars.push(
      <Pressable key={i} onPress={() => updateRating(i)} variant={'unstyled'}>
        <Star
          size={48}
          color={theme.colors.yellow[600]}
          weight={rating >= i ? 'fill' : 'light'}
        />
      </Pressable>,
    )
  }

  return (
    <HStack justifyContent={'center'} my={4}>
      {stars}
    </HStack>
  )
}

export default StarReview
