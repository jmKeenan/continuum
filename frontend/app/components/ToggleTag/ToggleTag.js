import React from 'react'
import s from './styles.css'

export default class ToggleTag extends React.Component {
  static get propTypes () {
    return {
      categoryName: React.PropTypes.string,
      tagSelected: React.PropTypes.bool,
      open: React.PropTypes.bool,
      handleFilterFeed: React.PropTypes.func,
      style: React.PropTypes.string,
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      tag: {},
      tagSelected: false,
    }
  }
  componentDidMount = () => {
    this.setState({
      tagSelected: (this.props.tagSelected),
    })
  }
  componentWillReceiveProps (nextProps) {
    nextProps.filtersCleared ? this.setState({tagSelected: false}) : null // clears selection state and display styles
  }
  handleToggleTag = () => {
    this.setState({
      tagSelected: !(this.state.tagSelected),
    })
  }
  handleClickTag (e) {
    this.handleToggleTag()
    this.props.handleFilterFeed(this.props.tag.tagId, this.props.categoryName) // Fires handleFilterFeed function to updates displayed feed items based on selected tags, needs categoryName to create correct reference
  }
  handleTagStyling = () => {
    // Updates Tag style based on state and display location (/FindCollateral or /PutCollateral)
    let open = [this.props.open || this.props.expanded ? s.open : s.closed]
    let active = [this.state.tagSelected && !this.props.filtersCleared ? s.active : s.inactive]
    let style = [this.props.style === 'addCollateral' ? s.addCollateral : null]
    let styles = [open, active, style, s.tag]
    return (
      styles.join(' ')
    )
  }
  render () {
    return (
      <li className={this.handleTagStyling()} onClick={this.handleClickTag.bind(this)}>
        {this.props.tag.tagValue}{!this.props.open && !this.props.expanded ? <span className={s.x}>{'✕'}</span> : ''}
      </li>
    )
  }
}
