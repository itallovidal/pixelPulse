import React from 'react'
import Header from './header/header'
import Comment from './commentary/comment'
import { ReviewContext } from '../context/ReviewContext'
import CommentBox from './commentary/commentBox'
import { AnimatedFlatlist, AnimatedVstack } from '../AnimatedComponents'
import { EmptyComment } from './commentary/emptyComment'
import { IComment } from '../../@types/game'
import Loading from '../Loading'
import { FadeInUp } from 'react-native-reanimated'
import Arrows from '../arrows'

function FlatListContainer() {
  const {
    state: { game, commentaries },
    showCommentBox,
    isReviewLoading,
  } = React.useContext(ReviewContext)
  React.useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
  }, [game.info])
  // @ts-ignore
  const flatListRef = React.useRef<FlatList>(null)
  function scrollToCommentSection() {
    if (!showCommentBox) {
      return
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }

  if (!game.info) return <Loading />

  return (
    <AnimatedVstack
      entering={FadeInUp.duration(1000).delay(300)}
      bg={'gray.700'}
      flex={1}
    >
      <AnimatedFlatlist
        ref={flatListRef}
        ListHeaderComponent={<Header />}
        data={commentaries}
        onLayout={() => scrollToCommentSection()}
        renderItem={({ item }) => {
          if (commentaries[0] === null)
            return <EmptyComment opcty={!showCommentBox} />
          if (isReviewLoading) return <></>
          return <Comment data={item as IComment} opcty={showCommentBox} />
        }}
      />
      {showCommentBox && !isReviewLoading ? <CommentBox /> : null}
    </AnimatedVstack>
  )
}

export default FlatListContainer
