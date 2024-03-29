import React from 'react'
import { HStack, Icon, Button, Text } from 'native-base'
import { GameController } from 'phosphor-react-native'
import { removeFromWishPlay } from '../../../../utilities/api/removeFromWishPlay'
import { GlobalContext } from '../../../context/globalContextProvider'
import { ReviewContext } from '../../../context/ReviewContext'

function RemoveFromWishListButton() {
  const { showToast } = React.useContext(GlobalContext)
  const {
    state: { rating, game },
    handleUpdateWishList,
  } = React.useContext(ReviewContext)
  async function handleRemoveFromWishList() {
    await handleUpdateWishList('remove', game.wishList.id)
    showToast({
      bg: 'green.700',
      placement: 'top',
      title: 'Game Removido da sua playlist!',
    })
  }

  return (
    <Button
      onPress={() => handleRemoveFromWishList()}
      isDisabled={rating > 0}
      bg={'gray.600'}
      mt={-4}
      w={'full'}
      _pressed={{ opacity: 0.6, background: 'gray.600' }}
    >
      <HStack flex={1} space={3} alignItems={'center'}>
        <Icon
          opacity={rating > 0 ? 0.4 : 1}
          as={GameController}
          size={40}
          color={'red.600'}
        />

        <Text color={'white'}> Retirar da lista de interesses</Text>
      </HStack>
    </Button>
  )
}

export default RemoveFromWishListButton
