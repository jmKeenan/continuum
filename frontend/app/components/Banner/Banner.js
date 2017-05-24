import React from 'react'
import { Link } from 'react-router'
import s from './styles.css'

export default function Banner (props) {
  let bannerMaker = () => {
    let openOrNot = props.isBannerOpen === true ? s.bannerOpen : s.bannerClosed
    let messageTypeToSet = s.default

    switch (props.messageType) {
      case 'error':
        messageTypeToSet = s.bannerWarn
        break
      case 'warn':
        messageTypeToSet = s.bannerWarn
        break
      case 'confirm':
        messageTypeToSet = s.bannerConfirm
        break
      default: messageTypeToSet = s.default
    }

    let styles = [openOrNot, messageTypeToSet, s.banner]
    return (styles.join(' '))
  }

  let bannerReturnMessage = () => {
    if (!props.hideReturnHome && props.messageType !== 'confirm') {
      return <Link to='/'>{'← Return to Home'}</Link>
    }
  }

  return (
    <div className={s.bannerContainer}>
    <div className={bannerMaker()} onClick={() => props.handleBannerReset()}>
      <div className={s.closeBanner}> {'✕'} </div>
        {props.messageType === 'warn' || props.messageType === 'error' ? <div className={s.bannerWarnMessage}>{props.message}</div> : <div className={s.bannerConfirmMessage}> {props.message} </div>}
        <div onClick={() => props.handleBannerReset()} className={s.returnToHome}> {bannerReturnMessage()} </div>
      </div>
    </div>
  )
}
