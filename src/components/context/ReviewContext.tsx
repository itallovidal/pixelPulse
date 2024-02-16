import React, { ReactNode } from 'react'
import { IGame } from '../../@types/game'
import { GlobalContext } from './globalContextProvider'
import { IPostCommentSchema } from '../../schemas/postCommentSchema'
import {
  IReviewReducerState,
  reviewContextReducer,
} from '../../utilities/reducers/reviewContextReducer'
import { getGame } from '../../utilities/api/getGame'
import { getComments } from '../../utilities/api/getComments'
import { submitComment } from '../../utilities/api/submitComment'
import { postRating } from '../../utilities/api/submitRating'
import { useNavigation, useRoute } from '@react-navigation/native'
import { IGameToEdit, TAPPNavigatorProps } from '../../routes/routes'
import { submitUpdatedRating } from '../../utilities/api/submitUpdatedRating'

interface IReviewContext {
  state: IReviewReducerState
  showCommentBox: boolean
  isReviewLoading: boolean
  updateRating: (star: number) => void
  changeFilterState: (state: `discover` | `forme`) => void
  updateGame: (filter: `discover` | `forme`, gameID?: number) => Promise<void>
  handleSubmitComment: ({ text }: IPostCommentSchema) => Promise<void>
  handleSubmitRating: () => Promise<void>
  gameToEdit: IGameToEdit
  handleUpdatedRating: () => Promise<void>
}
//
export const ReviewContext = React.createContext({} as IReviewContext)
export function ReviewContextProvider({ children }: { children: ReactNode }) {
  const { showToast, userToken } = React.useContext(GlobalContext)
  const [showCommentBox, setShowCommentBox] = React.useState<boolean>(false)
  const [isReviewLoading, setIsReviewLoading] = React.useState(false)
  const { gameToEdit } = useRoute().params as { gameToEdit: IGameToEdit }

  const [state, dispatch] = React.useReducer(reviewContextReducer, {
    game: {} as IGame,
    rating: 0,
    filter: `discover`,
    commentaries: [null],
  })

  React.useEffect(() => {
    updateGame(state.filter)
  }, [state.filter])

  async function handleUpdatedRating() {
    try {
      setIsReviewLoading(true)
      const data = {
        id: gameToEdit.id,
        stars: state.rating,
      }

      await submitUpdatedRating(data)

      await updateGame(state.filter)

      showToast({
        bg: 'green.700',
        title: 'Jogo Atualizado com sucesso!',
        placement: 'top',
      })
    } catch (e) {
      console.log(e)
    } finally {
      setIsReviewLoading(false)
    }
  }

  async function updateGame(filter: `discover` | `forme`, gameID?: number) {
    try {
      setIsReviewLoading(true)
      const game = await getGame(filter, userToken!.accessToken, gameID)
      dispatch({ type: 'SET_GAME', payload: game })
      updateRating(0)
      const comments = await getComments(game.id, userToken!.accessToken)
      dispatch({ type: 'SET_COMMENTARIES', payload: comments })
    } catch (e) {
    } finally {
      setIsReviewLoading(false)
    }
  }

  function changeFilterState(state: `discover` | `forme`) {
    dispatch({ type: 'SET_FILTER', payload: state })
  }

  function updateRating(star: number) {
    if (star === 0) {
      setShowCommentBox(false)
    } else {
      setShowCommentBox(true)
    }
    dispatch({ type: 'SET_RATING', payload: star })
  }

  async function handleSubmitComment({ text }: IPostCommentSchema) {
    try {
      setIsReviewLoading(true)
      const comments = await submitComment(
        text,
        userToken!.accessToken,
        state.game.id,
      )

      dispatch({ type: 'SET_COMMENTARIES', payload: comments })

      showToast({
        bg: 'green.700',
        placement: 'top',
        title: 'Comentário postado com sucesso!',
      })
    } catch (e) {
      console.log(e)
    } finally {
      setIsReviewLoading(false)
    }
  }

  async function handleSubmitRating() {
    try {
      setIsReviewLoading(true)
      await postRating(state.game.id, state.rating, userToken!.accessToken)
      await updateGame(state.filter)
      showToast({
        bg: 'green.700',
        placement: 'top',
        title: 'Jogo avaliado com sucesso!',
      })
    } catch (e) {
      console.log(e)
    } finally {
      setIsReviewLoading(false)
    }
  }

  return (
    <ReviewContext.Provider
      value={{
        handleSubmitComment,
        state,
        isReviewLoading,
        showCommentBox,
        updateRating,
        changeFilterState,
        updateGame,
        handleSubmitRating,
        handleUpdatedRating,
        gameToEdit,
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}
