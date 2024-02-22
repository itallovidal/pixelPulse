import React, { useCallback } from 'react'
import {
  Center,
  Divider,
  FlatList,
  ScrollView,
  Text,
  VStack,
} from 'native-base'

import Button from '../components/Button'
import { GlobalContext } from '../components/context/globalContextProvider'
import { Api } from '../utilities/api/axios.config'
import { IRatedGame } from '../@types/game'
import RatedCard from '../components/catalogue/ratedCard'
import { useFocusEffect } from '@react-navigation/native'
import Loading from '../components/Loading'
import TextHeader from '../components/textHeader'

function Catalogue() {
  const { theme, userToken } = React.useContext(GlobalContext)
  const [games, setGames] = React.useState<IRatedGame[] | undefined>()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function getRatedGames() {
    try {
      setIsLoading(true)
      const { data } = await Api.get('games/rated', {
        headers: {
          Authorization: `Bearer ${userToken?.accessToken}`,
        },
      })

      return data as IRatedGame[]
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log('catalogo')
      getRatedGames().then((data) => setGames(data))
    }, []),
  )

  return (
    <VStack flex={1} bg={theme.colors.gray['700']}>
      <VStack
        flex={1}
        bg={theme.colors.gray['700']}
        p={4}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <TextHeader
          h1={' Meu Catálogo'}
          h2={'Clique no jogo para mais informações.'}
        />

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            w={'full'}
            data={games}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <RatedCard game={item} delay={index * 100} />
            )}
          />
        )}
      </VStack>
    </VStack>
  )
}

export default Catalogue
