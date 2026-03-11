import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ChevronRightIcon, QrCodeIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header, ScreenLayout, ToggleDrawerButton } from '@/widgets/navigation'

import { ConnectionListCard } from '@/entities/connection'

import { colors } from '@/shared/config'
import { AppButton } from '@/shared/ui/AppButton'
import { IconSymbol, type IconSymbolName } from '@/shared/ui/IconSymbol'
import { Typography } from '@/shared/ui/Typography'
import * as ListLayout from '@/shared/ui/ListLayout'

const FRAME_SIZE = 260
const CORNER_SIZE = 24
const CORNER_WIDTH = 3

const styles = StyleSheet.create({
  cardList: {
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors['white/60'],
    borderColor: colors['white/80'],
    borderRadius: 9999,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  scanFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  // Scanner modal
  scannerOverlay: {
    backgroundColor: 'black',
    flex: 1,
  },
  scannerClose: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  scannerBody: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scannerHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
  },
  scannerFrame: {
    height: FRAME_SIZE,
    position: 'relative',
    width: FRAME_SIZE,
  },
  // dim overlay strips around the frame
  dimTop: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: FRAME_SIZE,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  dimBottom: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: FRAME_SIZE,
  },
  dimLeft: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 0,
  },
  dimRight: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 0,
  },
  // Corner brackets
  cornerTL: { borderLeftWidth: CORNER_WIDTH, borderTopWidth: CORNER_WIDTH, height: CORNER_SIZE, left: 0, position: 'absolute', top: 0, width: CORNER_SIZE, borderColor: 'white' },
  cornerTR: { borderRightWidth: CORNER_WIDTH, borderTopWidth: CORNER_WIDTH, height: CORNER_SIZE, position: 'absolute', right: 0, top: 0, width: CORNER_SIZE, borderColor: 'white' },
  cornerBL: { borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, bottom: 0, height: CORNER_SIZE, left: 0, position: 'absolute', width: CORNER_SIZE, borderColor: 'white' },
  cornerBR: { borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, bottom: 0, height: CORNER_SIZE, position: 'absolute', right: 0, width: CORNER_SIZE, borderColor: 'white' },
  // Scan line
  scanLine: {
    backgroundColor: 'rgba(99,190,255,0.8)',
    height: 2,
    left: 8,
    position: 'absolute',
    right: 8,
  },
  scannerFooter: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
})

/* -------------------------------------------------------------------------------------------------
 * ScannerModal
 * -----------------------------------------------------------------------------------------------*/
type ScannerModalProps = { visible: boolean; onClose: () => void }

const ScannerModal: FC<ScannerModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const scanAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!visible) return
    scanAnim.setValue(0)
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: FRAME_SIZE - 4, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [visible, scanAnim])

  return (
    <Modal animationType="slide" statusBarTranslucent transparent={false} visible={visible}>
      <View style={[styles.scannerOverlay, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onClose} style={[styles.scannerClose, { top: insets.top + 16 }]}>
          <XMarkIcon color="white" size={28} />
        </TouchableOpacity>

        <View style={styles.scannerBody}>
          <View style={styles.scannerFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]} />
          </View>
          <Typography style={styles.scannerHint}>{t('tabs.wallet.scan_hint')}</Typography>
        </View>

        <View style={[styles.scannerFooter, { paddingBottom: insets.bottom + 16 }]}>
          <AppButton fullWidth onPress={onClose} text={t('tabs.wallet.scan_capture')} variant="primary" />
        </View>
      </View>
    </Modal>
  )
}

/* -------------------------------------------------------------------------------------------------
 * WalletCard
 * -----------------------------------------------------------------------------------------------*/
type WalletCardProps = { label: string; icon: IconSymbolName; onPress?: () => void }

const WalletCard: FC<WalletCardProps> = ({ label, icon, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <ConnectionListCard.Root>
      <ConnectionListCard.Content>
        <View style={styles.iconContainer}>
          <IconSymbol color={colors['gray-800']} height={24} name={icon} width={24} />
        </View>
        <ConnectionListCard.Description>
          <ConnectionListCard.Name>{label}</ConnectionListCard.Name>
        </ConnectionListCard.Description>
        <ConnectionListCard.Actions>
          <ConnectionListCard.Button>
            <AppButton onPress={() => {}} size="sm" variant="link">
              <ChevronRightIcon color="black" />
            </AppButton>
          </ConnectionListCard.Button>
        </ConnectionListCard.Actions>
      </ConnectionListCard.Content>
    </ConnectionListCard.Root>
  </TouchableOpacity>
)

/* -------------------------------------------------------------------------------------------------
 * WalletScreenHeader
 * -----------------------------------------------------------------------------------------------*/
const WalletScreenHeader: FC = () => {
  const { t } = useTranslation()

  return (
    <Header.Root variant="primary">
      <Header.Actions position="left">
        <Header.TitleText>{t('tabs.wallet.title')}</Header.TitleText>
      </Header.Actions>
      <Header.Actions position="right">
        <ToggleDrawerButton />
      </Header.Actions>
    </Header.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * WalletScreen
 * -----------------------------------------------------------------------------------------------*/
export default function WalletScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [scannerVisible, setScannerVisible] = useState(false)

  return (
    <ScreenLayout.Root>
      <WalletScreenHeader />
      <ScreenLayout.Content scrollable={false}>
        <ListLayout.Root>
          <ListLayout.Content style={styles.cardList}>
            <WalletCard
              icon="identification.outlined"
              label={t('tabs.wallet.drivers_licence')}
              onPress={() => router.push('/wallet/drivers-licence')}
            />
            <WalletCard
              icon="document-text.outlined"
              label={t('tabs.wallet.birth_certificate')}
              onPress={() => router.push('/wallet/birth-certificate')}
            />
            <WalletCard
              icon="credit-card.outlined"
              label={t('tabs.wallet.credit_card')}
              onPress={() => router.push('/wallet/credit-card')}
            />
            <WalletCard
              icon="identification.outlined"
              label={t('tabs.wallet.passport')}
              onPress={() => router.push('/wallet/passport')}
            />
          </ListLayout.Content>
        </ListLayout.Root>
      </ScreenLayout.Content>
      <View style={[styles.scanFooter, { paddingBottom: insets.bottom + 16 }]}>
        <AppButton
          fullWidth
          IconLeft={QrCodeIcon}
          onPress={() => setScannerVisible(true)}
          text={t('tabs.wallet.scan')}
          variant="primary"
        />
      </View>
      <ScannerModal onClose={() => setScannerVisible(false)} visible={scannerVisible} />
    </ScreenLayout.Root>
  )
}
