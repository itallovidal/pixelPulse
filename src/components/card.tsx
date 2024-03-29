import React from 'react'
import { IGameCard, IRatedGame } from '../@types/game'
import { Image, Pressable, Text, VStack } from 'native-base'
import { AnimatedVstack } from './AnimatedComponents'
import { FadeIn } from 'react-native-reanimated'
import { GlobalContext } from './context/globalContextProvider'

function isIRatedCard(game: unknown): game is IRatedGame {
  if (!(typeof game === 'object')) return false
  if (game === null) return false
  return 'gameID' in game
}

export function Card({
  game,
  delay,
}: {
  game: IRatedGame | IGameCard
  delay: number
}) {
  const {
    navigation: { navigate },
  } = React.useContext(GlobalContext)

  function checkTypeOfGame() {
    if (isIRatedCard(game))
      return navigate(`home`, {
        id: game.id,
        gameID: game.gameID,
        isEditing: false,
        isWishListed: true,
        isSearched: false,
      })
    else {
      return navigate(`home`, {
        id: '',
        gameID: game.id,
        isEditing: false,
        isWishListed: false,
        isSearched: true,
      })
    }
  }

  return (
    <Pressable
      onPress={() => checkTypeOfGame()}
      _pressed={{
        opacity: 0.45,
      }}
      w={`1/2`}
      m={1}
    >
      <AnimatedVstack
        entering={FadeIn.delay(delay)}
        bg={'black'}
        my={1}
        rounded={'md'}
      >
        <Image
          rounded={'md'}
          w={'full'}
          h={220}
          alt={'imagem de perfil'}
          source={{ uri: `https:${game.cover.url}` }}
        />

        <VStack
          alignItems={'center'}
          p={2}
          minH={70}
          justifyContent={'center'}
          flex={1}
        >
          <Text
            fontSize={14}
            numberOfLines={2}
            fontWeight={'bold'}
            color={'white'}
          >
            {game.name}
          </Text>
        </VStack>
      </AnimatedVstack>
    </Pressable>
  )
}
