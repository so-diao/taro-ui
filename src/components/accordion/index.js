import Taro from '@tarojs/taro'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { View, Text } from '@tarojs/components'
import AtComponent from '../../common/component'
import { delayQuerySelector, initTestEnv, easeOut } from '../../common/utils'

initTestEnv()

// 文档
export default class AtAccordion extends AtComponent {
  constructor () {
    super(...arguments)
    this.isCompleted = true
    this.state = {
      wrapperHeight: ''
    }
  }

  handleClick = event => {
    const { open } = this.props
    this.props.onClick(!open, event)
  }

  toggleWithAnimation () {
    const { open, isAnimation } = this.props
    if (!this.isCompleted || !isAnimation) return

    this.isCompleted = false
    delayQuerySelector(this, '.at-accordion__content', 0)
      .then(rect => {
        const height = parseInt(rect[0].height)
        const startHeight = open ? height : 0
        const endHeight = open ? 0 : height
        easeOut(startHeight, endHeight, value => {
          if (value === endHeight) {
            this.isCompleted = true
          }
          this.setState({
            wrapperHeight: value
          })
        })
      })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open !== this.props.open) {
      this.toggleWithAnimation()
    }
  }

  render () {
    const {
      customStyle,
      className,
      title,
      icon,
      hasBorder,
      open
    } = this.props
    const { wrapperHeight } = this.state

    const isAnimationStart = open && !this.isCompleted && wrapperHeight < 2

    const rootCls = classNames('at-accordion', className)
    const iconCls = classNames({
      'at-icon': true,
      [`at-icon-${icon && icon.value}`]: icon && icon.value,
      'at-accordion__icon': true,
    })
    const headerCls = classNames('at-accordion__header', {
      'at-accordion__header--noborder': !hasBorder
    })
    const arrowCls = classNames('at-accordion__arrow', {
      'at-accordion__arrow--folded': !!open
    })
    const contentCls = classNames('at-accordion__content', {
      'at-accordion__content--inactive': (!open && this.isCompleted) || isAnimationStart
    })

    const iconStyle = {
      color: (icon && icon.color) || '',
      fontSize: (icon && `${icon.size}px`) || '',
    }
    const contentStyle = { height: `${wrapperHeight}px` }

    if (this.isCompleted || isAnimationStart) {
      contentStyle.height = ''
    }

    return <View className={rootCls} style={customStyle}>
      <View className={headerCls} onClick={this.handleClick}>
        {icon && icon.value && <Text className={iconCls} style={iconStyle}></Text>}
        <View className='at-accordion__title'>{title}</View>
        <View className={arrowCls}>
          <Text className='at-icon at-icon-chevron-down'></Text>
        </View>
      </View>
      <View className={contentCls} style={contentStyle}>
        {this.props.children}
      </View>
    </View>
  }
}

AtAccordion.defaultProps = {
  open: false,
  customStyle: '',
  className: '',
  title: '',
  icon: {},
  hasBorder: true,
  isAnimation: true,
  onClick: () => {},
}

AtAccordion.propTypes = {
  customStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  className: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  open: PropTypes.bool,
  isAnimation: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.object,
  hasBorder: PropTypes.bool,
  onClick: PropTypes.func,
}
