import React from 'react'
import { FadeInDown, FadeOut } from 'react-native-reanimated'
import { HStack, TextArea } from 'native-base'
import Button from '../../Button'
import { AnimatedVstack } from '../../AnimatedComponents'
import { ReviewContext } from '../../context/ReviewContext'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ErrorText from '../../ErrorText'
import {
  IPostCommentSchema,
  postCommentSchema,
} from '../../../schemas/postCommentSchema'

function CommentBox() {
  const {
    isReviewLoading,
    updateGame,
    state: { filter },
    handleSubmitComment,
    homeRouteParams,
  } = React.useContext(ReviewContext)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<IPostCommentSchema>({
    resolver: zodResolver(postCommentSchema),
  })

  React.useEffect(() => {
    setValue(`text`, ``)
  }, [isSubmitted])

  return (
    <AnimatedVstack
      entering={FadeInDown.duration(300)}
      exiting={FadeOut}
      p={4}
      bg={'gray.700'}
      w={'full'}
      my={6}
    >
      {errors.text?.message && <ErrorText error={errors.text?.message} />}
      <Controller
        control={control}
        name={'text'}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextArea
            isDisabled={isReviewLoading}
            _disabled={{
              opacity: 0.4,
            }}
            _focus={{
              borderColor: errors.text ? `red.600` : `gray.700`,
            }}
            borderColor={errors.text ? `red.600` : `gray.700`}
            autoCompleteType
            variant={'unstyled'}
            placeholder={'Digite um breve comentário.'}
            borderWidth={errors.text ? 2 : 0}
            bgColor={'gray.400'}
            mb={2}
            p={4}
            color={'white'}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />

      <HStack justifyContent={'flex-end'} space={2}>
        {homeRouteParams === undefined || !homeRouteParams.isEditing ? (
          <Button
            onPress={() => updateGame(filter)}
            buttonTheme={'unstyled'}
            bg={'gray.600'}
            h={`100%`}
          >
            Próximo jogo
          </Button>
        ) : null}

        <Button
          onPress={handleSubmit(handleSubmitComment)}
          isDisabled={isReviewLoading}
          buttonTheme={'whiteTheme'}
          alignSelf={'flex-end'}
        >
          Postar
        </Button>
      </HStack>
    </AnimatedVstack>
  )
}

export default CommentBox
