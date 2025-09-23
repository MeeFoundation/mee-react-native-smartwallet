// TODO Refactor

import type { FC } from 'react'
import { Image, type ImageSourcePropType, StyleSheet, Text, View, type ViewStyle } from 'react-native'

import { colors } from '@/shared/config'
import { generateColorHsl } from '@/shared/lib/color'
import { getImageSource } from '@/shared/lib/get-image-source'

export type AvatarProps = {
  text: string
  src?: ImageSourcePropType | string
  size?: number
  style?: ViewStyle
}

export const Avatar: FC<AvatarProps> = ({ text, src, size = 24, style }) => {
  const bgColor = generateColorHsl(text)

  return (
    <View style={[styles.avatar, { height: size, width: size }, !src && { backgroundColor: bgColor }, style]}>
      {src && <Image source={getImageSource(src)} style={styles.avatarImg} />}
      {!src && <Text style={styles.avatarText}>{text.charAt(0).toUpperCase()}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: '50%',
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    height: '100%',
    width: '100%',
  },
  avatarText: {
    alignItems: 'center',
    color: colors.secondary,
    display: 'flex',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    lineHeight: 20,
  },
})
