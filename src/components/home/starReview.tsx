import React from 'react'
import { HStack, Pressable } from 'native-base'
import { Star } from 'phosphor-react-native'
import { GlobalContext } from '../context/globalContextProvider'
import { ReviewContext } from '../context/ReviewContext'

function StarReview() {
  const { theme } = React.useContext(GlobalContext)
  const {
    state: { rating },
    updateRating,
    isReviewLoading,
    gameToEdit,
  } = React.useContext(ReviewContext)

  const stars = []

  for (let i = 1; i < 6; i++) {
    stars.push(
      <Pressable
        disabled={isReviewLoading}
        key={i}
        onPress={() => updateRating(rating === i && !gameToEdit.gameID ? 0 : i)}
        variant={'unstyled'}
        _disabled={{
          opacity: 0.3,
        }}
      >
        <Star
          size={48}
          color={theme.colors.yellow[600]}
          weight={rating >= i ? 'fill' : 'thin'}
        />
      </Pressable>,
    )
  }

  return <HStack justifyContent={'center'}>{stars}</HStack>
}

export default StarReview
